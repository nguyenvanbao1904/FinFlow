package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.request.IconCreationRequest;
import com.nvb.fin_flow.dto.response.IconPageableResponse;
import com.nvb.fin_flow.dto.response.IconResponse;

import java.util.Map;
import java.util.Set;

public interface IconService {
    IconPageableResponse getIcons(Map<String, String> params);

    IconResponse addIcon(IconCreationRequest iconCreationRequest);

    void deleteIcon(String id);

    Set<IconResponse> getIconsNonPageable();
}
