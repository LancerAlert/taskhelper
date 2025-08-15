package com.taskhelper.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.builder()
                .username("user@example.com")
                .password(passwordEncoder().encode("password123"))
                .roles("USER")
                .build();

        UserDetails helper = User.builder()
                .username("helper@example.com")
                .password(passwordEncoder().encode("helper123"))
                .roles("USER", "HELPER")
                .build();

        UserDetails admin = User.builder()
                .username("admin@example.com")
                .password(passwordEncoder().encode("admin123"))
                .roles("USER", "HELPER", "ADMIN")
                .build();

        return new InMemoryUserDetailsManager(user, helper, admin);
    }

    @Bean
    public SecurityFilterChain filterCHain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // 개발용 비활성화, 운영 시 보완 설정 필요
            .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/", "/register", "/css/**", "/js/**", "/images/**").permitAll()
                    .anyRequest().permitAll()
            )
                .formLogin(form -> form
                    .loginPage("/login")                               // 커스텀 로그인 페이지 경로
                    .loginProcessingUrl("/login")                        // 로그인 form submit 처리 URL (POST)
                    .defaultSuccessUrl("/", true) // 로그인 성공 시 이동할 기본 URL
                    .failureUrl("/login?error=true")   // 로그인 실패 시 이동 URL
                    .permitAll()
                )
                .logout(logout -> logout
                    .logoutUrl("/logout")                              // 로그아웃 URL
                    .logoutSuccessUrl("/login?logout")                 // 로그아웃 후 이동할 URL
                    .invalidateHttpSession(true)                         // 세션 무효화
                    .deleteCookies("JSESSIONID")        // 쿠기 삭제
                    .permitAll()
                );

        return http.build();
    }
}