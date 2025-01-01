import React, { memo } from "react";

// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "menu-items";
// import { useSelector } from "store";
import RoleBasedAuthorizationHOC from "utils/route-guard/RoleBasedAuthorizationHOC";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    // const role = useSelector((state) => state.authorization.penetration_role);
    const navItems = menuItem.items.map((item, index) => {
        const uniqueKey = `${item.id}_${index}`;
        /* eslint-disable */

        switch (item.type) {
            case "group":
                return (
                    <React.Fragment key={`${uniqueKey}-groups-${index}`}>
                        <RoleBasedAuthorizationHOC rolesList={item.roles} userApp={item.userApp} KeysId={`${uniqueKey}-groups-${index}`}>
                            <React.Fragment key={`${uniqueKey}-group-${index}`}>
                                <NavGroup keysId={`${uniqueKey}-group-${index}`} item={item} />
                            </React.Fragment>
                        </RoleBasedAuthorizationHOC>
                    </React.Fragment>
                );
            case "noPerms":
                return (
                    <React.Fragment key={`${uniqueKey}-noPerms-${index}`}>
                        <NavGroup keysId={uniqueKey} item={item} />
                    </React.Fragment>
                );
            default:
                return (
                    <React.Fragment key={`${uniqueKey}-default-${index}`}>
                        <Typography keysId={uniqueKey} variant="h6" color="error" align="center">
                            Menu Items Error
                        </Typography>
                    </React.Fragment>
                );
        }
        /* eslint-enable */
    });

    return <>{navItems}</>;
};

export default memo(MenuList);
