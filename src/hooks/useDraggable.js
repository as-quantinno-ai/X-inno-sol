import { useState, useRef } from "react";

const useDraggableColumns = (initialWidths = {}) => {
    const [columnWidths, setColumnWidths] = useState(initialWidths);
    const resizingColumnIndex = useRef(null);
    const startX = useRef(null);
    const startWidth = useRef(null);

    const onResize = (e) => {
        if (resizingColumnIndex.current !== null) {
            const deltaX = e.clientX - startX.current;
            const newWidth = startWidth.current + deltaX;
            setColumnWidths((prevWidths) => ({
                ...prevWidths,
                [resizingColumnIndex.current]: newWidth
            }));
        }
    };

    const onResizeEnd = () => {
        resizingColumnIndex.current = null;
        document.removeEventListener("mousemove", onResize);
        document.removeEventListener("mouseup", onResizeEnd);
    };

    const onResizeStart = (e, index) => {
        e.preventDefault();
        resizingColumnIndex.current = index;
        startX.current = e.clientX;
        startWidth.current = e.target.parentElement.clientWidth;
        document.addEventListener("mousemove", onResize);
        document.addEventListener("mouseup", onResizeEnd);
    };

    return { columnWidths, onResizeStart };
};

export default useDraggableColumns;
