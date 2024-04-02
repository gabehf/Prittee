import { Box } from '@mui/material';
import PostGrid from '../Components/PostGrid'
import { useLoaderData } from 'react-router-dom';
import Countdown from '../Components/Countdown';
import { useState } from 'react';
import { loadCurrentWinner } from '../utils';
import WinArchive from '../Components/WinArchive';

export default function Index({ cw, wa }) {

    const data = useLoaderData()
    const [winArchive, setWinArchive] = useState(data[0])
    const [currentWinner, setCurrentWinner] = useState(data[1][0]) // why is the current winner api response an array??
    const [winnerTime, setWinnerTime] = useState(new Date(currentWinner.won_at)) // why is the current winner api response an array??
    const [showWinArchive, setShowWinArchive] = useState(false)
  
    const reloadWinner = async () => {
        console.log('loading new winner')
        loadCurrentWinner().then(r => {
          setCurrentWinner(r[0])
          setWinnerTime(new Date(currentWinner.won_at))
        })
    }
  
    const toggleWinArchive = () => {
      setShowWinArchive(s => !s)
    }
    return (
        <>
        <Box id="lastWinner" className="
        bg-gradient-to-tl
        transition-all 
        duration-300 
        from-purple-500  
        via-sky-500 
        to-emerald-500 
        bg-size-200 
        bg-pos-0 
        hover:bg-pos-100 
        hover:cursor-pointer
        p-8 
        mb-3" onClick={() => toggleWinArchive()}>
          <p className="post-text pb-2 prevent-select" id="winnerPostText">{currentWinner.post_text}</p>
          <p className="post-author prevent-select" id="winnerPostAuthor">by {currentWinner.player_name}</p>
          <Countdown key={String(winnerTime)} until={winnerTime} onEnd={reloadWinner}/>
        </Box>
        <Box id="posts">
          {showWinArchive ? <WinArchive data={winArchive}></WinArchive>: <PostGrid />}
        </Box>
        </>
    )
}