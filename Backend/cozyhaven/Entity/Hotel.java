package com.hexaware.project.cozyhaven.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Hotel name is required")
    @Size(min = 2, max = 100, message = "Hotel name must be between 2 and 100 characters")
    private String name;
    @NotBlank(message = "Location is required")
    @Size(min = 2, max = 100, message = "Location must be between 2 and 100 characters")
    private String location;
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private String phoneNo;
    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    private String image;
    private String specialFeature;
    
    @ElementCollection
    @CollectionTable(name = "hotel_amenities", joinColumns = @JoinColumn(name = "hotel_id"))
    @Column(name = "amenity")
    private List<String> amenities;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Room> rooms;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Review> reviews;
    
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private HotelOwner owner;
    
    public Hotel(Long id, String name, String location, String phoneNo, String description, String image,
			String specialFeature, List<String> amenities, List<Room> rooms, List<Review> reviews,
			List<Booking> bookings, HotelOwner owner) {
		super();
		this.id = id;
		this.name = name;
		this.location = location;
		this.phoneNo = phoneNo;
		this.description = description;
		this.image = image;
		this.specialFeature = specialFeature;
		this.amenities = amenities;
		this.rooms = rooms;
		this.reviews = reviews;
		this.bookings = bookings;
		this.owner = owner;
	}


	public HotelOwner getOwner() {
		return owner;
	}


	public void setOwner(HotelOwner owner) {
		this.owner = owner;
	}


	public List<Booking> getBookings() {
		return bookings;
	}


	public void setBookings(List<Booking> bookings) {
		this.bookings = bookings;
	}


	public Hotel() {
    	
    }
    
    

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getSpecialFeature() {
		return specialFeature;
	}

	public void setSpecialFeature(String specialFeature) {
		this.specialFeature = specialFeature;
	}

	public List<String> getAmenities() {
		return amenities;
	}

	public void setAmenities(List<String> amenities) {
		this.amenities = amenities;
	}

	public List<Room> getRooms() {
		return rooms;
	}

	public void setRooms(List<Room> rooms) {
		this.rooms = rooms;
	}

	public List<Review> getReviews() {
		return reviews;
	}

	public void setReviews(List<Review> reviews) {
		this.reviews = reviews;
	}


	@Override
	public String toString() {
	    return "Hotel [id=" + id + ", name=" + name + ", location=" + location + ", phoneNo=" + phoneNo +
	            ", description=" + description + ", image=" + image + ", specialFeature=" + specialFeature +
	            ", amenities=" + amenities +
	            ", rooms=" + (rooms != null ? rooms.size() : 0) +
	            ", reviews=" + (reviews != null ? reviews.size() : 0) +
	            ", bookings=" + (bookings != null ? bookings.size() : 0) +
	            ", ownerId=" + (owner != null ? owner.getOwnerId() : "null") + "]";
	}



	
	

	
   

    
}