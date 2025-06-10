import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/auth/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callLogin = (username, password) => {
  return axios.post("/api/v1/auth/login", { username, password });
};

export const callFetchAccount = () => {
  return axios.get("/api/v1/auth/account");
};

export const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};

export const callFetchListUser = (query) => {
  // current=1&pageSize=3
  return axios.get(`/api/v1/user?${query}`);
};

export const callCreateAUser = (fullName, password, email, phone) => {
  return axios.post("/api/v1/user", { fullName, password, email, phone });
};

export const callBulkCreateUser = (data) => {
  return axios.post("/api/v1/user/bulk-create", data);
};

export const callUpdateUser = (_id, fullName, phone) => {
  return axios.patch(`/api/v1/user/${_id}`, { fullName, phone });
};

export const callDeleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
};

///////////////////////

export const callFetchListBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};

export const callFetchCategory = () => {
  return axios.get("/api/v1/database/category");
};

export const callCreateBook = (
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  return axios.post("/api/v1/book", {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  });
};

export const callUpdateBook = (
  id,
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  return axios.patch(`/api/v1/book/${id}`, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  });
};

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

export const callDeleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`);
};

export const callFetchBookById = (id) => {
  return axios.get(`api/v1/book/${id}`);
};

export const callPlaceOrder = (data) => {
  return axios.post("/api/v1/order", {
    ...data,
  });
};

export const callOrderHistory = () => {
  return axios.get("/api/v1/history");
};

export const callUpdateAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};

export const callUpdateUserInfo = (_id, phone, name, avatar) => {
  return axios.patch(`/api/v1/user/${_id}`, {
    phone,
    name,
    avatar,
  });
};

export const callUpdatePassword = (id, oldpass, newpass) => {
  return axios.post(`/api/v1/user/change-password/${id}`, {
    password: oldpass,
    newPassword: newpass,
  });
};

export const callFetchDashboard = () => {
  return axios.get("/api/v1/database/dashboard");
};

export const callFetchListOrder = (query) => {
  return axios.get(`/api/v1/order?${query}`);
};

export const callFetchListBanks = () => {
  return axios.get("api/v1/getAllBanks");
};

export const callPayment = (payload) => {
  return axios.post("/payment/payment-url", payload);
};

export const callVnPayReturn = (queryString) => {
  return axios.get(`api/v1/payment/vnpay-return/${queryString}`);
};

export const callVnPayIpn = (queryString) => {
  return axios.get(`/payment/vnpay-ipn/${queryString}`);
};
