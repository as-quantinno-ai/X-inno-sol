import PropTypes from "prop-types";
import React from "react";
import { useMediaQuery, Drawer } from "@mui/material";

import ChatMenu from "./DataSourceMenu";

const DataSourceDrawer = ({
    user,
    open,
    onClose,
    handleMainMenuClick,
    handleSelectItem,
    handleChatTypeChange,
    catalogueFields
    // selectedIndex
}) => {
    const matchDownMd = useMediaQuery((theme) => theme.breakpoints.down("lg"));

    return !matchDownMd ? (
        <ChatMenu
            user={user}
            setUser={user}
            handleMainMenuClick={handleMainMenuClick}
            handleSelectItem={handleSelectItem}
            handleChatTypeChange={handleChatTypeChange}
            catalogueFields={catalogueFields}
        />
    ) : (
        <Drawer anchor="right" open={open} onClose={onClose} sx={{ width: "300px" }}>
            <ChatMenu
                user={user}
                setUser={user}
                handleMainMenuClick={handleMainMenuClick}
                handleSelectItem={handleSelectItem}
                handleChatTypeChange={handleChatTypeChange}
                catalogueFields={catalogueFields}
            />
        </Drawer>
    );
};
DataSourceDrawer.propTypes = {
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    handleMainMenuClick: PropTypes.func,
    handleSelectItem: PropTypes.func,
    handleChatTypeChange: PropTypes.func,
    catalogueFields: PropTypes.array
    // selectedIndex: PropTypes.number
};
export default DataSourceDrawer;
