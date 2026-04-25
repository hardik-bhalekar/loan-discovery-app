package com.loandiscovery.repository;

import com.loandiscovery.entity.FraudAlert;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {
    List<FraudAlert> findByResolvedFalseOrderByCreatedAtDesc();
}
