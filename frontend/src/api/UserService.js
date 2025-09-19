import axios from "axios";

const API_URL = "http://localhost:5000/api/users/";

const getProfile = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL + "me", config);
  return response.data;
};

const updateProfile = async (profileData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(API_URL + "me", profileData, config);
  return response.data;
};

const UserService = {
  getProfile,
  updateProfile,
};

export default UserService;
