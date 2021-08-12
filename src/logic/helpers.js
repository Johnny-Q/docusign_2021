import axios from "axios";

export const getReviewers = async () => {
  const response = await axios.get("http://localhost:5000/api/get-reviewers", {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`
    }
  });

  return response.data;
};

export const startAudit = async (name, id, reviewers) => {
  return axios
    .post(
      "http://localhost:5000/api/start-audit",
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
