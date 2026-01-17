package com.susa.circle.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.susa.circle.dto.request.ChangePasswordRequest;
import com.susa.circle.dto.request.LoginRequest;
import com.susa.circle.dto.request.RegisterRequest;
import com.susa.circle.dto.response.AuthResponse;
import com.susa.circle.dto.response.UserResponse;
import com.susa.circle.security.CustomUserDetails;
import com.susa.circle.security.JwtAuthenticationFilter;
import com.susa.circle.service.AuthService;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
    controllers = AuthController.class,
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = JwtAuthenticationFilter.class
    )
)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private AuthResponse authResponse;
    private UserResponse userResponse;
    private CustomUserDetails userDetails;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPhoneNumber("+1234567890");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("john@example.com");
        loginRequest.setPassword("password123");

        userResponse = UserResponse.builder()
            .id(1L)
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .phoneNumber("+1234567890")
            .active(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        authResponse = AuthResponse.builder()
            .token("test-jwt-token")
            .type("Bearer")
            .user(userResponse)
            .build();

        userDetails = new CustomUserDetails(
            1L,
            "john@example.com",
            "password",
            true
        );
    }

    @Test
    void testRegister_Success() throws Exception {
        when(authService.register(any(RegisterRequest.class))).thenReturn(
            authResponse
        );

        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest))
            )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(
                jsonPath("$.message").value("User registered successfully")
            )
            .andExpect(jsonPath("$.data.token").value("test-jwt-token"))
            .andExpect(jsonPath("$.data.user.firstName").value("John"))
            .andExpect(jsonPath("$.data.user.email").value("john@example.com"));

        verify(authService).register(any(RegisterRequest.class));
    }

    @Test
    void testRegister_ValidationError_MissingFirstName() throws Exception {
        registerRequest.setFirstName(null);

        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest))
            )
            .andExpect(status().isBadRequest());

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void testRegister_ValidationError_InvalidEmail() throws Exception {
        registerRequest.setEmail("invalid-email");

        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest))
            )
            .andExpect(status().isBadRequest());

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void testRegister_ValidationError_ShortPassword() throws Exception {
        registerRequest.setPassword("12345");

        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest))
            )
            .andExpect(status().isBadRequest());

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void testLogin_Success() throws Exception {
        when(authService.login(any(LoginRequest.class))).thenReturn(
            authResponse
        );

        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Login successful"))
            .andExpect(jsonPath("$.data.token").value("test-jwt-token"))
            .andExpect(jsonPath("$.data.user.email").value("john@example.com"));

        verify(authService).login(any(LoginRequest.class));
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {
        when(authService.login(any(LoginRequest.class))).thenThrow(
            new BadCredentialsException("Invalid credentials")
        );

        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest))
            )
            .andExpect(status().isUnauthorized());

        verify(authService).login(any(LoginRequest.class));
    }

    @Test
    void testLogin_ValidationError_MissingUsername() throws Exception {
        loginRequest.setUsername(null);

        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest))
            )
            .andExpect(status().isBadRequest());

        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    @WithMockUser
    void testGetCurrentUser_Success() throws Exception {
        when(authService.getCurrentUser(anyLong())).thenReturn(userResponse);

        mockMvc
            .perform(get("/api/auth/me").with(user(userDetails)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.firstName").value("John"))
            .andExpect(jsonPath("$.data.email").value("john@example.com"));

        verify(authService).getCurrentUser(anyLong());
    }

    @Test
    @WithMockUser
    void testChangePassword_Success() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("password123");
        request.setNewPassword("newpassword123");

        doNothing()
            .when(authService)
            .changePassword(anyLong(), any(ChangePasswordRequest.class));

        mockMvc
            .perform(
                put("/api/auth/change-password")
                    .with(user(userDetails))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(
                jsonPath("$.message").value("Password changed successfully")
            );

        verify(authService).changePassword(
            anyLong(),
            any(ChangePasswordRequest.class)
        );
    }

    @Test
    @WithMockUser
    void testChangePassword_ValidationError_ShortNewPassword()
        throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("password123");
        request.setNewPassword("12345");

        mockMvc
            .perform(
                put("/api/auth/change-password")
                    .with(user(userDetails))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request))
            )
            .andExpect(status().isBadRequest());

        verify(authService, never()).changePassword(
            anyLong(),
            any(ChangePasswordRequest.class)
        );
    }
}
