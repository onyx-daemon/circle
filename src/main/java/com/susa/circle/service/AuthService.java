package com.susa.circle.service;

import com.susa.circle.dto.request.ChangePasswordRequest;
import com.susa.circle.dto.request.LoginRequest;
import com.susa.circle.dto.request.RegisterRequest;
import com.susa.circle.dto.response.AuthResponse;
import com.susa.circle.dto.response.UserResponse;
import com.susa.circle.entity.User;
import com.susa.circle.exception.BadRequestException;
import com.susa.circle.exception.ResourceNotFoundException;
import com.susa.circle.mapper.UserMapper;
import com.susa.circle.repository.UserRepository;
import com.susa.circle.security.CustomUserDetails;
import com.susa.circle.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info(
            "Attempting to register user with email: {} or phone: {}",
            request.getEmail(),
            request.getPhoneNumber()
        );

        if (
            request.getEmail() != null &&
            userRepository.existsByEmail(request.getEmail())
        ) {
            throw new BadRequestException("Email is already registered");
        }

        if (
            request.getPhoneNumber() != null &&
            userRepository.existsByPhoneNumber(request.getPhoneNumber())
        ) {
            throw new BadRequestException("Phone number is already registered");
        }

        User user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phoneNumber(request.getPhoneNumber())
            .password(passwordEncoder.encode(request.getPassword()))
            .active(true)
            .build();

        user = userRepository.save(user);
        log.info("User registered successfully with id: {}", user.getId());

        // Removed unused username variable and directly create user details
        CustomUserDetails userDetails = CustomUserDetails.build(user);
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, UserMapper.toResponse(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Attempting to login user: {}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails =
            (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        User user = userRepository
            .findById(userDetails.getId())
            .orElseThrow(() ->
                new ResourceNotFoundException("User", "id", userDetails.getId())
            );

        log.info("User logged in successfully: {}", request.getUsername());
        return new AuthResponse(token, UserMapper.toResponse(user));
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        log.info("Attempting to change password for user id: {}", userId);

        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new ResourceNotFoundException("User", "id", userId)
            );

        if (
            !passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
            )
        ) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user id: {}", userId);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        log.debug("Fetching user profile for id: {}", userId);

        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new ResourceNotFoundException("User", "id", userId)
            );

        return UserMapper.toResponse(user);
    }
}
