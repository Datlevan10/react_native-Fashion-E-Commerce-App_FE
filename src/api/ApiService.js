// Cần thay đổi và sử dụng IP cục bộ của máy tính trong mạng nội bộ cho API
const API_BASE_URL = "http://192.168.1.5:8080/api";

const getRequest = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw { status: response.status, errors: responseData.error };
    }

    return responseData;
  } catch (error) {
    console.error(`Error while making GET request to ${endpoint}:`, error);
    throw error;
  }
};

const postRequest = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw { status: response.status, errors: responseData.error };
    }

    return { status: response.status, ...responseData };
  } catch (error) {
    console.error(`Error while making POST request to ${endpoint}:`, error);
    throw error;
  }
};

const getStores = () => getRequest("/stores");

const registerCustomer = (customerData) => postRequest("/customers", customerData);

const loginCustomer = (loginData) => postRequest("/customers/auth/login", loginData);

const getEventImageActive = () => getRequest("/events/is_active/active");

const getCategories = () => getRequest("/categories");

const getProductsByCategory = (category_id) => getRequest(`/products/category/${category_id}`);


export default {
  registerCustomer,
  loginCustomer,
  getCategories,
  getStores,
  getEventImageActive,
  getProductsByCategory,
};
