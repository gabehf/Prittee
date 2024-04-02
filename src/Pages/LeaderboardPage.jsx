import { Box } from "@mui/material";
import { useLoaderData, Await } from "react-router-dom";
import React from "react";
import Leaderboard from "../Components/Leaderboard";
import LeaderboardSkeleton from "../Components/LeaderboardSkeleton";

export default function LeaderboardPage() {
    const { data } = useLoaderData()
    return (
        <React.Suspense fallback={<LeaderboardSkeleton />}>
            <Await resolve={data}>
            {(users) => <Leaderboard users={users} />}
            </Await>
        </React.Suspense>
    )
}