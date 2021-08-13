import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import esriConfig from "@arcgis/core/config";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Sketch from "@arcgis/core/widgets/Sketch";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { getAudit, getUserById, saveImage } from "../logic/helpers";

const ReviewMapComponent = ({ reviewData, webmapID }) => {
  const [user, setUser] = useState({});

  const div = useRef();
  esriConfig.apiKey = process.env.REACT_APP_ESRI_KEY;

  useEffect(() => {
    getUserById(reviewData.author).then(response => setUser(response.data));

    let layers = [];
    console.log(JSON.parse(reviewData.sketchLayer));
    for (const arr of Object.values(JSON.parse(reviewData.sketchLayer))) {
      let graphics = [];
      for (const graphicJSON of arr) {
        graphics.push(Graphic.fromJSON(graphicJSON));
      }
      layers.push(
        new FeatureLayer({
          source: graphics,
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

    const map = new WebMap({
      portalItem: {
        id: webmapID
      }
    });

    layers.forEach(layer => map.add(layer));

    const view = new MapView({
      map: map,
      center: [0, 0], // Longitude, latitude
      zoom: 5, // Zoom level
      container: div.current // Div element
    });

    setTimeout(() => {
      view
        .takeScreenshot({
          width: 200,
          height: 200
        })
        .then(screenshot => {
          // let imageElement = document.getElementById("screenshotImage");
          // imageElement.src = screenshot.dataUrl;
          // console.log(screenshot.dataUrl);
          saveImage(reviewData._id, screenshot.dataUrl);
        });
    }, 10000);

    // view.when(() => {
    //   view.takeScreenshot().then(screenshot => {
    //     // let imageElement = document.getElementById("screenshotImage");
    //     // imageElement.src = screenshot.dataUrl;
    //     console.log("!!!", screenshot.dataUrl);
    //   });
    // });

    return () => {
      view && view.destroy();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row", margin: "60px" }}>
      <div ref={div} style={{ width: "600px", height: "600px" }}></div>;
      <div style={{ marginLeft: "40px" }}>
        <div>
          <h1>Author</h1>
          <p>
            {user?.name} ({user?.email})
          </p>
        </div>
        <div>
          <h1>Comments</h1>
          <p>{reviewData.comments}</p>
        </div>
        <div>
          <h1>Files</h1>
          <a href={`https://docusign2021.herokuapp.com/${reviewData.file}`}>
            {reviewData.file}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReviewMapComponent;
