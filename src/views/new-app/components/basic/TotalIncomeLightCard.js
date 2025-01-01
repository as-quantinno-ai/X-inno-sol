import React from "react";
import PropTypes from "prop-types";

// material-ui
import { styled } from "@mui/material/styles";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

// project imports
import MainCard from "./cards/MainCard";
import TotalIncomeCard from "./cards/TotalIncomeCard";

// assets
// import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.primary.light,
    overflow: "hidden",
    position: "relative",
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
        background: `linear-gradient(210.04deg, ${theme.palette.primary.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
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
        background: `linear-gradient(140.9deg, ${theme.palette.primary.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: "50%",
        top: -160,
        right: -130
    }
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const TotalIncomeLightCard = ({ isLoading, title, value }) => {
    // const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false}>
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
                                        <Typography variant="h4" sx={{ color: "primary.light" }}>
                                            {value}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: "primary.light",
                                                mt: 0.5
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

TotalIncomeLightCard.propTypes = {
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    value: PropTypes.string
};

export default TotalIncomeLightCard;
