package com.hexaware.project.cozyhaven.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hexaware.project.cozyhaven.Entity.Room;


@Repository
public interface RoomRepository extends JpaRepository<Room, Long>{
	
	List<Room> findByHotel_Id(Long hotelId);
	List<Room> findByHotel_IdAndIsAvailableTrue(Long hotelId);


	int countByHotelId(Long hotelId);
	List<Room> findByIsAvailableTrue();
	
	@Query("SELECT r FROM Room r WHERE r.isAvailable = false AND NOT EXISTS (" +
		       "SELECT b FROM Booking b WHERE b.room = r AND b.departureDate > CURRENT_DATE)")
		List<Room> findRoomsToMarkAvailable();

}