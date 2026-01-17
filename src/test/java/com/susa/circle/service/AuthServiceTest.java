package com.susa.circle.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.susa.circle.dto.request.ChangePasswordRequest;
import com.susa.circle.dto.request.LoginRequest;
import com.susa.circle.dto.request.RegisterRequest;
import com.susa.circle.dto.response.AuthResponse;
import com.susa.circle.dto.response.UserResponse;
import com.susa.circle.entity.User;
import com.susa.circle.exception.BadRequestException;
import com.susa.circle.exception.ResourceNotFoundException;
import com.susa.circle.repository.UserRepository;
import com.susa.circle.security.CustomUserDetails;
import com.susa.circle.security.JwtUtil;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1L)
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .phoneNumber("+1234567890")
            .password("encodedPassword")
            .active(true)
            .build();

        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPhoneNumber("+1234567890");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("john@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void testRegister_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByPhoneNumber(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any())).thenReturn("test-token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("test-token", response.getToken());
        assertNotNull(response.getUser());
        assertEquals("John", response.getUser().getFirstName());

        verify(userRepository).existsByEmail("john@example.com");
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken(any());
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> authService.register(registerRequest)
        );

        assertEquals("Email is already registered", exception.getMessage());
        verify(userRepository).existsByEmail("john@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegister_PhoneAlreadyExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByPhoneNumber(anyString())).thenReturn(true);

        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> authService.register(registerRequest)
        );

        assertEquals(
            "Phone number is already registered",
            exception.getMessage()
        );
        verify(userRepository).existsByPhoneNumber("+1234567890");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLogin_Success() {
        Authentication authentication = mock(Authentication.class);
        CustomUserDetails userDetails = CustomUserDetails.build(testUser);

        when(
            authenticationManager.authenticate(
                any(UsernamePasswordAuthenticationToken.class)
            )
        ).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtil.generateToken(any())).thenReturn("test-token");
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("test-token", response.getToken());
        assertNotNull(response.getUser());
        assertEquals("John", response.getUser().getFirstName());

        verify(authenticationManager).authenticate(
            any(UsernamePasswordAuthenticationToken.class)
        );
        verify(jwtUtil).generateToken(any());
    }

    @Test
    void testLogin_InvalidCredentials() {
        when(
            authenticationManager.authenticate(
                any(UsernamePasswordAuthenticationToken.class)
            )
        ).thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () ->
            authService.login(loginRequest)
        );

        verify(authenticationManager).authenticate(
            any(UsernamePasswordAuthenticationToken.class)
        );
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void testChangePassword_Success() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("password123");
        request.setNewPassword("newpassword123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(
            passwordEncoder.matches("password123", "encodedPassword")
        ).thenReturn(true);
        when(passwordEncoder.encode("newpassword123")).thenReturn(
            "newEncodedPassword"
        );
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        assertDoesNotThrow(() -> authService.changePassword(1L, request));

        verify(userRepository).findById(1L);
        verify(passwordEncoder).matches("password123", "encodedPassword");
        verify(passwordEncoder).encode("newpassword123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testChangePassword_UserNotFound() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("password123");
        request.setNewPassword("newpassword123");

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> authService.changePassword(1L, request)
        );

        assertTrue(exception.getMessage().contains("User"));
        verify(userRepository).findById(1L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testChangePassword_IncorrectCurrentPassword() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrongpassword");
        request.setNewPassword("newpassword123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(
            passwordEncoder.matches("wrongpassword", "encodedPassword")
        ).thenReturn(false);

        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> authService.changePassword(1L, request)
        );

        assertEquals("Current password is incorrect", exception.getMessage());
        verify(userRepository).findById(1L);
        verify(passwordEncoder).matches("wrongpassword", "encodedPassword");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testGetCurrentUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        UserResponse response = authService.getCurrentUser(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("john@example.com", response.getEmail());

        verify(userRepository).findById(1L);
    }

    @Test
    void testGetCurrentUser_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> authService.getCurrentUser(1L)
        );

        assertTrue(exception.getMessage().contains("User"));
        verify(userRepository).findById(1L);
    }
}
