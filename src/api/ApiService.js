import api from "./AxiosInstance";

// Store
const getStores = async () => {
  return api.get("/stores");
};

// Login, logout Customer
const registerCustomer = async (customerData) => {
  return api.post("/customers", customerData);
};

const authenticateLoginCustomer = async (loginData) => {
  return api.post("/customers/auth/login", loginData);
};

const logout = async () => {
  return api.post("customers/auth/logout");
};

// Event
const getEventImageActive = async () => {
  return api.get("/events/is-active/active");
};

// Category, Product, Favorite Product
const getCategories = async () => {
  return api.get("/categories");
};

const getListAllProducts = async () => {
  return api.get("/products");
};

const searchProducts = async (keyword) => {
  return api.get(`/products/search?keyword=${keyword}`);
};

const getFeatureProducts = async (categoryId) => {
  return api.get(`/products/category/${categoryId}`);
};

const addProductToFavorite = async (productData) => {
  return api.post("/product_favorites", productData);
};

const getFavoriteProductByCustomerId = async (customerId) => {
  return api.get(`/product_favorites/customer/${customerId}`);
};

const removeProductFromFavorite = async (productFavoriteId) => {
  return api.delete(`/product_favorites/${productFavoriteId}`);
};

// Customer
const getInfoCustomerByCustomerId = async (customerId) => {
  return api.get(`/customers/${customerId}`);
};

// Cart, Cart Detail
const addProductToCart = async (productData) => {
  return api.post("/carts", productData);
};

const deleteItemInCart = async (cartDetailId) => {
  return api.delete(`/cart_details/${cartDetailId}/delete-item-in-cart`);
};

// Review
const writeReviewProduct = async (reviewData) => {
  return api.post("/reviews", reviewData);
};

const getReviewByProductId = async (productId) => {
  return api.get(`/reviews/product/${productId}`);
};

// Notification
const getNotification = async (customerId) => {
  return api.get(`/notifications?customer_id=${customerId}`);
};

const hideNotification = async (notificationId, data) => {
  return api.post(`/notifications/hide/${notificationId}`, data);
};

export default {
  registerCustomer,
  authenticateLoginCustomer,
  logout,
  getCategories,
  getStores,
  getListAllProducts,
  searchProducts,
  getEventImageActive,
  getFeatureProducts,
  addProductToCart,
  deleteItemInCart,
  writeReviewProduct,
  getReviewByProductId,
  addProductToFavorite,
  getInfoCustomerByCustomerId,
  getFavoriteProductByCustomerId,
  removeProductFromFavorite,
  getNotification,
  hideNotification,
};
