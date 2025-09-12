package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
    List<InvalidatedToken> findByExpiryTimeBefore(LocalDateTime dateTime);
}