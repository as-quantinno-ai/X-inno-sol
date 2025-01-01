import PropTypes from "prop-types";
// material-ui
import { Grid, Box, useTheme, Button } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// third-party
import React, { useState, useEffect, useCallback } from "react";
import { ArcherContainer } from "react-archer";
import {
    GetAccessToken,
    getDataSourceMetaData,
    postDataSourceMapping,
    getMetadatamapping,
    getAllMetaDatabystage
} from "views/api-configuration/default";
// project imports
import Columns from "./Columns";
import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/slices/snackbar";
import SendIcon from "@mui/icons-material/Send";
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, MarkerType, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import api from "views/api-configuration/api";

const HorizontalFlow = ({ initialNodes, initialEdges, onConnection }) => {
    // eslint-disable-next-line no-unused-vars
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => {
            const updatedEdges = addEdge(params, initialEdges);
            setEdges((eds) => addEdge(params, eds));
            onConnection(updatedEdges);
        },
        [onConnection, setEdges]
    );
    return (
        initialNodes && (
            <div style={{ height: "800px", width: "90%", marginTop: "-20px", marginLeft: "20px", marginRight: "20px" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    minZoom={0.2}
                    maxZoom={5}
                    attributionPosition="bottom-right"
                >
                    <MiniMap nodeStrokeWidth={3} zoomable pannable />

                    <Controls />
                </ReactFlow>
            </div>
        )
    );
};

HorizontalFlow.propTypes = {
    initialNodes: PropTypes.array,
    initialEdges: PropTypes.array,
    onConnection: PropTypes.func
};

const Board = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    // eslint-disable-next-line no-unused-vars
    const { configData, schemaFields } = useSelector((state) => state.datasourceconfiguration);

    const [metadata, setmetadata] = useState();

    // eslint-disable-next-line no-unused-vars
    const [sourceDataId, setSourceDataId] = useState();

    const [selectedMetaDataId, setSelectedMetaDataId] = useState(false);

    const [selectedAttributeName, setSelectedAttributeName] = useState("");
    const [sourceAttributeName, setSourceAttributeName] = useState("");
    const [datasource, setdatasource] = useState();
    const [data, setData] = useState([]);

    const [mappings, setMappings] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [editMappings, setEditMappings] = useState(false);
    // const onDragEnd = (result) => {
    //     if (!result.destination) {
    //         return;
    //     }
    //     if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return;

    //     const items = Array.from(data);

    //     const [reorderedItem] = items.splice(result.source.index, 1);

    //     items.splice(result.destination.index, 0, reorderedItem);
    //     setData(items);
    // };
    const [transformationTexts, setTransformationTexts] = useState({});

    function getAttributeName(updatedMappings) {
        const newSourceAttributeName = {};
        Object.keys(updatedMappings).forEach((metadataId) => {
            const ids = updatedMappings[metadataId];
            const attributeNamesArray = [];

            ids.forEach((id) => {
                const datasourceItem = datasource?.find((item) => item.dsMetadataId === id);
                if (datasourceItem) {
                    attributeNamesArray.push(datasourceItem.attributeName);
                }
            });
            newSourceAttributeName[metadataId] = attributeNamesArray;
        });
        setSourceAttributeName(newSourceAttributeName);
    }

    async function processDataWithMappings() {
        try {
            const response = await api.get(
                `${getMetadatamapping(configData.datasourceid, configData.productclientdatasetsid, configData.tableid)}`
            );

            const data = response?.data?.result;
            setData(data);
            const updatedMappings = {};
            const textMappings = { ...transformationTexts };

            data.forEach((mapping) => {
                const standardMetadataId = mapping.standardmetadataid.replace(/\[|\]/g, "");
                const parsedDataSourceMetadataId = JSON.parse(mapping.datasourcemetadataid);
                if (!updatedMappings[standardMetadataId]) {
                    updatedMappings[standardMetadataId] = [];
                }
                updatedMappings[standardMetadataId] = parsedDataSourceMetadataId;
                textMappings[standardMetadataId] = [textMappings[textMappings] || [], mapping.transformation];
            });
            setMappings(updatedMappings);
            setTransformationTexts(textMappings);
            getAttributeName(updatedMappings);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    useEffect(() => {
        api.get(`${getAllMetaDatabystage(configData.productclientdatasetsid, configData.tableid, "BRONZE")}`)
            .then((res) => {
                const metadatas = res?.data?.result;
                setmetadata(metadatas);
                const mappings = metadatas.map((meta) => ({
                    [meta.metadataid]: []
                }));
                setMappings(Object.assign({}, ...mappings));
                setTransformationTexts(Object.assign({}, ...mappings));

                api.get(`${getDataSourceMetaData(configData.datasourceid, configData.productclientdatasetsid, configData.tableid)}`, {
                    headers: GetAccessToken()
                })
                    .then((res) => {
                        const datasources = res?.data?.result;
                        setdatasource(datasources);
                    })
                    .catch((error) => console.log(error));
                processDataWithMappings();
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        getAttributeName(mappings);
    }, [metadata, datasource, mappings]);

    // eslint-disable-next-line no-unused-vars
    const [hoveredAttributeName, setHoveredAttributeName] = useState(null);
    const [hovereddatasourcemetadataidsIds, setHovereddatasourcemetadataidsIds] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [highlightMetadataids, setHighlightmetadataids] = useState(null);
    const flattenedMetadata = metadata?.flatMap((object, index) => ({
        ...object,
        index
    }));

    const flattenedDatasource = datasource?.flatMap((object, index) => ({
        ...object,
        index
    }));
    const mergedArray = flattenedMetadata && flattenedDatasource && [...flattenedMetadata, ...flattenedDatasource];

    const initialNodes =
        mergedArray &&
        mergedArray?.map((object) => ({
            id: `horizontal-${object.metadataid ?? object.dsMetadataId}`,
            sourcePosition: "right",
            ...(object.metadataid && { type: "input" }),
            data: { label: object.attributeName },
            position: {
                x: object.metadataid ? 0 : 1000,
                y: 100 + object.index * 50
            },
            style: {
                strokeWidth: 2,
                fontSize: 10,
                fontWeight: 700,
                stroke: `${theme.palette.secondary.dark}`,
                border: 4,
                borderColor: `${theme.palette.primary.dark}`,
                width: 250,
                backgroundColor: `${theme.palette.primary.light}`
            },
            ...(object.dsMetadataId && { targetPosition: "left" })
        }));

    const initialEdges = data?.map((object) => ({
        id: `horizontal-e${object.standardmetadataid.slice(1, -1)}-${object.datasourcemetadataid.slice(1, -1)}`,
        source: `horizontal-${object.standardmetadataid.slice(1, -1)}`,
        target: `horizontal-${object.datasourcemetadataid.slice(1, -1)}`,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: `${theme.palette.secondary.dark}`
        },
        label: `${object.transformation}`,
        style: {
            strokeWidth: 2,
            stroke: `${theme.palette.secondary.dark}`
        }
    }));

    const handleMouseEnter = () => {};

    const dataSelection = (sourceId) => {
        setSourceDataId(sourceId);
        setSelectedMetaDataId(true);
    };

    const handleTransformationChange = (text) => {
        const updatedMappings = { ...transformationTexts };
        updatedMappings[selectedMetaDataId] = [[], text];
        setTransformationTexts(updatedMappings);
    };

    const requestPayload = () => {
        const payload = [];
        Object.entries(mappings).forEach(([metadataId, sourceIds]) => {
            if (sourceIds.length === 0) {
                return;
            }
            const specificMetadata = metadata.find((item) => item.metadataid === parseInt(metadataId, 10));
            const specificMetadataforMapping = data.find((item) => {
                const itemStandardmetadataid = parseInt(item.standardmetadataid.slice(1, -1), 10);
                return itemStandardmetadataid === parseInt(metadataId, 10);
            });
            const mappingId = specificMetadataforMapping && specificMetadataforMapping?.mappingid;
            const transformationSourceId = specificMetadataforMapping && specificMetadataforMapping?.transformationsourceid;

            const specificSourceDataIds = sourceIds.map((id) => parseInt(id, 10));

            const sourcedataItems = specificSourceDataIds.map((id) => {
                const sourceDataItem = datasource.find((item) => item.dsMetadataId === id);
                return sourceDataItem;
            });
            const allMatch = sourcedataItems.every((item) => item && item?.attributeType === specificMetadata?.attributeType);
            const sourcetype = allMatch ? "TR" : "TC";

            const stringValue = Array.isArray(transformationTexts[metadataId])
                ? transformationTexts[metadataId].find((item) => typeof item === "string" && item.trim() !== "")
                : transformationTexts[metadataId];

            const obj = {
                productclientdatasetsid: configData?.productclientdatasetsid,
                datasourceid: configData.datasourceid,
                tableid: configData.tableid,
                standardmetadataid: `[${metadataId}]`,
                datasourcemetadataid: JSON.stringify(sourceIds),
                transformation: stringValue,
                sourcetype,
                order: 0,
                transformationsourceid: transformationSourceId || 0,
                mappingid: mappingId || 0
            };

            payload.push(obj);
        });

        return payload;
    };

    const handleData = () => {
        api.post(`${postDataSourceMapping()}`, requestPayload())
            .then(() => {
                processDataWithMappings();

                dispatch(
                    openSnackbar({
                        open: true,
                        message: "New Mapping created",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.error("Error creating new mapping:", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating New Mapping",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };
    // const handlerDetails = (id) => {
    //     //    dispatch(selectItem(id));
    //     setEditMappings(!editMappings);
    // };
    const handleSourceSelection = (selectedId) => {
        const updatedMappings = { ...mappings };
        if (updatedMappings[selectedMetaDataId]?.includes(selectedId)) {
            updatedMappings[selectedMetaDataId] = updatedMappings[selectedMetaDataId].filter((item) => item !== selectedId);
        } else {
            updatedMappings[selectedMetaDataId] = [...(updatedMappings[selectedMetaDataId] || []), selectedId];
        }
        setMappings(updatedMappings);
        const attributeNames = {};

        Object.keys(updatedMappings).forEach((metadataId) => {
            const ids = updatedMappings[metadataId];
            const attributeNamesArray = [];
            ids.forEach((id) => {
                const datasourceItem = datasource.find((item) => item.dsMetadataId === id);
                if (datasourceItem) {
                    attributeNamesArray.push(datasourceItem.attributeName);
                }
            });
            attributeNames[metadataId] = attributeNamesArray;
        });
        setSourceAttributeName(attributeNames);
    };

    const handleMetaSelection = (selectedId) => {
        setSelectedMetaDataId(selectedId);
        const metadataIdToAttributeName = {};
        metadata.forEach((item) => {
            metadataIdToAttributeName[item.metadataid] = item.attributeName;
        });

        const selectedAttributeName = metadataIdToAttributeName[selectedId];
        setSelectedAttributeName(selectedAttributeName);
    };

    const [edges, setEdges] = useState(initialEdges);

    const handleEdgeConnect = (newEdges) => {
        setEdges(newEdges);
    };

    const addItemToMappings = (selectedId, parentId) => {
        setSelectedMetaDataId(selectedId);
        setMappings((prevMappings) => {
            const updatedMappings = { ...prevMappings };

            if (!updatedMappings[parentId]) {
                updatedMappings[parentId] = [];
            }
            if (selectedId !== parentId && selectedId !== false) {
                updatedMappings[parentId] = [...new Set([...updatedMappings[parentId], selectedId])];
            }
            return updatedMappings;
        });

        const metadataIdToAttributeName = {};
        metadata.forEach((item) => {
            metadataIdToAttributeName[item.metadataid] = item.attributeName;
        });

        const selectedAttributeName = metadataIdToAttributeName[selectedId];
        setSelectedAttributeName(selectedAttributeName);
        // setTimeout(() => {
        //     handleSourceSelection(parentId);
        // }, 3000);
    };

    const removeItemFromMappings = (itemId, parentId) => {
        setMappings((prevMappings) => {
            const updatedMappings = { ...prevMappings };
            if (updatedMappings[parentId]) {
                updatedMappings[parentId] = updatedMappings[parentId].filter((id) => id !== itemId);
                if (updatedMappings[parentId].length === 0) {
                    delete updatedMappings[parentId];
                }
            }
            return updatedMappings;
        });
    };
    return (
        <>
            {metadata && datasource && (
                <DndProvider backend={HTML5Backend}>
                    <ArcherContainer
                        strokeColor="black"
                        strokeDasharray="5,5"
                        strokeWidth={2}
                        style={{ width: "100%", position: "relative" }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        ml: -2,
                                        mr: -2,

                                        display: "flex",
                                        paddingTop: "10px",
                                        paddingBottom: "10px",
                                        "& > *": {
                                            flex: 1
                                        }
                                    }}
                                >
                                    {initialNodes && edges && editMappings === true && (
                                        <HorizontalFlow
                                            initialNodes={initialNodes}
                                            initialEdges={initialEdges}
                                            onConnection={handleEdgeConnect}
                                        />
                                    )}
                                    {!editMappings && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "230px"
                                            }}
                                        >
                                            <Columns
                                                key={datasource.attributeId}
                                                column={datasource}
                                                index={datasource}
                                                selectedMetaDataId={selectedMetaDataId}
                                                onClick={handleSourceSelection}
                                                mappings={mappings}
                                                hoveredAttributeName={hoveredAttributeName}
                                                hovereddatasourcemetadataidsIds={hovereddatasourcemetadataidsIds}
                                                setHovereddatasourcemetadataidsIds={setHovereddatasourcemetadataidsIds}
                                                onTransformationChange={handleTransformationChange}
                                                transformationTexts={transformationTexts}
                                                highlightMetadataids={highlightMetadataids}
                                                selectedAttributeName={selectedAttributeName}
                                                sourceAttributeName={sourceAttributeName}
                                                isSource={false}
                                                addItem={addItemToMappings}
                                                removeItem={removeItemFromMappings}
                                                datasource={datasource}
                                            />
                                            <Columns
                                                key={metadata.attributeId}
                                                column={metadata}
                                                index={metadata}
                                                dataSelection={dataSelection}
                                                selectedMetaDataId={selectedMetaDataId}
                                                show
                                                onClick={handleMetaSelection}
                                                transformationTexts={transformationTexts}
                                                selectedAttributeName={selectedAttributeName}
                                                onTransformationChange={handleTransformationChange}
                                                mappings={mappings}
                                                handleMouseEnter={handleMouseEnter}
                                                hoveredAttributeName={hoveredAttributeName}
                                                highlightMetadataids={highlightMetadataids}
                                                sourceAttributeName={sourceAttributeName}
                                                isSource
                                                addItem={addItemToMappings}
                                                removeItem={removeItemFromMappings}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                            {!editMappings && (
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ marginTop: "10px" }}
                                        onClick={() => handleData()}
                                        endIcon={<SendIcon />}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </ArcherContainer>
                </DndProvider>
            )}
        </>
    );
};

export default Board;
