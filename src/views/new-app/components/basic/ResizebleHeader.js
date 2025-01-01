import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

const ResizableHeader = ({ width, onResize, children }) => {
    const headerRef = useRef();
    const [startWidth, setStartWidth] = useState(width);
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseMove = (e) => {
        if (isResizing) {
            const newWidth = startWidth + (e.clientX - headerRef.current.getBoundingClientRect().right);
            onResize(newWidth);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };
    const handleMouseDown = () => {
        setIsResizing(true);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        setStartWidth(headerRef.current.offsetWidth);
    };

    return (
        <div ref={headerRef} style={{ width: `${width}px`, display: "inline-flex", alignItems: "center", borderRight: "1px solid #ddd" }}>
            {children}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    width: "5px",
                    cursor: "col-resize",
                    padding: "4px",
                    borderLeft: "1px solid #ddd",
                    backgroundColor: "#f0f0f0"
                }}
            />
        </div>
    );
};

ResizableHeader.propTypes = {
    width: PropTypes.number,
    onResize: PropTypes.func,
    children: PropTypes.node
};

export default ResizableHeader;
