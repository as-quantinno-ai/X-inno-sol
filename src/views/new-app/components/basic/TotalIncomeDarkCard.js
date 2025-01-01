import React from "react";
import PropTypes from "prop-types";
// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

// project imports
import MainCard from "./cards/MainCard";
import TotalIncomeCard from "./cards/TotalIncomeCard";

// assets
// import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { THEME_MODE } from "constants/generic";

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: "hidden",
    position: "relative",
    margin: "4px",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)"
    },
    "&:after": {
        // eslint-disable-next-line quotes
        content: '""',
        position: "absolute",
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: "50%",
        top: -30,
        right: -180
    },
    "&:before": {
        // eslint-disable-next-line quotes
        content: '""',
        position: "absolute",
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: "50%",
        top: -160,
        right: -130
    }
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const TotalIncomeDarkCard = ({ isLoading, title, value, ind, selectedDs }) => {
    const theme = useTheme();
    const cardWrapperStyles = {
        backgroundColor: selectedDs === ind ? theme.palette.secondary.dark : theme.palette.primary.dark,
        color: theme.palette.primary.dark
    };
    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false} style={cardWrapperStyles}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color:
                                                    theme.palette.mode === THEME_MODE.DARK ? theme.palette.inputField.background : "#fff",
                                                fontSize: "12px"
                                            }}
                                        >
                                            {value}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                mt: 0.25,
                                                color:
                                                    theme.palette.mode === THEME_MODE.DARK ? theme.palette.inputField.background : "$fff",
                                                fontSize: "12px"
                                            }}
                                        >
                                            {title}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

TotalIncomeDarkCard.propTypes = {
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ind: PropTypes.number,
    selectedDs: PropTypes.number
};

export default TotalIncomeDarkCard;
