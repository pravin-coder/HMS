package com.hexaware.project.cozyhaven.Security;

import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtil {

    // Secret key for signing the token (make sure it's sufficiently long and secure)
    private static final String SECRET_KEY = "absgdhjagbdbaudshfgshdjdgfjhfgsdgfdsgjgfudsgf";

    // Token validity in seconds (5 hours)
    private static final int TOKEN_VALIDITY = 5 * 60 * 60;

    // Generate JWT token with username and role claims
    public String generateToken(String username, String role) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)   // Embed role in the token payload
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000L))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract role claim from token
    public String extractUserRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // Extract username (subject) from token
    public String extractUserName(String token) {
        return getClaims(token).getSubject();
    }

    // Validate token against username and expiration
    public Boolean isTokenValid(String token, String username) {
        String extractedUsername = extractUserName(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    // Check if token expiration date has passed
    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // Extract all claims from token
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
