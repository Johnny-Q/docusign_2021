import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import esriConfig from "@arcgis/core/config";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { fileUpload, getAudit, submitReview } from "../logic/helpers";

const ReviewMap = () => {
  let { id } = useParams();
  const [audit, setAudit] = useState({});
  const [reviewComments, setReviewComments] = useState("");
  const [file, setFile] = useState(null);

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

    getAudit(id).then(audit => setAudit(audit));

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
        id: id
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

    submitReview(
      audit._id,
      JSON.stringify(graphicsObject),
      reviewComments
    ).then(reviewDoc => {
      fileUpload(file, reviewDoc._id);
    });

    toggleRefresh(!refresh);
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>{audit?.name}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start"
        }}
      >
        <div
          ref={div}
          style={{ width: "700px", height: "600px", marginTop: "20px" }}
        ></div>
        <div
          style={{
            width: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "20px"
          }}
        >
          <h5>Comment for last graphic</h5>
          <textarea
            placeholder="Add comment to graphic"
            value={comments}
            onChange={e => {
              setComments(e.target.value);
            }}
            style={{ width: "90%", height: "60px" }}
          />
          <br />
          <button
            onClick={() => {
              recentGraphic.attributes.comments = comments;
            }}
          >
            save
          </button>
          <br />
          <h5>General comments</h5>
          <textarea
            placeholder="Comments about map data"
            value={reviewComments}
            onChange={e => {
              setReviewComments(e.target.value);
            }}
            style={{ width: "90%", height: "60px" }}
          />
          <br />
          <h5>Upload additional data</h5>
          <input
            type="file"
            name="data"
            onChange={e => setFile(e.target.files[0])}
            style={{ width: "100%" }}
          />
          <br />
          <br />

          <button onClick={exportGraphics}>Submit Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewMap;
