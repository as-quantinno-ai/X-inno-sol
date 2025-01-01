import { createSlice } from "@reduxjs/toolkit";

// Create a slice for navigation data
const qualityController = createSlice({
    name: "qualitycontroller",
    initialState: {
        selectedDatasetId: "",
        selectedTableId: "",
        viewName: "",
        attribName: "",
        searchValue: "",
        refTableId: "",
        dqRuleId: "",
        refAttribName: "",
        refViewName: ""
    },
    reducers: {
        setQualityData: (state, action) => {
            // Set all navigation data at once
            const {
                selectedDatasetId,
                selectedTableId,
                viewName,
                attribName,
                searchValue,
                refTableId,
                dqRuleId,
                refAttribName,
                refViewName
            } = action.payload;
            state.selectedDatasetId = selectedDatasetId;
            state.selectedTableId = selectedTableId;
            state.viewName = viewName;
            state.attribName = attribName;
            state.searchValue = searchValue;

            state.refTableId = refTableId;
            state.dqRuleId = dqRuleId;
            state.refAttribName = refAttribName;
            state.refViewName = refViewName;
        },
        clearQualityData: (state) => {
            // Clear all fields
            state.attribVal = "";
            state.attribName = "";
            state.refTableId = "";
            state.dqRuleId = "";
            state.refAttribName = "";
        }
    }
});

// Export actions
export const { setQualityData, clearQualityData } = qualityController.actions;

// Export the reducer to be added to the store
export default qualityController.reducer;
