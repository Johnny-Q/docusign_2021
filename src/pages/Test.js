import { useEffect } from "react";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

const Test = () => {
    esriConfig.apiKey = process.env.REACT_APP_ESRI_KEY;

    useEffect(() => {
        const map = new Map({
            basemap: "arcgis-topographic", // Basemap layer service
        });

        const view = new MapView({
            map: map,
            center: [-118.805, 34.027], // Longitude, latitude
            zoom: 13, // Zoom level
            container: "viewDiv", // Div element
        });
    }, []);

    return <div id="viewDiv" style={{width:"1000px", height:"1000px"}}></div>;
};

export default Test;
