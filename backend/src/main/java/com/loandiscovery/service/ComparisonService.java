package com.loandiscovery.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loandiscovery.dto.SaveComparisonRequest;
import com.loandiscovery.dto.SavedComparisonResponse;
import com.loandiscovery.model.SavedComparison;
import com.loandiscovery.model.User;
import com.loandiscovery.repository.SavedComparisonRepository;
import com.loandiscovery.security.CurrentUserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ComparisonService {

    private final CurrentUserService currentUserService;
    private final SavedComparisonRepository savedComparisonRepository;
    private final ObjectMapper objectMapper;

    public ComparisonService(
            CurrentUserService currentUserService,
            SavedComparisonRepository savedComparisonRepository,
            ObjectMapper objectMapper
    ) {
        this.currentUserService = currentUserService;
        this.savedComparisonRepository = savedComparisonRepository;
        this.objectMapper = objectMapper;
    }

    public List<SavedComparisonResponse> listSavedComparisons() {
        User user = currentUserService.getCurrentUserEntity();
        return savedComparisonRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SavedComparisonResponse saveComparison(SaveComparisonRequest request) {
        User user = currentUserService.getCurrentUserEntity();

        SavedComparison savedComparison = new SavedComparison();
        savedComparison.setUser(user);
        savedComparison.setSelectedLoans(serialize(request.getSelectedLoans()));

        return toResponse(savedComparisonRepository.save(savedComparison));
    }

    public void deleteComparison(Long comparisonId) {
        User user = currentUserService.getCurrentUserEntity();
        SavedComparison comparison = savedComparisonRepository.findByIdAndUserId(comparisonId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Saved comparison not found"));
        savedComparisonRepository.delete(comparison);
    }

    private SavedComparisonResponse toResponse(SavedComparison comparison) {
        return new SavedComparisonResponse(
                comparison.getId(),
                deserialize(comparison.getSelectedLoans()),
                comparison.getCreatedAt()
        );
    }

    private String serialize(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to serialize selected loans", ex);
        }
    }

    private Object deserialize(String value) {
        try {
            return objectMapper.readValue(value, Object.class);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to read saved comparison", ex);
        }
    }
}