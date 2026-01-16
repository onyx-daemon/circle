package com.susa.circle.security;

import com.susa.circle.entity.User;
import com.susa.circle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
        throws UsernameNotFoundException {
        log.debug("Loading user by username: {}", username);

        User user = userRepository
            .findByEmail(username)
            .or(() -> userRepository.findByPhoneNumber(username))
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    "User not found with username: " + username
                )
            );

        return CustomUserDetails.build(user);
    }

    public UserDetails loadUserById(Long id) {
        log.debug("Loading user by id: {}", id);

        User user = userRepository
            .findById(id)
            .orElseThrow(() ->
                new UsernameNotFoundException("User not found with id: " + id)
            );

        return CustomUserDetails.build(user);
    }
}
