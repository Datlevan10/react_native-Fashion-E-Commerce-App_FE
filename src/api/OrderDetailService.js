import api from "./AxiosInstance";

// ============ ORDER DETAILS APIs ============
// Get all order details
export const getAllOrderDetails = async () => {
  try {
    const response = await api.get("/order_details");
    return response;
  } catch (error) {
    console.error("Error fetching all order details:", error);
    throw error;
  }
};

// Get order details by order_id using the specific API endpoint
export const getOrderDetailsByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/order_details/order/${orderId}`);
    const orderDetails = response.data.data || response.data || [];
    
    return {
      data: {
        order_details: orderDetails,
        product_count: orderDetails.length
      }
    };
  } catch (error) {
    console.error("Error fetching order details by order_id:", error);
    return { data: { order_details: [], product_count: 0 } };
  }
};

// Get specific order detail by order_detail_id
export const getOrderDetailById = async (orderDetailId) => {
  try {
    const response = await api.get(`/order_details/${orderDetailId}`);
    return response;
  } catch (error) {
    console.error("Error fetching order detail by ID:", error);
    throw error;
  }
};

// Get product count for multiple orders efficiently using specific API endpoints
export const getProductCountsForOrders = async (orders) => {
  try {
    // Create a map to store promises for each unique order_id
    const orderIds = [...new Set(orders.map(order => order.order_id || order.id).filter(Boolean))];

const productCountPromises = orderIds.map(async (orderId) => {
  try {
    const response = await api.get(`/order_details/order/${orderId}`, {
      // Cho phép Axios coi 404 là hợp lệ, không throw error
      validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
    });

    // Nếu 404 thì response.data sẽ chỉ có message, coi như không có dữ liệu
    const orderDetails = response.data?.data || [];
    return { orderId, count: orderDetails.length };
  } catch (error) {
    // Không log bất kỳ lỗi nào
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

export default {
  getAllOrderDetails,
  getOrderDetailsByOrderId,
  getOrderDetailById,
  getProductCountsForOrders,
};