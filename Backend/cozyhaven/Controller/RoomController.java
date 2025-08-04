package com.hexaware.project.cozyhaven.Controller;


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

import com.hexaware.project.cozyhaven.Dto.RoomDTO;
import com.hexaware.project.cozyhaven.Entity.Room;
import com.hexaware.project.cozyhaven.Exception.RoomNotFoundException;
import com.hexaware.project.cozyhaven.Repository.RoomRepository;
import com.hexaware.project.cozyhaven.Service.RoomService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ModelMapper mp;

    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_OWNER')")
    @PostMapping("/create")
    public ResponseEntity<RoomDTO> createRoom(@RequestBody RoomDTO room) {
        Room room1 = mp.map(room, Room.class);
        Room savedRoom = roomService.createRoom(room1);
        RoomDTO response = mp.map(savedRoom, RoomDTO.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    
    @GetMapping("/getroombyid/{id}")
    public ResponseEntity<RoomDTO> getRoom(@PathVariable Long id) throws RoomNotFoundException {
        Optional<Room> room = roomService.getRoomById(id);
        if (room.isPresent()) {
            RoomDTO roomDTO = mp.map(room.get(), RoomDTO.class);
            return new ResponseEntity<>(roomDTO, HttpStatus.OK);
        } else {
            throw new RoomNotFoundException("Room not found");
        }
    }
    
    
    @PutMapping("/updateroombyid/{id}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long id, @RequestBody RoomDTO r) throws RoomNotFoundException {
        Room room = mp.map(r, Room.class);
        Room updatedRoom = roomService.updateRoom(id, room);
        if(updatedRoom!=null) {
        RoomDTO roomDTO = mp.map(updatedRoom, RoomDTO.class);
        return new ResponseEntity<>(roomDTO, HttpStatus.OK);
        }
        else {
        	throw new RoomNotFoundException("Room not found");
			//return new ResponseEntity<>( HttpStatus.NOT_FOUND);
		}
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_OWNER')")
    @DeleteMapping("/deleteroombyid/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        String str=roomService.deleteRoom(id);
        if(str.equals("Deleted"))
        	return new ResponseEntity<String>(str,HttpStatus.OK);
        else
        return new ResponseEntity<String>(str,HttpStatus.NOT_FOUND);
    }
    
    @GetMapping("/allrooms-available/{id}")
    public ResponseEntity<List<RoomDTO>> getAvailableRoomsByHotel(@PathVariable("id") Long id) {
        // Step 1: Update expired rooms to available
        roomService.updateRoomAvailabilityBasedOnDepartureDate();

        // Step 2: Fetch only rooms in this hotel that are currently available
        List<Room> rooms = roomRepository.findByHotel_Id(id)
                                         .stream()
                                         .filter(Room::isAvailable)
                                         .toList();

        // Step 3: Map to DTOs
        List<RoomDTO> roomDTOs = rooms.stream()
                                      .map(room -> mp.map(room, RoomDTO.class))
                                      .toList();

        if (roomDTOs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(roomDTOs, HttpStatus.OK);
        }
    }
    
    
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    @PutMapping("/set-available/{roomId}")
    public ResponseEntity<String> setRoomAvailable(@PathVariable Long roomId) {
        Optional<Room> optionalRoom = roomRepository.findById(roomId);
        if (optionalRoom.isPresent()) {
            Room room = optionalRoom.get();
            room.setAvailable(true);  // or room.setIsAvailable(true);
            roomRepository.save(room);
            return ResponseEntity.ok("Room availability updated to true.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Room with ID " + roomId + " not found.");
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<RoomDTO>> getAvailableRooms() {
        List<Room> availableRooms = roomService.getAvailableRooms();
        List<RoomDTO> roomDTOs = availableRooms.stream()
            .map(room -> mp.map(room, RoomDTO.class))
            .toList();

        if (roomDTOs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(roomDTOs, HttpStatus.OK);
        }
    }


    @GetMapping("/allrooms")
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        List<RoomDTO> roomDTOs = rooms.stream().map((temp)->mp.map(temp,RoomDTO.class)).toList();
        
        if(roomDTOs.isEmpty())
        {
        	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        else {
        	return new ResponseEntity<>(roomDTOs, HttpStatus.OK);
		}
    }
    
    @GetMapping("/{roomId}/availability")
    public ResponseEntity<Boolean> getRoomAvailability(@PathVariable Long roomId) {
        boolean isAvailable = roomService.getRoomAvailabilityStatus(roomId);
        return new ResponseEntity<>(isAvailable, HttpStatus.OK);
    }
    
    
    
}