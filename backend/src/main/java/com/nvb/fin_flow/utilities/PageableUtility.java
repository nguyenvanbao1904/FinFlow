package com.nvb.fin_flow.utilities;

import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class PageableUtility {
    @Value("${pageable.size}")
    private int size;
    public Pageable getPageable(String page, Sort sort){
        int pageInt;
        try {
            if (page == null || page.isEmpty()) {
                pageInt = 0;
            } else {
                pageInt = Integer.parseInt(page) - 1;
                if (pageInt < 0) {
                    pageInt = 0;
                }
            }
        }catch (NumberFormatException e){
            throw new AppException(ErrorCode.INVALID_DATE_FORMAT);
        }
        if(sort != null){
            return PageRequest.of(pageInt, size, sort);
        }
        return PageRequest.of(pageInt, size);
    }
}
