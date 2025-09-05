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

// Staff Authentication APIs
const staffLogin = async (credentials) => {
  return api.post("/staffs/auth/login", credentials);
};

const staffLogout = async () => {
  return api.post("/staffs/auth/logout");
};

const staffRefreshToken = async (refreshToken) => {
  return api.post("/staffs/auth/refresh-token", { refresh_token: refreshToken });
};

// Admin Authentication APIs  
const adminLogin = async (credentials) => {
  return api.post("/admins/auth/login", credentials);
};

const adminLogout = async () => {
  return api.post("/admins/auth/logout");
};

const adminRefreshToken = async (refreshToken) => {
  return api.post("/admins/auth/refresh-token", { refresh_token: refreshToken });
};

const getAdminProfile = async () => {
  return api.get("/admin/profile");
};

// Admin Management APIs
const getAllStaffs = async () => {
  return api.get("/staffs");
};

const toggleStaffStatus = async (staffId) => {
  return api.put(`/admin/staffs/${staffId}/toggle-status`);
};

const banCustomer = async (customerId, reason) => {
  return api.put(`/admin/customers/${customerId}/ban`, { reason });
};

const getSalesReports = async (filters) => {
  return api.get("/admin/reports/sales", { params: filters });
};

const getOrdersReports = async (filters) => {
  return api.get("/admin/reports/orders", { params: filters });
};

// Event
const getEventImageActive = async () => {
  return api.get("/events/is-active/active");
};

// Category, Product, Favorite Product
const getCategories = async () => {
  return api.get("/categories");
};

