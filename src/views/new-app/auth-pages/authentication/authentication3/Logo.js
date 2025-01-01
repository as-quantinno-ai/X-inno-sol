// material-ui
import React, { useContext } from "react";
import { useTheme } from "@mui/material/styles";
import darktheme1logo from "assets/images/theme1/9.png";
import darktheme2logo from "assets/images/theme2/9.png";
import darktheme3logo from "assets/images/theme3/9.png";
import darktheme4logo from "assets/images/theme4/9.png";
import darktheme5logo from "assets/images/theme5/9.png";
import darktheme6logo from "assets/images/theme6/9.png";
import darkthemedefaultlogo from "assets/images/defaultTheme/9.png";
import { ConfigContext } from "../../../../../contexts/ConfigContext";

const Logo = () => {
    const theme = useTheme();
    const { presetColor } = useContext(ConfigContext);

    // eslint-disable-next-line no-unused-vars
    const themehexcode = theme.palette.primary.dark;

    /*eslint-disable */
    switch (presetColor) {
        case "theme1":
            return <img src={darktheme1logo} width={180} alt="innovative logo" />;

        case "theme2":
            return <img src={darktheme2logo} width={180} alt="innovative logo" />;

        case "theme3":
            return <img src={darktheme3logo} width={180} alt="innovative logo" />;

        case "theme4":
            return <img src={darktheme4logo} width={180} alt="innovative logo" />;

        case "theme5":
            return <img src={darktheme5logo} width={180} alt="innovative logo" />;

        case "theme6":
            return <img src={darktheme6logo} width={180} alt="innovative logo" />;

        default:
            return <img src={darkthemedefaultlogo} width={180} alt="innovative logo" />;
    }
};

export default Logo;
