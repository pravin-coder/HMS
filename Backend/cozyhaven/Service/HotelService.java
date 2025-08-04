package com.hexaware.project.cozyhaven.Service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.project.cozyhaven.Entity.Hotel;
import com.hexaware.project.cozyhaven.Entity.HotelOwner;
import com.hexaware.project.cozyhaven.Entity.Room;
import com.hexaware.project.cozyhaven.Repository.HotelOwnerRepository;
import com.hexaware.project.cozyhaven.Repository.HotelRepository;
import com.hexaware.project.cozyhaven.Repository.RoomRepository;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private HotelOwnerRepository hotelOwnerRepository;

    
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    
    public Hotel getHotelById(Long hotelId) {
    	Hotel hotel=hotelRepository.findById(hotelId).orElse(null);
        
        return hotel;
    }

    
    public Hotel createHotel(Hotel hotel) {
        if (hotel == null) {
            throw new IllegalArgumentException("Hotel cannot be null");
        }
        if (hotel.getOwner() == null || hotel.getOwner().getOwnerId() == null) {
            throw new IllegalArgumentException("Hotel owner or owner ID must not be null");
        }

        Long ownerId = hotel.getOwner().getOwnerId();
        HotelOwner hotelOwner = hotelOwnerRepository.findById(ownerId)
            .orElseThrow(() -> new RuntimeException("HotelOwner with id " + ownerId + " not found"));

        hotel.setOwner(hotelOwner);
        Hotel savedHotel = hotelRepository.save(hotel);
        return savedHotel;
    }

    public Hotel updateHotel(Long hotelId, Hotel hotelDetails) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        hotel.setName(hotelDetails.getName());
        hotel.setLocation(hotelDetails.getLocation());
        hotel.setPhoneNo(hotelDetails.getPhoneNo());
        hotel.setDescription(hotelDetails.getDescription());
        hotel.setAmenities(hotelDetails.getAmenities());
        hotel.setImage(hotelDetails.getImage());
        hotel.setRooms(hotelDetails.getRooms());
        hotel.setSpecialFeature(hotelDetails.getSpecialFeature());
        hotel.setReviews(hotelDetails.getReviews());
        hotel.setOwner(hotelDetails.getOwner());
        
        return hotelRepository.save(hotel);
    }

    
    public String deleteHotel(Long hotelId) {
    	Hotel h= hotelRepository.findById(hotelId).orElse(null);
    	if(h!=null) {
        hotelRepository.deleteById(hotelId);
        return "Deleted";
    	}
    	else {
			return "Not Found";
		}
		
    }

    

    // Add a room to a hotel
    public Room addRoom(Long hotelId, Room room) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        room.setHotel(hotel);
        return roomRepository.save(room);
    }


	public List<Room> getAllRooms(Long hotelId) {
		List<Room> room = roomRepository.findByHotel_Id(hotelId);
        //System.out.println(room);
        return room;
	}
	
	public List<Room> getAllAvailableRooms(Long hotelId) {
	    return roomRepository.findByHotel_IdAndIsAvailableTrue(hotelId);
	}


	public List<Hotel> searchHotels(String location, String roomType) {
        return hotelRepository.searchHotelsByLocationAndRoomType(location, roomType);
    }


	public List<Hotel> findHotelsByLocation(String location) {
        return hotelRepository.findHotelsByLocation(location);
    }


	public List<Hotel> getHotelsByOwnerId(Long ownerId) {
	    return hotelRepository.findByOwnerOwnerId(ownerId);
	}
}