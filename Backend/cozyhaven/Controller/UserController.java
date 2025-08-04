package com.hexaware.project.cozyhaven.Controller;



import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.project.cozyhaven.Dto.UserDTO;
import com.hexaware.project.cozyhaven.Entity.User;
import com.hexaware.project.cozyhaven.Enum.Roles;
import com.hexaware.project.cozyhaven.Exception.UserNotFoundException;
import com.hexaware.project.cozyhaven.Service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
//@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper mp;
    
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/allusers")
    public ResponseEntity<List<UserDTO>> getallusers(){
    	List<User> user =userService.showall();
    	List<UserDTO> users=new ArrayList<>();
    	for(User u : user)
    	{
    		UserDTO x = mp.map(u, UserDTO.class);
    		users.add(x);
    	}
    	if(user.isEmpty()) {
    		return new ResponseEntity<List<UserDTO>>(users,HttpStatus.NO_CONTENT);
    	}
    	return new ResponseEntity<List<UserDTO>>(users,HttpStatus.OK);
    }
 
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserDTO user) {
        User user1 = mp.map(user, User.class);
        user1.setPassword(userService.encodePassword(user1.getPassword()));
        User user2 = userService.registerUser(user1);
        return new ResponseEntity<>(user2, HttpStatus.CREATED);
    }

    @GetMapping("/getuser/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) throws UserNotFoundException {
        Optional<User> user = userService.findById(id);
        if (user.isPresent()) {
            UserDTO userDTO = mp.map(user.get(), UserDTO.class);
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } else {
            throw new UserNotFoundException("User not found");
        }
    }
    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getuserbyusername/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) throws UserNotFoundException {
        User user = userService.findByUsername(username);
        if (user!=null) {
            UserDTO userDTO = mp.map(user, UserDTO.class);
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } else {
            throw new UserNotFoundException("User not found");
        }
    }
    
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_OWNER')")
    @GetMapping("/getowneridbyuserid/{userId}")
    public ResponseEntity<Long> getOwnerIdByUserId(@PathVariable Long userId) {
        Long ownerId = userService.getOwnerIdByUserId(userId);
        return new ResponseEntity<>(ownerId, HttpStatus.OK);
    }

    @PutMapping("/updateuser/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDetails) {
        User userEntity = mp.map(userDetails, User.class);
        User updatedUser = userService.updateUser(id, userEntity);
        
        UserDTO userDTO = mp.map(updatedUser, UserDTO.class);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }
    
    
    @PreAuthorize("hasRole('ADMIN') ")
    @DeleteMapping("/deleteuser/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        String str= userService.deleteUser(id);
        if(str.equals("Deleted"))
        return new ResponseEntity<>(str,HttpStatus.OK);
        else {
			return new ResponseEntity<>(str,HttpStatus.NOT_FOUND);
		}
    }
    

    @PreAuthorize("hasRole('ADMIN') ")
    @GetMapping("allUsersWithRoleUser")
    public ResponseEntity<List<UserDTO>> getAllUsersWithRoleUser() {
        List<User> user = userService.getUsersByRole(Roles.USER);
        List<UserDTO> users=new ArrayList<>();
        for(User u : user)
    	{
    		UserDTO x = mp.map(u, UserDTO.class);
    		users.add(x);
    	}
        if (users.isEmpty()) {
        	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    
    
    @PreAuthorize("hasRole('ADMIN') ")
    @GetMapping("allUsersWithRoleHotelOwner")
    public ResponseEntity<List<UserDTO>> getAllUsersWithRoleHotelOwner() {
        List<User> user = userService.getUsersByRole(Roles.HOTEL_OWNER);
        List<UserDTO> users=new ArrayList<>();
        for(User u : user)
    	{
    		UserDTO x = mp.map(u, UserDTO.class);
    		users.add(x);
    	}
        if (users.isEmpty()) {
        	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
}