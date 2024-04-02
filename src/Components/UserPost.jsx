import { Box } from "@mui/material";

export default function UserPost({ post }) {
    let dateString = new Date(post.created_at).toLocaleString()
    return (
        <Box className='border-b-2 border-white p-4'>
            <Box>{post.post_text}</Box>
            <Box className='text-sm'>Points: {post.points}</Box>
            <Box className='text-sm'>Posted: {dateString}</Box>
            {/* I actually don't know if won_at is the right key because i haven't won yet LOL */}
            {post.won_at ? <Box className='text-sm'>Posted: {dateString}</Box> : <></>}
        </Box>
    )
} 