import axios from "axios";

export const login = (email, password) => {
  return axios
    .post("https://docusign2021.herokuapp.com/api/login", {
      email: email,
      password: password
    })
    .then(response => {
      window.localStorage.setItem("token", response.data.token);
      window.location.assign("/dashboard");
    })
    .catch(error => {
      console.log(error);
    });
};

export const register = (name, email, password) => {
  return axios
    .post("https://docusign2021.herokuapp.com/api/register", {
      name: name,
      email: email,
      password: password
    })
    .then(response => {
      window.location.assign("/login");
    })
    .catch(error => {
      console.log(error);
    });
};

export const verifyToken = async token => {
  const response = await axios.get(
    "https://docusign2021.herokuapp.com/api/verifytoken",
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );

  return response.status === 204;
};

export const logout = () => {
  window.localStorage.removeItem("token");
};

export const currentUser = async () => {
  const response = await axios.get(
    "https://docusign2021.herokuapp.com/api/get-user",
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }
  );

  return response.data;
};
