package com.hexaware.project.cozyhaven.Exception;

public class RoomNotFoundException extends Exception{
	String msg;
	public RoomNotFoundException(String msg) {
		this.msg=msg;
	}
	
	public String getMessage() {
		return msg;
	}
}