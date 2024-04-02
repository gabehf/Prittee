import Header from "../Components/Header";
import Box from '@mui/material/Box'
import { LinearProgress, CircularProgress } from "@mui/material";
import { useLoaderData, Await } from "react-router-dom";
import React from "react";
import UserPost from "../Components/UserPost";

export default function Profile() {
    const { user, posts } = useLoaderData()

    const loadingFallback = () => {
        return (
            <Box className='flex flex-col items-center'>
            <Box className='flex flex-row justify-around items-center' width={480} height={140}>
                <Box maxWidth={150}>
                    <CircularProgress color="inherit"/>
                </Box>
                <Box width={100}>
                    <LinearProgress color="inherit" />
                    <br/>
                    <LinearProgress color="inherit" />
                    <br/>
                    <LinearProgress color="inherit" />
                </Box>
            </Box>
            <Box maxHeight={400} width={400} className='mt-4 overflow-y-auto no-scrollbar'>
                    <br/>
                    <br/>
                <LinearProgress color="inherit" />
            </Box>
            </Box>
        )
    }
    return (
        <React.Suspense fallback={loadingFallback()}>
            <Await resolve={Promise.all([user, posts]).then(value => value)}>
                {(value) => {
                    let [ user, posts ] = value
                    user = user.user
                    return(
                        <Box className='flex flex-col items-center'>
                            <Box className='flex flex-row justify-around items-center' width={480}>
                                <Box maxWidth={150}>
                                    <img src={user.avatar_url} alt={`${user.player_name}`} />
                                </Box>
                                <Box>
                                    <h2 className="text-2xl font-bold mb-2">{user.player_name}</h2>
                                    <p>Total Points: {user.total_points}</p>
                                    <p>Posts: {posts.length}</p>
                                </Box>
                            </Box>
                            <Box maxHeight={400} className='mt-4 overflow-y-auto no-scrollbar'>
                                {posts.map((post) => <UserPost post={post} />)}
                            </Box>
                        </Box>
                    )
                }}
            </Await>
        </React.Suspense>
    )
}