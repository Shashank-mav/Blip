const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require("../models/userModel");


const accessChat = asyncHandler(async(req,res)=>{
// we are going to check if a chat with this user exists
// if it does , return it , if it dosen't ,create chat with this user id

  const {userId} = req.body;

  if(!userId){
    console.log("userId PARAMS NOT SENT WITH REQUEST");
    return res.sendStatus(400);
  }


  var isChat = await Chat.find({
    isGroupChat: false,
    $and:[
      {users:{$elemMatch:{$eq: req.user._id}}},
      {users:{$elemMatch:{$eq:userId}}},
    ]
  }).populate("users","-password")
        .populate("latestMessage")

    isChat = await User.populate(isChat,{
      path:"latestMessage.sender",
      select: "name pic email",
    })

    if(isChat.length >0){
      res.send(isChat[0]);
    }else{
      var chatData ={
        chatName: "sender",
        isGroupChat: false,
        users:[req.user._id, userId],
      };
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
});

const fetchChats = asyncHandler(async(req,res)=>{
  try {
    Chat.find({users:{$elemMatch: {$eq: req.user._id}}})
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(results)=>{
          results = await await User.populate(results,{
            path:"latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        })
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async(req,res)=>{
  // to create a chat it require 2 things
  // 1. name of the group
  // 2. users that you want to add(i.e array of users)

// SO FIRST lets check , when creating the chat, you have filled
// these 2 detail or not

if(!req.body.users || ! req.body.name ){
  return (res.status(400).send({message:"please fill all the feilds"}));

}

var users = JSON.parse(req.body.users);

if (users.length <2){
  return (res.status(400).send("more than 2 users are required to create a group chat"));

}

// all of the added users + currently logged in user will be a part of group chat

users.push(req.user);

// now let's create query to the database to create this group

try {
  // Chat is chatModel
  const groupChat = await Chat.create({
    chatName : req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user,
});

// now fetch this grpchat from db, and send it back to the user

const fullGroupChat = await Chat.findOne({_id:groupChat._id})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  res.status(200).json(fullGroupChat);
} catch (error) {
  res.status(400);
  throw new Error(error.message);
}

});

const renameGroup = asyncHandler(async(req,res)=>{
  // take chatId and chatName
  const {chatId, chatName} =req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName
    },
    {
      new:true,
    }

  )
    .populate("users","-password")
    .populate("groupAdmin", "-password")

  if(!updatedChat){
    res.status(404);
    throw new Error("Chat not found");
  } else{
    res.json(updatedChat);
  }

});

const addToGroup = asyncHandler(async(req,res)=>{
  // requires 2 things id
  // 1. id of chat you want to add user to
  // 2. ids of users you want to add to the group

  const {chatId, userId} = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push :{users:userId},
    },
    {new:true}
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  if (!added) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(added);
  }

});



const removeFromGroup = asyncHandler(async(req,res)=>{
  // requires 2 things id
  // 1. id of chat you want to add user to
  // 2. ids of users you want to add to the group

  const {chatId, userId} = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull :{users:userId},
    },
    {new:true}
  )
  .populate("users","-password")
  .populate("groupAdmin", "-password")

  if (!removed) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(removed);
  }

});

module.exports = {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup};