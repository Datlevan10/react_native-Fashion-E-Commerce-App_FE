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

const updateCustomer = async (customerId, data, hasImages = false) => {
  const headers = hasImages 
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };
    
  return api.put(`/customers/${customerId}`, data, { headers });
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

// Admin Dashboard APIs - These calculate statistics from actual data
const getTotalCustomers = async () => {
  try {
    const response = await api.get("/customers");
    // Handle different response structures
    let customers = response.data;
    if (response.data.data) {
      customers = response.data.data;
    }
    const total = Array.isArray(customers) ? customers.length : 0;
    return { data: { data: { total } } };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { data: { data: { total: 0 } } };
  }
};

const getTotalStaff = async () => {
  try {
    const response = await api.get("/staffs");
    // Handle different response structures
    let staffs = response.data;
    if (response.data.data) {
      staffs = response.data.data;
    }
    const total = Array.isArray(staffs) ? staffs.length : 0;
    return { data: { data: { total } } };
  } catch (error) {
    console.error("Error fetching staffs:", error);
    return { data: { data: { total: 0 } } };
  }
};

const getTotalProducts = async () => {
  try {
    const response = await api.get("/products");
    // Handle different response structures
    let products = response.data;
    if (response.data.data) {
      products = response.data.data;
    }
    const total = Array.isArray(products) ? products.length : 0;
    return { data: { data: { total } } };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: { data: { total: 0 } } };
  }
};

const getTotalCategories = async () => {
  try {
    const response = await api.get("/categories");
    // Handle different response structures
    let categories = response.data;
    if (response.data.data) {
      categories = response.data.data;
    }
    const total = Array.isArray(categories) ? categories.length : 0;
    return { data: { data: { total } } };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: { data: { total: 0 } } };
  }
};

const getOrderStatistics = async () => {
  try {
    const response = await api.get("/orders");
    // Handle different response structures
    let orders = response.data;
    if (response.data.data) {
      orders = response.data.data;
    }
    
    if (!Array.isArray(orders)) {
      orders = [];
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at || o.date_created || 0);
      return orderDate >= today;
    }).length;
    
    const weekOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at || o.date_created || 0);
      return orderDate >= weekAgo;
    }).length;
    
    const monthOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at || o.date_created || 0);
      return orderDate >= monthAgo;
    }).length;
    
    // Calculate revenue
    const todayRevenue = orders.filter(o => {
      const orderDate = new Date(o.created_at || o.date_created || 0);
      return orderDate >= today;
    }).reduce((sum, order) => sum + (parseFloat(order.total_price || order.total || 0)), 0);
    
    const weekRevenue = orders.filter(o => {
      const orderDate = new Date(o.created_at || o.date_created || 0);
      return orderDate >= weekAgo;
    }).reduce((sum, order) => sum + (parseFloat(order.total_price || order.total || 0)), 0);
    
    const monthRevenue = orders.filter(o => {
      const orderDate = new Date(o.created_at || o.date_created || 0);
      return orderDate >= monthAgo;
    }).reduce((sum, order) => sum + (parseFloat(order.total_price || order.total || 0)), 0);
    
    return { 
      data: {
        today: todayOrders,
        week: weekOrders,
        month: monthOrders,
        todayRevenue: todayRevenue,
        weekRevenue: weekRevenue,
        monthRevenue: monthRevenue,
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      }
    };
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    return { 
      data: {
        today: 0, week: 0, month: 0,
        todayRevenue: 0, weekRevenue: 0, monthRevenue: 0,
        total: 0, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0
      }
    };
  }
};

const getRecentOrders = async (limit = 10) => {
  try {
    const response = await api.get("/orders");
    // Handle different response structures
    let orders = response.data;
    if (response.data.data) {
      orders = response.data.data;
    }
    
    if (!Array.isArray(orders)) {
      orders = [];
    }
    
    // Sort by created_at or id (descending) and take first 'limit' items
    const sortedOrders = orders.sort((a, b) => {
      const dateA = new Date(a.created_at || a.date_created || 0);
      const dateB = new Date(b.created_at || b.date_created || 0);
      return dateB - dateA;
    }).slice(0, limit);
    
    return { data: { orders: sortedOrders } };
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return { data: { orders: [] } };
  }
};

const getTopProducts = async (limit = 5) => {
  try {
    // This would need order details to calculate, for now return empty
    // In real implementation, you'd need to analyze order_details
    return { data: { products: [] } };
  } catch (error) {
    console.error("Error fetching top products:", error);
    return { data: { products: [] } };
  }
};

// Cart and Order Statistics for Admin Dashboard
const getTotalCarts = async () => {
  try {
    const response = await api.get("/carts");
    // Handle different response structures
    let carts = response.data;
    if (response.data.data) {
      carts = response.data.data;
    }
    const total = Array.isArray(carts) ? carts.length : 0;
    return { data: { data: { total } } };
  } catch (error) {
    console.error("Error fetching carts:", error);
    return { data: { data: { total: 0 } } };
  }
};

const getActiveCarts = async () => {
  try {
    const response = await api.get("/carts");
    // Handle different response structures
    let carts = response.data;
    if (response.data.data) {
      carts = response.data.data;
    }
    
    if (!Array.isArray(carts)) {
      carts = [];
    }
    
    const activeCarts = carts.filter(cart => !cart.is_ordered);
    return { data: { data: { active: activeCarts.length, carts: activeCarts } } };
  } catch (error) {
    console.error("Error fetching active carts:", error);
    return { data: { data: { active: 0, carts: [] } } };
  }
};

