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

const initialWinnerState = { winner: null, line: [] };

const Room = () => {
  const { id } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const name = queryParams.get('name');
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState(Array(9).fill({ player: null }));
  const [isXNext, setIsXNext] = useState(true);
  const [winnerState, setWinnerState] = useState(initialWinnerState);

  useEffect(() => {
    const newSocket = io('https://nodejs--singhshivansh12.repl.co', {
      withCredentials: true,
      extraHeaders: {
        'my-custom-header': 'abcd',
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.io server in New Room');
    });

    newSocket.on('updatePlayers', (data) => {
      setPlayers(data.numPlayers);

      if (data.numPlayers === 2 && currentPlayer == null) {
        setCurrentPlayer(data.currentPlayer);
      }
      if (data.numPlayers === 1) {
        setCurrentPlayer(data.currentPlayer);
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
      }, 1800);

      return () => clearTimeout(timeoutId);
    }
  }, [players]);

  useEffect(() => {
    if (!socket) return;

    socket.on('data_receive', (data) => {
      setCurrentPlayer(data.currentPlayer);
      setIsXNext(!data.isXNext);

      const newWinner = calculateWinner(data.grid);
      setWinnerState(newWinner);

      if (data.grid) {
        const newGrid = [...data.grid];
        setGrid(newGrid);
        console.log('updated grid');
      }
    });
  }, [socket, currentPlayer]);

  const calculateWinner = (grid) => {
    if (!grid) {
      return null;
    }

    const winningConditions = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8],
    ];
    let check=0;
    for (let i = 0; i < 9; i++) {
      if (grid[i].player == null) {
          check=1;
          break;
      }
  }
       if(check==0){
        return { winner: 'Draw', line: [] };
       }
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];

      if (
        grid[a].player &&
        grid[a].player === grid[b].player &&
        grid[a].player === grid[c].player
      ) {
        return { winner: grid[a].player, line: [a, b, c] };
      }
    }

    return null;
  };

  const handleCellClick = (index) => {
    if (!grid[index].player && players === 2 && !winnerState?.winner) {
      const currentPlayer = isXNext ? 'X' : 'O';

      const newGrid = [...grid];
      newGrid[index] = { player: currentPlayer };

      setGrid(newGrid);
      setIsXNext(!isXNext);
      socket.emit('data_send', { roomid: id, index, currentPlayer, grid: newGrid, isXNext });

      const newWinner = calculateWinner(newGrid);
      setWinnerState(newWinner);

      if (currentPlayer === 'X' && currentPlayer !== null) {
        setCurrentPlayer('O');
      } else if (currentPlayer === 'O' && currentPlayer !== null) {
        setCurrentPlayer('X');
      }

      if (newWinner) {
        setGameStarted(false);
      }
    }
  };

  const renderCell = (index) => {
    const isWinningCell = winnerState && winnerState.line.includes(index);

    return (
      <Button
        key={index}
        fontSize="4xl"
        fontWeight="bold"
        p="8"
        borderRadius="lg"
        color="white"
        bg={isWinningCell ? 'green' : 'linear-gradient(45deg, #FF6B6B 0%, #FFE66D 100%)'}
        border={isWinningCell ? '2px solid green' : '2px solid #FF6B6B'}
        onClick={() => handleCellClick(index)}
        _hover={{ bg: '#FF6B6B', color: 'white' }}
      >
        {grid[index].player}
      </Button>
    );
  };

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
            {winnerState && (
              <Text fontSize="3xl" mt="4" color="yellow">
                Winner: {winnerState.winner}
              </Text>
            )}
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
