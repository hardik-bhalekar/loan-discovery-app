package com.loandiscovery.repository;

import com.loandiscovery.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    Optional<Branch> findByIfsc(String ifsc);

    List<Branch> findByCityContainingIgnoreCase(String city);

    List<Branch> findByBankContainingIgnoreCase(String bank);

    @Query("SELECT DISTINCT b.bank FROM Branch b ORDER BY b.bank")
    List<String> findDistinctBankNames();
}
