import React from "react";
import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, List, Typography } from "@mui/material";

// project imports
import NavItem from "../NavItem";
import NavCollapse from "../NavCollapse";
import RoleBasedAuthorizationHOC from "utils/route-guard/RoleBasedAuthorizationHOC";
import PermBasedAuthorizationHOC from "utils/route-guard/PermBasedAuthorizationHOC";
import { useSelector } from "react-redux";

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

// const NavGroup = ({ keysId, item }) => {
//     const theme = useTheme();
//     const { drawerOpen } = useSelector((state) => state.menu);
//     const items = item.children?.map((menu, index) => {
//         /* eslint-disable */
//         switch (menu.type) {
//             case "collapse":
//                 return (
//                     <>
//                         <React.Fragment key={`collapse-${index}`}>
//                             <PermBasedAuthorizationHOC perm={menu.perms} nav="Yes">
//                                 <NavCollapse keysId={`${keysId}-collapse-${index}-${menu.perms}`} menu={menu} level={1} />
//                             </PermBasedAuthorizationHOC>
//                         </React.Fragment>
//                     </>
//                 );
//             case "item":
//                 return (
//                     <>
//                         <React.Fragment key={`-item-${index}`}>
//                             <RoleBasedAuthorizationHOC key={`${keysId}-item-${index}`} rolesList={menu.roles}>
//                                 <PermBasedAuthorizationHOC perm={menu.perms} nav="Yes">
//                                     <NavItem key={menu.id} item={menu} level={1} />
//                                 </PermBasedAuthorizationHOC>
//                             </RoleBasedAuthorizationHOC>
//                         </React.Fragment>
//                     </>
//                 );
//             // case 'custom-form-items':
//             //     return (
//             //         <React.Fragment key={`-custom-form-items-${index}`}>
//             //             <RoleBasedAuthorizationHOC rolesList={menu.roles} level={0} appCheck="Yes" menuItemType="custom-form-items">
//             //                 <NavCollapse keysId={`${keysId}-custom-form-items-${index}-${menu.perms}`} menu={item} level={1} />
//             //             </RoleBasedAuthorizationHOC>
//             //         </React.Fragment>
//             //     );
//             case "custom-dashboard-items":
//                 return (
//                     <React.Fragment key={`-custom-dashboard-items-${index}`}>
//                         <RoleBasedAuthorizationHOC rolesList={menu.roles} level={0} appCheck="Yes" menuItemType="custom-dashboard-items">
//                             <NavCollapse keysId={`${keysId}-custom-dashboard-items-${index}-${menu.roles}`} menu={item} level={1} />
//                         </RoleBasedAuthorizationHOC>
//                     </React.Fragment>
//                 );
//             case "custom-chat-bots":
//                 return (
//                     <React.Fragment key={`-custom-Chat-bots-${index}`}>
//                         <RoleBasedAuthorizationHOC rolesList={menu.roles} level={0} appCheck="Yes" menuItemType="custom-chat-bots">
//                             <NavCollapse keysId={`${keysId}-custom-Chat-bots-${index}-${menu.roles}`} menu={item} level={1} />
//                         </RoleBasedAuthorizationHOC>
//                     </React.Fragment>
//                 );
//             case "noPerms":
//                 return (
//                     <React.Fragment key={`-noPerms-${index}`}>
//                         <RoleBasedAuthorizationHOC rolesList={menu.roles}>
//                             <NavItem key={`${keysId}-noPerms-${index}-${menu.roles}`} item={menu} level={1} />
//                         </RoleBasedAuthorizationHOC>
//                     </React.Fragment>
//                 );
//             default:
//                 return (
//                     <React.Fragment key={`-default-${index}`}>
//                         <Typography key={`${keysId}-default-${index}`} variant="h6" color="error" align="center">
//                             Menu Items Error
//                         </Typography>
//                     </React.Fragment>
//                 );
//         }
//     });

//     /* eslint-enable */

//     return (
//         // <React.Fragment key={`${item.id}`}>
//         <React.Fragment>
//             <List
//                 subheader={
//                     item.title && (
//                         <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
//                             {drawerOpen && item.title}
//                             {item.caption && (
//                                 <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
//                                     {drawerOpen && item.caption}
//                                 </Typography>
//                             )}
//                         </Typography>
//                     )
//                 }
//             >
//                 {items}
//             </List>

//             {/* group divider */}
//             <Divider sx={{ mt: 0.25, mb: 1.25 }} />
//         </React.Fragment>
//     );
// };

const NavGroup = ({ keysId, item }) => {
    const theme = useTheme();
    const { drawerOpen } = useSelector((state) => state.menu);

    const items = item.children?.map((menu, index) => {
        const uniqueKey = `${keysId}-${menu.type}-${menu.id || index}`;
        /* eslint-disable */
        switch (menu.type) {
            case "collapse":
                return (
                    <PermBasedAuthorizationHOC key={uniqueKey} perm={menu.perms} nav="Yes">
                        <NavCollapse keysId={uniqueKey} menu={menu} level={1} />
                    </PermBasedAuthorizationHOC>
                );
            case "item":
                return (
                    <RoleBasedAuthorizationHOC key={uniqueKey} rolesList={menu.roles}>
                        <PermBasedAuthorizationHOC perm={menu.perms} nav="Yes">
                            <NavItem key={uniqueKey} item={menu} level={1} />
                        </PermBasedAuthorizationHOC>
                    </RoleBasedAuthorizationHOC>
                );
            case "custom-dashboard-items":
                return (
                    <RoleBasedAuthorizationHOC
                        key={uniqueKey}
                        rolesList={menu.roles}
                        level={0}
                        appCheck="Yes"
                        menuItemType="custom-dashboard-items"
                    >
                        <NavCollapse keysId={uniqueKey} menu={menu} level={1} />
                    </RoleBasedAuthorizationHOC>
                );
            case "custom-chat-bots":
                return (
                    <RoleBasedAuthorizationHOC
                        key={uniqueKey}
                        rolesList={menu.roles}
                        level={0}
                        appCheck="Yes"
                        menuItemType="custom-chat-bots"
                    >
                        <NavCollapse keysId={uniqueKey} menu={menu} level={1} />
                    </RoleBasedAuthorizationHOC>
                );
            case "noPerms":
                return (
                    <RoleBasedAuthorizationHOC key={uniqueKey} rolesList={menu.roles}>
                        <NavItem item={menu} level={1} />
                    </RoleBasedAuthorizationHOC>
                );
            default:
                return (
                    <Typography key={uniqueKey} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    /* eslint-enable */

    return (
        <React.Fragment>
            <List
                subheader={
                    item.title && (
                        <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
                            {drawerOpen && item.title}
                            {item.caption && (
                                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                    {drawerOpen && item.caption}
                                </Typography>
                            )}
                        </Typography>
                    )
                }
            >
                {items}
            </List>

            <Divider sx={{ mt: 0.25, mb: 1.25 }} />
        </React.Fragment>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object,
    keysId: PropTypes.string
};

export default NavGroup;
