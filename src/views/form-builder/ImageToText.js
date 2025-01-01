import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { Box, Grid, Card, CardActionArea, CardMedia, IconButton, Typography } from "@mui/material";
// third-party
import { isString } from "lodash";
import { useDropzone } from "react-dropzone";

// assets
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api from "views/api-configuration/api";
import { postOcrImage } from "views/api-configuration/default";
import FormFooterButtons from "views/new-app/components/FormButtons";

const DropZoneStyle = styled("div")(({ theme }) => ({
    width: "100%",
    height: "30%",
    fontSize: 24,
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(0.5),
    border: 1,
    borderWidth: 2,
    borderRadius: theme.shape.borderRadius,
    "&:hover": { opacity: 0.72 }
}));

function UploadFile({ handleImageTextValue, formattrib, handleUploadImagesModal }) {
    const theme = useTheme();

    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);

    const handleRemove = (file) => {
        const filteredItems = files.filter((_file) => _file !== file);
        setFiles(filteredItems);
        if (file.preview === selectedFile) {
            setSelectedFile(null);
        }
    };

    const handleSubmit = async () => {
        if (!files || files.length === 0) {
            console.warn("No files selected for upload.");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("image_files", file);
        });
        formData.append("attributes", formattrib);

        const response = await api.post(postOcrImage, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        handleImageTextValue(response);
        if (response?.status === 200) {
            handleUploadImagesModal();
        }
    };

    const handleDrop = useCallback((acceptedFiles) => {
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
            return updatedFiles;
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        multiple: true
    });

    return (
        <Grid container spacing={0}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: files.length > 0 ? theme.spacing(2) : null,
                    alignItems: "center",
                    height: files.length > 0 ? "auto" : "60vh",
                    width: "100%",
                    gridTemplateColumns: files.length > 0 ? "repeat(3, 1fr)" : "none"
                }}
            >
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
                            <Typography sx={{ fontWeight: "bold" }}>Drag & Drop or Select File</Typography>
                            <Typography sx={{ color: `${theme.palette.primary.main}` }}>
                                Drop files here or click to browse through your machine
                            </Typography>
                        </Box>
                    </Box>
                </DropZoneStyle>
            </Box>
            {files.length > 0 && (
                <>
                    <Grid xs={6}>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                width: 400,
                                marginTop: "5%",
                                margin: "8%",
                                mb: 10
                            }}
                        >
                            {files.map((file) => {
                                const { name, preview } = file;
                                // eslint-disable-next-line no-unused-vars
                                const key = isString(file) ? file : name;

                                return (
                                    <>
                                        <Card
                                            sx={{
                                                p: 0,
                                                m: 0.5,
                                                width: 100,
                                                height: 100,
                                                borderRadius: 0.25,
                                                overflow: "hidden",
                                                position: "relative"
                                            }}
                                        >
                                            <IconButton
                                                sx={{ position: "absolute", top: 2, right: 5, zIndex: 1 }}
                                                onClick={() => {
                                                    handleRemove(file);
                                                }}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                            <CardActionArea
                                                onClick={() => {
                                                    setSelectedFile(preview);
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={isString(file) ? file : preview}
                                                    alt="Card Image"
                                                    sx={{ height: 100 }}
                                                />
                                            </CardActionArea>
                                        </Card>
                                    </>
                                );
                            })}
                        </Box>
                    </Grid>
                    <Grid xs={6}>
                        <Box
                            sx={{
                                position: "absolute",
                                width: "40%",
                                height: "70%",
                                top: "15%",
                                left: "55%",
                                right: "10%",
                                bottom: "10%",
                                bgcolor: "background.paper",
                                borderRadius: "8px",
                                borderWidth: "2px",
                                borderColor: "black",
                                p: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: 1
                            }}
                        >
                            {!selectedFile && <Typography>Select Image for Preview</Typography>}
                            {selectedFile && <img src={selectedFile} alt="Selected preview" style={{ width: "100%", height: "100%" }} />}
                        </Box>
                    </Grid>
                </>
            )}
            <Grid xs={12}>
                <Box
                    sx={{
                        position: "absolute",
                        width: "50%",
                        height: "10%",
                        top: "90%",
                        bottom: "0%",
                        left: "25%",
                        right: "45%",
                        p: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <FormFooterButtons onSubmit={handleSubmit} onCancel={handleUploadImagesModal} />
                </Box>
            </Grid>
        </Grid>
    );
}

UploadFile.propTypes = {
    formattrib: PropTypes.string,
    handleImageTextValue: PropTypes.func,
    handleUploadImagesModal: PropTypes.func
};

const UploadImages = ({ formattrib, handleImageTextValue, handleUploadImagesModal }) => (
    <Box sx={{ display: "flex" }}>
        <UploadFile handleImageTextValue={handleImageTextValue} formattrib={formattrib} handleUploadImagesModal={handleUploadImagesModal} />
    </Box>
);

UploadImages.propTypes = {
    formattrib: PropTypes.string,
    handleImageTextValue: PropTypes.func,
    handleUploadImagesModal: PropTypes.func
};
export default UploadImages;
