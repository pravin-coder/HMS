package com.hexaware.project.cozyhaven.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.hexaware.project.cozyhaven.Security.CustomUserDetailsService;
import com.hexaware.project.cozyhaven.Security.JWTFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JWTFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return authBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(authz -> authz
        		.requestMatchers("/api/**").permitAll()
        	    .requestMatchers("/api/auth/login").permitAll()
        	    .requestMatchers("/api/users/register").permitAll()
        	    .requestMatchers("/api/bookings/**").permitAll()
        	    .requestMatchers("/api/users/**").permitAll()
        	    .requestMatchers("/api/users/updateuser/**").permitAll()
        	    .requestMatchers("/api/users/getuser/**").permitAll()
        	    .requestMatchers("/api/hotels/**").permitAll()
        	    .requestMatchers("/api/rooms/getroombyid/{id}").permitAll()
        	    .requestMatchers("/api/rooms/allrooms-available/**").permitAll()
        	    .requestMatchers("/api/hotels/getallhotel").permitAll()
        	    .requestMatchers("/api/hotels/gethotelbyid/**").permitAll() 
        	    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        	    .anyRequest().authenticated()
        	)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
