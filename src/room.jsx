import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ChakraProvider, CSSReset, Box, Heading } from '@chakra-ui/react';

const Room = () => {
  const { id } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const name = queryParams.get('name');
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState(0);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.io server in New Room');
    });

    newSocket.on('updatePlayers', (numPlayers) => {
      setPlayers(numPlayers);
    });

    newSocket.emit('join_room', { roomid: id });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  return (
    <ChakraProvider>
      <CSSReset />
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundImage="linear-gradient(45deg, #8a2387 0%, #e94057 100%)"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          backgroundImage="url('https://www.transparenttextures.com/patterns/brick-wall.png')"
          opacity="0.2"
        ></Box>
        <Box
          p="8"
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          textAlign="center"
        >
          <Heading as="h1" size="xl" mb="4" color="white">
            Room {id}
          </Heading>
          <Heading as="h2" size="md" mb="4" color="white">
            Welcome, {name}!
          </Heading>
          {players < 2 ? (
            <Box
              p="4"
              bg="rgba(255, 255, 255, 0.8)"
              borderRadius="md"
              backdropFilter="blur(8px)"
            >
              <p>Waiting for players...</p>
            </Box>
          ) : (
            <p>Game is starting...</p>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Room;
