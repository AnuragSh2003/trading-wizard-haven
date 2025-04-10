/**
 * Base API configuration
 */
const API_BASE_URL = "http://localhost:8081/api";

/**
 * API response interface
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Zerodha response interfaces
 */
interface ZerodhaLoginUrlResponse {
  loginUrl: string;
}

/**
 * User interface
 */
interface User {
  id: number;
  firstName: string;
  email: string;
}

/**
 * Auth response interface
 */
type AuthResponse = ApiResponse<User>;

/**
 * API error response interface
 */
interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: string[];
  data: any;
}

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Creates fetch options with authentication header
 */
const createAuthOptions = (options: RequestInit = {}): RequestInit => {
  const token = getAuthToken();
  let headers = { ...options.headers };
  
  if (token) {
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  return {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
      ...headers,
    },
    mode: 'cors',
    credentials: 'include',
  };
};

/**
 * Generic fetch function with error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const authOptions = createAuthOptions(options);
    
    console.log('Making API request to:', url);
    console.log('With headers:', authOptions.headers);
    if (options.body) console.log('With body:', options.body);
    
    const response = await fetch(url, authOptions);
    console.log('Response status:', response.status);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Response data:', data);
    } else {
      const textData = await response.text();
      console.log('Non-JSON response:', textData);
      throw new Error('Invalid response format');
    }

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/sign-in')) {
          window.location.href = '/sign-in';
        }
      }
      
      const error: ApiErrorResponse = {
        status: response.status,
        message: data.message || "An error occurred",
        errors: data.errors,
        data: data
      };
      
      console.error('API Error:', error);
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * API service for making HTTP requests
 */
export const api = {
  get: <T>(endpoint: string) => 
    apiFetch<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, data: any) => 
    apiFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: any) => 
    apiFetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string) => 
    apiFetch<T>(endpoint, { method: 'DELETE' }),
};

/**
 * Zerodha API service
 */
export const zerodhaApi = {
  getLoginUrl: () => 
    api.get<ApiResponse<ZerodhaLoginUrlResponse>>('/zerodha/login-url').then(response => {
      console.log('Zerodha login URL response:', response);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get Zerodha login URL');
      }
      return response.data;
    }),
  
  generateSession: (requestToken: string) => {
    // Create URL with query parameter
    const url = `/zerodha/generate-session?request_token=${encodeURIComponent(requestToken)}`;
    console.log('Generating Zerodha session with URL:', url);
    
    return api.post<ApiResponse<void>>(url, {}).then(response => {
      console.log('Zerodha session response:', response);
      if (!response.success) {
        throw new Error(response.message || 'Failed to generate Zerodha session');
      }
      return response;
    });
  },
  
  getHoldings: () => 
    api.get<any[]>('/zerodha/holdings'),
  
  getPositions: () => 
    api.get<any[]>('/zerodha/positions'),
  
  getOrders: () => 
    api.get<any[]>('/zerodha/orders'),
  
  getProfile: () => 
    api.get<any>('/zerodha/profile'),
};

/**
 * Screener API service
 */
export const screenerApi = {
  getScreenerResults: (filters: any) => 
    api.post<any[]>("/screener/nse/results", filters),
  
  saveScreener: (screenerConfig: any) => 
    api.post<any>("/screener/save", screenerConfig),
  
  getSavedScreeners: () => 
    api.get<any[]>("/screener/saved"),
  
  deleteScreener: (id: string) => 
    api.delete<void>(`/screener/delete/${id}`),
  
  getNseSectors: () =>
    api.get<string[]>("/screener/nse/sectors"),
  
  getNseIndustries: () =>
    api.get<string[]>("/screener/nse/industries"),
};

/**
 * Market API service for NSE
 */
export const marketApi = {
  getNseMarketData: () => 
    api.get<any>("/market/nse/overview"),
  
  getNseIndices: () => 
    api.get<any[]>("/market/nse/indices"),
  
  getNseStockDetails: (symbol: string) => 
    api.get<any>(`/market/nse/stock/${symbol}`),
  
  getNseMarketNews: () => 
    api.get<any[]>("/market/nse/news"),
  
  getNseChartData: (symbol: string, timeframe: string) => 
    api.get<any[]>(`/market/nse/chart/${symbol}?timeframe=${timeframe}`),
  
  getNseTopGainers: () =>
    api.get<any[]>("/market/nse/top-gainers"),
  
  getNseTopLosers: () =>
    api.get<any[]>("/market/nse/top-losers"),
  
  getNseMostActive: () =>
    api.get<any[]>("/market/nse/most-active"),
};

/**
 * Trading API service
 */
export const tradingApi = {
  getPortfolio: () => 
    api.get<any>("/trading/portfolio"),
  
  executeOrder: (orderData: any) => 
    api.post<any>("/trading/order", orderData),
  
  getOrderHistory: () => 
    api.get<any[]>("/trading/orders"),
  
  cancelOrder: (orderId: string) => 
    api.delete<void>(`/trading/order/${orderId}`),
  
  getFunds: () =>
    api.get<any>("/trading/funds"),
  
  addFunds: (amount: number) =>
    api.post<any>("/trading/funds/add", { amount }),
  
  withdrawFunds: (amount: number) =>
    api.post<any>("/trading/funds/withdraw", { amount }),
};

/**
 * Analytics API service
 */
export const analyticsApi = {
  getPortfolioMetrics: () =>
    api.get<any>("/analytics/portfolio/metrics"),
  
  getSectorAllocation: () =>
    api.get<any[]>("/analytics/portfolio/sectors"),
  
  getHistoricalPerformance: (period: string) =>
    api.get<any[]>(`/analytics/portfolio/performance?period=${period}`),
  
  getBenchmarkComparison: () =>
    api.get<any>("/analytics/benchmark-comparison"),
};
