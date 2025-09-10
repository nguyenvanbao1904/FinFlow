package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.response.BoardMemberResponse;

import java.util.Map;
import java.util.Set;

public interface BoardMemberService {
    Set<BoardMemberResponse> getBoardMembers(Map<String, String> params);
}
