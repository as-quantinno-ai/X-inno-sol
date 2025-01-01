import React from "react";

// material-ui
import { Grid, Switch } from "@mui/material";

// project imports
// import useConfig from "hooks/useConfig";
import Transitions from "ui-component/extended/Transitions";

import RightBarFormCard from "../../ui-component/cards/RightBarFormCard";

// ==============================|| UTILITIES - ANIMATION ||============================== //

const AnimationSlide = () => {
    // const { borderRadius } = useConfig();

    // eslint-disable-next-line no-unused-vars
    const [type, setType] = React.useState("slide");
    // eslint-disable-next-line no-unused-vars
    const [position, setPosition] = React.useState("top-left");
    // eslint-disable-next-line no-unused-vars
    const [direction, setDirection] = React.useState("left");
    const [animate, setAnimate] = React.useState(false);

    return (
        <Grid container>
            <Grid item xs={12}>
                <Switch checked={animate} onChange={() => setAnimate(!animate)} inputProps={{ "aria-label": "controlled" }} />
                <Transitions
                    type={type}
                    in={animate}
                    position={position}
                    direction={direction}
                    style={{ position: "fixed", top: "0px", right: "0px", zIndex: "10000", boxShadow: "1px 2px 10px #cfcfcf" }}
                >
                    <RightBarFormCard profile="img-gal-3.png" />
                </Transitions>
            </Grid>
        </Grid>
    );
};

export default AnimationSlide;
