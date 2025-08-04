package com.hexaware.project.cozyhaven.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.project.cozyhaven.Entity.Room;
import com.hexaware.project.cozyhaven.Repository.RoomRepository;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room createRoom(Room room) {
    	room.setAvailable(true); 
        return roomRepository.save(room);
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Room updateRoom(Long id, Room roomDetails) {
        Room room = roomRepository.findById(id).orElse(null);
        // Check if hotel is null and throw an exception or handle accordingly
        if (roomDetails.getHotel() == null || roomDetails.getHotel().getId() == null) {
            throw new IllegalArgumentException("Hotel information must be provided.");
        }
        // Set the new values
        room.setAC(roomDetails.isAC());
        room.setRoomType(roomDetails.getRoomType());
        room.setBaseFare(roomDetails.getBaseFare());
        room.setMaxOccupancy(roomDetails.getMaxOccupancy());
        room.setHotel(roomDetails.getHotel());  // Ensure the hotel is correctly set
        room.setFeatures(roomDetails.getFeatures());
        // Save the updated room
        return roomRepository.save(room);
    }


    public String deleteRoom(Long id) {
    	Room room = roomRepository.findById(id).orElse(null);
    	if(room!=null) {
        roomRepository.deleteById(id);
    	return "Deleted";
    	}
    	else {
			return "Not Found";
    	
		}
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    
    public List<Room> getAvailableRooms() {
        return roomRepository.findByIsAvailableTrue();
    }
  
    public void updateRoomAvailabilityBasedOnDepartureDate() {
        List<Room> rooms = roomRepository.findRoomsToMarkAvailable();
        for (Room room : rooms) {
            room.setAvailable(true);
        }
        roomRepository.saveAll(rooms);
    }

    public boolean getRoomAvailabilityStatus(Long roomId) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found with ID: " + roomId));
        return room.isAvailable();
    }

	
}