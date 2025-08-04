package com.hexaware.project.cozyhaven.Service;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hexaware.project.cozyhaven.Entity.HotelOwner;
import com.hexaware.project.cozyhaven.Entity.User;
import com.hexaware.project.cozyhaven.Enum.Roles;
import com.hexaware.project.cozyhaven.Repository.HotelOwnerRepository;
import com.hexaware.project.cozyhaven.Repository.UserRepository;

@Service
public class UserService {
	
	
	@Autowired
    private PasswordEncoder passwordEncoder;
	
    @Autowired
    private UserRepository userRepository;  
    
    @Autowired
    private HotelOwnerRepository hotelOwnerRepository;  
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    
    public User registerUser(User user) {
    	logger.info("===============================>User registration Started");
        // Check if username exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
        	logger.info("===============================>This user Records are already present in DB");
            throw new RuntimeException("Username is already taken, please try a different one");
        }   
        // Check if email exists
        if (userRepository.existsByEmail(user.getEmail())) {
        	logger.info("===============================>This user Records are already present in DB");
            throw new RuntimeException("Email is already registered, please try a different one");
        }    
        User user1 = userRepository.save(user);
    	if (user1.getRole() == Roles.HOTEL_OWNER) {
            HotelOwner hotelOwner = new HotelOwner();
            hotelOwner.setUser(user1);
            hotelOwnerRepository.save(hotelOwner);
        }
    	logger.info("===================================>User registration CompletedSuccessfully,and values stored in DB");
        return user1;
    }


    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // Find a user by their ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    
    public User updateUser(Long id, User userDetails) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setName(userDetails.getName());
        
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setUsername(userDetails.getUsername());
        if(userDetails.getPassword()!=null) {
        //System.out.println(userDetails.getPassword());
        userDetails.setPassword(encodePassword(userDetails.getPassword()));
        //System.out.println(userDetails.getPassword());
        existingUser.setPassword(userDetails.getPassword());
        }
        
        
        return userRepository.save(existingUser);
    }

    
    public String deleteUser(Long id) {
    	User u= userRepository.findById(id).orElse(null);
    	if(u!=null) {
        userRepository.deleteById(id);
		return "Deleted";
    	}
    	else {
			return "Not Found";
		}
    }




	public List<User> showall() {
		List<User> user=userRepository.findAll();
		return user;
		
	}

	public Long getOwnerIdByUserId(Long userId) {
	    HotelOwner owner = hotelOwnerRepository.findByUserId(userId);
	    return owner.getOwnerId();
	}


	public List<User> getUsersByRole(Roles role) {
		List<User> li=userRepository.findByRole(role);
		return li;
	}




	public String encodePassword(String password) {
        // Encrypt the password using BCryptPasswordEncoder
        return passwordEncoder.encode(password);
    }




	public User findByUsername(String string) {
		User u = userRepository.findByUsername(string).orElse(null);
		return u;
	}




	public User save(User user) {
		return userRepository.save(user);
		
	}
}