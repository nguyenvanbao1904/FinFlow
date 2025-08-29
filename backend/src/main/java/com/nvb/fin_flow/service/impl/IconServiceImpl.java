package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.request.IconCreationRequest;
import com.nvb.fin_flow.dto.response.IconPageableResponse;
import com.nvb.fin_flow.dto.response.IconResponse;
import com.nvb.fin_flow.entity.Icon;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.IconMapper;
import com.nvb.fin_flow.repository.IconRepository;
import com.nvb.fin_flow.service.IconService;
import com.nvb.fin_flow.utilities.PageableUtility;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class IconServiceImpl implements IconService {
    IconRepository iconRepository;
    IconMapper iconMapper;
    PageableUtility pageableUtility;

    @Override
    public IconPageableResponse getIcons(Map<String, String> params) {
        Pageable page = pageableUtility.getPageable(params.get("page"), null);
        Page<Icon> icons = iconRepository.findAll(page);
        return IconPageableResponse.builder()
                .totalPages(icons.getTotalPages())
                .iconResponses(new LinkedHashSet<>(
                        icons.getContent().stream().map(iconMapper::toResponse).collect(Collectors.toList())))
                .build();
    }

    @Override
    public IconResponse addIcon(IconCreationRequest iconCreationRequest) {
        Icon icon = iconRepository.save(iconMapper.toEntity(iconCreationRequest));
        return iconMapper.toResponse(icon);
    }

    @Override
    public void deleteIcon(String id) {
        try {
            iconRepository.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new AppException(ErrorCode.SQL_EXCEPTION,
                    Map.of("ms", ex.getCause().getMessage().split("\\[")[0].trim()));
        }
    }

    @Override
    public Set<IconResponse> getIconsNonPageable() {
        return iconRepository.findAll().stream()
                .map(iconMapper::toResponse)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
