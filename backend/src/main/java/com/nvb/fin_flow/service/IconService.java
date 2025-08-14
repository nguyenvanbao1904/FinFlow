package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.request.IconCreationRequest;
import com.nvb.fin_flow.dto.response.IconResponse;

import java.util.Set;

public interface IconService {
    Set<IconResponse> getIcons();
    IconResponse addIcon(IconCreationRequest iconCreationRequest);
    void deleteIcon(String id);
}
