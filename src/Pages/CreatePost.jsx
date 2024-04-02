import { TextField } from '@mui/material'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import { insertPost } from '../utils'
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const submitHandler = () => {
        if (text.length > 80) { 
            return
        }
        setLoading(true)
        insertPost(text)
        .then(() => {
            navigate('/')
            setLoading(false)
        })
    }
    return (
        <Box className='flex flex-col align-end m-auto' width={300}>
            <TextField color={text.length > 80 ? 'error' : 'primary'} label="Make a post" multiline rows={3} margin='normal' onChange={(e) => setText(e.target.value)}/>
            <div className={text.length > 80 ? 'text-red-400' : 'text-neutral-300'}>{text.length}/80</div>
            <LoadingButton loading={loading}  className='grow-0' onClick={submitHandler}>Submit</LoadingButton>
        </Box>
    )
}

//i saw a bank that offered "24 hour service" and I thought "it takes that long??"