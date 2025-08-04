package com.hexaware.project.cozyhaven.Service;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.project.cozyhaven.Entity.Booking;
import com.hexaware.project.cozyhaven.Entity.Room;
import com.hexaware.project.cozyhaven.Repository.BookingRepository;
import com.hexaware.project.cozyhaven.Repository.RoomRepository;
import com.hexaware.project.cozyhaven.Repository.UserRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoomRepository roomRepository;

    public Booking createBooking(Booking booking) {
    	Room room = booking.getRoom();
        if (room != null) {
            room.setAvailable(false);
            roomRepository.save(room);
        }
    	
        return bookingRepository.save(booking);
    	
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking updateBooking(Long id, Booking bookingDetails) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if(booking!=null) {
        booking.setAadharImg(bookingDetails.getAadharImg());
        booking.setArrivalDate(bookingDetails.getArrivalDate());
        booking.setDepartureDate(bookingDetails.getDepartureDate());
        booking.setEmail(bookingDetails.getEmail());
        booking.setHotel(bookingDetails.getHotel());
        booking.setName(bookingDetails.getName());
        booking.setNoOfAdults(bookingDetails.getNoOfAdults());
        booking.setNoOfChildren(booking.getNoOfChildren());
        booking.setNoOfRooms(bookingDetails.getNoOfRooms());
        booking.setPhoneNo(bookingDetails.getPhoneNo());
        booking.setRoom(bookingDetails.getRoom());
        booking.setRoomType(bookingDetails.getRoomType());
        booking.setTotalBill(bookingDetails.getTotalBill());
        booking.setUser(bookingDetails.getUser());
        return bookingRepository.save(booking);
        }
        else {
			return null;
		}
    }

    public String deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            Room room = booking.getRoom();
            bookingRepository.deleteById(id);

            if (room != null) {
                // Check if room has any other active/future bookings
                boolean hasFutureBookings = bookingRepository.existsByRoomAndDepartureDateAfter(room, java.time.LocalDate.now());
                if (!hasFutureBookings) {
                    room.setAvailable(true);
                    roomRepository.save(room);
                }
            }
            return "Deleted";
        } else {
            return "Not Found";
        }
    }

    public List<Booking> getAllBookings() {
        List<Booking> li= bookingRepository.findAll();
        return li;
    }

	public List<Booking> getBookingByUserId(Long userid) {
		List<Booking> booking = bookingRepository.findByUser_Id(userid);
		return booking;
	}

	
	  public List<Booking> getBookingByHotelId(Long hotelid) { 
		  List<Booking> list=bookingRepository.findByHotel_Id(hotelid); 
		  return list;
	  }
	 
}