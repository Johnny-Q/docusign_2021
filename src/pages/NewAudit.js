import { useEffect, useState } from "react";
import Select from "react-select";
import { currentUser } from "../logic/auth";
import { getReviewers, startAudit, useInterval } from "../logic/helpers";

// const Select = styled.select`
//   width: 100%;
//   padding: 10px 20px 10px 20px;
//   border-radius: 24px;
//   border: 2px solid black;
//   font-size: 1em;

//   ::-webkit-scrollbar {
//     display: none;
//   }
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// `;

const NewAudit = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [reviewers, setReviewers] = useState([]);
  const [reviewerOptions, setReviewerOptions] = useState([]);
  const [user, setUser] = useState({});

  useInterval(
    () => {
      currentUser().then(user => {
        setUser(user);
      });
    },
    !user.docusign ? 1000 : null
  );

  useEffect(() => {
    getReviewers().then(reviewers => {
      let reviewerList = [];
      reviewers.forEach(reviewer => {
        reviewerList.push({
          value: reviewer.email,
          label: `${reviewer.name} (${reviewer.email})`
        });
      });
      setReviewerOptions(reviewerList);
    });
    currentUser().then(user => setUser(user));
  }, []);

  const handleSubmit = () => {
    let reviewerEmails = [];
    reviewers.forEach(reviewer => {
      reviewerEmails.push(reviewer.value);
    });
    // console.log(reviewerEmails);
    startAudit(name, id, reviewerEmails);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: "25vw",
          minWidth: "250px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
      >
        <h1>New Audit</h1>
        <input
          style={{
            borderRadius: 99,
            padding: "10px 20px 10px 20px",
            width: "100%",
            fontSize: "1em",
            boxSizing: "border-box"
          }}
          type="text"
          placeholder="Audit Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <br />
        <input
          style={{
            borderRadius: 99,
            padding: "10px 20px 10px 20px",
            width: "100%",
            fontSize: "1em",
            boxSizing: "border-box"
          }}
          type="text"
          placeholder="ArcGIS Map PortalItem ID"
          value={id}
          onChange={e => setId(e.target.value)}
        />
        <label for="Reviewers" style={{ padding: "15px 0 5px 20px" }}>
          Reviewers
        </label>
        <div style={{ width: "100%" }}>
          <Select
            name="Reviewers"
            options={reviewerOptions}
            isMulti
            defaultValue={reviewers}
            onChange={setReviewers}
          />
        </div>

        <br />
        {user.docusign ? (
          <button
            style={{
              borderRadius: 99,
              padding: "10px 20px 10px 20px",
              textAlign: "center",
              fontSize: "1em",
              width: "100%"
            }}
            onClick={handleSubmit}
          >
            Create Audit
          </button>
        ) : (
          <button
            style={{
              borderRadius: 99,
              padding: "10px 20px 10px 20px",
              textAlign: "center",
              fontSize: "1em",
              width: "100%"
            }}
            onClick={() =>
              window.open(
                `https://account-d.docusign.com/oauth/auth?response_type=token&scope=signature&client_id=${process.env.REACT_APP_DOCUSIGN_INTEGRATION_KEY}&redirect_uri=${process.env.REACT_APP_DOCUSIGN_REDIRECT_URI}`
              )
            }
          >
            Connect DocuSign
          </button>
        )}
      </div>
    </div>
  );
};

export default NewAudit;
