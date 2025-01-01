import PropTypes from "prop-types";
import { useSelector } from "store";

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const RoleBasedHOC = ({ children, allowedRoles }) => {
    const role = useSelector((state) => state.authorization.penetration_role);

    if (allowedRoles.includes(role)) {
        return children;
    }
    // eslint-disable-next-line
    return <></>;
};

RoleBasedHOC.propTypes = {
    children: PropTypes.node,
    allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default RoleBasedHOC;
