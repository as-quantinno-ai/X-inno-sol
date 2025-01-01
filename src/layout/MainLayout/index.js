import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";
// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from "@mui/material";

// project imports
import Header from "./Header";
import Sidebar from "./Sidebar";
import { drawerWidth } from "store/constant";
import { openDrawer } from "store/slices/menu";
import { useDispatch, useSelector } from "store";

// styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter
        }),
        [theme.breakpoints.up("md")]: {
            marginLeft: -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down("md")]: {
            marginLeft: "20px",
            width: `calc(100% - ${drawerWidth}px)`,
            padding: "16px"
        },
        [theme.breakpoints.down("sm")]: {
            marginLeft: "10px",
            width: `calc(100% - ${drawerWidth}px)`,
            padding: "16px",
            marginRight: "10px"
        }
    }),
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.down("md")]: {
            marginLeft: "20px"
        },
        [theme.breakpoints.down("sm")]: {
            marginLeft: "10px"
        }
    })
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down("lg"));
    // eslint-disable-next-line no-unused-vars
    const [scrollTop, setScrollTop] = React.useState(0);

    const handleScroll = (event) => {
        setScrollTop(event.currentTarget.scrollTop);
    };
    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);

    React.useEffect(() => {
        dispatch(openDrawer(!matchDownMd));
    }, [matchDownMd]);

    const header = useMemo(
        () => (
            <Toolbar>
                <Header />
            </Toolbar>
        ),
        []
    );

    return (
        <Box sx={{ display: "flex", padding: "0px" }} onScroll={handleScroll}>
            <CssBaseline />
            {/* header */}
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: "transparent",
                    transition: drawerOpen ? theme.transitions.create("width") : "none",
                    position: "absolute"
                }}
            >
                {header}
            </AppBar>
            <Sidebar />
            <Main theme={theme} open={drawerOpen} style={{ marginTop: "0px", marginRight: "0px", borderRadius: "0px", minHeight: "100vh" }}>
                <Box sx={{ marginTop: "70px" }}>
                    <Outlet />
                </Box>
            </Main>
        </Box>
    );
};

export default MainLayout;
