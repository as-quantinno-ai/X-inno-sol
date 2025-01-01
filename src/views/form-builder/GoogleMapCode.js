import { Skeleton, OutlinedInput, TextField, InputLabel } from "@mui/material";
import React, { useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Autocomplete, OverlayView } from "@react-google-maps/api";
import mapMarker from "../../assets/images/mapmarker.png";

const libraries = ["places"];

function GoogleMapCode() {
    const libRef = useRef(libraries);
    const { isLoaded } = useJsApiLoader({
        id: "script-loader",
        googleMapsApiKey: "AIzaSyC2B17VpxpsqV8gXn7MGVJtaQ-tvQuKh2E",
        libraries: libRef.current
    });
    const [map, setMap] = useState(/** @type google.maps.map */ null);
    const [zoom] = useState(15);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [center, setCenter] = useState({ lat: 24.8607, lng: 67.0011 });

    const [locationInfo, setLocationInfo] = useState({
        address: "",
        latitude: "",
        longitude: ""
    });
    /** @type React.MutableRefObject<HTMLInputElement> */
    // const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    // const destinationRef = useRef();

    if (!isLoaded) {
        return <Skeleton />;
    }

    const handlePlaceSelect = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            if (place && place.geometry && place.geometry.location) {
                setSelectedAddress(place.formatted_address);

                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                setLocationInfo((prevLocationInfo) => ({
                    ...prevLocationInfo,
                    latitude: lat.toFixed(6),
                    longitude: lng.toFixed(6)
                }));

                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === "OK") {
                        if (results[0]) {
                            const address = results[0].formatted_address;
                            setLocationInfo((prevLocationInfo) => ({
                                ...prevLocationInfo,
                                address
                            }));
                        } else {
                            setLocationInfo((prevLocationInfo) => ({
                                ...prevLocationInfo,
                                address: ""
                            }));
                        }
                    }
                });

                setSelectedPlace({ latitude: lat, longitude: lng });
                map.panTo(place.geometry.location);
            }
        }
    };

    const handleLoadMap = (map) => {
        setMap(map);
    };

    const handleLoadAutocomplete = (autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const overlayViewStyles = {
        position: "absolute",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    };

    const overlayViewContent = <img src={mapMarker} alt="Overlay" style={{ width: "20px", height: "20px" }} />;

    const overlayViewPosition = selectedPlace
        ? /*eslint-disable*/
          {
              lat: selectedPlace.latitude,
              lng: selectedPlace.longitude
          }
        : null;
    /*eslint-enable*/
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        setLocationInfo((prevLocationInfo) => ({
            ...prevLocationInfo,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
        }));

        if (window.google && window.google.maps && window.google.maps.Geocoder) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK") {
                    if (results[0]) {
                        const address = results[0].formatted_address;
                        setLocationInfo((prevLocationInfo) => ({
                            ...prevLocationInfo,
                            address
                        }));
                        setSelectedPlace({ latitude: lat, longitude: lng });
                        setSelectedAddress(address);
                    } else {
                        setLocationInfo((prevLocationInfo) => ({
                            ...prevLocationInfo,
                            address: ""
                        }));
                    }
                }
            });
        }
    };

    // const google = window.google;
    // eslint-disable-next-line-no-undef
    // const directionsService = new google.maps.DirectionsService();

    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: "1", height: "400px" }}>
                {isLoaded && (
                    <>
                        <Autocomplete
                            onLoad={(autocomplete) => handleLoadAutocomplete(autocomplete)}
                            onPlaceChanged={handlePlaceSelect}
                            sx={{ marginBottom: "10px", paddingLeft: "10px", paddingBottom: "10px" }}
                        >
                            <OutlinedInput
                                fullWidth
                                size="small"
                                type="text"
                                placeholder="Origin"
                                value={selectedAddress}
                                onChange={(event) => setSelectedAddress(event.target.value)}
                            />
                        </Autocomplete>
                        <GoogleMap
                            zoom={zoom}
                            center={center}
                            onLoad={(map) => handleLoadMap(map)}
                            mapContainerStyle={{
                                width: "100%",
                                height: "97%"
                            }}
                            onClick={handleMapClick}
                            // onLoad={loadHandler}
                            options={{
                                zoomControl: true,
                                mapTypeControl: false,
                                fullScreenControl: false
                            }}
                        >
                            {overlayViewPosition && (
                                <OverlayView position={overlayViewPosition} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                                    <div style={overlayViewStyles}>{overlayViewContent}</div>
                                </OverlayView>
                            )}
                        </GoogleMap>
                    </>
                )}
            </div>
            <div style={{ width: "20%", marginLeft: "auto" }}>
                <h4 style={{ paddingLeft: "10%" }}>Location Information</h4>
                <div style={{ width: "90%", margin: "auto" }}>
                    <div style={{ padding: "10px" }}>
                        <InputLabel htmlFor="address">Address: </InputLabel>
                        <TextField id="address" multiline rows={4} value={locationInfo.address} fullWidth variant="outlined" />
                    </div>
                    <div style={{ padding: "10px" }}>
                        <InputLabel htmlFor="latitude">Latitude: </InputLabel>
                        <TextField id="latitude" type="text" value={locationInfo.latitude} fullWidth variant="outlined" />
                    </div>
                    <div style={{ padding: "10px" }}>
                        <InputLabel htmlFor="longitude">Longitude: </InputLabel>
                        <TextField id="longitude" type="text" value={locationInfo.longitude} fullWidth variant="outlined" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoogleMapCode;
