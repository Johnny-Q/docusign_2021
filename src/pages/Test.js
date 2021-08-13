import { useEffect, useRef, useState } from "react";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import axios from "axios";

const Test = () => {
  const [file, setFile] = useState(null);
  return (
    <>
      <input
        type="file"
        name="data"
        onChange={e => {
          setFile(e.target.files[0]);
          console.log(e.target.files[0]);
        }}
        style={{ width: "100%" }}
      />
      <button
        onClick={async () => {
          let data = new FormData();
          try {
            data.append("file", file, "test_file");
            data.append("text", "text value");
            let resp = await axios({
              method: "post",
              url: "https://docusign2021.herokuapp.com/api/file-upload",
              headers: {
                authorization: `Bearer ${window.localStorage.getItem("token")}`,
                "content-type": "multipart/form-data"
              },
              data: data
            });
            console.log(resp.data);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        upload
      </button>
    </>
  );
};

export default Test;
