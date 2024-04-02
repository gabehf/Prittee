import { LinearProgress, Box } from "@mui/material";

export default function LeaderboardSkeleton() {
    return (
        <Box maxHeight={500} className='overflow-y-auto no-scrollbar'>
        <LinearProgress color="inherit" />
        </Box>
    )
}