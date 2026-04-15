package com.loandiscovery.service;

import com.loandiscovery.dto.IfscResponse;
import com.loandiscovery.model.Branch;
import com.loandiscovery.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class IfscService {

    private final BranchRepository branchRepository;
    private final RestTemplate restTemplate;
    private final String baseUrl;

    public IfscService(
            BranchRepository branchRepository,
            @Value("${razorpay.ifsc.base-url}") String baseUrl) {
        this.branchRepository = branchRepository;
        this.restTemplate = new RestTemplate();
        this.baseUrl = baseUrl;
    }

    /**
     * Lookup IFSC code. Checks MySQL cache first, then calls Razorpay API on miss.
     */
    public IfscResponse lookup(String ifsc) {
        String code = ifsc.toUpperCase().trim();

        // Validate format
        if (!code.matches("^[A-Z]{4}0[A-Z0-9]{6}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid IFSC format. Expected: 4 letters + 0 + 6 alphanumeric characters");
        }

        // Check cache
        Optional<Branch> cached = branchRepository.findByIfsc(code);
        if (cached.isPresent()) {
            return toDto(cached.get());
        }

        // Call Razorpay API
        try {
            String url = baseUrl + "/" + code;
            IfscResponse response = restTemplate.getForObject(url, IfscResponse.class);

            if (response != null) {
                // Save to cache
                saveBranch(response);
                return response;
            }

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "IFSC code not found: " + code);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "IFSC code not found: " + code);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Failed to reach Razorpay IFSC API: " + e.getMessage());
        }
    }

    /**
     * Search cached bank names by query string.
     */
    public List<String> searchBanks(String query) {
        if (query == null || query.isBlank()) {
            return branchRepository.findDistinctBankNames();
        }
        return branchRepository.findByBankContainingIgnoreCase(query)
                .stream()
                .map(Branch::getBank)
                .distinct()
                .sorted()
                .toList();
    }

    /**
     * Get cached branches by city.
     */
    public List<IfscResponse> getBanksByCity(String city) {
        return branchRepository.findByCityContainingIgnoreCase(city)
                .stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Get all cached distinct bank names.
     */
    public List<String> getAllBankNames() {
        return branchRepository.findDistinctBankNames();
    }

    // ─── Private helpers ──────────────────────────────

    private void saveBranch(IfscResponse dto) {
        // Don't save duplicates
        if (branchRepository.findByIfsc(dto.getIfsc()).isPresent()) return;

        Branch branch = new Branch();
        branch.setBank(dto.getBank());
        branch.setIfsc(dto.getIfsc());
        branch.setBranch(dto.getBranch());
        branch.setAddress(dto.getAddress());
        branch.setCity(dto.getCity());
        branch.setDistrict(dto.getDistrict());
        branch.setState(dto.getState());
        branch.setContact(dto.getContact());
        branch.setImps(dto.getImps());
        branch.setRtgs(dto.getRtgs());
        branch.setUpi(dto.getUpi());
        branch.setNeft(dto.getNeft());
        branch.setMicr(dto.getMicr());
        branch.setBankCode(dto.getBankCode());
        branchRepository.save(branch);
    }

    private IfscResponse toDto(Branch branch) {
        IfscResponse dto = new IfscResponse();
        dto.setBank(branch.getBank());
        dto.setIfsc(branch.getIfsc());
        dto.setBranch(branch.getBranch());
        dto.setAddress(branch.getAddress());
        dto.setCity(branch.getCity());
        dto.setDistrict(branch.getDistrict());
        dto.setState(branch.getState());
        dto.setContact(branch.getContact());
        dto.setImps(branch.getImps());
        dto.setRtgs(branch.getRtgs());
        dto.setUpi(branch.getUpi());
        dto.setNeft(branch.getNeft());
        dto.setMicr(branch.getMicr());
        dto.setBankCode(branch.getBankCode());
        return dto;
    }
}
