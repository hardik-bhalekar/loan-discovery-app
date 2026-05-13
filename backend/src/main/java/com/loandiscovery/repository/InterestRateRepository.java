package com.loandiscovery.repository;

import com.loandiscovery.model.InterestRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterestRateRepository extends JpaRepository<InterestRate, Long> {

    List<InterestRate> findByIsLatestTrueOrderByLoanTypeAscBankNameAsc();

    List<InterestRate> findByLoanTypeAndIsLatestTrueOrderByInterestRateMinAsc(String loanType);

    Optional<InterestRate> findFirstByIsLatestTrueOrderByScrapedAtDesc();

    @Modifying
    @Transactional
    @Query("UPDATE InterestRate r SET r.isLatest = false WHERE r.isLatest = true")
    void markAllAsNotLatest();

    @Query("SELECT DISTINCT r.loanType FROM InterestRate r WHERE r.isLatest = true")
    List<String> findDistinctLoanTypes();

    long countByIsLatestTrue();
}
