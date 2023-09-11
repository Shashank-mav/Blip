import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  FormControl,
  FormLabel,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/toast';

import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const postDetails = (pics) =>{
    setLoading(true);
    if(pics===undefined){
      toast({
        title: 'Please Select an Image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if(pics.type==="image/jpeg" || pics.type==="image/png"){
      const data = new FormData();
      data.append("file",pics);
      data.append("upload_preset","Blip-chat");
      data.append("cloud_name","dpxcnqecd");
      fetch("https://api.cloudinary.com/v1_1/dpxcnqecd/image/upload",{
        method:'post',
        body:data,

      }).then((res)=>res.json())
      .then(data=>{
        setPic(data.url.toString());
        console.log(data.url.toString());
        setLoading(false);
      })
      .catch((err)=>{
        console.log(err);
        setLoading(false);
      });
    }else{
      toast({
        title: 'Please Select an Image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const submitHandler = async() =>{
    setLoading(true);
    if(!name || !email || !password || !confirmpassword ){
      toast({
        title: 'Please Fill all fields 😅',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if(password !== confirmpassword){
      toast({
        title: 'Passwords do not match 😬',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
     return;
    }

    try {
      const config ={
        headers: {
          "Content-type":"application/json",

        },
      };

        const {data} = await axios.post("/api/user",{name,email,password,pic},
        config
        );
        toast({
          title: 'Registration Successful 🥳',
          status: 'Success',
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");

    } catch (error) {
      toast({
        title: 'Error Occured 💀',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }

  };
  return (
    <>
      <Stack
        bg={'gray.50'}
        rounded={'xl'}
        p={{ base: 4, sm: 6, md: 8 }}
        spacing={{ base: 8 }}
        maxW={{ lg: 'lg' }}
      >
        <Stack spacing={4}>
          <Heading
            color={'gray.800'}
            lineHeight={1.1}
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
          >
            Join The Blip
            <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
            >
              !
            </Text>
          </Heading>
          <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
            We’re looking for amazing engineers just like you! Become a part of
            our rockstar engineering team and skyrocket your career!
          </Text>
        </Stack>
        <Box as={'form'} >
          <VStack spacing={4} px={{ base: 2, sm: 5, lg: 10 }}>
            <FormControl id="first-name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter Your Name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                placeholder="Enter Your Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={show ? 'text' : 'password'}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={show ? 'text' : 'password'}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="pic">
              <FormLabel>
                Upload your picture
              </FormLabel>
              <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}

              />

            </FormControl>
          </VStack>
          <Button
            fontFamily={'heading'}
            mt={8}
            w={'full'}
            bgGradient="linear(to-r, red.400,pink.400)"
            color={'white'}
            _hover={{
              bgGradient: 'linear(to-r, red.400,pink.400)',
              boxShadow: 'xl',
            }}
            onClick={submitHandler}
            isLoading={loading}
          >
            Sign In
          </Button>
        </Box>
        form
      </Stack>
    </>
  );
};

export default Signup;
