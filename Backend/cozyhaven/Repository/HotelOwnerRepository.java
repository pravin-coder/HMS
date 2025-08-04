package com.hexaware.project.cozyhaven.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.project.cozyhaven.Entity.HotelOwner;



@Repository
public interface HotelOwnerRepository extends JpaRepository<HotelOwner, Long>{
	HotelOwner findByUserId(Long userId);
}
