// NeonTicTacToeGrid.jsx
import React, { useState } from 'react';
import { Box, Grid, GridItem, Center, Text } from '@chakra-ui/react';

const NeonTicTacToeGrid = () => {
  const [cells, setCells] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index) => {
    if (cells[index] || calculateWinner(cells)) {
      return;
    }

    const newCells = [...cells];
    newCells[index] = isXNext ? 'X' : 'O';

    setCells(newCells);
    setIsXNext(!isXNext);
  };

  const renderCell = (index) => {
    const cellValue = cells[index];
    const neonColor = isXNext ? '#ff6a00' : '#00ff6a';

    return (
      <GridItem
        key={index}
        boxSize={{ base: '16', md: '32', lg: '48' }}
        borderRadius="md"
        _hover={{
          bg: 'pink.500',
          opacity: 0.8,
        }}
        onClick={() => handleClick(index)}
        shadow="lg"
      >
        <Center h="100%">
          {cellValue && (
            <Text fontSize={{ base: 'lg', md: '2xl', lg: '3xl' }} fontWeight="bold" color={neonColor}>
              {cellValue}
            </Text>
          )}
        </Center>
      </GridItem>
    );
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(to-r, #18a0fb, #32ff7e)"
      boxShadow="xl"
      borderRadius="md"
      p={{ base: 4, md: 8, lg: 12 }}
    >
      <Grid
        templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={{ base: 2, md: 4, lg: 6 }}
        borderRadius="md"
        padding={{ base: 2, md: 4, lg: 6 }}
        maxW={{ base: '80vw', md: '70vw', lg: '60vw' }}
        bgGradient="linear(to-r, #ff0, #00f)"
        boxShadow="md"
        
        p="4"
      >
        {[0, 1, 2].map((row) => (
          <React.Fragment key={row}>
            {[0, 1, 2].map((col) => renderCell(row * 3 + col))}
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

// Helper function to check for a winner
const calculateWinner = (cells) => {
  // Your logic for checking the winner (not implemented in this example)
  return null;
};

export default NeonTicTacToeGrid;
