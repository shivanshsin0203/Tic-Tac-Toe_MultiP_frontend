import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  ChakraProvider,
  CSSReset,
  Box,
  Heading,
  Button,
  Flex,
  Spinner,
  Text,
} from '@chakra-ui/react';

const Room = () => {
  const { id } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const name = queryParams.get('name');
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      withCredentials: true,
      extraHeaders: {
        'my-custom-header': 'abcd',
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.io server in New Room');
    });

    newSocket.on('updatePlayers', (numPlayers) => {
      setPlayers(numPlayers);
    });

    newSocket.on('updateGrid', ({ roomid, grid }) => {
      if (roomid === id) {
        setGrid(grid);
        setIsXNext(!isXNext);
      }
    });

    newSocket.emit('join_room', { roomid: id });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [id, isXNext]);

  useEffect(() => {
    if (players === 2) {
      const timeoutId = setTimeout(() => {
        setGameStarted(true);
      }, 3000);

      // Clear the timeout to prevent memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [players]);

  const calculateWinner = () => {
    // Implement your logic for determining the winner
    // Returns 'X', 'O', or null if there's no winner yet
  };

  const handleCellClick = (index) => {
    if (!grid[index] && players === 2 && !calculateWinner()) {
      const newGrid = [...grid];
      newGrid[index] = isXNext ? 'X' : 'O';
      setGrid(newGrid);
      setIsXNext(!isXNext);

      socket.emit('updateGrid', { roomid: id, grid: newGrid });
    }
  };

  const renderCell = (index) => (
    <Button
      key={index}
      fontSize="4xl"
      fontWeight="bold"
      p="8"
      borderRadius="lg"
      color="white"
      bg="linear-gradient(45deg, #FF6B6B 0%, #FFE66D 100%)"
      border="2px solid #FF6B6B"
      onClick={() => handleCellClick(index)}
      _hover={{ bg: '#FF6B6B', color: 'white' }}
    >
      {grid[index]}
    </Button>
  );

  return (
    <ChakraProvider>
      <CSSReset />
      <Box>
        {gameStarted ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            height="100vh"
            background="linear-gradient(45deg, #8a2387 0%, #e94057 100%)"
            color="white"
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
              display="grid"
              gridTemplateColumns="repeat(3, 1fr)"
              gap="4"
              bg="rgba(255, 255, 255, 0.1)"
              borderRadius="lg"
              p="8"
              boxShadow="md"
              minWidth="325px"
              width="25%"
            >
              {grid.map((_, index) => renderCell(index))}
            </Box>
            <Text fontSize="2xl" mt="4">
              {isXNext ? 'X' : 'O'}'s turn
            </Text>
          </Flex>
        ) : (
          <Flex
            direction="column"
            align="center"
            justify="center"
            height="100vh"
            background="linear-gradient(45deg, #8a2387 0%, #e94057 100%)"
            color="white"
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
            <Box p="8" borderRadius="md" boxShadow="md" textAlign="center">
              <Heading as="h1" size="xl" mb="4">
                Room {id}
              </Heading>
              <Heading as="h2" size="md" mb="4">
                Welcome, {name}!
              </Heading>
              {players < 2 ? (
                <Box p="4">
                  <Spinner size="lg" color="teal" />
                  <Text mt="2">Waiting for players...</Text>
                </Box>
              ) : (
                <Box p="4">
                  <Spinner size="xl" color="white" thickness="4px" speed="0.65s" />
                  <Text mt="2">Game is starting...</Text>
                </Box>
              )}
            </Box>
          </Flex>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default Room;
