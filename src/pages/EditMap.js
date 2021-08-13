import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  getAudit,
  getReviewsForCycle,
  sendDocuments,
  submitModifications
} from "../logic/helpers";
import ReviewMapComponent from "../components/ReviewMapComponent";

const EditMap = () => {
  let { id } = useParams();
  const [audit, setAudit] = useState({});
  const [reviewDataArr, setReviewDataArr] = useState([]);

  useEffect(() => {
    getAudit(id).then(audit => {
      setAudit(audit);
      //   console.log(audit);
      getReviewsForCycle(audit.webmapID, -1).then(response => {
        console.log(response.data);
        setReviewDataArr(response.data);
      });
    });
    return () => {
      setAudit({});
      setReviewDataArr([]);
    };
  }, [id]);
  console.log(reviewDataArr);

  const handleReview = () => {
    submitModifications(audit._id).then(window.location.assign("/dashboard"));
  };
  const handleFinalize = () => {
    sendDocuments(audit._id).then(window.location.assign("/dashboard"));
  };

  return (
    <>
      <h1>{audit.name}</h1>
      <h3>Review cycle #{audit.cycle}</h3>
      <div>
        {reviewDataArr?.map((reviewData, index) => {
          return (
            <ReviewMapComponent
              reviewData={reviewData}
              webmapID={id}
              key={index}
            />
          );
        })}
      </div>
      <h3>
        For option 1: changes can be made through ArcGIS Online for a new review
        cycle
      </h3>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: "50px"
        }}
      >
        <button
          style={{ padding: "20px", fontSize: "1em" }}
          onClick={handleReview}
        >
          Start new review cycle
        </button>
        <button
          style={{ padding: "20px", fontSize: "1em" }}
          onClick={handleFinalize}
        >
          Finalize map for distribution
        </button>
      </div>
    </>
  );
};

export default EditMap;
