package com.susa.circle.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String title;
    private List<EmailResponse> emails;
    private List<PhoneResponse> phones;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
