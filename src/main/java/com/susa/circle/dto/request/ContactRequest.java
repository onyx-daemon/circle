package com.susa.circle.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {

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

    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @Valid
    private List<EmailRequest> emails;

    @Valid
    private List<PhoneRequest> phones;
}
