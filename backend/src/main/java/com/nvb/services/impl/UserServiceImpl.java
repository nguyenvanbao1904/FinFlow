/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nvb.services.impl;

import com.nvb.dtos.UserDTO;
import com.nvb.pojos.User;
import com.nvb.repositories.UserRepository;
import com.nvb.services.UserService;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author nguyenvanbao
 */
@Service("userDetailsService")
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserDTO get(Map<String, String> params) {

        String id = params.get("id");
        if (id != null && !id.isEmpty()) {
            return this.toDTO(userRepository.findById(Long.parseLong(id)).orElse(null));
        }

        String username = params.get("username");
        if (username != null && !username.isEmpty()) {
            return this.toDTO(userRepository.findByUsername(username).orElse(null));
        }

        return null;
    }

    @Override
    public UserDTO addOrUpdate(UserDTO userDto, MultipartFile avatar) {
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        return this.toDTO(userRepository.save(this.toEntity(userDto)));
    }

    @Override
    public UserDTO authenticate(String username, String password) {
        User u = userRepository.findByUsername(username).orElse(null);
        if (u != null && passwordEncoder.matches(password, u.getPassword())) {
            return this.toDTO(u);
        }
        return null;
    }

    @Override
    public List<UserDTO> getAll(Map<String, String> params) {
        return this.getAll(params, true);
    }

    @Override
    public List<UserDTO> getAll(Map<String, String> params, boolean pagination) {
        List<UserDTO> ls = new ArrayList<>();
        String username = params.get("username");
        String page = params.get("page");
        if (page == null || page.isEmpty()) {
            params.put("page", "1");
        }

        if (pagination) {
            Page<User> users;
            Pageable pageable = PageRequest.of(Integer.parseInt(page) - 1, 6);
            if (username != null && !username.isEmpty()) {
                users = userRepository.findByUsernameContaining(username, pageable);

                for (User user : users.getContent()) {
                    ls.add(toDTO(user));
                }
            }
            if (params.isEmpty()) {
                users = userRepository.findAll(pageable);
                for (User user : users.getContent()) {
                    ls.add(toDTO(user));
                }
            }
        } else {
            List<User> users;
            if (username != null && !username.isEmpty()) {
                users = userRepository.findByUsernameContaining(username);

                for (User user : users) {
                    ls.add(toDTO(user));
                }
            }
            if (params.isEmpty()) {
                users = userRepository.findAll();
                for (User user : users) {
                    ls.add(toDTO(user));
                }
            }
        }
        return ls;
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDTO u = this.get(Map.of("username", username));
        if (u == null) {
            throw new UsernameNotFoundException("Invalid username!");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        if (u.isIsAdmin()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(), u.getPassword(), authorities);
    }

    private UserDTO toDTO(User user) {

        if (user == null) {
            return null;
        }
        return modelMapper.map(user, UserDTO.class);
    }

    private User toEntity(UserDTO dto) {

        if (dto == null) {
            return null;
        }
        return modelMapper.map(dto, User.class);
    }

}
