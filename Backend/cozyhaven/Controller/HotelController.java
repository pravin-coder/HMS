package com.hexaware.project.cozyhaven.Controller;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.hexaware.project.cozyhaven.Dto.HotelDTO;
import com.hexaware.project.cozyhaven.Dto.RoomDTO;
import com.hexaware.project.cozyhaven.Entity.Hotel;
import com.hexaware.project.cozyhaven.Entity.Room;
import com.hexaware.project.cozyhaven.Repository.RoomRepository;
import com.hexaware.project.cozyhaven.Service.HotelService;
import com.hexaware.project.cozyhaven.Service.RoomService;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;
    
    @Autowired
    private RoomService roomService;

    @Autowired
    private ModelMapper mp; 

    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_OWNER')")
    @PostMapping("/createhotel")
    public ResponseEntity<HotelDTO> createHotel(@RequestBody HotelDTO hotel) {
    	Hotel hotel1 = mp.map(hotel, Hotel.class);
        Hotel hotel2 = hotelService.createHotel(hotel1);
        HotelDTO hotel3 = mp.map(hotel2, HotelDTO.class);
        return ResponseEntity.status(201).body(hotel3);
    }

    
    @GetMapping("/getallhotel")
    public ResponseEntity<List<HotelDTO>> getAllHotels() {
        List<Hotel> hotels = hotelService.getAllHotels();
        List<HotelDTO> hotel=new ArrayList<>();
    	for(Hotel h : hotels)
    	{
    		HotelDTO x = mp.map(h, HotelDTO.class);
    		hotel.add(x);
    	}
    	if(hotel.isEmpty()) {
    		return new ResponseEntity<List<HotelDTO>>(hotel,HttpStatus.NO_CONTENT);
    	}
    	return new ResponseEntity<List<HotelDTO>>(hotel,HttpStatus.OK);
    }
    


    
    @GetMapping("gethotelbyid/{hotelId}")
    public ResponseEntity<?> getHotelById(@PathVariable Long hotelId) {
        Hotel hotel = hotelService.getHotelById(hotelId);
        if (hotel != null) {
        	HotelDTO x = mp.map(hotel, HotelDTO.class);
        	return new ResponseEntity<HotelDTO>(x,HttpStatus.OK);
        } else {
        	return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
        }
    }

    // Update a hotel
    @PutMapping("/updatehotel/{hotelId}")
    public ResponseEntity<HotelDTO> updateHotel(@PathVariable Long hotelId, @RequestBody HotelDTO hotelDetails) {
    	Hotel hotel1 = mp.map(hotelDetails, Hotel.class);
        Hotel hotel2 = hotelService.updateHotel(hotelId, hotel1);
        if (hotel2 != null) {
            HotelDTO hotel3 = mp.map(hotel2, HotelDTO.class);
            return new ResponseEntity<HotelDTO>(hotel3,HttpStatus.OK);
        } else {
        	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_OWNER')")
    @DeleteMapping("/deletehotel/{hotelId}")
    public ResponseEntity<String> deleteHotel(@PathVariable Long hotelId) {
        String str = hotelService.deleteHotel(hotelId);
        if (str==null) {
            return new ResponseEntity<String>(str,HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<String>(str,HttpStatus.OK);
        }
    }

   /////// 
    
    @GetMapping("/{hotelId}/rooms/all")
    public ResponseEntity<List<RoomDTO>> getAllRooms(@PathVariable Long hotelId) {
        List<Room> allRooms = hotelService.getAllRooms(hotelId);
        if (allRooms.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        else {
			List<RoomDTO> list = allRooms.stream().map((temp)->mp.map(temp, RoomDTO.class)).toList();
			return new ResponseEntity<List<RoomDTO>>(list,HttpStatus.OK);
		}
    }
///////
    // Add a new room to a hotel
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_OWNER')")
    @PostMapping("/{hotelId}/rooms")
    public ResponseEntity<Room> addRoom(@PathVariable Long hotelId, @RequestBody Room room) {
    	Hotel hotel = hotelService.getHotelById(hotelId);
        
        // Set the hotel object in the room
        room.setHotel(hotel);
        Room addedRoom = hotelService.addRoom(hotelId, room);
        return ResponseEntity.status(201).body(addedRoom); 
    }
    
    @PreAuthorize("hasRole('USER') ")
    @GetMapping("/search")
    public ResponseEntity<List<HotelDTO>> searchHotels(@RequestParam String location, @RequestParam String roomType) {
    	System.out.println("Received location: " + location + " and roomType: " + roomType);
        List<Hotel> hotels = hotelService.searchHotels(location, roomType);
        System.out.println(hotels);
        List<HotelDTO> hotelDTOs = hotels.stream()
                .map(hotel -> mp.map(hotel, HotelDTO.class))
                .collect(Collectors.toList());

        if (hotelDTOs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(hotelDTOs, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('USER') ")
    @GetMapping("/searchbylocation")
    public ResponseEntity<List<HotelDTO>> getHotelsByLocation(@RequestParam String location) {
        List<Hotel> hotels = hotelService.findHotelsByLocation(location);
        List<HotelDTO> hotelDTOList = new ArrayList<>();
        
        for (Hotel h : hotels) {
            HotelDTO dto = mp.map(h, HotelDTO.class); // mp = ModelMapper
            hotelDTOList.add(dto);
        }

        if (hotelDTOList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(hotelDTOList, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_OWNER')")
    @GetMapping("/gethotelbyownerid/{ownerId}")
    public ResponseEntity<List<HotelDTO>> getHotelsByOwnerId(@PathVariable Long ownerId) {
        List<Hotel> hotels = hotelService.getHotelsByOwnerId(ownerId);
        if (hotels.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        List<HotelDTO> hotelDTOs = hotels.stream()
                .map(hotel -> mp.map(hotel, HotelDTO.class))
                .collect(Collectors.toList());
        return new ResponseEntity<>(hotelDTOs, HttpStatus.OK);
    }
    
    @GetMapping("/{hotelId}/rooms/available")
    public ResponseEntity<List<RoomDTO>> getAllAvailableRooms(@PathVariable Long hotelId) {
        List<Room> allRooms = hotelService.getAllAvailableRooms(hotelId);
        if (allRooms.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        else {
			List<RoomDTO> list = allRooms.stream().map((temp)->mp.map(temp, RoomDTO.class)).toList();
			return new ResponseEntity<List<RoomDTO>>(list,HttpStatus.OK);
		}
    }

}