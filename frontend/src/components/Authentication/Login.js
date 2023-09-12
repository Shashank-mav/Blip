import React from 'react'
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
import { useState } from 'react';
import { useToast } from '@chakra-ui/toast';

import axios from 'axios';

import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const submitHandler = async() =>{
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "😅 Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "🥳 Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
          maxW={{ lg: 'lg' }}>
          <Stack spacing={4}>
            <Heading
              color={'gray.800'}
              lineHeight={1.1}
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
              Welcome back to MADNESS !!
              <Text
                as={'span'}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text">
                !
              </Text>
            </Heading>
            <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
              We aare looking for amazing engineers just like you! Become a part
              of our rockstar engineering team and skyrocket your career!
            </Text>
          </Stack>
          <Box as={'form'} >
          <VStack spacing={4} px={{ base: 2, sm: 5, lg: 10 }}>

            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                value={email}
                type="email"
                placeholder="Enter Your Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                value={password}
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

              Log In
            </Button>
            <Button
            variant="solid"
              fontFamily={'heading'}
              mt={2}
              w={'full'}
              bgGradient="linear(to-r, orange.400,red.400)"
              color={'white'}
              _hover={{
                bgGradient: 'linear(to-r, orange.200,red.200)',
                boxShadow: 'xl',
              }}
              onClick={() => {
                setEmail("guest@example.com");
                setPassword("123456");
              }}
              >

              Log In as Guest
            </Button>
          </Box>
          form
        </Stack>
    </>
  )
}

export default Login
