import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';

const ProfileModal = ({user,children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();


  



  return (
   <>

   {
    children ? (<span onClick={onOpen}>{children}</span>):(
      <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>


    )
   }

<Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader
             fontSize="40px"
             textAlign="center"
             mx="auto"

          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          >
            <Image
            borderRadius="full"
            boxSize="150px"
            src={user.pic}
            alt={user.name}

            />

          <Text
          fontSize={{base:"28px", md:"30px"}}
          >
            Email: {user.email}
          </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

   </>
  )
}

export default ProfileModal
