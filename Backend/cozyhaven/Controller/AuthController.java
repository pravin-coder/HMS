package com.hexaware.project.cozyhaven.Controller;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.project.cozyhaven.Entity.HotelOwner;
import com.hexaware.project.cozyhaven.Entity.LoginRequest;
import com.hexaware.project.cozyhaven.Entity.User;
import com.hexaware.project.cozyhaven.Exception.UserNotFoundException;
import com.hexaware.project.cozyhaven.Repository.UserRepository;
import com.hexaware.project.cozyhaven.Security.JWTUtil;
import com.hexaware.project.cozyhaven.Service.HotelOwnerService;
import com.hexaware.project.cozyhaven.Service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private HotelOwnerService hotelOwnerService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private JWTUtil jwtUtil;

    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) throws UserNotFoundException {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                                    .map(GrantedAuthority::getAuthority)
                                    .findFirst()
                                    .orElse("ROLE_USER");

            // ✅ Now using updated token method
            String token = jwtUtil.generateToken(authentication.getName(), role);
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));


            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            response.put("userId", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
    
    
    
    
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getOwnerId")
    public ResponseEntity<?> getOwnerId() {
        try {
            // Fetch the currently logged-in user's username
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username;
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
            // Fetch the User entity based on the username
            User user = userService.findByUsername(username);  // Assume you have a service method for this
            if (user == null) {
                return ResponseEntity.notFound().build();  // Handle case where user is not found
            }
            // Fetch the HotelOwner entity based on the User ID
            HotelOwner hotelOwner = hotelOwnerService.getHotelOwnerByUserId(user.getId());
            if (hotelOwner == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(hotelOwner.getOwnerId());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching owner ID: " + e.getMessage());
        }
    }
    
    
    
    
    @GetMapping("/getUserId")
    public ResponseEntity<?> getUserId() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = (principal instanceof UserDetails) 
                              ? ((UserDetails) principal).getUsername() 
                              : principal.toString();

            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body("User not found for username: " + username);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("userId", user);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error fetching user ID: " + e.getMessage());
        }
    }



}