import React from "react";
import PropTypes from "prop-types";

// material-ui
import {
    // Box,
    // Chip,
    IconButton,
    List,
    ListItem,
    ListItemText,
    // ListItemAvatar,
    Stack,
    // Typography,
    useTheme,
    Select,
    MenuItem
} from "@mui/material";
// import { useDispatch, useSelector } from "store";
import { useSelector } from "store";

// project imports
// import Avatar from "ui-component/extended/Avatar";
import MainCard from "ui-component/cards/MainCard";

// ==============================|| DATACARD ORGANIZATION CHART ||============================== //

// function DataCard({ name, role, avatar, linkedin, meet, skype, onChange, root }) {
function DataCard({ name, linkedin, meet, skype, onChange, root }) {
    const linkHandler = (link) => {
        window.open(link);
    };
    const theme = useTheme();
    const { rawDataSources } = useSelector((state) => state.dataCollection);

    const subTree = theme.palette.mode === "dark" ? "dark.800" : "grey.100";
    const rootTree = theme.palette.mode === "dark" ? "dark.900" : "secondary.light";

    return (
        <MainCard
            sx={{
                bgcolor: root ? rootTree : subTree,
                border: root ? `1px solid ${theme.palette.primary.main}` : `1px solid${theme.palette.secondary.main}`,
                width: "max-content",
                m: "0px auto"
            }}
            content={false}
        >
            <List sx={{ width: "100%", border: "transparent", p: 1.5 }}>
                <ListItem sx={{ p: 0, alignItems: "flex-start" }}>
                    {/* <ListItemAvatar>
                        <Avatar src={avatar} size="sm" />
                    </ListItemAvatar> */}
                    <ListItemText
                        sx={{ m: 0, p: 4 }}
                        primary={
                            <>
                                {root ? (
                                    <Select
                                        name="catalog"
                                        placeholder="Select Data Domain"
                                        onChange={(e) => onChange(e)}
                                        style={{ width: "100%", marginTop: "5px", padding: "1px" }}
                                    >
                                        <MenuItem value="">---------------------</MenuItem>
                                        {rawDataSources?.map((item,indx) => (
                                            <MenuItem key={indx} value={item}>{item.tablename}</MenuItem>
                                        ))}
                                    </Select>
                                ) : (
                                    name
                                )}
                            </>
                        }
                    />
                </ListItem>
                <Stack spacing={2} sx={{ pl: 7, mt: -1.75 }}>
                    {/* <Box sx={{ display: 'flex' }}>
                        {!root && (
                            <Chip
                                label={role}
                                sx={{ fontSize: '0.625rem', height: 20, '& .MuiChip-label': { px: 0.75 } }}
                                color="primary"
                                variant="outlined"
                                size="small"
                            />
                        )}
                        {root && (
                            <Typography sx={{ color: `secondary.dark` }} variant="caption">
                                {role}
                            </Typography>
                        )}
                    </Box> */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                            onClick={() => linkHandler(linkedin)}
                            size="small"
                            sx={{ bgcolor: theme.palette.mode === "dark" ? "dark.main" : "background.paper", borderRadius: 1, p: 0.25 }}
                        >
                            {/* <LinkedInIcon /> */}
                        </IconButton>
                        <IconButton
                            onClick={() => linkHandler(meet)}
                            size="small"
                            sx={{ bgcolor: theme.palette.mode === "dark" ? "dark.main" : "background.paper", borderRadius: 1, p: 0.25 }}
                        >
                            {/* <MeetIcon /> */}
                        </IconButton>
                        <IconButton
                            onClick={() => linkHandler(skype)}
                            size="small"
                            sx={{ bgcolor: theme.palette.mode === "dark" ? "dark.main" : "background.paper", borderRadius: 1, p: 0.25 }}
                        >
                            {/* <SkypeIcon /> */}
                        </IconButton>
                    </Stack>
                </Stack>
            </List>
        </MainCard>
    );
}

DataCard.propTypes = {
    name: PropTypes.string,
    role: PropTypes.string,
    avatar: PropTypes.string,
    linkedin: PropTypes.string,
    meet: PropTypes.string,
    skype: PropTypes.string,
    root: PropTypes.bool,
    onChange: PropTypes.func
};

export default DataCard;
