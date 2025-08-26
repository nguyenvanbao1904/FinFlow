package com.nvb.fin_flow.deserializer;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.nvb.fin_flow.dto.response.IconResponse;
import com.nvb.fin_flow.entity.Icon;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.IconMapper;
import com.nvb.fin_flow.repository.IconRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IconDeserializer extends JsonDeserializer<Icon> {
    IconRepository iconRepository;
    IconMapper iconMapper;

    @Override
    public Icon deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        String id = jsonParser.getText();
        return iconRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REFERENCE, Map.of("entity", "Icon")));
    }
}
