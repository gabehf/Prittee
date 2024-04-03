import './App.css';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { Analytics } from "@vercel/analytics/react"

// TODO:
// - Leaderboard past #25 (pagination)

function App() {
  return (
    <Container>
      <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            className='h-screen'

        >
          <Header />
          <Box width={480} id='gameContainer' className='grow'>
            <Outlet />
          </Box>
      <Footer/>
      <Analytics />
      </Box>
      </Container>
  );
}

export default App;
