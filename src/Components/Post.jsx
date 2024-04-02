import { Box } from "@mui/material";
import { LinearProgress } from '@mui/material'
import { Key, Star } from "@mui/icons-material";

export default function Post({ text, tier, index, id, onClick }) {
    const renderStars = () => {
        const arr = []
        for (let i = 0; i < tier; i++) {
            arr.push(
                <Star fontSize='small' />
            )
        }
        return arr
    }
    if (text === '') {
        return (
            <Box className="
            transition-all 
            duration-300 
            bg-gradient-to-tl
            from-indigo-900 
            via-indigo-600 
            to-purple-500 
            bg-size-200 
            bg-pos-0 
            hover:bg-pos-100 
            hover:cursor-pointer
            p-8" height={225}>
            <LinearProgress sx={{
                  backgroundColor: 'white',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'indigo'
                  }
                }} className="opacity-25"/>
            </Box>
        )
    } else {
        return (
            <Box className="
            transition-all 
            duration-300 
            bg-gradient-to-tl
            from-indigo-900 
            via-indigo-600 
            to-purple-500 
            bg-size-200 
            bg-pos-0 
            hover:bg-pos-100 
            hover:cursor-pointer
            p-8" height={225} onClick={() => onClick({post_text: text, index: index, tier: tier, id: id})}>
                <Box sx={{marginTop: -2, marginBottom: 1, marginLeft: -2, display: 'flex'}}>
                    {renderStars()}
                </Box>
                <p className='text-clip overflow-hidden prevent-select'>{text}</p>
            </Box>
        )
    }
}