import { Box } from "@mui/material";
import { useState, useEffect } from "react";

export default function Countdown({ until, onEnd }) {

    const t1 = new Date()
    const t2 = new Date(until) // 10 minutes after win time
    const msUntil = (t2.getTime()+10*60000) - t1.getTime();
    const secondsUntil = Math.floor(msUntil / 1000)
    const [seconds, setSeconds] = useState(secondsUntil)
    useEffect(() => {
        var interval = setInterval(() => {       
            setSeconds(s => s-1)
            if (seconds < 1) {
                clearInterval(interval)
                onEnd()
            }
        }, 1000);
        return function cleanup() {
            clearInterval(interval);
        };
    }, [seconds])

    const formatTime = (time) => {
        if (time <= 0) {
            return '0:00'
        }
        let m = Math.floor(time / 60)
        let s = time - (m * 60)
        let lead = s < 10 ? '0' : ''
        return `${m}:${lead+s}`
    }
    return (
        <Box className='prevent-select'>
            {formatTime(seconds)}
        </Box>
    )
}