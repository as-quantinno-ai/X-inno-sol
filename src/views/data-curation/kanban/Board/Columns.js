import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

// third-party
import { Droppable, DragDropContext } from "react-beautiful-dnd";

// project imports
import useConfig from "hooks/useConfig";
import Items from "./Items";
import AddItem from "./AddItem";
import { gridSpacing } from "store/constant";
import { useSelector } from "store";

// assets
import MainCard from "ui-component/cards/MainCard";
import { getStage } from "constants/generic";

// column drag wrapper

// column drop wrapper
const getDropWrapper = (isDraggingOver, theme, radius) => {
    const bgcolor = theme.palette.mode === "dark" ? "dark.900" : "secondary.light";

    return {
        background: isDraggingOver ? bgcolor : bgcolor,
        padding: "8px 16px 14px",
        borderRadius: radius,
        overflowY: "auto"
    };
};
const Columns = ({ column, selectedValue }) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.mode === "dark" ? "dark.900" : "secondary.light";

    const { borderRadius } = useConfig();
    const { items } = useSelector((state) => state.kanban);
    const [data, setData] = useState([]);
    const changeStates = () => {
        const data = items?.filter((item) => item?.datapipelinelayerid === column?.datapipelinelayerid);
        setData(data);
    };
    useEffect(() => {
        changeStates();
    }, [selectedValue, column, items]);
    //  const columnItems = layer.filter((item) => item.deltalakelayerid === column.deltalakelayerid);

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return;

        const items = Array.from(data);
        const [reorderedItem] = items.splice(result.source.index, 1);

        items.splice(result.destination.index, 0, reorderedItem);
        setData(items);
    };

    return (
        column && (
            <DragDropContext onDragEnd={onDragEnd}>
                <MainCard
                    sx={{
                        bgcolor: backgroundColor,
                        border: "1px solid",
                        borderColor: theme.palette.primary.light,
                        borderRadius: "8px",
                        m: "16px",
                        overflowY: "auto",
                        minWidth: "280px",
                        maxWidth: "350px"
                    }}
                    border={false}
                >
                    <Grid container alignItems="center" spacing={gridSpacing}>
                        <Grid item xs zeroMinWidth>
                            <Typography variant="h5" component="div" align="center" sx={{ color: theme.palette.primary.main }}>
                                {getStage(column.stage)}
                            </Typography>
                            {/* <EditColumn column={column} /> */}
                        </Grid>
                    </Grid>
                    <Droppable droppableId={column.datapipelinelayerid.toString()} type="row">
                        {(providedDrop, snapshotDrop) => (
                            <div
                                ref={providedDrop.innerRef}
                                {...providedDrop.droppableProps}
                                style={getDropWrapper(snapshotDrop.isDraggingOver, theme, `${borderRadius}px`)}
                            >
                                {data.map((item, i) => (
                                    <Items key={i} item={item} index={i} stage={column.stage} />
                                ))}
                                {providedDrop.placeholder}
                            </div>
                        )}
                    </Droppable>
                    {column.stage !== "BRONZE" ? <AddItem columnId={column} selectedValue={selectedValue} /> : <></>}
                </MainCard>
            </DragDropContext>
        )
    );
};

Columns.propTypes = {
    column: PropTypes.object,
    index: PropTypes.number,
    selectedValue: PropTypes.any
};

export default Columns;
