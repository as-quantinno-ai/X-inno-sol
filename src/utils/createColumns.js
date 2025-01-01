import React from "react";

const createColumns = (columns, columnWidths, onResizeStart) =>
    columns.map((header) => ({
        ...header,
        filter: true,
        sort: true,
        wrap: true,
        options: {
            ...header.options,
            filter: header.options?.filter ?? true,
            sort: header.options?.sort ?? true,
            wrap: header.options?.wrap ?? true,
            customHeadRender: ({ index, ...column }) => (
                <th
                    key={index}
                    style={{
                        width: columnWidths[index] || "120px",
                        minWidth: "40px",
                        maxWidth: columnWidths[index] || "auto",
                        position: "relative",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        paddingLeft: "10px",
                        paddingRight: "20px",
                        textAlign: "start"
                    }}
                    className="custom-header"
                >
                    <p
                        style={{
                            position: "relative",
                            whiteSpace: "nowrap",
                            minWidth: "40px",
                            maxWidth: columnWidths[index] || "auto",
                            overflow: columns.length > 6 && "hidden",
                            paddingLeft: "10px",
                            textAlign: "start",
                            display: "inline-block",
                            margin: 0,
                            padding: 0
                        }}
                    >
                        {column.label}
                    </p>
                    <div
                        className="resize-handle"
                        style={{
                            position: "absolute",

                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: "5px",
                            cursor: "col-resize",
                            backgroundColor: "transparent"
                        }}
                        onMouseDown={(e) => onResizeStart(e, index)}
                    >
                        I
                    </div>
                </th>
            )
        }
    }));

export default createColumns;
