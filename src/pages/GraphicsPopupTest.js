import { useEffect, useRef, useState } from "react";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate";

const GraphicsPopupTest = () => {
  const div = useRef();
  esriConfig.apiKey = process.env.REACT_APP_ESRI_KEY;
  console.log(esriConfig.apiKey);

  const editingLayer = new GraphicsLayer();
  const [refresh, toggleRefresh] = useState(false);
  const [graphicsObject, setGraphicsObject] = useState({
    point: [],
    polyline: [],
    polygon: [],
    rectangle: [],
    circle: []
  });
  const [graphicsArr, setGraphicsArr] = useState([]);
  const [recentGraphic, setRecentGraphic] = useState(null);
  const [comments, setComments] = useState("");

  useEffect(() => {
    console.log("use effect");
    let tempGraphicsObject = {
      point: [],
      polyline: [],
      polygon: [],
      rectangle: [],
      circle: []
    };
    let tempGraphicsArr = [];
    let layers = [];
    for (const arr of Object.values(graphicsObject)) {
      if (arr.length > 0) {
        console.log(arr);
        layers.push(
          new FeatureLayer({
            source: arr,
            objectIdField: "oid",
            fields: [
              {
                name: "oid",
                type: "oid"
              },
              {
                name: "comments",
                type: "string"
              }
            ],
            popupTemplate: {
              title: "Revision Comments",
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
            }
          })
        );
      }
    }
    // const map = new Map({
    //   basemap: "arcgis-topographic",
    //   layers: [...layers, editingLayer]
    // });

    // test web map
    const map = new WebMap({
      portalItem: {
        id: "f9185de6c1914e81ad34ea892097ce17"
      }
    });

    //add layers on top of webmap
    layers.forEach(layer => {
      map.layers.add(layer);
    });

    map.layers.add(editingLayer);

    const view = new MapView({
      map: map,
      center: [0, 0], // Longitude, latitude
      zoom: 5, // Zoom level
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
          event.graphic.attributes = {
            oid: event.graphic.uid
          };
          tempGraphicsObject[event.tool].push(event.graphic);
          setGraphicsObject({
            point: [...graphicsObject.point, ...tempGraphicsObject.point],
            polyline: [
              ...graphicsObject.polyline,
              ...tempGraphicsObject.polyline
            ],
            polygon: [...graphicsObject.polygon, ...tempGraphicsObject.polygon],
            rectangle: [
              ...graphicsObject.rectangle,
              ...tempGraphicsObject.rectangle
            ],
            circle: [...graphicsObject.circle, ...tempGraphicsObject.circle]
          });
          tempGraphicsArr.push(event.graphic);
          setGraphicsArr([...graphicsArr, tempGraphicsArr]);
          setRecentGraphic(event.graphic);
          // temp_graphics.push(event.graphic);
          // setGraphicsArr([...graphicsArr, ...temp_graphics]);
          // console.log(graphicsArr);
        }
      });
      sketch.on("update", event => {
        if (event.state === "complete") {
        }
      });

      view.ui.add(sketch, "top-right");
    });

    return () => {
      view && view.destroy();
    };
  }, [refresh]);

  function exportGraphics() {
    console.log(JSON.stringify(graphicsObject));
    toggleRefresh(!refresh);
  }
  return (
    <>
      <div ref={div} style={{ width: "900px", height: "900px" }}></div>

      <button onClick={exportGraphics}>Export</button>

      <textarea
        placeholder="add comment to graphic"
        value={comments}
        onChange={e => {
          setComments(e.target.value);
        }}
      ></textarea>
      <button
        onClick={() => {
          recentGraphic.attributes.comments = comments;
        }}
      >
        save
      </button>

      <br />
      <br />
    </>
  );
};

export default GraphicsPopupTest;
