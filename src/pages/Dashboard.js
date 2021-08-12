import { useEffect, useState } from "react";
import greenCircles from "../assets/greencircles.png";
import axios from "axios";
import { currentUser } from "../logic/auth";

const AuditComponent = ({ audit, user }) => {
  const actionText = () => {
    if (
      audit.facilitator === user._id &&
      audit.status === "awaiting revisions"
    ) {
      return "Action required: pending revisions";
    } else if (
      audit.facilitator === user._id &&
      audit.status === "awaiting responses"
    ) {
      return "Awaiting reviews";
    } else if (
      audit.cycles[audit.cycle - 1]?.reviews.includes(
        review => review.author === user._id
      ) === undefined
    ) {
      return "Action required: Review map";
    } else if (
      audit.cycles[audit.cycle - 1]?.reviews.includes(
        review => review.author === user._id
      ) &&
      audit.status !== "completed"
    ) {
      return "Awaiting map modifications";
    } else {
      return "Audit completed";
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        borderRadius: "32px",
        border: "2px solid lightgray",
        // backgroundColor: "rgba(0,0,0,0.1)",
        padding: "5px 20px 0 20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}
      >
        <h3>{audit.name}</h3>
        <p>Review cycle #{audit.cycle}</p>
      </div>
      <p style={{ margin: 0 }}>
        Role: {audit.facilitator === user._id ? "Facilitator" : "Reviewer"}
      </p>
      <h4>{actionText()}</h4>
    </div>
  );
};

const Dashboard = () => {
  const [ongoingAudits, setOngoingAudits] = useState([]);
  const [pastAudits, setPastAudits] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    currentUser().then(user => setUser(user));

    axios
      .get("http://localhost:5000/api/get-audits", {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
      })
      .then(response => {
        let ongoing = [];
        let past = [];
        response.data.forEach(audit => {
          if (audit.status !== "completed") {
            ongoing.push(audit);
          } else {
            past.push(audit);
          }
        });
        setOngoingAudits(ongoing);
        setPastAudits(past);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "45vw",
          minWidth: "300px",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            width: "65%",
            minWidth: "240px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginTop: "40px"
          }}
        >
          <h1>Your Audits</h1>
          {ongoingAudits.length === 0 ? (
            <>You do not have any ongoing audits</>
          ) : (
            <>
              {ongoingAudits.map(ongoingAudit => (
                <AuditComponent audit={ongoingAudit} user={user} />
              ))}
            </>
          )}
          <br />
          <br />
          <h1>Past Audits</h1>
          {pastAudits.length === 0 ? (
            <>You do not have any past audits</>
          ) : (
            <>
              {pastAudits.map(pastAudit => (
                <AuditComponent audit={pastAudit} user={user} />
              ))}
            </>
          )}
        </div>
        <div
          style={{
            width: "35%",
            minWidth: "240px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "100px"
          }}
        >
          <img
            src={greenCircles}
            style={{ height: "200px", width: "183px" }}
            alt="Green circles"
          />
          <button
            style={{
              borderColor: "#137547",
              borderRadius: "15px",
              padding: "15px",
              backgroundColor: "white",
              fontWeight: "bold",
              marginTop: "20px",
              cursor: "pointer"
            }}
            onClick={() => window.location.assign("/newaudit")}
          >
            Start a New Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
