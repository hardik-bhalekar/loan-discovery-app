package com.loandiscovery.repository;

import com.loandiscovery.entity.OtpRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRecordRepository extends JpaRepository<OtpRecord, Long> {
    Optional<OtpRecord> findTopByIdentifierOrderByExpiresAtDesc(String identifier);
}
