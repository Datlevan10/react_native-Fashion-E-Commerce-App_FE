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

const getProductByProductId = async (productId) => {
  return api.get(`/products/${productId}`);
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

const getProductInCartDetailByCustomerId = async (customerId) => {
  return api.get(
    `/cart_details/customer/${customerId}/not-ordered-cart_details`
  );
};

const deleteItemInCart = async (cartDetailId) => {
  return api.delete(`/cart_details/${cartDetailId}/delete-item-in-cart`);
};

// Review
const writeReviewProduct = async (reviewData) => {
  return api.post("/reviews", reviewData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const filterReviewsByStar = async (star, productId) => {
  return api.get(
    `/reviews/filter-by-star?stars_review=${star}&product_id=${productId}`
  );
};

const filterReviewByHighest = async (productId) => {
  return api.get(`/reviews/filter-by-highest?product_id=${productId}`);
};

const filterReviewByLowest = async (productId) => {
  return api.get(`/reviews/filter-by-lowest?product_id=${productId}`);
};

const filterReviewByNewest = async (productId) => {
  return api.get(`/reviews/filter-by-newest?product_id=${productId}`);
};

const filterReviewByOldest = async (productId) => {
  return api.get(`/reviews/filter-by-oldest?product_id=${productId}`);
};

const filterReviewByMedia = async (productId) => {
  return api.get(`/reviews/filter-by-media?product_id=${productId}`);
};

const filterReviewByMostHelpFul = async (productId) => {
  return api.get(`/reviews/filter-by-most-helpful?product_id=${productId}`);
};

const getAllReviews = async () => {
  return api.get("/reviews");
};

const getReviewByProductId = async (productId) => {
  return api.get(`/reviews/product/${productId}`);
};

const getReviewByProductIdLimit = async (productId, limit) => {
  return api.get(
    `/reviews/product/${productId}/limit?limit=${parseInt(limit, 10)}`
  );
};

const postHelpfulCount = async (reviewId) => {
  return api.post("/reviews/post-helpful-count", { review_id: reviewId });
};

// Report Review
const reportReview = async (data) => {
  return api.post(`/report_reviews`, data);
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
  getProductByProductId,
  searchProducts,
  getEventImageActive,
  getFeatureProducts,
  addProductToCart,
  getProductInCartDetailByCustomerId,
  deleteItemInCart,
  writeReviewProduct,
  filterReviewsByStar,
  filterReviewByHighest,
  filterReviewByLowest,
  filterReviewByNewest,
  filterReviewByOldest,
  filterReviewByMedia,
  filterReviewByMostHelpFul,
  postHelpfulCount,
  getAllReviews,
  getReviewByProductId,
  getReviewByProductIdLimit,
  addProductToFavorite,
  getInfoCustomerByCustomerId,
  getFavoriteProductByCustomerId,
  removeProductFromFavorite,
  getNotification,
  hideNotification,
  reportReview,
};
