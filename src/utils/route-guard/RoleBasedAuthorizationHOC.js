import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "store";

// project imports
import NavItem from "layout/MainLayout/Sidebar/MenuList/NavItem";

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */

const AppBasedScreenNavItems = ({ appChck, keyId }) => {
    const { screens } = useSelector((state) => state.globe);

    let output = <></>;

    if (appChck) {
        output = (
            <>
                {screens?.map((screen, ind) => {
                    const isScreenStyleEmpty = screen && (!screen.style || Object.keys(screen?.style).length === 0);

                    const item = {
                        id: `custom-dashbaord-screen-${ind}`,
                        title: `${screen.screentitle}`,
                        type: "custom-dashboard-items",
                        url: `/show-dashboard/${screen.screenid}`,
                        icon: null
                    };
                    if (!isScreenStyleEmpty) {
                        try {
                            const style = JSON.parse(screen.style);
                            item.icon = style.icon;
                        } catch (error) {
                            console.error(`Error parsing style for screen ${screen.screentitle}:`, error);
                        }
                    }
                    return (
                        <React.Fragment key={`${keyId}-screen-${ind}`}>
                            <NavItem key={`form-nav-item-${ind}`} item={item} level={1} />
                        </React.Fragment>
                    );
                })}
            </>
        );
    }
    return output;
};

AppBasedScreenNavItems.propTypes = {
    appChck: PropTypes.string,
    keyId: PropTypes.string
};

const AppBasedFormNavItems = ({ appChck, keyId }) => {
    const { forms } = useSelector((state) => state.globe);
    let output = <></>;

    if (appChck) {
        output = (
            <>
                {forms?.map((form, ind) => {
                    const isFormStyleEmpty = form && (!form.style || Object.keys(form?.style).length === 0);
                    const item = {
                        id: `custom-forms-${ind}`,
                        title: form.formtitle,
                        type: "custom-form-items",
                        url: `/data-entry/${form.formid}`,
                        icon: null
                    };
                    if (!isFormStyleEmpty) {
                        try {
                            const style = JSON.parse(form.style);
                            item.icon = style.icon;
                        } catch (error) {
                            console.error(`Error parsing style for screen ${form.formtitle}:`, error);
                        }
                    }

                    return (
                        <React.Fragment key={`${keyId}-form-${ind}`}>
                            <NavItem key={`form-nav-item-${ind}`} item={item} level={1} />
                        </React.Fragment>
                    );
                })}
            </>
        );
    }
    return output;
};

AppBasedFormNavItems.propTypes = {
    appChck: PropTypes.string,
    keyId: PropTypes.string
};

const AppBasedChatsNavItems = ({ appChck, keyId }) => {
    const { chatbots } = useSelector((state) => state.globe);
    let output = <></>;

    if (appChck) {
        output = (
            <>
                {chatbots?.map((chatbot, ind) => {
                    const item = {
                        id: `custom-chat-bots-${ind}`,
                        title: chatbot.flowname,
                        type: "custom-chat-bots",
                        url: `/xtreme-bots/${chatbot.genaiflowid}`,
                        icon: "ChatBubbleOutline"
                    };

                    return (
                        <React.Fragment key={`${keyId}-custom-chat-bots-${ind}`}>
                            <NavItem key={`custom-chat-bots-${ind}`} item={item} level={1} />
                        </React.Fragment>
                    );
                })}
            </>
        );
    }
    return output;
};

AppBasedChatsNavItems.propTypes = {
    appChck: PropTypes.string,
    keyId: PropTypes.string
};
const RoleBasedAuthorizationHOC = ({ children, rolesList, appCheck, menuItemType, userApp, keysId }) => {
    let output = <></>;

    const role = useSelector((state) => state.authorization.penetration_role);
    if (role === "USER@APP" && userApp === "USER@APP") {
        output = children;
    } else if (rolesList?.includes(role)) {
        if (menuItemType === "custom-dashboard-items") {
            output = <AppBasedScreenNavItems appChck={appCheck} keysId={keysId} />;
        } else if (menuItemType === "custom-form-items") {
            output = <AppBasedFormNavItems appChck={appCheck} keysId={keysId} />;
        } else if (menuItemType === "custom-chat-bots") {
            output = <AppBasedChatsNavItems appChck={appCheck} keysId={keysId} />;
        } else {
            output = children;
        }
    } else {
        output = <></>;
    }

    return output;
};

RoleBasedAuthorizationHOC.propTypes = {
    children: PropTypes.node,
    rolesList: PropTypes.arrayOf(PropTypes.string),
    appCheck: PropTypes.string,
    menuItemType: PropTypes.string,
    userApp: PropTypes.string,
    keysId: PropTypes.string
};

export default RoleBasedAuthorizationHOC;
