import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import { Container } from '@mui/material'
import Link from '@mui/material/Link'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { loadUser } from '../utils'

// TODO: change api key and token inputs to one input for Copy -> Request Headers

export default function Login() {

    const navigate = useNavigate()

    const [ token, setToken ] = useState('')
    const [ apikey, setApiKey ] = useState(localStorage.getItem("apikey"))
    const [ failText, setFailText ] = useState('')
    const [ apiKeyErr, setApiKeyErr ] = useState(false)
    const [ tokenErr, setTokenErr ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const onTokenChange = (e) => setToken(e.target.value);
    const onApiKeyChange = (e) => setApiKey(e.target.value);

    const addUserToken = async () => {
        setLoading(true)
        // reset error values
        setTokenErr(false)
        setApiKeyErr(false)
        // ensure the bearer token provided is valid 
        localStorage.setItem('token', token)
        localStorage.setItem('apikey', apikey)
        loadUser().then((r) => {
            setLoading(false)
            if (r.success) {
                navigate('/')
            } else {
                if (r.apikeyInvalid) {
                    setApiKeyErr(true)
                }
                if (r.tokenInvalid) {
                    setTokenErr(true)
                }
            }
        })
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Container>
                <h1 className='text-center mb-12 text-xl'>Prittee is an <span className='text-red-400 italic'>experimental</span> alternate front end for Pithee<br/>
                Before using it is recommended you <Link href='https://zircon-stoplight-fbb.notion.site/Prittee-Introduction-0e418deda00242ebb6026d074b397629'>read the introduction</Link> to learn about Prittee's limitations</h1>
                <p className='text-center'>Add your Pithee api key and authorization token to start using Prittee.<br/>
                    You can find out how to get your info <Link href="https://zircon-stoplight-fbb.notion.site/Prittee-Introduction-0e418deda00242ebb6026d074b397629">here</Link>.</p>
                <Box component="div" display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={4} className='mt-6'>
                    <TextField id="apikey" error={apiKeyErr} onChange={onApiKeyChange} label="API Key" variant="outlined" value={localStorage.getItem("apikey")} />
                    <TextField id="auth-token" error={tokenErr} helperText={failText} onChange={onTokenChange} label="Authorization Token" variant="outlined" />
                    <LoadingButton loading={loading} variant="text" size="large" onClick={addUserToken}>Let's Go</LoadingButton>
                </Box>
            </Container>
        </Box>
    )
}
