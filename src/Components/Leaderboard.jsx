import { Box } from "@mui/material";

export default function Leaderboard({ users }) {
    let i = 0
    return (
        <Box maxHeight={500} className='overflow-y-auto no-scrollbar'>
        {users.map((user) => {
            i++
            return (
            <Box className='flex flex-row justify-between border-b-2 p-2 mb-3'>
                <Box className='flex flex-row gap-8'>
                    <Box>{i}.</Box>
                    <img src={user.avatar_url} alt={user.player_name} width={35} height={35}/>
                </Box>
                <Box>{user.player_name}</Box>
                <Box className='text-end'>{user.total_points}</Box>
            </Box>
        )})}
        </Box>
    )
}