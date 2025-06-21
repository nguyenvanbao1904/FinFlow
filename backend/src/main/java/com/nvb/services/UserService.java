/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.nvb.services;

import com.nvb.dtos.UserDTO;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author nguyenvanbao
 */
public interface UserService extends UserDetailsService {

    UserDTO get(Map<String, String> params);

    UserDTO addOrUpdate(UserDTO userDto, MultipartFile avatar);

    UserDTO authenticate(String username, String password);

    List<UserDTO> getAll(Map<String, String> params);

    List<UserDTO> getAll(Map<String, String> params, boolean pagination);

    void delete(Long id);
}
