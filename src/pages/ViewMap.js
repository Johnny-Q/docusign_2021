import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { getAudit, getReviewsForCycle } from "../logic/helpers";
import ViewMapComponent from "../components/ViewMapComponent";
import esriConfig from "@arcgis/core/config";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";

const ViewMap = () => {
  let { id } = useParams();
  const [audit, setAudit] = useState({});
  const [reviewDataArr, setReviewDataArr] = useState([]);
  const div = useRef();
  esriConfig.apiKey = process.env.REACT_APP_ESRI_KEY;

  useEffect(() => {
    getAudit(id).then(audit => {
      setAudit(audit);
      //   console.log(audit);
      getReviewsForCycle(audit.webmapID, -1).then(response => {
        console.log(response.data);
        setReviewDataArr(response.data);
      });
    });

    const map = new WebMap({
      portalItem: {
        id: id
      }
    });

    const view = new MapView({
      map: map,
      center: [0, 0], // Longitude, latitude
      zoom: 5, // Zoom level
      container: div.current // Div element
    });

    return () => {
      setAudit({});
      setReviewDataArr([]);
      view && view.destroy();
    };
  }, [id]);
  console.log(reviewDataArr);
  return (
    <>
      <h1>{audit.name}</h1>
      <h3>Review cycle #{audit.cycle}</h3>
      <h2>Primary Map</h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div ref={div} style={{ width: "600px", height: "600px" }}></div>
      </div>

      <h2>Modification Requests</h2>
      <div>
        {reviewDataArr?.map((reviewData, index) => {
          return (
            <ViewMapComponent
              reviewData={reviewData}
              webmapID={id}
              key={index}
            />
          );
        })}
      </div>
    </>
  );
};

export default ViewMap;
