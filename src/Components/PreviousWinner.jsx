import { Box } from "@mui/material";

export default function PreviousWinner({ post }) {
    let dateString = new Date(post.won_at).toLocaleString()
    return (
        <Box className='border-b-2 border-white p-4'>
            <Box>{post.post_text}</Box>
            <Box className='text-sm'>by {post.player_name}</Box>
            <Box className='text-sm'>Won: {dateString}</Box>
        </Box>
    )
} 