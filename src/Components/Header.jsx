import { Box, Container } from "@mui/material"
import { NavLink } from "react-router-dom";
import { AccountBoxOutlined, PostAdd, LeaderboardOutlined } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

export default function Header() {

    const navigate = useNavigate()

    return (
        <Container className='mt-6 mb-4'>
            <Box id="header" className="mb-2 text-center hover:cursor-pointer" onClick={() => navigate('/')}>
                <h1 className='text-4xl font-bold'>Prittee</h1>
                <p className="text-md text-slate-300">An <span className='text-sky-400 italic'>unofficial</span> alternate front end for Pithee</p>
            </Box>
            <Box className='flex flex-row justify-between m-auto mb-6' width={125}>
                <Box>
                    <NavLink to='/me'><AccountBoxOutlined /></NavLink>
                </Box>
                <Box>
                    <NavLink to='/leaderboard'><LeaderboardOutlined /></NavLink>
                </Box>
                <Box>
                    <NavLink to='/post'><PostAdd /></NavLink>
                </Box>
            </Box>
        </Container>
    )
}