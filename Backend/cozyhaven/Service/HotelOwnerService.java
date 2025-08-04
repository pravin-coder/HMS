package com.hexaware.project.cozyhaven.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.project.cozyhaven.Entity.HotelOwner;
import com.hexaware.project.cozyhaven.Repository.HotelOwnerRepository;

@Service
public class HotelOwnerService {
	
	@Autowired
    private HotelOwnerRepository hotelOwnerRepository;

    public HotelOwner getHotelOwnerByUserId(Long userId) {
        return hotelOwnerRepository.findByUserId(userId);
    }

}