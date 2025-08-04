package com.hexaware.project.cozyhaven.Controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.project.cozyhaven.Dto.ReviewDTO;
import com.hexaware.project.cozyhaven.Entity.Hotel;
import com.hexaware.project.cozyhaven.Entity.Review;
import com.hexaware.project.cozyhaven.Entity.User;
import com.hexaware.project.cozyhaven.Exception.ReviewNotFoundException;
import com.hexaware.project.cozyhaven.Service.HotelService;
import com.hexaware.project.cozyhaven.Service.ReviewService;
import com.hexaware.project.cozyhaven.Service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/reviews")
public class ReviewController {
	
	@Autowired
	ReviewService reviewService;
	
	@Autowired
	HotelService hotelService;
	
	@Autowired
	ModelMapper mp;
	
	@Autowired
	UserService userService;
	
	@PostMapping("/createreview")
	public ResponseEntity<ReviewDTO> writereview(@RequestBody ReviewDTO review){
		Hotel hotel = hotelService.getHotelById(review.getHotel().getId());
		User user = userService.getUserById(review.getUser().getId());
	    review.setHotel(hotel);
	    review.setUser(user);
		Review review2=mp.map(review, Review.class);
		Review review3=reviewService.savereview(review2);
		ReviewDTO review4=mp.map(review3, ReviewDTO.class);
		return new ResponseEntity<ReviewDTO>(review4,HttpStatus.CREATED);
	}
	
	@GetMapping("/getreviewbyid/{reviewid}")
	public ResponseEntity<ReviewDTO> getreview(@PathVariable Long reviewid) throws ReviewNotFoundException{
		Review review=reviewService.getreviewbyid(reviewid);
		if(review!=null)
		{
			ReviewDTO rev=mp.map(review, ReviewDTO.class);
			return new ResponseEntity<ReviewDTO>(rev,HttpStatus.OK);
			
		}
		else {
			throw new ReviewNotFoundException("No Review Exists with mentioned id");
		}
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/getallreview")
	public ResponseEntity<List<ReviewDTO>> getAllReviews() throws ReviewNotFoundException {
	    List<Review> reviews = reviewService.getallreviews();

	    if (reviews != null && !reviews.isEmpty()) {
	        List<ReviewDTO> reviewDTOs = reviews.stream()
	            .map(review -> mp.map(review, ReviewDTO.class))
	            .collect(Collectors.toList());
	        
	        return new ResponseEntity<>(reviewDTOs, HttpStatus.OK);
	    } else {
	        throw new ReviewNotFoundException("No reviews found");
	    }
	}

	
	@PutMapping("/updatereviewbyid/{reviewid}")
	public ResponseEntity<ReviewDTO> updatereview(@PathVariable Long reviewid,@RequestBody ReviewDTO rev) throws ReviewNotFoundException{
		Review rev2=mp.map(rev, Review.class);
		Review rev3=reviewService.updatereview(reviewid,rev2);
		if(rev3!=null)
		{
			ReviewDTO rev4=mp.map(rev3, ReviewDTO.class);
			return new ResponseEntity<ReviewDTO>(rev4,HttpStatus.OK);
			
		}
		else {
			throw new ReviewNotFoundException("No Review Exists with mentioned id");
		}
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/deletereviewbyid/{reviewid}")
	public ResponseEntity<String> deletereview(@PathVariable Long reviewid){
		String str = reviewService.deletereview(reviewid);
		if(str.equals("Deleted"))
			return new ResponseEntity<String>(str,HttpStatus.OK);
		else {
			return new ResponseEntity<String>(str,HttpStatus.NOT_FOUND);
		}
	}
	
	
	@PreAuthorize("hasRole('ADMIN') ")
	@GetMapping("/getallreviews")
	public ResponseEntity<List<ReviewDTO>> getall(){
		List<Review> li=reviewService.getallreviews();
		if(li.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		else {
			List<ReviewDTO> li2=li.stream().map((temp)->mp.map(temp, ReviewDTO.class)).toList();
			return new ResponseEntity<List<ReviewDTO>>(li2,HttpStatus.OK);
		}
	}
	
	
	@PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_OWNER')")
	@GetMapping("/getreviewbyhotelid/{hotelid}")
	public ResponseEntity<List<ReviewDTO>> getreviewhotel(@PathVariable Long hotelid) throws ReviewNotFoundException{
		List<Review> li=reviewService.getreviewbyhotelid(hotelid);
		if(li.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		else {
			List<ReviewDTO> li2=li.stream().map((temp)->mp.map(temp, ReviewDTO.class)).toList();
			return new ResponseEntity<List<ReviewDTO>>(li2,HttpStatus.OK);
		}
	}
	
	
	
	@GetMapping("/getreviewbyuserid/{userid}")
	public ResponseEntity<List<ReviewDTO>> getreviewuser(@PathVariable Long userid) throws ReviewNotFoundException{
		List<Review> li=reviewService.getreviewbyuserid(userid);
		if(li.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		else {
			List<ReviewDTO> li2=li.stream().map((temp)->mp.map(temp, ReviewDTO.class)).toList();
			return new ResponseEntity<List<ReviewDTO>>(li2,HttpStatus.OK);
		}
	}
}