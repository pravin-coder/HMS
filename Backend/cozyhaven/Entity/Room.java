package com.hexaware.project.cozyhaven.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Room {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	@Column(name="room_type")
    private String roomType; 
    private int maxOccupancy; 
    private double baseFare;
    private boolean isAC;
    @ElementCollection
    private List<String> features;
    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    @JsonIgnore
    private Hotel hotel;
    @Column(nullable = false)
    private boolean isAvailable = true;  // true = available, false = not available

    
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();


	public Room(Long id, String roomType, int maxOccupancy, double baseFare, boolean isAC, List<String> features,
			Hotel hotel, boolean isAvailable, List<Booking> bookings) {
		super();
		this.id = id;
		this.roomType = roomType;
		this.maxOccupancy = maxOccupancy;
		this.baseFare = baseFare;
		this.isAC = isAC;
		this.features = features;
		this.hotel = hotel;
		this.isAvailable = isAvailable;
		this.bookings = bookings;
	}


	public Room() {
		super();
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


	public boolean isAvailable() {
		return isAvailable;
	}


	public void setAvailable(boolean isAvailable) {
		this.isAvailable = isAvailable;
	}


	public List<Booking> getBookings() {
		return bookings;
	}


	public void setBookings(List<Booking> bookings) {
		this.bookings = bookings;
	}


	@Override
	public String toString() {
	    return "Room [id=" + id + ", roomType=" + roomType + ", maxOccupancy=" + maxOccupancy +
	            ", baseFare=" + baseFare + ", isAC=" + isAC + ", features=" + features +
	            ", hotelId=" + (hotel != null ? hotel.getId() : "null") +
	            ", isAvailable=" + isAvailable +
	            ", bookingCount=" + (bookings != null ? bookings.size() : 0) + "]";
	}

    
	

    
}