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

const getFeatureProducts = async (category_id) => {
  return api.get(`/products/category/${category_id}`);
};

const addProductToCart = async (productData) => {
  return api.post("/carts", productData);
};

const addProductToFavorite = async (productData) => {
  return api.post("/product_favorites", productData);
};

const getInfoCustomerByCustomerId = async (customer_id) => {
  return api.get(`/customers/${customer_id}`);
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
  addProductToFavorite,
  getInfoCustomerByCustomerId,
};
