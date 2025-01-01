import PropTypes from "prop-types";
import React from "react";
// import { useNavigate } from "react-router-dom";
import { useSelector } from "store";

// project imports
// import useAuth from "hooks/useAuth";

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const PermBasedAuthorizationHOC = ({ children, perm, nav }) => {
    // const { isLoggedIn } = useAuth();
    // const navigate = useNavigate();

    const perms = useSelector((state) => state.authorization.user_perms);
    if (perms.includes(perm)) {
        return children;
    }

    // navigate('login', { replace: true });

    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         navigate('login', { replace: true });
    //     }
    // }, [isLoggedIn, navigate]);

    // return <> {!nav ? <>You Are Not Authorize To View This Data</> : <></>}</>;
    return <> {!nav ? <></> : <></>}</>;
};

PermBasedAuthorizationHOC.propTypes = {
    children: PropTypes.node,
    perm: PropTypes.string,
    nav: PropTypes.string
};

export default PermBasedAuthorizationHOC;
