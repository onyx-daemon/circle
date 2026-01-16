package com.susa.circle.dto.response;

import com.susa.circle.enums.EmailType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailResponse {

    private Long id;
    private String email;
    private EmailType type;
}
