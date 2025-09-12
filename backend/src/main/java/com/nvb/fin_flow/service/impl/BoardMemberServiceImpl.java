package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.response.BoardMemberResponse;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.BoardMemberMapper;
import com.nvb.fin_flow.repository.BoardMemberRepository;
import com.nvb.fin_flow.repository.CompanyRepository;
import com.nvb.fin_flow.service.BoardMemberService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class BoardMemberServiceImpl implements BoardMemberService {
    BoardMemberRepository boardMemberRepository;
    CompanyRepository companyRepository;
    BoardMemberMapper boardMemberMapper;
    @Override
    @Cacheable(value = "boardMembers", key = "#params['code']")
    public Set<BoardMemberResponse> getBoardMembers(Map<String, String> params) {
        String code = params.get("code");
        if (code != null && !code.isEmpty()) {
            return companyRepository.findByCode(code)
                    .map(company -> boardMemberRepository.findByCompany(company)
                            .stream()
                            .map(boardMemberMapper::toResponse)
                            .sorted((a, b) -> {
                                return getPriority(a.getPosition()) - getPriority(b.getPosition());
                            })
                            .collect(Collectors.toCollection(LinkedHashSet::new))
                    )
                    .orElseThrow(() ->new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "company")));
        }

        throw new AppException(ErrorCode.PARAMS_INVALID);
    }
    private int getPriority(String position) {
        if (position == null) return 999; // fallback nếu null
        if (position.contains("Chủ tịch")) return 1;
        if (position.contains("Tổng Giám đốc")) return 2;
        if (position.contains("Phó Tổng Giám đốc")) return 3;
        if (position.contains("Giám đốc")) return 4;
        if (position.contains("Trưởng Ban kiểm soát")) return 5;
        return 100; // các chức vụ khác
    }
}

