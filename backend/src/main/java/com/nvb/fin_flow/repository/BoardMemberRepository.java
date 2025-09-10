package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.BoardMember;
import com.nvb.fin_flow.entity.Company;
import com.nvb.fin_flow.repository.projection.BoardMemberWithCompanyAndPersonSimple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardMemberRepository extends JpaRepository<BoardMember, String> {
    List<BoardMemberWithCompanyAndPersonSimple> findByCompany(Company company);
}
