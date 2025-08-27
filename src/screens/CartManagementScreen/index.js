import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5 } from 'react-native-vector-icons';
import Colors from '../../styles/Color';
import apiService from '../../api/ApiService';

const CartManagementScreen = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, abandoned, expired
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCarts();
  }, [currentPage]);

  const fetchCarts = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setCurrentPage(1);
      } else {
        setLoading(true);
      }

      const response = await apiService.getAllCarts(refresh ? 1 : currentPage, 20);
      
      if (response.status === 200) {
        const cartsData = response.data.data || response.data.carts || [];
        
        // Enhance carts with status calculation
        const enhancedCarts = cartsData.map(cart => ({
          ...cart,
          status: getCartStatus(cart),
          last_activity: cart.updated_at || cart.created_at,
        }));
        
        setCarts(refresh ? enhancedCarts : [...carts, ...enhancedCarts]);
        setTotalPages(response.data.totalPages || Math.ceil(response.data.total / 20) || 1);
      }
    } catch (error) {
      console.error('Error fetching carts:', error);
      Alert.alert('Error', 'Failed to load carts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getCartStatus = (cart) => {
    const lastUpdate = new Date(cart.updated_at || cart.created_at);
    const now = new Date();
    const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
    
    if (cart.is_ordered) return 'ordered';
    if (hoursDiff > 168) return 'expired'; // 7 days
    if (hoursDiff > 24) return 'abandoned'; // 24 hours
    return 'active';
  };

  const handleRefresh = () => {
    fetchCarts(true);
  };

  const loadMoreCarts = () => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewCart = async (cart) => {
    try {
      setLoading(true);
      const response = await apiService.getCartItems(cart.cart_id);
      if (response.status === 200) {
        setCartItems(response.data.data || []);
        setSelectedCart(cart);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = (cart) => {
    Alert.alert(
      'Clear Cart',
      `Are you sure you want to clear this cart?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => executeClearCart(cart.cart_id),
        },
      ]
    );
  };

  const executeClearCart = async (cartId) => {
    try {
      setLoading(true);
      // This would need a clear cart API endpoint
      Alert.alert('Info', 'Clear cart API not implemented yet');
      // await apiService.clearCart(cartId);
      // Alert.alert('Success', 'Cart cleared successfully');
      // handleRefresh();
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = (cart) => {
    Alert.alert(
      'Send Reminder',
      `Send abandonment reminder email to ${cart.customer_email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => executeSendReminder(cart),
        },
      ]
    );
  };

  const executeSendReminder = async (cart) => {
    try {
      setLoading(true);
      // This would need a send reminder API endpoint
      Alert.alert('Info', 'Send reminder API not implemented yet');
      // await apiService.sendCartReminder(cart.cart_id);
      // Alert.alert('Success', 'Reminder email sent successfully');
    } catch (error) {
      console.error('Error sending reminder:', error);
      Alert.alert('Error', 'Failed to send reminder');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCarts = () => {
    let filtered = carts.filter(cart => {
      const matchesSearch = cart.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cart.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cart.cart_id?.toString().includes(searchQuery);
      
      const matchesFilter = filterStatus === 'all' || cart.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
    
    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return Colors.success;
      case 'abandoned':
        return Colors.warning;
      case 'expired':
        return Colors.error;
      case 'ordered':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'shopping-cart';
      case 'abandoned':
        return 'clock';
      case 'expired':
        return 'x-circle';
      case 'ordered':
        return 'check-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN') + ' ' + 
           new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateCartTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderCartItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cartCard}
      onPress={() => handleViewCart(item)}
    >
      <View style={styles.cartHeader}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartId}>Cart #{item.cart_id}</Text>
          <Text style={styles.customerName}>
            {item.customer_name || 'Unknown Customer'}
          </Text>
          <Text style={styles.customerEmail}>
            {item.customer_email || 'No email'}
          </Text>
        </View>
        
        <View style={styles.cartStatus}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' }
          ]}>
            <Feather
              name={getStatusIcon(item.status)}
              size={12}
              color={getStatusColor(item.status)}
            />
            <Text style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cartMeta}>
        <View style={styles.metaRow}>
          <Feather name="calendar" size={12} color={Colors.textSecondary} />
          <Text style={styles.metaText}>
            Created: {formatDate(item.created_at)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Feather name="clock" size={12} color={Colors.textSecondary} />
          <Text style={styles.metaText}>
            Last Activity: {formatDate(item.last_activity)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Feather name="package" size={12} color={Colors.textSecondary} />
          <Text style={styles.metaText}>
            Items: {item.total_items || 0}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <FontAwesome5 name="money-bill" size={12} color={Colors.textSecondary} />
          <Text style={styles.metaText}>
            Value: {new Intl.NumberFormat('vi-VN').format(item.total_amount || 0)} VND
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewCart(item)}
        >
          <Feather name="eye" size={14} color={Colors.primary} />
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>

        {item.status === 'abandoned' && (
          <TouchableOpacity
            style={styles.reminderButton}
            onPress={() => handleSendReminder(item)}
          >
            <Feather name="mail" size={14} color={Colors.warning} />
            <Text style={styles.reminderButtonText}>Remind</Text>
          </TouchableOpacity>
        )}

        {(item.status === 'expired' || item.status === 'abandoned') && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleClearCart(item)}
          >
            <Feather name="trash-2" size={14} color={Colors.error} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCartDetailsModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color={Colors.blackColor} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            Cart #{selectedCart?.cart_id} Details
          </Text>
          <View style={styles.placeholder} />
        </View>

        {selectedCart && (
          <ScrollView style={styles.modalContent}>
            {/* Cart Info */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Cart Information</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer:</Text>
                <Text style={styles.detailValue}>
                  {selectedCart.customer_name || 'Unknown'}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>
                  {selectedCart.customer_email || 'N/A'}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(selectedCart.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(selectedCart.status) }
                  ]}>
                    {selectedCart.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedCart.created_at)}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Updated:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedCart.updated_at)}
                </Text>
              </View>
            </View>

            {/* Cart Items */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Cart Items ({cartItems.length})</Text>
              
              {cartItems.length === 0 ? (
                <Text style={styles.emptyCartText}>No items in cart</Text>
              ) : (
                cartItems.map((item, index) => (
                  <View key={index} style={styles.cartItemCard}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.product_name || 'Unknown Product'}
                    </Text>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemPrice}>
                        {new Intl.NumberFormat('vi-VN').format(item.price || 0)} VND
                      </Text>
                      <Text style={styles.itemQuantity}>
                        Qty: {item.quantity || 0}
                      </Text>
                      <Text style={styles.itemTotal}>
                        Total: {new Intl.NumberFormat('vi-VN').format((item.price || 0) * (item.quantity || 0))} VND
                      </Text>
                    </View>
                  </View>
                ))
              )}
              
              {cartItems.length > 0 && (
                <View style={styles.cartTotalContainer}>
                  <Text style={styles.cartTotalText}>
                    Cart Total: {new Intl.NumberFormat('vi-VN').format(calculateCartTotal(cartItems))} VND
                  </Text>
                </View>
              )}
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              {selectedCart.status === 'abandoned' && (
                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={() => {
                    setModalVisible(false);
                    handleSendReminder(selectedCart);
                  }}
                >
                  <Feather name="mail" size={20} color={Colors.whiteColor} />
                  <Text style={styles.modalActionText}>Send Reminder</Text>
                </TouchableOpacity>
              )}
              
              {(selectedCart.status === 'expired' || selectedCart.status === 'abandoned') && (
                <TouchableOpacity
                  style={[styles.modalActionButton, { backgroundColor: Colors.error }]}
                  onPress={() => {
                    setModalVisible(false);
                    handleClearCart(selectedCart);
                  }}
                >
                  <Feather name="trash-2" size={20} color={Colors.whiteColor} />
                  <Text style={styles.modalActionText}>Clear Cart</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {['all', 'active', 'abandoned', 'expired', 'ordered'].map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            filterStatus === filter && styles.activeFilterButton
          ]}
          onPress={() => setFilterStatus(filter)}
        >
          <Text style={[
            styles.filterButtonText,
            filterStatus === filter && styles.activeFilterButtonText
          ]}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search carts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      {renderFilterButtons()}

      {/* Cart List */}
      <FlatList
        data={getFilteredCarts()}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.cart_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMoreCarts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => 
          loading ? <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} /> : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="shopping-cart" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No carts found</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Cart Details Modal */}
      {renderCartDetailsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteBgColor,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.blackColor,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.grayBgColor,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: Colors.blackColor,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: Colors.whiteColor,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  cartCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cartInfo: {
    flex: 1,
  },
  cartId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 2,
  },
  customerName: {
    fontSize: 14,
    color: Colors.blackColor,
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cartStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  cartMeta: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '20',
    borderRadius: 6,
  },
  viewButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.warning + '20',
    borderRadius: 6,
  },
  reminderButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.error + '20',
    borderRadius: 6,
  },
  clearButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.error,
    fontWeight: '500',
  },
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderColor,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.blackColor,
    flex: 2,
    textAlign: 'right',
  },
  emptyCartText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  cartItemCard: {
    backgroundColor: Colors.grayBgColor,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.blackColor,
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  itemTotal: {
    fontSize: 12,
    color: Colors.blackColor,
    fontWeight: '600',
  },
  cartTotalContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  cartTotalText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'right',
  },
  modalActions: {
    marginTop: 20,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.warning,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalActionText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.whiteColor,
    fontWeight: '600',
  },
});

export default CartManagementScreen;