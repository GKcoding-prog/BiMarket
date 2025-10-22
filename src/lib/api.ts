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
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
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
    // Try multiple payload formats that Django might expect
    const payloads = [
      // Format 1: Standard Django User model fields
      {
        email: userData.email,
        password: userData.password,
        username: userData.email, // Django often requires username
        first_name: userData.full_name?.split(' ')[0] || '',
        last_name: userData.full_name?.split(' ').slice(1).join(' ') || '',
        role: userData.role || 'client'
      },
      // Format 2: Custom full_name field
      {
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name,
        role: userData.role || 'client'
      },
      // Format 3: DRF typical format
      {
        email: userData.email,
        password1: userData.password,
        password2: userData.password,
        username: userData.email,
        role: userData.role || 'client'
      }
    ];

    // Try each payload format
    for (let i = 0; i < payloads.length; i++) {
      console.log(`📤 Trying registration format ${i + 1}:`, payloads[i]);
      
      const result = await this.request<User>('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(payloads[i]),
      });

      if (!result.error) {
        console.log(`✅ Registration successful with format ${i + 1}`);
        return result;
      } else {
        console.log(`❌ Format ${i + 1} failed:`, result.error);
      }
    }

    // If all formats failed, return the last error
    return this.request<User>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payloads[0]),
    });
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

  // Categories
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/categories/');
  }

  // Cart
  async getCart(): Promise<ApiResponse<any>> {
    return this.request<any>('/cart/');
  }

  async addToCart(productId: string, quantity: number = 1): Promise<ApiResponse<any>> {
    return this.request<any>('/cart/items/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/cart/items/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string): Promise<ApiResponse> {
    return this.request(`/cart/items/${itemId}/`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>('/orders/');
  }

  async createOrder(orderData: any): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/`);
  }

  // Dashboard
  async getDashboardData(): Promise<ApiResponse<any>> {
    return this.request<any>('/dashboard/');
  }

  // Payments
  async processPayment(paymentData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/payments/', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
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