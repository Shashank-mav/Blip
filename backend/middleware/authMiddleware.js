const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req,res,next)=>{
  let token;

  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")

  ){
    try{
      // token is something like-> Bearer husjbdnrnr

      token = req.headers.authorization.split(" ")[1];

      // decode token id
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      // find user and return it (!without password tho)

      req.user = await User.findById(decode.id).select("-password");
      next();
    }catch(error){
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if(!token){
    res.status(401);
      throw new Error("Not authorized, no token");
  }

});

module.exports = {protect};