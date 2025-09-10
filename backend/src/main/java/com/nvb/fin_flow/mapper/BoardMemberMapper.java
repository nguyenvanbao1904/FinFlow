package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.response.BoardMemberResponse;
import com.nvb.fin_flow.repository.projection.BoardMemberWithCompanyAndPersonSimple;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BoardMemberMapper {
    @Mapping(source = "company_Name", target = "companyName")
    @Mapping(source = "person_Name", target = "personName")
    BoardMemberResponse toResponse(BoardMemberWithCompanyAndPersonSimple boardMemberWithCompanyAndPersonSimple);
}
