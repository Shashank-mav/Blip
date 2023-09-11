import { Box, Card, CardBody, Container, Image, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import image from '../assets/logo_new.png';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {

  // if user logged in , push him to the chat page
  const navigate = useNavigate();

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if(user){
    navigate("/chats")
  }
  }, [navigate])



  return (
    <Container maxW='xl' centerContent>
      <Box>
        <Card maxW='md'>
          <CardBody>
            <Image src={image} alt="Image" maxH="100px" maxW="200px" />
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
}

export default Homepage;
