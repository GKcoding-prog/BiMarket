// API client for Django backend - this is gonna be fire! 🔥
const API_BASE_URL = '/api';  // Use Vite proxy instead of direct URL

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: 'client' | 'vendeur';
}

interface TokenResponse {
  access: string;
  refresh: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items?: any[];
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  // Helper to set auth token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  // Helper to clear token
  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Generic fetch wrapper with auth
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    console.log('🌐 Making API request to:', url);
    console.log('📋 Headers:', headers);
    console.log('📦 Body:', options.body);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'include',
      });

      console.log('📊 Response status:', response.status);

      const data = await response.json();
      console.log('📄 Response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || data.message || `HTTP ${response.status}`);
      }

      return { data };
    } catch (error) {
      console.error('💥 API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<TokenResponse>> {
    return this.request<TokenResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<ApiResponse<User>> {
    // Match the exact backend schema
    const payload = {
      email: userData.email,
      password: userData.password,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone || "",
      role: userData.role || 'client'
    };

    console.log('📤 Registering user with payload:', payload);
    
    const result = await this.request<User>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!result.error) {
      console.log('✅ Registration successful');
    } else {
      console.log('❌ Registration failed:', result.error);
    }

    return result;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<TokenResponse>> {
    return this.request<TokenResponse>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout/', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  // User profile
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me/');
  }

  // Products
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/products/');
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}/`);
  }

  async createProduct(productData: any): Promise<ApiResponse<Product>> {
    return this.request<Product>('/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}/`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/categories/');
  }

  async createCategory(categoryData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/categories/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    return this.request(`/categories/${id}/`, {
      method: 'DELETE',
    });
  }

  // Cart
  async getCart(): Promise<ApiResponse<any>> {
    return this.request<any>('/cart/');
  }

  async addToCart(productId: string, quantity: number = 1): Promise<ApiResponse<any>> {
    console.log('🛒 addToCart called with:', { productId, quantity });
    
    return this.request<any>('/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<any>> {
    console.log('🔄 updateCartItem called with:', { itemId, quantity });
    
    // Django endpoint: PATCH /cart/update/<uuid:item_id>/
    return this.request<any>(`/cart/update/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string): Promise<ApiResponse> {
    console.log('🗑️ removeFromCart called with:', { itemId });
    
    // Try different endpoint patterns based on Django URLconf
    // Pattern 1: POST /cart/remove/ with item_id in body
    let result = await this.request('/cart/remove/', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId }),
    });
    
    if (result.error?.includes('404')) {
      console.log('⚠️ POST /cart/remove/ failed, trying DELETE /cart/remove/{id}/');
      result = await this.request(`/cart/remove/${itemId}/`, {
        method: 'DELETE',
      });
    }
    
    if (result.error?.includes('404')) {
      console.log('⚠️ DELETE /cart/remove/{id}/ failed, trying POST /cart/remove/{id}/');
      result = await this.request(`/cart/remove/${itemId}/`, {
        method: 'POST',
      });
    }
    
    return result;
  }

  // Orders
  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>('/orders/');
  }

  async createOrder(orderData: any): Promise<ApiResponse<Order>> {
    console.log('📦 Creating order with:', orderData);
    
    return this.request<Order>('/orders/create/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/`);
  }

  async getSellerOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>('/orders/seller/');
  }

  // Dashboard
  async getDashboardData(): Promise<ApiResponse<any>> {
    return this.request<any>('/dashboard/');
  }

  // Payments
  async initiatePayment(paymentData: {
    order_id: string;
    payment_method: 'lumicash' | 'ecocash';
    phone_number: string;
  }): Promise<ApiResponse<any>> {
    console.log('💳 Initiating payment:', paymentData);
    return this.request<any>('/payments/initiate/', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async confirmPayment(paymentId: string): Promise<ApiResponse<any>> {
    console.log('✅ Confirming payment:', paymentId);
    return this.request<any>('/payments/confirm/', {
      method: 'POST',
      body: JSON.stringify({ payment_id: paymentId }),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/payments/status/${paymentId}/`);
  }

  async processPayment(paymentData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/payments/', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Wishlist
  async getWishlist(): Promise<ApiResponse<any>> {
    return this.request<any>('/wishlist/');
  }

  async addToWishlist(productId: string): Promise<ApiResponse<any>> {
    console.log('💜 Adding to wishlist:', productId);
    return this.request<any>('/wishlist/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse<any>> {
    console.log('💔 Removing from wishlist:', productId);
    return this.request<any>('/wishlist/remove/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async toggleWishlist(productId: string): Promise<ApiResponse<any>> {
    console.log('💖 Toggling wishlist:', productId);
    return this.request<any>('/wishlist/toggle/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async checkWishlist(productId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/wishlist/check/?product_id=${productId}`);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for use in components
export type {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  TokenResponse,
  User,
  Product,
  Order,
};