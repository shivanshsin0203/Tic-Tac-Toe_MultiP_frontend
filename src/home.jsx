import React, { useState } from 'react';
import {
  ChakraProvider,
  CSSReset,
  Box,
  Heading,
  Button,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from '@chakra-ui/react';

function Home() {
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');

  const handleJoinRoom = () => {
    
    console.log('Joining room:', nameInput, roomIdInput);
    setJoinRoomModalOpen(false);
  };

  const handleCreateRoom = () => {
    // Add your logic for creating a room here
    console.log('Creating room:', nameInput);
    setCreateRoomModalOpen(false);
  };

  return (
    <ChakraProvider>
      <CSSReset />
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="purple.800"
        color="white"
      >
        <Container textAlign="center">
          <Heading as="h1" size="2xl" mb="8" fontFamily="monospace">
            Tic Tac Toe
          </Heading>
          <Button
            colorScheme="teal"
            size="lg"
            mr="4"
            boxShadow="0 0 20px rgba(0, 255, 150, 1)"
            onClick={() => setJoinRoomModalOpen(true)}
          >
            Join Room
          </Button>
          <Button
            colorScheme="pink"
            size="lg"
            boxShadow="0 0 20px rgba(255, 0, 150, 1)"
            onClick={() => setCreateRoomModalOpen(true)}
          >
            Create Room
          </Button>
        </Container>

        {/* Join Room Modal */}
        <Modal isOpen={joinRoomModalOpen} onClose={() => setJoinRoomModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Join Room</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Your Name"
                mb="4"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
              <Input
                placeholder="Room ID"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={handleJoinRoom}>
                Join
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Create Room Modal */}
        <Modal isOpen={createRoomModalOpen} onClose={() => setCreateRoomModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Room</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Your Name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="pink" onClick={handleCreateRoom}>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
}

export default Home;
