package com.hexaware.project.cozyhaven.Exception;

public class ReviewNotFoundException extends Exception{
	String msg;
	public ReviewNotFoundException(String msg) {
		this.msg=msg;
	}
	
	public String getMessage() {
		return msg;
	}
}