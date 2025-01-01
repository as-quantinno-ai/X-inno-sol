import React from "react";
import * as Icons from "@mui/icons-material";
import PropTypes from "prop-types";
const IconResolver = ({ iconName, ...props }) => {
    const IconComponent = Icons[iconName];

    if (!IconComponent) {
        console.error(`Icon "${iconName}" not found`);
        return null;
    }

    return <IconComponent {...props} />;
};

IconResolver.propTypes = {
    iconName: PropTypes.string
};
export default IconResolver;
