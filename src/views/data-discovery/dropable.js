import React, { useState, useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    if (!enabled) {
        return null;
    }

    return <Droppable {...props}>{children}</Droppable>;
};

StrictModeDroppable.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.any])
};
export default StrictModeDroppable;
