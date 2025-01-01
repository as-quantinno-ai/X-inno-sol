import React from "react";
import { Avatar } from "@mui/material";
import { IconHome } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const AvatarHomeSection = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleAvatarClick = () => {
        navigate("/");
    };
    return (
        <Avatar
            variant="rounded"
            sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
                background: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
                color: theme.palette.primary.dark,
                transition: "all .2s ease-in-out",
                "&[aria-controls=\"menu-list-grow\"],&:hover": {
                    borderColor: theme.palette.primary.main,
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.light
                }
            }}
            onClick={handleAvatarClick}
            color="inherit"
            style={{ width: "30px", height: "30px" }}
        >
            <IconHome stroke={1.5} size="1rem" />
        </Avatar>
    );
};

export default AvatarHomeSection;
