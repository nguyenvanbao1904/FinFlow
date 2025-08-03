package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.request.UserCreationRequest;
import com.nvb.fin_flow.dto.request.UserUpdateRequest;
import com.nvb.fin_flow.dto.response.UserResponse;
import com.nvb.fin_flow.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}