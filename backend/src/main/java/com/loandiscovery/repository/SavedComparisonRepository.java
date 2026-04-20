package com.loandiscovery.repository;

import com.loandiscovery.model.SavedComparison;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedComparisonRepository extends JpaRepository<SavedComparison, Long> {
    List<SavedComparison> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<SavedComparison> findByIdAndUserId(Long id, Long userId);
}
