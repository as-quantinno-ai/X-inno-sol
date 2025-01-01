import api from "views/api-configuration/api";
import { GetAccessToken, getAppPerm } from "views/api-configuration/default";
import { useEffect, useState } from "react";

const useFetchPermissions = (productClientDatasetId, roleNamee, shouldFetch) => {
    const [formData, setFormData] = useState({
        allowedScreens: [],
        allowedForms: [],
        allowedButtons: []
    });
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        if (shouldFetch) {
            const fetchPermissions = async () => {
                try {
                    const response = await api.get(getAppPerm(productClientDatasetId, roleNamee), {
                        headers: {
                            "Content-Type": "application/json",
                            ...GetAccessToken()
                        }
                    });

                    if (response.status === 200) {
                        const { allowedScreens, allowedForms, allowedButtons } = response.data.result;
                        setFormData({
                            allowedScreens,
                            allowedForms,
                            allowedButtons
                        });
                    } else {
                        console.error("Error fetching data:", response.message);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setIsFetched(true);
                }
            };

            fetchPermissions();
        }
    }, [productClientDatasetId, roleNamee, shouldFetch]);

    return { formData, isFetched };
};

export default useFetchPermissions;
