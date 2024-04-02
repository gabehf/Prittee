import { Box } from "@mui/material";
import PreviousWinner from "./PreviousWinner";

export default function WinArchive({ data }) {
    return(
        <Box id="lastWinner" className="
          p-4
          pt-0
          mb-6
          overflow-y-auto
          no-scrollbar" height={434}>
            {data.map((post) => <PreviousWinner post={post}/>)}
          </Box>
    )
}