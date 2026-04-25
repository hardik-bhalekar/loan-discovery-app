package com.loandiscovery.repository;

import com.loandiscovery.entity.UserConsent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserConsentRepository extends JpaRepository<UserConsent, Long> {
    List<UserConsent> findByUserIdAndStatus(Long userId, String status);
}
