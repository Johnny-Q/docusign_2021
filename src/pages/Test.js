import { useEffect, useRef, useState } from "react";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const Test = () => {
  const div = useRef();
  esriConfig.apiKey = process.env.REACT_APP_ESRI_KEY;
  console.log(esriConfig.apiKey);

  const editingLayer = new GraphicsLayer();
  const [toggle, setToggle] = useState(false);
  const [layerConfigs, setLayerConfigs] = useState([]);
  const [layerId, setLayerId] = useState("");
  const [graphicsString, setGraphicsString] = useState("");
  const [recentGraphic, setRecentGraphic] = useState(null);
  const [comments, setComments] = useState("");

  const [graphics, setGraphics] = useState([]);

  function importGraphics() {
    setToggle(!toggle);
  }

  useEffect(() => {
    let layers = [];
    for (let config of layerConfigs) {
      layers.push(new FeatureLayer(config));
    }
    try {
      let graphicsJSON = JSON.parse(graphicsString);
      for (const graphic of graphicsJSON) {
        console.log(graphic);
        editingLayer.add(Graphic.fromJSON(graphic));
      }
    } catch (err) {}

    const map = new Map({
      basemap: "arcgis-topographic",
      layers: [...layers, editingLayer]
    });

    const view = new MapView({
      map: map,
      center: [-118.80543, 34.027], // Longitude, latitude
      zoom: 10, // Zoom level
      container: div.current // Div element
    });

    view.when(() => {
      const sketch = new Sketch({
        layer: editingLayer,
        view: view,
        // graphic will be selected as soon as it is created
        creationMode: "update"
      });

      sketch.on("create", event => {
        if (event.state === "complete") {
          setRecentGraphic(event.graphic);
          console.log(recentGraphic);
          console.log(event.graphic.toJSON());
        }
      });
      sketch.on("update", event => {
        if (event.state === "complete") {
          console.log("done");
        }
      });

      view.ui.add(sketch, "top-right");
    });
    return () => {
      view && view.destroy();
    };
  }, [toggle, layerConfigs]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div>
        <h1>Map builder</h1>
        <input
          type="text"
          placeholder="feature layer id"
          value={layerId}
          onChange={e => {
            setLayerId(e.target.value);
          }}
        />
        <button
          onClick={() => {
            setLayerConfigs([
              ...layerConfigs,
              {
                portalItem: {
                  // autocasts as esri/portal/PortalItem
                  id: "b684f4461e5446efa7c0c1672739896f",
                  // id: layerId,
                  apiKey: esriConfig.apiKey
                }
              }
            ]);
          }}
        >
          load feature layer
        </button>
        <textarea
          type="text"
          placeholder="graphics json array"
          value={graphicsString}
          onChange={e => {
            setGraphicsString(e.target.value);
          }}
        ></textarea>
        <button onClick={importGraphics}>Update Map</button>
      </div>
      <div ref={div} style={{ width: "1000px", height: "1000px" }}></div>
      <button
        onClick={() => {
          console.log("reee");
          console.log(editingLayer);
          let temp = [];
          for (const graphic of editingLayer.graphics) {
            temp.push(graphic.toJSON());
          }
          console.log(JSON.stringify(temp));
        }}
      >
        Export Graphics Layer
      </button>
      <textarea
        placeholder="add comment to graphic"
        value={comments}
        onChange={e => {
          setComments(e.target.value);
        }}
      ></textarea>
      <button
        onClick={() => {
          console.log(recentGraphic);
          editingLayer.remove(recentGraphic);
          console.log("recent graphic", recentGraphic);
          recentGraphic.attributes = {
            Comments: comments
          };
          recentGraphic.popupTemplate = {
            title: "fuck",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "comments",
                    label: "comments"
                  }
                ]
              }
            ]
          };
          console.log(JSON.stringify(recentGraphic.toJSON()));
          editingLayer.add(recentGraphic);
        }}
      >
        save
      </button>
    </div>
  );
};

export default Test;
