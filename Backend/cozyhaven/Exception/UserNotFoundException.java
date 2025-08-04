package com.hexaware.project.cozyhaven.Exception;

public class UserNotFoundException extends Exception{
	String msg;
	public UserNotFoundException(String msg) {
		this.msg=msg;
	}
	
	public String getMessage() {
		return msg;
	}
}