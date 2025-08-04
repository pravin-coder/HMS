package com.hexaware.project.cozyhaven.Dto;

import java.util.List;

import com.hexaware.project.cozyhaven.Entity.Booking;
import com.hexaware.project.cozyhaven.Entity.Hotel;

import jakarta.persistence.ElementCollection;

public class RoomDTO {
	private Long id;
    private String roomType; 
    private int maxOccupancy; 
    private double baseFare;
    private boolean isAC;
    @ElementCollection
    private List<String> features;
    
    private Hotel hotel;
	
    
	public RoomDTO(Long id, String roomType, int maxOccupancy, double baseFare, boolean isAC, List<String> features,
			Hotel hotel, List<Booking> bookings) {
		super();
		this.id = id;
		this.roomType = roomType;
		this.maxOccupancy = maxOccupancy;
		this.baseFare = baseFare;
		this.isAC = isAC;
		this.features = features;
		this.hotel = hotel;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getRoomType() {
		return roomType;
	}
	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}
	public int getMaxOccupancy() {
		return maxOccupancy;
	}
	public void setMaxOccupancy(int maxOccupancy) {
		this.maxOccupancy = maxOccupancy;
	}
	public double getBaseFare() {
		return baseFare;
	}
	public void setBaseFare(double baseFare) {
		this.baseFare = baseFare;
	}
	public boolean isAC() {
		return isAC;
	}
	public void setAC(boolean isAC) {
		this.isAC = isAC;
	}
	public List<String> getFeatures() {
		return features;
	}
	public void setFeatures(List<String> features) {
		this.features = features;
	}
	public Hotel getHotel() {
		return hotel;
	}
	public void setHotel(Hotel hotel) {
		this.hotel = hotel;
	}
	@Override
	public String toString() {
	    return "RoomDTO [id=" + id + ", roomType=" + roomType + ", maxOccupancy=" + maxOccupancy + ", baseFare=" 
	            + baseFare + ", isAC=" + isAC + ", features=" + features + ", hotelId=" + hotel.getId() 
	            + "]";
	}

	
	public RoomDTO() {
		
	}
    
    
}