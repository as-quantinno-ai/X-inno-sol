import React from "react";
import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Typography, Card } from "@mui/material";

// project imports
import useConfig from "hooks/useConfig";
import Items from "./Items";

// assets
import MainCard from "ui-component/cards/MainCard";
import { ArcherElement } from "react-archer";
import { THEME_MODE } from "constants/generic";

const Columns = ({
    show,
    column,
    index,
    selectedMetaDataId,
    dataSelection,
    metaSelection,
    selection,
    isMetaSelected,
    onClick,
    mappings,
    handleMouseEnter,
    hoveredAttributeName,
    hovereddatasourcemetadataidsIds,
    setHovereddatasourcemetadataidsIds,
    onTransformationChange,
    transformationTexts,
    highlightMetadataids,
    selectedAttributeName,
    sourceAttributeName,
    addItem,
    removeItem,
    isSource,
    datasource
}) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.mode === "dark" ? "dark.900" : "secondary.light";
    const arrowColor = theme.palette.mode === "dark" ? theme.palette.dark.light : theme.palette.secondary.dark;
    const { borderRadius } = useConfig();
    const bgcolor = theme.palette.mode === THEME_MODE.DARK ? "dark.900" : "secondary.light";

    const getRelations = (itemId) => {
        if (isSource) {
            return (
                mappings[itemId]?.map((targetId) => ({
                    targetId: `target-${targetId}`,
                    style: { strokeColor: arrowColor, strokeWidth: 2 },
                    className: "animated-arrow" // Apply the animation class here
                })) || []
            );
        }
        return (
            Object.keys(mappings)
                .filter((sourceId) => mappings[sourceId].includes(itemId))
                .map((sourceId) => ({
                    targetId: `source-${sourceId}`,
                    targetAnchor: "left",
                    sourceAnchor: "right",
                    style: { strokeColor: arrowColor, strokeWidth: 2 },
                    className: "animated-arrow" // Apply the animation class here
                })) || []
        );
    };

    return (
        column && (
            <MainCard
                sx={{
                    bgcolor: backgroundColor,
                    border: `1px solid ${theme.palette.primary.main}`,
                    width: "30%",
                    m: "2px auto",
                    mr: "16px",
                    ml: "16px"
                }}
                border={false}
            >
                <div
                    style={{
                        background: bgcolor,
                        padding: "8px 8px 8px",
                        borderRadius: `${borderRadius}px`
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                        <Typography>{show ? "Standard(Catalog) Metadata" : "Datasource Metadata"}</Typography>
                    </div>

                    {column?.length > 0 ? (
                        column.map((item, i) => (
                            <React.Fragment key={item.metadataid || item.dsMetadataId}>
                                <ArcherElement
                                    id={
                                        isSource
                                            ? `source-${item.metadataid || item.dsMetadataId}`
                                            : `target-${item.metadataid || item.dsMetadataId}`
                                    }
                                    relations={getRelations(item.metadataid || item.dsMetadataId)}
                                >
                                    <div>
                                        <Items
                                            key={i}
                                            item={item}
                                            index={i}
                                            colIndex={index}
                                            dataSelection={dataSelection}
                                            metaSelection={metaSelection}
                                            isMetaSelected={isMetaSelected}
                                            selection={selection}
                                            show={show}
                                            selectedMetaDataId={selectedMetaDataId}
                                            selectedAttributeName={selectedAttributeName}
                                            onClick={onClick}
                                            mappings={mappings}
                                            parentId={item.metadataid || item.dsMetadataId}
                                            handleMouseEnter={handleMouseEnter}
                                            hoveredAttributeName={hoveredAttributeName}
                                            hovereddatasourcemetadataidsIds={hovereddatasourcemetadataidsIds}
                                            setHovereddatasourcemetadataidsIds={setHovereddatasourcemetadataidsIds}
                                            onTransformationChange={onTransformationChange}
                                            transformationTexts={transformationTexts}
                                            highlightMetadataids={highlightMetadataids}
                                            sourceAttributeName={sourceAttributeName}
                                            addItem={addItem}
                                            removeItem={removeItem}
                                            isSource={isSource}
                                            datasource={datasource}
                                        />
                                    </div>
                                </ArcherElement>
                            </React.Fragment>
                        ))
                    ) : (
                        <Card
                            sx={{
                                margin: "4px 0 4px 0",
                                padding: 1,
                                border: "1px solid",
                                borderColor:
                                    theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.primary[200] + 75,
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: "8px",
                                width: "auto",
                                height: "auto"
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    display: "inline-block",
                                    width: "calc(100% - 34px)",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    verticalAlign: "middle",
                                    cursor: "pointer",
                                    color: "red"
                                }}
                            >
                                No Record Available
                            </Typography>
                        </Card>
                    )}
                </div>
            </MainCard>
        )
    );
};

Columns.propTypes = {
    show: PropTypes.bool,
    column: PropTypes.array,
    index: PropTypes.number,
    selectedMetaDataId: PropTypes.any,
    dataSelection: PropTypes.array,
    metaSelection: PropTypes.array,
    selection: PropTypes.array,
    isMetaSelected: PropTypes.bool,
    onClick: PropTypes.func,
    mappings: PropTypes.object,
    handleMouseEnter: PropTypes.func,
    hoveredAttributeName: PropTypes.any,
    hovereddatasourcemetadataidsIds: PropTypes.array,
    setHovereddatasourcemetadataidsIds: PropTypes.func,
    onTransformationChange: PropTypes.func,
    transformationTexts: PropTypes.object,
    highlightMetadataids: PropTypes.array,
    selectedAttributeName: PropTypes.any,
    sourceAttributeName: PropTypes.any,
    addItem: PropTypes.func,
    removeItem: PropTypes.func,
    isSource: PropTypes.bool,
    datasource: PropTypes.object
};

export default Columns;
