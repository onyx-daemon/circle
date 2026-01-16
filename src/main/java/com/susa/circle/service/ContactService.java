package com.susa.circle.service;

import com.susa.circle.dto.request.ContactRequest;
import com.susa.circle.dto.response.ContactResponse;
import com.susa.circle.entity.Contact;
import com.susa.circle.entity.ContactEmail;
import com.susa.circle.entity.ContactPhone;
import com.susa.circle.entity.User;
import com.susa.circle.exception.BadRequestException;
import com.susa.circle.exception.ResourceNotFoundException;
import com.susa.circle.mapper.ContactMapper;
import com.susa.circle.repository.ContactRepository;
import com.susa.circle.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    @Transactional
    public ContactResponse createContact(Long userId, ContactRequest request) {
        log.info("Creating contact for user id: {}", userId);

        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new ResourceNotFoundException("User", "id", userId)
            );

        Contact contact = Contact.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .title(request.getTitle())
            .user(user)
            .build();

        if (request.getEmails() != null) {
            List<ContactEmail> emails = request
                .getEmails()
                .stream()
                .map(emailReq ->
                    ContactEmail.builder()
                        .email(emailReq.getEmail())
                        .type(emailReq.getType())
                        .contact(contact)
                        .build()
                )
                .collect(Collectors.toList());
            contact.setEmails(emails);
        }

        if (request.getPhones() != null) {
            List<ContactPhone> phones = request
                .getPhones()
                .stream()
                .map(phoneReq ->
                    ContactPhone.builder()
                        .phoneNumber(phoneReq.getPhoneNumber())
                        .type(phoneReq.getType())
                        .contact(contact)
                        .build()
                )
                .collect(Collectors.toList());
            contact.setPhones(phones);
        }

        Contact savedContact = contactRepository.save(contact);
        log.info(
            "Contact created successfully with id: {}",
            savedContact.getId()
        );

        return ContactMapper.toResponse(savedContact);
    }

    @Transactional(readOnly = true)
    public Page<ContactResponse> getAllContacts(
        Long userId,
        Pageable pageable
    ) {
        log.debug("Fetching contacts for user id: {}", userId);

        Page<Contact> contacts = contactRepository.findByUserId(
            userId,
            pageable
        );

        // Manual conversion to avoid Streamable/Page issue
        List<ContactResponse> content = contacts
            .getContent()
            .stream()
            .map(ContactMapper::toResponse)
            .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, contacts.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Page<ContactResponse> searchContacts(
        Long userId,
        String search,
        Pageable pageable
    ) {
        log.debug(
            "Searching contacts for user id: {} with search term: {}",
            userId,
            search
        );

        Page<Contact> contacts = contactRepository.searchContactsByUserId(
            userId,
            search,
            pageable
        );

        // Manual conversion to avoid Streamable/Page issue
        List<ContactResponse> content = contacts
            .getContent()
            .stream()
            .map(ContactMapper::toResponse)
            .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, contacts.getTotalElements());
    }

    @Transactional(readOnly = true)
    public ContactResponse getContactById(Long userId, Long contactId) {
        log.debug("Fetching contact id: {} for user id: {}", contactId, userId);

        Contact contact = contactRepository
            .findById(contactId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Contact", "id", contactId)
            );

        if (!contact.getUser().getId().equals(userId)) {
            throw new BadRequestException(
                "You don't have permission to access this contact"
            );
        }

        return ContactMapper.toResponse(contact);
    }

    @Transactional
    public ContactResponse updateContact(
        Long userId,
        Long contactId,
        ContactRequest request
    ) {
        log.info("Updating contact id: {} for user id: {}", contactId, userId);

        // Find the contact to update
        Contact contact = contactRepository
            .findById(contactId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Contact", "id", contactId)
            );

        if (!contact.getUser().getId().equals(userId)) {
            throw new BadRequestException(
                "You don't have permission to update this contact"
            );
        }

        // Update basic fields
        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setTitle(request.getTitle());

        // Clear and recreate emails
        contact.getEmails().clear();
        if (request.getEmails() != null) {
            for (var emailReq : request.getEmails()) {
                ContactEmail email = ContactEmail.builder()
                    .email(emailReq.getEmail())
                    .type(emailReq.getType())
                    .contact(contact)
                    .build();
                contact.getEmails().add(email);
            }
        }

        // Clear and recreate phones
        contact.getPhones().clear();
        if (request.getPhones() != null) {
            for (var phoneReq : request.getPhones()) {
                ContactPhone phone = ContactPhone.builder()
                    .phoneNumber(phoneReq.getPhoneNumber())
                    .type(phoneReq.getType())
                    .contact(contact)
                    .build();
                contact.getPhones().add(phone);
            }
        }

        // Save and return updated contact
        Contact updatedContact = contactRepository.save(contact);
        log.info(
            "Contact updated successfully with id: {}",
            updatedContact.getId()
        );

        return ContactMapper.toResponse(updatedContact);
    }

    @Transactional
    public void deleteContact(Long userId, Long contactId) {
        log.info("Deleting contact id: {} for user id: {}", contactId, userId);

        Contact contact = contactRepository
            .findById(contactId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Contact", "id", contactId)
            );

        if (!contact.getUser().getId().equals(userId)) {
            throw new BadRequestException(
                "You don't have permission to delete this contact"
            );
        }

        contactRepository.delete(contact);
        log.info("Contact deleted successfully with id: {}", contactId);
    }
}
