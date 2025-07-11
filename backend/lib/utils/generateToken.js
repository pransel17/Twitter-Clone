import jwt from "jsonwebtoken";

//This function creates a JWT token and then sends 
// it to the user's browser as a cookie so you can keep
//  them logged in after signup or login.


const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
  });
};

export default generateTokenAndSetCookie; 
