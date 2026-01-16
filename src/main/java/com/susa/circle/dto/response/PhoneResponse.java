package com.susa.circle.dto.response;

import com.susa.circle.enums.PhoneType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhoneResponse {

    private Long id;
    private String phoneNumber;
    private PhoneType type;
}
