package com.hexaware.project.cozyhaven.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.project.cozyhaven.Entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
	//List<Review> findByHotel(Hotel hotel);

	List<Review> findByHotel_Id(Long hotelid);

	List<Review> findByUser_Id(Long userid);

	int countByHotelId(Long hotelId);
}