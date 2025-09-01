    package com.nvb.fin_flow.utilities;

    import com.nvb.fin_flow.enums.SystemSettingKey;
    import com.nvb.fin_flow.exception.AppException;
    import com.nvb.fin_flow.exception.ErrorCode;
    import com.nvb.fin_flow.service.SystemSettingsService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.domain.Sort;
    import org.springframework.stereotype.Component;

    @Component
    @RequiredArgsConstructor
    public class PageableUtility {
        private final SystemSettingsService systemSettingsService;
        public Pageable getPageable(String page, Sort sort){
            int size = Integer.parseInt(systemSettingsService.getSettingValue(SystemSettingKey.PAGE_SIZE));
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
