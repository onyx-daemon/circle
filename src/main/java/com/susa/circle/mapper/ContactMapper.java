package com.susa.circle.mapper;

import com.susa.circle.dto.response.ContactResponse;
import com.susa.circle.dto.response.EmailResponse;
import com.susa.circle.dto.response.PhoneResponse;
import com.susa.circle.entity.Contact;
import com.susa.circle.entity.ContactEmail;
import com.susa.circle.entity.ContactPhone;
import java.util.List;
import java.util.stream.Collectors;

public class ContactMapper {

    public static ContactResponse toResponse(Contact contact) {
        return ContactResponse.builder()
            .id(contact.getId())
            .firstName(contact.getFirstName())
            .lastName(contact.getLastName())
            .title(contact.getTitle())
            .emails(toEmailResponses(contact.getEmails()))
            .phones(toPhoneResponses(contact.getPhones()))
            .createdAt(contact.getCreatedAt())
            .updatedAt(contact.getUpdatedAt())
            .build();
    }

    private static List<EmailResponse> toEmailResponses(
        List<ContactEmail> emails
    ) {
        return emails
            .stream()
            .map(email ->
                EmailResponse.builder()
                    .id(email.getId())
                    .email(email.getEmail())
                    .type(email.getType())
                    .build()
            )
            .collect(Collectors.toList());
    }

    private static List<PhoneResponse> toPhoneResponses(
        List<ContactPhone> phones
    ) {
        return phones
            .stream()
            .map(phone ->
                PhoneResponse.builder()
                    .id(phone.getId())
                    .phoneNumber(phone.getPhoneNumber())
                    .type(phone.getType())
                    .build()
            )
            .collect(Collectors.toList());
    }
}
