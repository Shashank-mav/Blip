import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toast = useToast();
  const handleSearch = async() => {
    // first lets see if search button is pressed on empty
    if (!search) {
      toast({
        title: "😅 Please Enter Something",
        status: "warning",
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get(`/api/user?=${search}`, config)
      setLoading(false);
       // Sort the search results based on name similarity
    const sortedResults = data.sort((a, b) => {
      const aSimilarity = a.name.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
      const bSimilarity = b.name.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
      return bSimilarity - aSimilarity;
    });
      setSearchResult(sortedResults);
    } catch (error) {
      toast({
        title: "💀 Error Occured!",
        description: "Failed to Load Search Results",
        status: "error",
        duration:5000,
        isClosable: true,
        position: "bottom-left",
      });
    }

  };

  const accessChat = async (userId)=>{
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post("/api/chat",{userId},config);

      if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "💀 Error fetching the chats!",
        description: error.message,
        status: "error",
        duration:5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
   <>
   <Box
   display="flex"
   justifyContent="space-between"
   alignItems="center"
   bg="white"
   w="100%"
   p="5px 10px 5px 10px"
   borderWidth="5px"

   >
    <Tooltip label="Search user to chat"
    hasArrow
    placement="bottom-end"
    >
      <Button variant="ghost" onClick={onOpen}>
      <FaSearch size={24} />
      <Text display={{base:"none",md:"flex"}} px="4">
        Search User
      </Text>
      </Button>
    </Tooltip>

    <Text fontSize="2xl"  >
      Blip !
    </Text>

    <div>
      <Menu>
        <MenuButton p={1}>
          
        <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"

      padding="5px"
      borderRadius="50%"
      backgroundColor="white"
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
    >
      <BellIcon boxSize={5} color="gray.500" />
    </Box>
        </MenuButton>
        <MenuList pl={2}>
          {!notification.length && "No New Messages"}
          {notification.map((notif)=>(
            <MenuItem key={notif._id} onClick={()=>{setSelectedChat(notif.chat);
            setNotification(notification.filter((n)=> n!== notif));
            }}>
              {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message From ${getSender(user, notif.chat.users)}`}
            </MenuItem>
          ))}

          </MenuList>
      </Menu>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
        <Avatar size="sm" cursor="pointer" name={user.name}  src={user.pic}/>


        </MenuButton>
        <MenuList>
          <ProfileModal user={user}>
          <MenuItem>My Profile</MenuItem>
          </ProfileModal>
          <MenuDivider/>
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </div>
   </Box>

   <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
    <DrawerOverlay/>
    <DrawerContent>
      <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>

      <DrawerBody>
      {/* input box */}
      <Box display="flex" paddingBottom={2}>
      <Input
      placeholder='search by name or email'
      mr={2}
      value={search}
      onChange={(e)=> setSearch(e.target.value)}

      />

      <Button
       onClick={handleSearch}
       >Go</Button>
      </Box>

      {loading ?(
        <ChatLoading/>
      ):(
        searchResult?.map((user) =>(
          <UserListItem
          key={user._id}
          user={user}
          handleFunction={()=>accessChat(user._id)}

          />
        ))
      )}
      {loadingChat && <Spinner marginLeft="auto" display = "flex" />}
    </DrawerBody>

    </DrawerContent>



   </Drawer>
   </>
  )
}

export default SideDrawer
