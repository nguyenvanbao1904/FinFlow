package com.nvb.fin_flow.utilities;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class SortUtility {
    public Sort getSort(String sortParam) {
        Sort sort = Sort.unsorted();

        if (sortParam != null && !sortParam.isEmpty()) {
            String[] parts = sortParam.split(",");
            String sortField = parts[0];
            Sort.Direction sortDirection = Sort.Direction.ASC;

            if (parts.length > 1) {
                sortDirection = Sort.Direction.fromString(parts[1]);
            }

            if ("date".equals(sortField)) {
                sort = Sort.by(sortDirection, sortField)
                        .and(Sort.by("id")); // Sắp xếp phụ theo ID
            } else {
                sort = Sort.by(sortDirection, sortField);
            }
        }
        return sort;
    }

}