const getCartStatistics = async () => {
  // Get all carts and calculate statistics
  const response = await api.get("/carts");
  const carts = response.data;
  
  const statistics = {
    total: carts.length,
    active: carts.filter(c => !c.is_ordered).length,
    completed: carts.filter(c => c.is_ordered).length,
  };
  
  return { data: statistics };
};

const getTotalOrders = async () => {
  // Get all orders and return count
  const response = await api.get("/orders");
  return { data: { total: response.data.length } };
};

const getOrdersByStatus = async (status) => {
  // Use the correct backend route for filtering by status
  return api.get(`/orders/status/${status}`);
};

const getAllCarts = async (page = 1, limit = 20) => {
  // Get all carts with pagination params (backend may or may not use them)
  return api.get(`/carts?page=${page}&limit=${limit}`);
};

const getAllOrders = async (page = 1, limit = 20, filters = {}) => {
  // Build query params
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  
  // Add filters if provided
  if (filters.status && filters.status !== 'all') {
    // Use status-specific endpoint if filtering by status
    return api.get(`/orders/status/${filters.status}?${params.toString()}`);
  }
  
  // Add other filters as query params
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      params.append(key, filters[key]);
    }
  });
  
  return api.get(`/orders?${params.toString()}`);
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

// Update order status - Updated to match backend route
const updateOrderStatus = async (orderId, status) => {
  return api.put(`/orders/${orderId}/status`, { status });
};

// Get order details
const getOrderDetails = async (orderId) => {
  return api.get(`/orders/${orderId}`);
};

// Get order history
const getOrderHistory = async () => {
  return api.get('/orders/history');
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
  return api.get(`/orders/${orderId}`);
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

// ============ ZALOPAY PAYMENT APIs ============

// Initialize payment methods (one-time setup)
const initializePaymentMethods = async () => {
  return api.post("/payments/initialize");
};

// Create ZaloPay payment order
const createZaloPayPayment = async (paymentData) => {
  return api.post("/payments/zalopay/create", paymentData);
};

// Query ZaloPay payment status
const queryZaloPayStatus = async (appTransId) => {
  return api.post("/payments/zalopay/query", { app_trans_id: appTransId });
};

// Handle ZaloPay callback (for backend verification)
const verifyZaloPayCallback = async (callbackData) => {
  return api.post("/payments/zalopay/callback", callbackData);
};

// ============ ORDER DETAILS APIs ============
// Get all order details
const getAllOrderDetails = async () => {
  try {
    const response = await api.get("/order_details");
    return response;
  } catch (error) {
    console.error("Error fetching all order details:", error);
    throw error;
  }
};

// Get order details by order_id using the specific API endpoint
const getOrderDetailsByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/order_details/order/${orderId}`);
    return {
      data: {
        order_details: response.data.data || response.data || [],
        product_count: (response.data.data || response.data || []).length
      }
    };
  } catch (error) {
    console.error("Error fetching order details by order_id:", error);
    return { data: { order_details: [], product_count: 0 } };
  }
};

// Get specific order detail by order_detail_id
const getOrderDetailById = async (orderDetailId) => {
  try {
    const response = await api.get(`/order_details/${orderDetailId}`);
    return response;
  } catch (error) {
    console.error("Error fetching order detail by ID:", error);
    throw error;
  }
};

// Get product count for multiple orders efficiently
const getProductCountsForOrders = async (orders) => {
  try {
    // Create a map to store promises for each unique order_id
    const orderIds = [...new Set(orders.map(order => order.order_id || order.id).filter(Boolean))];
    const productCountPromises = orderIds.map(async (orderId) => {
      try {
        const response = await api.get(`/order_details/order/${orderId}`);
        const orderDetails = response.data.data || response.data || [];
        return { orderId, count: orderDetails.length };
      } catch (error) {
        console.error(`Error fetching product count for order ${orderId}:`, error);
        return { orderId, count: 0 };
      }
    });

    // Wait for all promises to resolve
    const productCounts = await Promise.all(productCountPromises);
    
    // Create a map of order_id to product count
    const countMap = {};
    productCounts.forEach(({ orderId, count }) => {
      countMap[orderId] = count;
    });
    
    // Add product_count to each order
    return orders.map(order => ({
      ...order,
      product_count: countMap[order.order_id || order.id] || 0
    }));
  } catch (error) {
    console.error("Error fetching product counts:", error);
    // Return orders with default count of 0 if API fails
    return orders.map(order => ({
      ...order,
      product_count: 0
    }));
  }
};

// ============ ORDER MANAGEMENT APIs ============
// Update order status (for admin)
const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Cancel order (for both admin and customer)
const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
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
  updateCustomer,
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
  getOrderHistory,
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
  // ZaloPay APIs
  initializePaymentMethods,
  createZaloPayPayment,
  queryZaloPayStatus,
  verifyZaloPayCallback,
  // Order Details APIs
  getAllOrderDetails,
  getOrderDetailsByOrderId,
  getOrderDetailById,
  getProductCountsForOrders,
  // Order Management APIs
  updateOrderStatus,
  cancelOrder,
}