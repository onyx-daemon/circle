package com.susa.circle.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    @Size(
        min = 2,
        max = 100,
        message = "First name must be between 2 and 100 characters"
    )
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(
        min = 2,
        max = 100,
        message = "Last name must be between 2 and 100 characters"
    )
    private String lastName;

    @Email(message = "Email should be valid")
    private String email;

    @Pattern(
        regexp = "^\\+?[1-9]\\d{1,14}$",
        message = "Phone number should be valid"
    )
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @AssertTrue(message = "Either email or phone number must be provided")
    public boolean isEmailOrPhoneProvided() {
        return (
            (email != null && !email.isBlank()) ||
            (phoneNumber != null && !phoneNumber.isBlank())
        );
    }
}
