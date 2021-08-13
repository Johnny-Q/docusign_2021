import axios from "axios";
import { useEffect, useRef } from "react";

export const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};

export const getReviewers = async () => {
  const response = await axios.get(
    "https://docusign2021.herokuapp.com/api/get-reviewers",
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );
  return response.data;
};

export const getAuditStatus = async auditID => {
  const response = await axios.post(
    "https://docusign2021.herokuapp.com/api/get-audit-status",
    {
      auditID: auditID
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );
  return response.data;
};

export const startAudit = async (name, id, reviewers) => {
  return axios
    .post(
      "https://docusign2021.herokuapp.com/api/start-audit",
      {
        name: name,
        id: id,
        reviewers: reviewers
      },
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
      }
    )
    .then(response => {
      window.location.assign("/dashboard");
    })
    .catch(error => {
      console.log(error);
    });
};

export const getAudit = async id => {
  const response = await axios.post(
    "https://docusign2021.herokuapp.com/api/get-audit-by-webmapid",
    {
      id: id
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );

  return response.data;
};

export const submitReview = async (audit, sketchLayer, comments) => {
  const response = await axios.post(
    "https://docusign2021.herokuapp.com/api/submit-review",
    {
      auditID: audit,
      sketchLayer: sketchLayer,
      comments: comments
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );

  return response.data;
};

export const fileUpload = async (file, reviewID) => {
  if (file) {
    let data = new FormData();
    data.append("file", file, file.name);
    data.append("reviewID", reviewID);
    return axios({
      method: "post",
      url: "https://docusign2021.herokuapp.com/api/file-upload",
      headers: {
        authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "content-type": "multipart/form-data"
      },
      data: data
    })
      .then(() => {
        window.location.assign("/dashboard");
      })
      .catch(error => console.log(error));
  } else {
    window.location.assign("/dashboard");
  }
};

export const saveAccessToken = async (accessToken, userToken) => {
  return axios.post(
    "https://docusign2021.herokuapp.com/api/oauth",
    {
      accessToken: accessToken
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );
};

export const getReviewsForCycle = async (id, cycle) => {
  return axios.post(
    "https://docusign2021.herokuapp.com/api/get-reviews-for-cycle",
    {
      id: id,
      cycle: cycle
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );
};

export const getUserById = async id => {
  return axios.get(
    `https://docusign2021.herokuapp.com/api/get-user-by-id?id=${id}`
  );
};

export const saveImage = async (id, image) => {
  return axios.post(
    "https://docusign2021.herokuapp.com/api/save-image",
    {
      reviewID: id,
      imageUrl: image
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );
};

export const submitModifications = async auditID => {
  return axios.post(
    "https://docusign2021.herokuapp.com/api/submit-modifications",
    {
      auditID: auditID
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );
};

export const sendDocuments = async auditID => {
  return axios.post(
    "https://docusign2021.herokuapp.com/api/send-documents",
    {
      auditID: auditID
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );
};
