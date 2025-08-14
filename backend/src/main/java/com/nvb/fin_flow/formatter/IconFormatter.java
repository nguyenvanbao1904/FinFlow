package com.nvb.fin_flow.formatter;


import com.nvb.fin_flow.entity.Icon;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.repository.IconRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.Formatter;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Map;

@Component
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)

public class IconFormatter implements Formatter<Icon> {
    IconRepository iconRepository;

    @Override
    public Icon parse(String id, Locale locale) {
        Icon icon = iconRepository.findById(id).orElse(null);
        if (icon == null) {
            throw new AppException(ErrorCode.INVALID_REFERENCE, Map.of("entity", "Icon"));
        }
        return icon;

    }

    @Override
    public String print(Icon icon, Locale locale) {
        return icon.getId().toString();
    }
}
