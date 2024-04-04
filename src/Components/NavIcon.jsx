import { Box, Tooltip } from "@mui/material"
import { NavLink, useLocation } from "react-router-dom";

export default function NavIcon({ label, href, icon }) {
    const location = useLocation()
    const IconComponent = icon
    const isActive = location.pathname === href
    return (
        <Tooltip title={label}>
            <Box>
                <NavLink to={href}>
                    <IconComponent color={isActive ? "primary" : undefined} />
                </NavLink>
            </Box>
        </Tooltip>
    )
}
