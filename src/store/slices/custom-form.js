import { getAllMetaDatabystage } from "views/api-configuration/default";
import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import CustomFormDTO from "views/api-configuration/DTOs/CustomFormDTO";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";
import { filterFormAttributes } from "constants/generic";

const parquetDataTypesForFields = {
    string: "string",
    varchar: "varchar",
    char: "char",
    int: "int",
    long: "long",
    decimal: "decimal",
    float: "float",
    double: "double",
    date: "date",
    timestamp: "datetime"
};

const initialState = {
    reduxFormFields: [new CustomFormDTO(0, "", 0, "", "", "", "", "", "", "", "", "", [])],
    parquetSchemaStr: {}
};
function swapElements(arr, index, type) {
    if (type === "up") {
        const temp = arr[index];
        arr[index] = arr[index - 1];
        arr[index - 1] = temp;
    } else {
        const temp = arr[index];
        arr[index] = arr[index + 1];
        arr[index + 1] = temp;
    }
    return arr;
}

const slice = createSlice({
    name: "form",
    initialState,
    reducers: {
        // Testing Reducer
        // hasRequest(state, action) {
        //     state.f1 += 1;
        // },
        hasRequest(state) {
            state.f1 += 1;
        },

        // getReduxFormFields(state, action) {
        //     return state.reduxFormFields;
        // },

        // Reducer to control state of formFields
        setFormFieldsSuccess(state, action) {
            state.reduxFormFields = [
                ...state.reduxFormFields,
                ...filterFormAttributes(action.payload).map((item) => ({
                    field_name: item.attributeName,
                    role: item.attributeType,
                    category: item.attributeCategory,
                    conditions: []
                }))
            ];
        },

        setParquetSchema(state) {
            state.parquetSchemaStr =
                state.reduxFormFields.length &&
                state.reduxFormFields?.reduce(
                    (result, obj) => ({
                        ...result, // Spread the existing result object
                        [obj.field_name]:
                            // The following field names should be change with DA_AN prefix
                            parquetDataTypesForFields[
                                obj.role === "sec" ||
                                obj.field_name === "first_name_identifier_da_an" ||
                                obj.field_name === "last_name_identifier_da_an" ||
                                obj.field_name === "email_identifier_da_an" ||
                                obj.field_name === "phone_identifier_da_an" ||
                                obj.field_name === "password_identifier_da_an" ||
                                obj.field_name === "company_name_identifier_da_an" ||
                                obj.field_name === "product_client_id_identifier_da_an"
                                    ? undefined
                                    : obj.dtype
                            ]
                    }),
                    {}
                );
        },

        // Reducer to control remove form field
        removeFormField(state, action) {
            state.reduxFormFields = state.reduxFormFields.filter((_, index) => index !== action.payload);
        },

        // Reducer to reset form
        resetFormField(state) {
            state.reduxFormFields = [];
        },

        // Reducer to control remove form field
        addFormField(state) {
            // state.reduxFormFields = [...state.reduxFormFields, { conditions: [] }];
            state.reduxFormFields = [...state.reduxFormFields, new CustomFormDTO(0, "", 0, "", "", "", "", "", "", "", "", "", [])];
        },

        // Reducer to control remove form field
        updateFormField(state, action) {
            state.reduxFormFields[action.payload.index] = {
                ...state.reduxFormFields[action.payload.index],
                [action.payload.name]: action.payload.value
            };
            // state.reduxFormFields = state.reduxFormFields.map((field, i) =>
            //     i === action.payload.index ? { ...field, [action.payload.name]: action.payload.value } : field
            // );
        },

        addCondition(state, action) {
            state.reduxFormFields[action.payload.index] = {
                ...state.reduxFormFields[action.payload.index],
                conditions: [...state.reduxFormFields[action.payload.index].conditions, {}]
            };
        },
        updateCondition(state, action) {
            const condition = { ...state.reduxFormFields[action.payload.index1].conditions[action.payload.index2] };
            condition[action.payload.name] = action.payload.value;
            state.reduxFormFields[action.payload.index1].conditions[action.payload.index2] = condition;
        },
        moveUp(state, action) {
            state.reduxFormFields = swapElements(state.reduxFormFields, action.payload.index);
        },
        moveDown(state, action) {
            state.reduxFormFields = swapElements(state.reduxFormFields, action.payload.index);
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

const registrationFormFields = [
    {
        attributeName: "first_name_identifier_da_an",
        attributeType: "text",
        attributeCategory: "QUALITATIVE"
    },
    {
        attributeName: "last_name_identifier_da_an",
        attributeType: "text",
        attributeCategory: "QUALITATIVE"
    },
    {
        attributeName: "phone_identifier_da_an",
        attributeType: "text",
        attributeCategory: "QUALITATIVE"
    },
    {
        attributeName: "email_identifier_da_an",
        attributeType: "text",
        attributeCategory: "QUALITATIVE"
    },
    {
        attributeName: "password_identifier_da_an",
        attributeType: "text",
        attributeCategory: "QUALITATIVE"
    },
    {
        attributeName: "company_name_identifier_da_an",
        attributeType: "text",
        attributeCategory: "QUALITATIVE"
    },
    {
        attributeName: "product_client_id_identifier_da_an",
        attributeType: "text",
        attributeCategory: "QUALITATIVE"
    }
];

// Async calls from server
export function setFormFieldsDispatcher(datasetid, tableid, type, formField) {
    return async () => {
        if (formField) {
            dispatch(slice.actions.setFormFieldsSuccess(formField));
        } else if (type === "REGISTRATION") {
            dispatch(slice.actions.setFormFieldsSuccess(registrationFormFields));
        } else {
            try {
                const response = await api.get(`${getAllMetaDatabystage(datasetid, tableid, "BRONZE")}`);

                dispatch(slice.actions.setFormFieldsSuccess(response.data.result));
                dispatch(slice.actions.setParquetSchema());
            } catch (error) {
                console.error(error);
            }
        }
    };
}

export function removeFormField(index) {
    return (dispatch) => {
        dispatch(slice.actions.removeFormField(index));
    };
}

export function reduxUpdateFormField(name, value, index) {
    return (dispatch) => {
        dispatch(slice.actions.updateFormField({ name, value, index }));
    };
}

export function reduxAddFormField() {
    return (dispatch) => {
        dispatch(slice.actions.addFormField());
    };
}

export function reduxAddCondition(index) {
    return (dispatch) => {
        dispatch(slice.actions.addCondition({ index }));
    };
}

export function reduxUpdateCondition(index1, index2, name, value) {
    return (dispatch) => {
        dispatch(slice.actions.updateCondition({ index1, index2, name, value }));
    };
}

export function resetFormField() {
    return (dispatch) => {
        dispatch(slice.actions.resetFormField());
    };
}
export function moveUpField(index) {
    return (dispatch) => {
        dispatch(slice.actions.moveUp({ index }));
    };
}
export function moveDownField(index) {
    return (dispatch) => {
        dispatch(slice.actions.moveDown({ index }));
    };
}
export function setParquetSchema() {
    return (dispatch) => {
        dispatch(slice.actions.setParquetSchema());
    };
}
export const { resetState: resetformState } = slice.actions;

export default slice.reducer;
