@echo off
setlocal

set "MAVEN_VERSION=3.9.9"
set "DIST_ROOT=%USERPROFILE%\.m2\wrapper\dists"
set "DIST_DIR=%DIST_ROOT%\apache-maven-%MAVEN_VERSION%-bin"
set "MAVEN_HOME=%DIST_DIR%\apache-maven-%MAVEN_VERSION%"
set "MAVEN_EXE=%MAVEN_HOME%\bin\mvn.cmd"

if not exist "%MAVEN_EXE%" (
  echo [INFO] Maven %MAVEN_VERSION% not found locally. Bootstrapping...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $version='%MAVEN_VERSION%'; $distRoot=Join-Path $env:USERPROFILE '.m2\wrapper\dists'; $distDir=Join-Path $distRoot ('apache-maven-' + $version + '-bin'); $zipPath=Join-Path $distDir ('apache-maven-' + $version + '-bin.zip'); $extractDir=$distDir; New-Item -ItemType Directory -Force -Path $distDir | Out-Null; if (!(Test-Path $zipPath)) { $url='https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/' + $version + '/apache-maven-' + $version + '-bin.zip'; Invoke-WebRequest -Uri $url -OutFile $zipPath }; Expand-Archive -Path $zipPath -DestinationPath $extractDir -Force"
  if errorlevel 1 (
    echo [ERROR] Maven bootstrap failed.
    exit /b 1
  )
)

if exist "%MAVEN_EXE%" (
  call "%MAVEN_EXE%" %*
  exit /b %ERRORLEVEL%
)

echo [ERROR] Maven executable not found at %MAVEN_EXE%
exit /b 1
