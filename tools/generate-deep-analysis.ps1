param(
  [string]$ProjectRoot = "C:\Users\ASUS\Documents\Backend\Loan-Discovery-Web-Application",
  [string]$OutputFile = "C:\Users\ASUS\Documents\Backend\Loan-Discovery-Web-Application\PROJECT_DEEP_ANALYSIS.txt"
)

$ErrorActionPreference = "Stop"

function Add-Section {
  param([string]$Title)
  Add-Content -Path $OutputFile -Value ""
  Add-Content -Path $OutputFile -Value ("=" * 120)
  Add-Content -Path $OutputFile -Value $Title
  Add-Content -Path $OutputFile -Value ("=" * 120)
}

function Add-Lines {
  param([object]$Lines)
  if ($null -eq $Lines) {
    Add-Content -Path $OutputFile -Value "<none>"
    return
  }

  if ($Lines -is [string]) {
    if ([string]::IsNullOrWhiteSpace($Lines)) {
      Add-Content -Path $OutputFile -Value "<none>"
    } else {
      Add-Content -Path $OutputFile -Value $Lines
    }
    return
  }

  $arr = @($Lines)
  if ($arr.Count -eq 0) {
    Add-Content -Path $OutputFile -Value "<none>"
  } else {
    Add-Content -Path $OutputFile -Value $arr
  }
}

