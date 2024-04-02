import { Container, Box } from "@mui/material";

export default function Footer() {
    return (
        <Box width={600} className='flex flex-row justify-around text-sm text-neutral-500 border-t-2 border-neutral-600 p-4 mt-4'>
            <a className="hover:text-neutral-300" href="https://github.com/gabehf/Prittee" target="_blank">View the source on GitHub</a>
            <a className="hover:text-neutral-300" href="https://forms.gle/YTBkxUk7mKsmMsvC6" target="_blank">Report a bug</a>
        </Box>
    )
}