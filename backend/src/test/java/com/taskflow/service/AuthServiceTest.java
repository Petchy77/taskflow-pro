package com.taskflow.service;

import com.taskflow.dto.auth.AuthResponse;
import com.taskflow.dto.auth.LoginRequest;
import com.taskflow.dto.auth.RegisterRequest;
import com.taskflow.entity.User;
import com.taskflow.entity.enums.Role;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;
    private User existingUser;

    @BeforeEach
    void setUp() {
        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setUsername("newuser");
        validRegisterRequest.setEmail("new@example.com");
        validRegisterRequest.setPassword("password123");
        validRegisterRequest.setFullName("New User");

        validLoginRequest = new LoginRequest();
        validLoginRequest.setUsername("petch");
        validLoginRequest.setPassword("petch123");

        existingUser = User.builder()
                .id(1L)
                .username("petch")
                .email("petch@example.com")
                .password("$2a$10$encodedPassword")
                .fullName("Petch")
                .role(Role.USER)
                .enabled(true)
                .build();
    }

    @Nested
    @DisplayName("Register tests")
    class RegisterTests {

        @Test
        @DisplayName("should register new user successfully")
        void shouldRegisterNewUserSuccessfully() {
            // Given
            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
            when(passwordEncoder.encode("password123")).thenReturn("$2a$10$hashed");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setId(99L);
                return user;
            });
            when(tokenProvider.generateToken(anyString(), anyLong(), anyString()))
                    .thenReturn("fake.jwt.token");
            when(tokenProvider.getExpirationTime()).thenReturn(86400000L);

            // When
            AuthResponse response = authService.register(validRegisterRequest);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("fake.jwt.token");
            assertThat(response.getTokenType()).isEqualTo("Bearer");
            assertThat(response.getUser().getUsername()).isEqualTo("newuser");
            assertThat(response.getUser().getRole()).isEqualTo("USER");
            verify(userRepository).save(any(User.class));
            verify(passwordEncoder).encode("password123");
        }

        @Test
        @DisplayName("should throw when username already exists")
        void shouldThrowWhenUsernameExists() {
            // Given
            when(userRepository.existsByUsername("newuser")).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> authService.register(validRegisterRequest))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessage("Username already exists");

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw when email already exists")
        void shouldThrowWhenEmailExists() {
            // Given
            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByEmail("new@example.com")).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> authService.register(validRegisterRequest))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessage("Email already exists");

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("should hash password before saving")
        void shouldHashPasswordBeforeSaving() {
            // Given
            when(userRepository.existsByUsername(anyString())).thenReturn(false);
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode("password123")).thenReturn("$2a$10$super_hashed");
            when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
            when(tokenProvider.generateToken(anyString(), any(), anyString())).thenReturn("token");
            when(tokenProvider.getExpirationTime()).thenReturn(86400000L);

            // When
            authService.register(validRegisterRequest);

            // Then
            verify(passwordEncoder).encode("password123");
            verify(userRepository).save(argThat(user ->
                    user.getPassword().equals("$2a$10$super_hashed")
            ));
        }
    }

    @Nested
    @DisplayName("Login tests")
    class LoginTests {

        @Test
        @DisplayName("should login successfully with valid credentials")
        void shouldLoginWithValidCredentials() {
            // Given
            when(userRepository.findByUsername("petch")).thenReturn(Optional.of(existingUser));
            when(passwordEncoder.matches("petch123", "$2a$10$encodedPassword")).thenReturn(true);
            when(tokenProvider.generateToken("petch", 1L, "USER")).thenReturn("valid.jwt.token");
            when(tokenProvider.getExpirationTime()).thenReturn(86400000L);

            // When
            AuthResponse response = authService.login(validLoginRequest);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("valid.jwt.token");
            assertThat(response.getUser().getId()).isEqualTo(1L);
            assertThat(response.getUser().getUsername()).isEqualTo("petch");
        }

        @Test
        @DisplayName("should throw when user not found")
        void shouldThrowWhenUserNotFound() {
            // Given
            when(userRepository.findByUsername("petch")).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> authService.login(validLoginRequest))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("Invalid username or password");
        }

        @Test
        @DisplayName("should throw when password is wrong")
        void shouldThrowWhenPasswordIsWrong() {
            // Given
            when(userRepository.findByUsername("petch")).thenReturn(Optional.of(existingUser));
            when(passwordEncoder.matches("petch123", "$2a$10$encodedPassword")).thenReturn(false);

            // When & Then
            assertThatThrownBy(() -> authService.login(validLoginRequest))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("Invalid username or password");

            verify(tokenProvider, never()).generateToken(anyString(), anyLong(), anyString());
        }

        @Test
        @DisplayName("should throw when account is disabled")
        void shouldThrowWhenAccountDisabled() {
            // Given
            existingUser.setEnabled(false);
            when(userRepository.findByUsername("petch")).thenReturn(Optional.of(existingUser));

            // When & Then
            assertThatThrownBy(() -> authService.login(validLoginRequest))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("Account is disabled");
        }
    }
}
