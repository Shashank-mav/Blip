const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
 const registerUser = asyncHandler(async (req,res)=>{
  const {name,email,password,pic}= req.body;


  if(!name || !email || !password){
    res.status(400);
    throw new Error(" PLEASE ENTER ALL THE FIELDS");

  }

  const userExists = await User.findOne({email});

  if (userExists){
    res.status(400);
    throw new Error("USER ALREADY EXISTS");
  }

  const user =  await User.create({
    name,
    email,
    password,
    pic,
  });

  if(user){
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });

  }else{
    res.status(400);
    throw new Error("FAILED TO CREATE USER");
  }
 });

 const authUser = asyncHandler(async(req,res)=>{
  const{email,password} = req.body;

  const user = await User.findOne({email});

  // user exist and password matches
  if(user && (await user.matchPassword(password))){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  }else{
    res.status(401);
    throw new Error("🤨 INVALID USER OR PASSWORD");
  }
 });

// /api/users ? -> queries
 const allUsers = asyncHandler( async(req,res)=>{
  const keyword = req.query.search ?{
    //or operator for mongodb
    // means we are searching inside of name or email,options = i, is for case senitive
    $or: [
      {name: {$regex: req.query.search, $options:"i"}},
      {email:{$regex: req.query.search, $options:"i"}},
    ]
  }:{};
  const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
  res.send(users);
});


 module.exports = {registerUser, authUser, allUsers};