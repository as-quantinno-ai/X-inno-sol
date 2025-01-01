import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
// material-ui
import { alpha, styled, useTheme } from "@mui/material/styles";
// import { Box, Paper, Button, IconButton, FormControl, Typography } from "@mui/material";
import { Box, Paper, Button, IconButton, Typography } from "@mui/material";

// third-party
import { isString } from "lodash";
import { useDropzone } from "react-dropzone";

// assets
import CancelIcon from "@mui/icons-material/Cancel";
// import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DropZoneStyle = styled("div")(({ theme }) => ({
    width: "100%",
    height: 500,
    fontSize: 24,
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    "&:hover": { opacity: 0.72 }
}));

// eslint-disable-next-line react/prop-types
function UploadFile({ onFilesChange }) {
    const [files, setFiles] = useState([]);
    const theme = useTheme();

    const handleRemove = (file) => {
        const filteredItems = files.filter((_file) => _file !== file);
        setFiles(filteredItems);
    };

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const newFiles = acceptedFiles.map((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // const binaryStr = reader.result;
                };
                reader.readAsArrayBuffer(file);
                return Object.assign(file, {
                    preview: URL.createObjectURL(file)
                });
            });

            setFiles((prevFiles) => {
                const updatedFiles = [...prevFiles, ...newFiles];
                onFilesChange(updatedFiles);
                return updatedFiles;
            });
        },
        [onFilesChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        multiple: true
    });

    return (
        <>
            {files.map((file) => {
                const { name, preview } = file;

                const key = isString(file) ? file : name;

                return (
                    <Box
                        key={key}
                        sx={{
                            p: 0,
                            m: 0.5,
                            width: 64,
                            height: 64,
                            borderRadius: 0.25,
                            overflow: "hidden",
                            position: "relative"
                        }}
                    >
                        <Paper
                            variant="outlined"
                            component="img"
                            src={isString(file) ? file : preview}
                            sx={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", borderRadius: 1 }}
                        />
                        <Box sx={{ top: 6, right: 6, position: "absolute" }}>
                            <IconButton
                                size="small"
                                onClick={() => handleRemove(file)}
                                sx={{
                                    p: "1px",
                                    color: "common.white",
                                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                    "&:hover": {
                                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48)
                                    }
                                }}
                            >
                                <CancelIcon />
                            </IconButton>
                        </Box>
                    </Box>
                );
            })}

            <DropZoneStyle
                {...getRootProps()}
                sx={{
                    ...(isDragActive && { opacity: 0.72 })
                }}
            >
                <input {...getInputProps()} />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        gap: theme.spacing(2),
                        alignItems: "center",
                        textAlign: "left"
                    }}
                >
                    <CloudUploadIcon size="large" style={{ color: `${theme.palette.primary.main}` }} />
                    <Box>
                        <Typography>Drag & Drop or Select File</Typography>
                        <Typography sx={{ color: `${theme.palette.primary.main}` }}>
                            Drop files here or click to browse through your machine
                        </Typography>
                    </Box>
                </Box>
            </DropZoneStyle>
            <Button variant="contained"> Next </Button>
        </>
    );
}

UploadFile.prototype = {
    onFilesChange: PropTypes.func
};
const ItemAttachments = () => {
    // const handleFilesChange = (files) => {};
    const handleFilesChange = () => {};

    return (
        <Box sx={{ display: "flex" }}>
            <UploadFile onFilesChange={handleFilesChange} />
        </Box>
    );
};

export default ItemAttachments;
