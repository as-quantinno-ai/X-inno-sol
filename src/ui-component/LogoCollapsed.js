// material-ui
import React, { useContext } from "react";
import { useTheme } from "@mui/material/styles";
import lighttheme1logo from "assets/images/logo-collapsed-theme/theme1/10.png";
import darktheme1logo from "assets/images/logo-collapsed-theme/theme1/9.png";
import lighttheme2logo from "assets/images/logo-collapsed-theme/theme2/10.png";
import darktheme2logo from "assets/images/logo-collapsed-theme/theme2/9.png";
import lighttheme3logo from "assets/images/logo-collapsed-theme/theme3/10.png";
import darktheme3logo from "assets/images/logo-collapsed-theme/theme3/9.png";
import lighttheme4logo from "assets/images/logo-collapsed-theme/theme4/10.png";
import darktheme4logo from "assets/images/logo-collapsed-theme/theme4/9.png";
import lighttheme5logo from "assets/images/logo-collapsed-theme/theme5/10.png";
import darktheme5logo from "assets/images/logo-collapsed-theme/theme5/9.png";
import lighttheme6logo from "assets/images/logo-collapsed-theme/theme6/10.png";
import darktheme6logo from "assets/images/logo-collapsed-theme/theme6/9.png";
import lightthemedefaultlogo from "assets/images/logo-collapsed-theme/defaultTheme/10.png";
import darkthemedefaultlogo from "assets/images/logo-collapsed-theme/defaultTheme/9.png";
import { ConfigContext } from "../contexts/ConfigContext";

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();
    const { presetColor } = useContext(ConfigContext);

    switch (presetColor) {
    case "theme1":
        return theme.palette.mode === "dark" ? (
            <img src={darktheme1logo} width={50} alt="innovative logo" />
        ) : (
            <img src={lighttheme1logo} width={50} alt="innovative logo" />
        );
    case "theme2":
        return theme.palette.mode === "dark" ? (
            <img src={darktheme2logo} width={50} alt="innovative logo" />
        ) : (
            <img src={lighttheme2logo} width={50} alt="innovative logo" />
        );
    case "theme3":
        return theme.palette.mode === "dark" ? (
            <img src={darktheme3logo} width={50} alt="innovative logo" />
        ) : (
            <img src={lighttheme3logo} width={50} alt="innovative logo" />
        );
    case "theme4":
        return theme.palette.mode === "dark" ? (
            <img src={darktheme4logo} width={50} alt="innovative logo" />
        ) : (
            <img src={lighttheme4logo} width={50} alt="innovative logo" />
        );
    case "theme5":
        return theme.palette.mode === "dark" ? (
            <img src={darktheme5logo} width={50} alt="innovative logo" />
        ) : (
            <img src={lighttheme5logo} width={50} alt="innovative logo" />
        );
    case "theme6":
        return theme.palette.mode === "dark" ? (
            <img src={darktheme6logo} width={50} alt="innovative logo" />
        ) : (
            <img src={lighttheme6logo} width={50} alt="innovative logo" />
        );

    default:
        return theme.palette.mode === "dark" ? (
            <img src={darkthemedefaultlogo} width={50} alt="innovative logo" />
        ) : (
            <img src={lightthemedefaultlogo} width={50} alt="innovative logo" />
        );
    }
};

export default Logo;
