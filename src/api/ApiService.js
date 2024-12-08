import api from "./AxiosInstance";

const getStores = async () => {
  return api.get("/stores");
};

const registerCustomer = async (customerData) => {
  return api.post("/customers", customerData);
};

const authenticateLoginCustomer = async (loginData) => {
  return api.post("/customers/auth/login", loginData);
};

const getEventImageActive = async () => {
  return api.get("/events/is_active/active");
};

const getCategories = async () => {
  return api.get("/categories");
};

const getListAllProducts = async () => {
  return api.get("/products");
};

const getFeatureProducts = async (categoryId) => {
  return api.get(`/products/category/${categoryId}`);
};

const addProductToCart = async (productData) => {
  return api.post("/carts", productData);
};

const removeProductFromCart = async (productData) => {
  return api.post(`/cart_details`, productData);
};

const addProductToFavorite = async (productData) => {
  return api.post("/product_favorites", productData);
};

const getInfoCustomerByCustomerId = async (customerId) => {
  return api.get(`/customers/${customerId}`);
};

const getFavoriteProductByCustomerId = async (customerId) => {
  return api.get(`/product_favorites/customer/${customerId}`);
};

const removeProductFromFavorite = async (productFavoriteId) => {
  return api.delete(`/product_favorites/${productFavoriteId}`);
};

const getNotification = async (customerId) => {
  return api.get(`/notifications?customer_id=${customerId}`);
}

const hideNotification = async (notificationId) => {
  return api.post(`/notifications/hide/${notificationId}`);
};


export default {
  registerCustomer,
  authenticateLoginCustomer,
  getCategories,
  getStores,
  getListAllProducts,
  getEventImageActive,
  getFeatureProducts,
  addProductToCart,
  removeProductFromCart,
  addProductToFavorite,
  getInfoCustomerByCustomerId,
  getFavoriteProductByCustomerId,
  removeProductFromFavorite,
  getNotification,
  hideNotification,
};
