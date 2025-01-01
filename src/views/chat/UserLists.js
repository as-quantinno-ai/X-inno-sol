import PropTypes from "prop-types";
import React, { useEffect, useState, Fragment } from "react";

// material-ui
import { Divider, Grid, List, ListItemButton, ListItemText, Typography } from "@mui/material";

// project imports
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useDispatch, useSelector } from "store";
import { getUsers } from "store/slices/chat";

// ==============================|| CHAT USER LIST ||============================== //

const UserList = ({ setUser }) => {
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const { users } = useSelector((state) => state.chat);

    useEffect(() => {
        dispatch(getUsers());
    }, []);

    useEffect(() => {
        setData(users);
    }, [users]);

    return (
        <>
            <List component="nav">
                {data.map((user) => (
                    <Fragment key={user.id}>
                        <ListItemButton
                            onClick={() => {
                                setUser(user);
                            }}
                        >
                            <ListItemText
                                secondary={
                                    <Grid container alignItems="center" spacing={1} component="span">
                                        <Grid item component="span">
                                            {user && <ChatBubbleOutlineIcon fontSize="10" />}
                                        </Grid>
                                        <Grid item xs zeroMinWidth component="span">
                                            <Typography
                                                variant="caption"
                                                component="span"
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    display: "block"
                                                }}
                                            >
                                                {user.status}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }
                            />
                        </ListItemButton>
                        <Divider />
                    </Fragment>
                ))}
            </List>
        </>
    );
};

UserList.propTypes = {
    setUser: PropTypes.func
};

export default UserList;