try {
  if (!(Test-Path $ProjectRoot)) {
    throw "Project root not found: $ProjectRoot"
  }

  $excludeDirs = @("node_modules", ".git", "dist", "build", ".next", "coverage", ".vscode", ".idea", "out", "bin", "obj")
  $excludeRegex = "\\(" + (($excludeDirs | ForEach-Object { [regex]::Escape($_) }) -join "|") + ")(\\|$)"

  if (Test-Path $OutputFile) { Remove-Item $OutputFile -Force }
  New-Item -Path $OutputFile -ItemType File -Force | Out-Null

  $allFiles = Get-ChildItem -Path $ProjectRoot -Recurse -File -Force | Where-Object {
    $_.FullName -notmatch $excludeRegex
  }

  Add-Section "PROJECT DEEP ANALYSIS REPORT"
  Add-Lines @(
    "Generated At: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss K')",
    "Project Root: $ProjectRoot",
    "Output File: $OutputFile",
    "PowerShell: $($PSVersionTable.PSVersion)"
  )

  Add-Section "1) ROOT DIRECTORY SNAPSHOT"
  Push-Location $ProjectRoot
  Add-Lines ((Get-ChildItem -Force | Select-Object Mode, LastWriteTime, Length, Name | Format-Table -AutoSize | Out-String))
  Pop-Location

  Add-Section "2) GIT METADATA"
  Push-Location $ProjectRoot
  $gitExists = Get-Command git -ErrorAction SilentlyContinue
  if ($gitExists) {
    Add-Lines ("Git Version: " + (git --version))
    Add-Lines ("Active Branch: " + (git rev-parse --abbrev-ref HEAD))
    Add-Lines ""
    Add-Lines "Remotes:"
    Add-Lines (git remote -v)
    Add-Lines ""
    Add-Lines "Status:"
    Add-Lines (git status --short)
    Add-Lines ""
    Add-Lines "Last Commit:"
    Add-Lines (git log -1 --pretty=fuller)
  } else {
    Add-Lines "git not installed or unavailable in PATH."
  }
  Pop-Location

  Add-Section "3) FILE INVENTORY SUMMARY"
  $totalFiles = $allFiles.Count
  $totalBytes = ($allFiles | Measure-Object Length -Sum).Sum
  $extStats = $allFiles | Group-Object Extension | Sort-Object Count -Descending | Select-Object Count, Name
  Add-Lines @("Total Files: $totalFiles", "Total Size (bytes): $totalBytes", "", "By Extension:")
  Add-Lines ($extStats | Format-Table -AutoSize | Out-String)

  Add-Section "4) TOP 100 LARGEST FILES"
  Add-Lines (($allFiles | Sort-Object Length -Descending | Select-Object -First 100 FullName, Length, LastWriteTime | Format-Table -AutoSize | Out-String))

  Add-Section "5) KEY CONFIG FILES CHECK"
  $keyFiles = @(
    "package.json","package-lock.json","yarn.lock","pnpm-lock.yaml",
    "tsconfig.json","jsconfig.json","vite.config.js","vite.config.ts",
    "webpack.config.js","next.config.js","tailwind.config.js","tailwind.config.ts",
    ".eslintrc",".eslintrc.js",".eslintrc.json","eslint.config.js",
    ".prettierrc",".prettierrc.json",".editorconfig",
    ".env",".env.local",".env.development",".env.production",
    "README.md","Dockerfile","docker-compose.yml",".gitignore"
  )
  foreach ($kf in $keyFiles) {
    $p = Join-Path $ProjectRoot $kf
    Add-Lines ("$kf => " + ($(if (Test-Path $p) { "FOUND" } else { "MISSING" })))
  }

  Add-Section "6) PACKAGE.JSON ANALYSIS"
  $pkgPath = Join-Path $ProjectRoot "package.json"
  if (Test-Path $pkgPath) {
    $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
    Add-Lines @(
      "name: $($pkg.name)",
      "version: $($pkg.version)",
      "private: $($pkg.private)",
      "type: $($pkg.type)",
      "description: $($pkg.description)"
    )
    Add-Lines ""
    Add-Lines "scripts:"
    if ($pkg.scripts) {
      $pkg.scripts.PSObject.Properties | ForEach-Object { Add-Lines ("  $($_.Name): $($_.Value)") }
    } else { Add-Lines "<none>" }

    Add-Lines ""
    Add-Lines "dependencies:"
    if ($pkg.dependencies) {
      $pkg.dependencies.PSObject.Properties | Sort-Object Name | ForEach-Object { Add-Lines ("  $($_.Name): $($_.Value)") }
    } else { Add-Lines "<none>" }

    Add-Lines ""
    Add-Lines "devDependencies:"
    if ($pkg.devDependencies) {
      $pkg.devDependencies.PSObject.Properties | Sort-Object Name | ForEach-Object { Add-Lines ("  $($_.Name): $($_.Value)") }
    } else { Add-Lines "<none>" }
  } else {
    Add-Lines "package.json not found."
  }

  Add-Section "7) SOURCE FILES LIST"
  $srcFiles = $allFiles | Where-Object { $_.Extension -in @(".js",".jsx",".ts",".tsx",".css",".scss",".html",".json",".md") } | Sort-Object FullName
  Add-Lines (($srcFiles | Select-Object FullName, Length, LastWriteTime | Format-Table -AutoSize | Out-String))

  Add-Section "8) CODE METRICS (PER EXTENSION)"
  $metrics = $srcFiles | Group-Object Extension | ForEach-Object {
    $lineCount = 0
    foreach ($f in $_.Group) {
      $lineCount += (Get-Content $f.FullName | Measure-Object -Line).Lines
    }
    [PSCustomObject]@{
      Extension = $_.Name
      Files = $_.Count
      Lines = $lineCount
    }
  } | Sort-Object Lines -Descending
  Add-Lines (($metrics | Format-Table -AutoSize | Out-String))

  Add-Section "9) ROUTING INDICATORS"
  $routeHits = Select-String -Path ($srcFiles.FullName) -Pattern "Route|Routes|createBrowserRouter|useNavigate|Link"
  Add-Lines ($(if ($routeHits) { $routeHits | Select-Object Path, LineNumber, Line | Format-Table -AutoSize | Out-String } else { "<none>" }))

  Add-Section "10) STATE MANAGEMENT INDICATORS"
  $stateHits = Select-String -Path ($srcFiles.FullName) -Pattern "useState|useReducer|useContext|redux|zustand|mobx|recoil|jotai"
  Add-Lines ($(if ($stateHits) { $stateHits | Select-Object Path, LineNumber, Line | Format-Table -AutoSize | Out-String } else { "<none>" }))

  Add-Section "11) API/NETWORK INDICATORS"
  $apiHits = Select-String -Path ($srcFiles.FullName) -Pattern "fetch\(|axios|XMLHttpRequest|/api/|http://|https://"
  Add-Lines ($(if ($apiHits) { $apiHits | Select-Object Path, LineNumber, Line | Format-Table -AutoSize | Out-String } else { "<none>" }))

  Add-Section "12) AUTH/SECURITY INDICATORS"
  $authHits = Select-String -Path ($srcFiles.FullName) -Pattern "token|jwt|auth|login|logout|refresh|cookie|localStorage|sessionStorage|bcrypt|helmet|cors|csrf"
  Add-Lines ($(if ($authHits) { $authHits | Select-Object Path, LineNumber, Line | Format-Table -AutoSize | Out-String } else { "<none>" }))

  Add-Section "13) VALIDATION/ERROR-HANDLING INDICATORS"
  $valHits = Select-String -Path ($srcFiles.FullName) -Pattern "try|catch|throw|zod|yup|validate|error|errors"
  Add-Lines ($(if ($valHits) { $valHits | Select-Object Path, LineNumber, Line | Format-Table -AutoSize | Out-String } else { "<none>" }))

  Add-Section "14) TODO/FIXME/HACK"
  $todoHits = Select-String -Path ($allFiles.FullName) -Pattern "TODO|FIXME|HACK|XXX"
  Add-Lines ($(if ($todoHits) { $todoHits | Select-Object Path, LineNumber, Line | Format-Table -AutoSize | Out-String } else { "<none>" }))

  Add-Section "15) TEST FILES"
  $testFiles = $allFiles | Where-Object {
    $_.Name -match "(\.test\.|\.spec\.)" -or $_.DirectoryName -match "\\__tests__\\"
  }
  Add-Lines ("Detected Test Files: $($testFiles.Count)")
  Add-Lines ($(if ($testFiles.Count -gt 0) { $testFiles | Select-Object FullName, Length, LastWriteTime | Format-Table -AutoSize | Out-String } else { "<none>" }))

  Add-Section "16) ENV FILES (KEYS ONLY, REDACTED VALUES)"
  $envFiles = Get-ChildItem -Path $ProjectRoot -Recurse -File -Filter ".env*" -Force | Where-Object {
    $_.FullName -notmatch $excludeRegex
  }
  if ($envFiles.Count -eq 0) {
    Add-Lines "<none>"
  } else {
    foreach ($ef in $envFiles) {
      Add-Lines ("File: " + $ef.FullName)
      $keys = Get-Content $ef.FullName | Where-Object { $_ -match "^[A-Za-z_][A-Za-z0-9_]*=" } | ForEach-Object {
        (($_ -split "=")[0] + "=<redacted>")
      }
      Add-Lines $(if ($keys) { $keys } else { "<no keys>" })
      Add-Lines ""
    }
  }

  Add-Section "17) DIRECTORY TREE (TRIMMED)"
 # ...existing code...
  function Write-Tree {
    param([string]$Path, [string]$Prefix = "")
    $children = Get-ChildItem -Path $Path -Force | Where-Object {
      -not ($_.PSIsContainer -and ($excludeDirs -contains $_.Name))
    } | Sort-Object `
      @{ Expression = { $_.PSIsContainer }; Descending = $true }, `
      @{ Expression = { $_.Name }; Descending = $false }

    for ($i = 0; $i -lt $children.Count; $i++) {
      $item = $children[$i]
      $isLast = ($i -eq $children.Count - 1)
      $branch = if ($isLast) { "\-- " } else { "+-- " }
      Add-Lines ($Prefix + $branch + $item.Name)

      if ($item.PSIsContainer) {
        $next = if ($isLast) { $Prefix + "    " } else { $Prefix + "|   " }
        Write-Tree -Path $item.FullName -Prefix $next
      }
    }
  }
# ...existing code...
  Add-Lines $ProjectRoot
  Write-Tree -Path $ProjectRoot -Prefix ""

  Add-Section "18) HASHES (CRITICAL FILES)"
  $critical = $allFiles | Where-Object { $_.Name -in @("package.json","package-lock.json","yarn.lock","pnpm-lock.yaml","tsconfig.json","README.md") }
  if ($critical.Count -eq 0) {
    Add-Lines "<none>"
  } else {
    foreach ($cf in $critical) {
      $hash = Get-FileHash -Path $cf.FullName -Algorithm SHA256
      Add-Lines ("$($cf.FullName) => $($hash.Hash)")
    }
  }

  Add-Section "19) RISK FLAGS (HEURISTIC)"
  $flags = @()
  if (-not (Test-Path (Join-Path $ProjectRoot "README.md"))) { $flags += "Missing README.md" }
  if (-not (Test-Path (Join-Path $ProjectRoot ".gitignore"))) { $flags += "Missing .gitignore" }
  if ($testFiles.Count -eq 0) { $flags += "No tests detected" }
  if ($envFiles.Count -gt 0) { $flags += "Env files present (verify secrets are not committed)" }
  if ($flags.Count -eq 0) { $flags += "No major heuristic flags found." }
  Add-Lines $flags

  Add-Section "20) NEXT ACTIONS"
  Add-Lines @(
    "1) Trace each API call to owner component/service and document data contracts.",
    "2) Add schema validation at UI and backend boundaries.",
    "3) Increase unit/integration coverage for business-critical modules.",
    "4) Audit auth/session storage and token lifecycle.",
    "5) Add architecture and deployment documentation."
  )

  Write-Host "Analysis file generated:" -ForegroundColor Green
  Write-Host $OutputFile -ForegroundColor Cyan
}
catch {
  Write-Host "Script failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}