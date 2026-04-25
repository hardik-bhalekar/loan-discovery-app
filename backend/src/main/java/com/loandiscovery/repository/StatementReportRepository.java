package com.loandiscovery.repository;

import com.loandiscovery.entity.StatementReport;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatementReportRepository extends JpaRepository<StatementReport, Long> {
    Optional<StatementReport> findTopByUserIdOrderByUploadedAtDesc(Long userId);
}
