import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MenuItem, Select } from "@mui/material";
import { getRelationalData } from "./UpdatedDataEntry";
const RelationalSelect = ({ field, func }) => {
    const [relationalData, setRelationalData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const catalogid = [
                    /* your catalogid values */
                ];
                const metadata = [
                    /* your metadata value */
                ];

                const data = await getRelationalData(catalogid, metadata);
                setRelationalData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <Select
            name={field.field_name}
            placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
            onChange={func}
            // eslint-disable-next-line no-undef
            style={{ ...styles.fieldStyle, width: "100%", marginTop: "5px" }}
            disabled={field.disabled === "true"}
            required={field.required === "true"}
        >
            <MenuItem value="">----------</MenuItem>
            {relationalData.map((eachParqRec) => (
                <MenuItem key={eachParqRec.uuid_identifier_da_an_v1} value={eachParqRec.uuid_identifier_da_an_v1}>
                    {/* {Object.values(removeUuid(eachParqRec)).map((colValue) => `${colValue} `)} */}
                </MenuItem>
            ))}
        </Select>
    );
};

RelationalSelect.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func
    // state: PropTypes.object
};

export default RelationalSelect;
