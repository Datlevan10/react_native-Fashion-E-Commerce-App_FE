const API_BASE_URL = "http://192.168.1.5:8080/api";

const registerCustomer = async (customerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw { status: response.status, errors: responseData.error };
    }

    return { status: response.status, ...responseData };
  } catch (error) {
    console.error("Error while registering:", error);
    throw error;
  }
};

export default {
  registerCustomer,
};
