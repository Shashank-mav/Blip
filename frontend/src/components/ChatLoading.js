import { Skeleton, Stack, Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
    <>
    <Stack>
    <Box padding='6' boxShadow='lg' bg='white'>
  <SkeletonCircle size='10' />
  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
</Box>
<Box padding='6' boxShadow='lg' bg='white'>
  <SkeletonCircle size='10' />
  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
</Box>
    </Stack>
    </>
  )
}

export default ChatLoading