const createCategory = async (categoryData) => {
  return api.post("/categories", categoryData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updateCategory = async (categoryId, categoryData, hasImage = false) => {
  const headers = hasImage 
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };
    
  return api.put(`/categories/${categoryId}`, categoryData, { headers });
};

const deleteCategory = async (categoryId) => {
  return api.delete(`/categories/${categoryId}`);
};

const getCategoryById = async (categoryId) => {
  return api.get(`/categories/${categoryId}`);
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

// Product filtering APIs based on Laravel ProductController
const getProductsByCategoryId = async (categoryId) => {
  return api.get(`/products/category/${categoryId}`);
};

const getLimitedProductsByCategoryId = async (categoryId, limit) => {
  return api.get(`/products/category/${categoryId}/limit/${limit}`);
};

const getLimitedProducts = async (limit) => {
  return api.get(`/products/limit/${limit}`);
};

const filterProductsByStars = async (stars) => {
  return api.get(`/products/filter-by-stars?stars=${stars}`);
};

const filterProductsBySizes = async (size) => {
  return api.get(`/products/filter-by-sizes?size=${size}`);
};

const filterProductsByPrice = async (minPrice, maxPrice, sort = 'asc') => {
  const params = new URLSearchParams();
  if (minPrice !== null && minPrice !== undefined) params.append('min_price', minPrice);
  if (maxPrice !== null && maxPrice !== undefined) params.append('max_price', maxPrice);
  if (sort) params.append('sort', sort);
  return api.get(`/products/filter-by-price?${params.toString()}`);
};

const filterProductsByTotalReviews = async (filter) => {
  return api.get(`/products/filter/total-reviews?filter=${filter}`);
};

const filterProductsByAverageReviews = async (filter) => {
  return api.get(`/products/filter/average-reviews?filter=${filter}`);
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

// Admin Dashboard APIs
const getTotalCustomers = async () => {
  return api.get("/admin/dashboard/customers/total");
};

const getTotalStaff = async () => {
  return api.get("/admin/dashboard/staff/total");
};

const getTotalProducts = async () => {
  return api.get("/admin/dashboard/products/total");
};

const getTotalCategories = async () => {
  return api.get("/admin/dashboard/categories/total");
};

const getOrderStatistics = async () => {
  return api.get("/admin/dashboard/orders/statistics");
};

const getRecentOrders = async (limit = 10) => {
  return api.get(`/admin/orders/recent?limit=${limit}`);
};

const getTopProducts = async (limit = 5) => {
  return api.get(`/admin/products/top-selling?limit=${limit}`);
};

// Cart and Order Statistics for Admin Dashboard
const getTotalCarts = async () => {
  return api.get("/admin/dashboard/carts/total");
};

const getActiveCarts = async () => {
  return api.get("/admin/dashboard/carts/active");
};

const getCartStatistics = async () => {
  return api.get("/admin/dashboard/carts/statistics");
};

const getTotalOrders = async () => {
  return api.get("/admin/dashboard/orders/total");
};

const getOrdersByStatus = async (status) => {
  return api.get(`/admin/dashboard/orders/status/${status}`);
};

const getAllCarts = async (page = 1, limit = 20) => {
  return api.get(`/admin/carts?page=${page}&limit=${limit}`);
};

const getAllOrders = async (page = 1, limit = 20) => {
  return api.get(`/admin/orders?page=${page}&limit=${limit}`);
};

// ============ CART MANAGEMENT APIs ============

// Get customer's active cart (not ordered)
const getCustomerCart = async (customerId) => {
  return api.get(`/carts/not-ordered-carts/customer/${customerId}`);
};

// Create new cart for customer
const createCart = async (customerId) => {
  return api.post("/carts", { customer_id: customerId });
};

// Add item to cart - matches backend CartController requirements
const addToCart = async (cartData) => {
  return api.post("/carts", cartData);
};

// Get cart items
const getCartItems = async (cartId) => {
  return api.get(`/cart_details/cart/${cartId}`);
};

// Update cart item quantity
const updateCartItem = async (cartDetailId, quantity) => {
  return api.put(`/cart_details/${cartDetailId}`, { quantity });
};

// Remove item from cart
const removeFromCart = async (cartDetailId) => {
  return api.delete(`/cart_details/${cartDetailId}/delete-item-in-cart`);
};

// ============ ORDER MANAGEMENT APIs ============

// Create order from cart
const createOrder = async (orderData) => {
  return api.post("/orders", orderData);
};

// Get customer orders
const getCustomerOrders = async (customerId) => {
  return api.get(`/orders/customer/${customerId}`);
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  return api.put(`/orders/${orderId}/status`, { status });
};

// Get order details
const getOrderDetails = async (orderId) => {
  return api.get(`/orders/${orderId}`);
};

// Staff Management APIs
const getAllStaff = async () => {
  return api.get("/staffs");
};

const getStaffById = async (staffId) => {
  return api.get(`/admin/staff/${staffId}`);
};

const createStaff = async (staffData) => {
  return api.post("/admin/staff", staffData);
};

const updateStaff = async (staffId, staffData) => {
  return api.put(`/admin/staff/${staffId}`, staffData);
};

const deleteStaff = async (staffId) => {
  return api.delete(`/admin/staff/${staffId}`);
};

// Customer Management APIs
const getAllCustomers = async (page = 1, limit = 20) => {
  return api.get(`/customers?page=${page}&limit=${limit}`);
};

const getCustomerById = async (customerId) => {
  return api.get(`/admin/customers/${customerId}`);
};

const updateCustomerStatus = async (customerId, status) => {
  return api.put(`/admin/customers/${customerId}/status`, { status });
};


const getOrderById = async (orderId) => {
  return api.get(`/admin/orders/${orderId}`);
};

// Product Management APIs
const getAllProductsAdmin = async () => {
  return api.get(`/products`);
};

const createProduct = async (productData) => {
  return api.post("/products", productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updateProduct = async (productId, productData, hasImages = false) => {
  const headers = hasImages 
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };
    
  return api.put(`/products/${productId}`, productData, { headers });
};

const deleteProduct = async (productId) => {
  return api.delete(`/products/${productId}`);
};

// Reports APIs
const getSalesReport = async (startDate, endDate) => {
  return api.get(`/admin/reports/sales?start_date=${startDate}&end_date=${endDate}`);
};

const getCustomerReport = async (startDate, endDate) => {
  return api.get(`/admin/reports/customers?start_date=${startDate}&end_date=${endDate}`);
};

const getProductReport = async (startDate, endDate) => {
  return api.get(`/admin/reports/products?start_date=${startDate}&end_date=${endDate}`);
};

export default {
  registerCustomer,
  authenticateLoginCustomer,
  logout,
  // Staff Authentication
  staffLogin,
  staffLogout,
  staffRefreshToken,
  // Admin Authentication
  adminLogin,
  adminLogout,
  adminRefreshToken,
  getAdminProfile,
  // Admin Management
  getAllStaffs,
  toggleStaffStatus,
  banCustomer,
  getSalesReports,
  getOrdersReports,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getStores,
  getListAllProducts,
  getProductByProductId,
  searchProducts,
  getEventImageActive,
  getFeatureProducts,
  // New filtering APIs
  getProductsByCategoryId,
  getLimitedProductsByCategoryId,
  getLimitedProducts,
  filterProductsByStars,
  filterProductsBySizes,
  filterProductsByPrice,
  filterProductsByTotalReviews,
  filterProductsByAverageReviews,
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
  // Admin APIs
  getTotalCustomers,
  getTotalStaff,
  getTotalProducts,
  getTotalCategories,
  getOrderStatistics,
  getRecentOrders,
  getTopProducts,
  // Cart and Order Statistics
  getTotalCarts,
  getActiveCarts,
  getCartStatistics,
  getTotalOrders,
  getOrdersByStatus,
  getAllCarts,
  // Cart Management
  getCustomerCart,
  createCart,
  addToCart,
  getCartItems,
  updateCartItem,
  removeFromCart,
  // getAllCustomerCarts,
  // getCustomerNotOrderedCartDetails,
  // Order Management
  createOrder,
  getCustomerOrders,
  updateOrderStatus,
  getOrderDetails,
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  getAllOrders,
  getOrderById,

  hideNotification,
  reportReview,
  // Admin APIs
  getTotalCustomers,
  getTotalStaff,
  getTotalProducts,
  getTotalCategories,
  getOrderStatistics,
  getRecentOrders,
  getTopProducts,
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  // Product Management APIs
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getSalesReport,
  getCustomerReport,
  getProductReport,
}