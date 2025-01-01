import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import { Grid, Typography, Box, Button, FormControl } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
// import { useDispatch } from "store";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import CatalogDumpDelete from "./CatalogDumpDialog";

const CatalogDumpForm = ({ datasetid, tableid, catalogsid, tablename }) => {
    const theme = useTheme();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCatalogId, setSelectedCatalogId] = useState(null);

    const handleDelete = (formid) => {
        setSelectedCatalogId(formid);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedCatalogId(null);
    };

    return (
        <MainCard
            content={false}
            title={
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                            Catalog Data Dump Operations ({tablename.replace(/_/g, " ")})
                        </Typography>
                    </Grid>
                </Grid>
            }
            style={{ width: "100%", height: "fit-content" }}
        >
            <Box sx={{ padding: 2, margin: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <Button
                                type="submit"
                                onClick={() => handleDelete("unprocessed")}
                                variant="contained"
                                startIcon={<DeleteIcon />}
                            >
                                Unprocessed Data
                            </Button>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <Button type="submit" onClick={() => handleDelete("processed")} variant="contained" startIcon={<DeleteIcon />}>
                                Processed Data
                            </Button>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <Button type="submit" onClick={() => handleDelete("Records")} variant="contained" startIcon={<DeleteIcon />}>
                                Delete Records
                            </Button>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <Button type="submit" onClick={() => handleDelete("Catalog")} variant="contained" startIcon={<DeleteIcon />}>
                                Catalog Dump
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
            {dialogOpen && (
                <CatalogDumpDelete
                    dialogOpen={dialogOpen}
                    datasetid={datasetid}
                    tableid={tableid}
                    catalogsid={catalogsid}
                    tablename={tablename}
                    type={selectedCatalogId}
                    handleDialogClose={handleDialogClose}
                />
            )}
        </MainCard>
    );
};

CatalogDumpForm.propTypes = {
    datasetid: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    catalogsid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tablename: PropTypes.string
};

export default CatalogDumpForm;
