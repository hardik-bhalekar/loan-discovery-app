package com.loandiscovery.repository;

import com.loandiscovery.model.LoanProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanProfileRepository extends JpaRepository<LoanProfile, Long> {
    Optional<LoanProfile> findByUserId(Long userId);
}
