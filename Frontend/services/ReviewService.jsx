import axios from 'axios';
const token = localStorage.getItem("token");
const BaseURL="http://localhost:8080/api/reviews";


export const getReviewsByUserId = async (userId) => {
 console.log("UserID:",userId);
  const res = await axios.get(`${BaseURL}/getreviewbyuserid/${userId}`);
  console.log(res);
  return res.data;
};

export const getReviewsByHotelId = async (hotelId) => {
  const res = await axios.get(`${BaseURL}/getreviewbyhotelid/${hotelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return res.data;
};