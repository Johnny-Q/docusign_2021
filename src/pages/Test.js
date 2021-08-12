import { useEffect, useRef, useState } from "react";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Layer from "@arcgis/core/layers/Layer";
import PortalItem from "@arcgis/core/portal/PortalItem"
const Test = () => {
    const div = useRef();
    esriConfig.apiKey = process.env.REACT_APP_ESRI_KEY;
    console.log(esriConfig.apiKey);
    const graphicsLayer = new GraphicsLayer();

    const [toggle, setToggle] = useState(false);
    const [layers, setLayers] = useState([graphicsLayer]);
    const [layerId, setLayerId] = useState("");
    const [graphicsJSON, setGraphicsJSON] = useState("");

    const map = new Map({
        basemap: "arcgis-topographic"
    })

    useEffect(() => {

        const view = new MapView({
            map: map,
            center: [-118.80543,34.02700], // Longitude, latitude
            zoom: 10, // Zoom level
            container: div.current, // Div element
        });

        view.when(() => {
            const sketch = new Sketch({
                layer: graphicsLayer,
                view: view,
                // graphic will be selected as soon as it is created
                creationMode: "update",
            });

            view.ui.add(sketch, "top-right");
        });

        return () => {
            view && view.destroy();
        };
    }, [toggle]);

    return (
        <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "center" }}>
            <div>
                <h1>Map builder</h1>
                <input type="text" placeholder="feature layer id" value={layerId} onChange={(e) => { setLayerId(e.target.value) }} />
                <button onClick={async () => {
                    // const layer = await Layer.fromPortalItem(new PortalItem({
                    //     "id": layerId,
                    // }));

                    // console.log(layer);
                    const layer = new FeatureLayer({
                        id: "b684f4461e5446efa7c0c1672739896f",
                        apiKey: esriConfig.apiKey
                    });

                    map.add(layer);
                }}>
                    load feature layer
                </button>
                <textarea type="text" placeholder="graphics json array" value={graphicsJSON} onChange={(e) => { setGraphicsJSON(e.target.value) }}></textarea>
                <button onClick={() => {
                    setToggle(!toggle);
                }}>Update Map</button>
            </div>
            <div ref={div} style={{ width: "500px", height: "500px" }}></div>
            <button
                onClick={() => {
                    for (const graphic of graphicsLayer.graphics.toArray()) {
                        console.log(JSON.stringify(graphic.toJSON()));
                    }
                }}
            >
                Export Graphics Layer
            </button>
        </div>
    );
};

export default Test;
