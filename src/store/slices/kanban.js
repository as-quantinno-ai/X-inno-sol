// third-party
import { createSlice } from "@reduxjs/toolkit";

// project imports
import axios from "axios";
// import { useDispatch } from "react-redux";
import { openSnackbar } from "store/slices/snackbar";

import { dispatch } from "../index";
import {
    // getCustomFormsByFormId,
    // GetAccessToken,
    // updateCustomFormData,
    GetJWT,
    getDeltaByPCDSIDtableid,
    // retrieveCustomFormRecord,
    // getCustomFormsByprodclidsidandTableIid,
    // getDataSourcesByCatalogsId,
    // getTransformerByPcdsIdTableIdDataLakeId,
    // getTransformerByProductIdTableId,
    // getDeltaByPCDSID,
    getTransformerByPcdsIdTableId,
    getTransformerByTransformerId
    // deleteTransformerByTransfomerId,
    // createTransformers
} from "views/api-configuration/default";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    columns: [],
    columnsOrder: [],
    comments: [],
    items: [],
    profiles: [],
    selectedItem: false,
    userStory: [],
    userStoryOrder: []
};

const slice = createSlice({
    name: "kanban",
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // ADD COLUMN
        addColumnSuccess(state, action) {
            state.columns = action.payload.columns;
            state.columnsOrder = action.payload.columnsOrder;
        },

        // EDIT COLUMN
        editColumnSuccess(state, action) {
            state.columns = action.payload.columns;
        },

        // UPDATE COLUMN ORDER
        updateColumnOrderSuccess(state, action) {
            state.columnsOrder = action.payload.columnsOrder;
        },

        // DELETE COLUMN
        deleteColumnSuccess(state, action) {
            state.columns = action.payload.columns;
            state.columnsOrder = action.payload.columnsOrder;
        },

        // ADD ITEM
        addItemSuccess(state, action) {
            state.items = action.payload.items;
            state.columns = action.payload.columns;
            state.userStory = action.payload.userStory;
        },

        // EDIT ITEM
        editItemSuccess(state, action) {
            state.items = action.payload.items;
            state.columns = action.payload.columns;
            state.userStory = action.payload.userStory;
        },

        // UPDATE COLUMN ITEM ORDER
        updateColumnItemOrderSuccess(state, action) {
            state.columns = action.payload.columns;
        },

        // SELECT ITEM
        selectItemSuccess(state, action) {
            state.selectedItem = action.payload.selectedItem;
        },

        // ADD ITEM COMMENT
        addItemCommentSuccess(state, action) {
            state.items = action.payload.items;
            state.comments = action.payload.comments;
        },

        // DELETE ITEM
        deleteItemSuccess(state, action) {
            state.items = action.payload.items;
            state.columns = action.payload.columns;
            state.userStory = action.payload.userStory;
        },

        // ADD STORY
        addStorySuccess(state, action) {
            state.userStory = action.payload.userStory;
            state.userStoryOrder = action.payload.userStoryOrder;
        },

        // EDIT STORY
        editStorySuccess(state, action) {
            state.userStory = action.payload.userStory;
        },

        // UPDATE STORY ORDER
        updateStoryOrderSuccess(state, action) {
            state.userStoryOrder = action.payload.userStoryOrder;
        },

        // UPDATE STORY ITEM ORDER
        updateStoryItemOrderSuccess(state, action) {
            state.userStory = action.payload.userStory;
        },

        // ADD STORY COMMENT
        addStoryCommentSuccess(state, action) {
            state.userStory = action.payload.userStory;
            state.comments = action.payload.comments;
        },

        // DELETE STORY
        deleteStorySuccess(state, action) {
            state.userStory = action.payload.userStory;
            state.userStoryOrder = action.payload.userStoryOrder;
        },

        // GET COLUMNS
        getColumnsSuccess(state, action) {
            state.columns = action.payload;
        },

        // GET COLUMNS ORDER
        getColumnsOrderSuccess(state, action) {
            state.columnsOrder = action.payload;
        },

        // GET COMMENTS
        getCommentsSuccess(state, action) {
            state.comments = action.payload;
        },

        // GET PROFILES
        getProfilesSuccess(state, action) {
            state.profiles = action.payload;
        },

        // GET ITEMS
        getItemsSuccess(state, action) {
            state.items = action.payload;
        },

        // GET USER STORY
        getUserStorySuccess(state, action) {
            state.userStory = action.payload;
        },

        // GET USER STORY ORDER
        getUserStoryOrderSuccess(state, action) {
            state.userStoryOrder = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

// Reducer

// ----------------------------------------------------------------------

export function getColumns(datasetid, tableid) {
    return async () => {
        try {
            const response = await api.get(getDeltaByPCDSIDtableid(datasetid, tableid), {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${GetJWT()}`
                }
            });
            dispatch(slice.actions.getColumnsSuccess(response.data.result));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getColumnsOrder() {
    return async () => {
        try {
            const response = await axios.get("/api/kanban/columns-order");
            dispatch(slice.actions.getColumnsOrderSuccess(response.data.columnsOrder));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getComments() {
    return async () => {
        try {
            const response = await axios.get("/api/kanban/comments");
            dispatch(slice.actions.getCommentsSuccess(response.data.comments));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getProfiles() {
    return async () => {
        try {
            const response = await axios.get("/api/kanban/profiles");
            dispatch(slice.actions.getProfilesSuccess(response.data.profiles));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getItems(pcdsid, tableid) {
    return async () => {
        try {
            const response = await api.get(getTransformerByPcdsIdTableId(pcdsid, tableid), {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${GetJWT()}`
                }
            });
            dispatch(slice.actions.getItemsSuccess(response.data.result));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUserStory() {
    return async () => {
        try {
            const response = await axios.get("/api/kanban/userstory");
            dispatch(slice.actions.getUserStorySuccess(response.data.userStory));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUserStoryOrder() {
    return async () => {
        try {
            const response = await axios.get("/api/kanban/userstory-order");
            dispatch(slice.actions.getUserStoryOrderSuccess(response.data.userStoryOrder));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addColumn(column, columns, columnsOrder) {
    return async () => {
        try {
            const response = await axios.post("/api/kanban/add-column", { column, columns, columnsOrder });
            dispatch(slice.actions.addColumnSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function editColumn(column, columns) {
    return async () => {
        try {
            const response = await axios.post("/api/kanban/edit-column", { column, columns });
            dispatch(slice.actions.editColumnSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateColumnOrder(columnsOrder) {
    return async () => {
        try {
            const response = await axios.post("/api/kanban/update-column-order", { columnsOrder });
            dispatch(slice.actions.updateColumnOrderSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function deleteColumn(columnId, columnsOrder, columns) {
    return async () => {
        try {
            const response = await axios.post("/api/kanban/delete-column", { columnId, columnsOrder, columns });
            dispatch(slice.actions.deleteColumnSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addItem(datasourceids, deltalakelayerids, order, productclientdatasetsids, tableids) {
    return async () => {
        try {
            // const response = await api.post(createTransformers, {
            //     datasourceid: datasourceids,
            //     datapipelinelayerid: deltalakelayerids,
            //     order,
            //     productclientdatasetsid: productclientdatasetsids,
            //     tableid: tableids,
            //     transformationquery: transformationqueries
            // });

            const resp = await api.get(getTransformerByPcdsIdTableId(productclientdatasetsids, tableids), {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${GetJWT()}`
                }
            });
            const res = await api.get(getDeltaByPCDSIDtableid(productclientdatasetsids, tableids), {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${GetJWT()}`
                }
            });

            dispatch(slice.actions.addItemSuccess({ items: resp.data.result, columns: res.data.result, userStory: null }));
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Transformer Added successfully",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                    variant: "alert",
                    alert: {
                        color: "success"
                    },
                    close: false
                })
            );
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Error Adding Transformer",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                    variant: "alert",
                    alert: {
                        color: "error"
                    },
                    close: false
                })
            );
        }
    };
}

export function editItem(columnId, columns, item, items, storyId, userStory) {
    return async () => {
        try {
            const response = await api.post("/api/kanban/edit-item", { items, item, userStory, storyId, columns, columnId });
            dispatch(slice.actions.editItemSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateColumnItemOrder(columns) {
    return async () => {
        try {
            const response = await api.post("/api/kanban/update-item-order", { columns });
            dispatch(slice.actions.updateColumnItemOrderSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function selectItem(selectedItem) {
    return async () => {
        try {
            const response = await api.get(getTransformerByTransformerId(selectedItem), {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${GetJWT()}`
                }
            });
            dispatch(slice.actions.selectItemSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addItemComment(itemId, comment, items, comments) {
    return async () => {
        try {
            const response = await api.post("/api/kanban/add-item-comment", { items, itemId, comment, comments });
            dispatch(slice.actions.addItemCommentSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function deleteItem(itemId, productclientdatasetsids, tableids) {
    return async () => {
        try {
            // const response = await api.delete(deleteTransformerByTransfomerId(itemId), {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //         Authorization: `Bearer ${GetJWT()}`
            //     }
            // });
            const resp = await api.get(getTransformerByPcdsIdTableId(productclientdatasetsids, tableids), {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${GetJWT()}`
                }
            });
            const res = await api.get(getDeltaByPCDSIDtableid(productclientdatasetsids, tableids), {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${GetJWT()}`
                }
            });

            dispatch(slice.actions.deleteItemSuccess({ items: resp.data.result, columns: res.data.result, userStory: null }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addStory(story, userStory, userStoryOrder) {
    return async () => {
        try {
            const response = await axios.post("/api/kanban/add-story", { userStory, story, userStoryOrder });
            dispatch(slice.actions.addStorySuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function editStory(story, userStory) {
    return async () => {
        try {
            const response = await axios.post("/api/kanban/edit-story", { userStory, story });
            dispatch(slice.actions.editStorySuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateStoryOrder(userStoryOrder) {
    return async () => {
        try {
            const response = await axios.post("/api/kanban/update-story-order", { userStoryOrder });
            dispatch(slice.actions.updateStoryOrderSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateStoryItemOrder(userStory) {
    return async () => {
        try {
            const response = await api.post("/api/kanban/update-storyitem-order", { userStory });
            dispatch(slice.actions.updateStoryItemOrderSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addStoryComment(storyId, comment, comments, userStory) {
    return async () => {
        try {
            const response = await axios.post("/api/kanban/add-story-comment", { userStory, storyId, comment, comments });
            dispatch(slice.actions.addStoryCommentSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function deleteStory(storyId, userStory, userStoryOrder) {
    return async () => {
        try {
            const response = await axios.post("/api/kanban/delete-story", { userStory, storyId, userStoryOrder });
            dispatch(slice.actions.deleteStorySuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export const { resetState: resetkanbanState } = slice.actions;

export default slice.reducer;
