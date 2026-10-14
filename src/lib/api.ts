// API Client for SoldaCheck Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('soldacheck_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Error HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      if (Array.isArray(errorData.message)) {
        errorMsg = errorData.message.join(', ');
      } else if (errorData.message) {
        errorMsg = errorData.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }

  // If response is empty or 204
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Machine {
  id: string;
  name: string;
  brand: string;
  model: string;
  weldType: string[];
  voltage: string;
  amperage: string;
  dutyCycle: string;
  location: string;
  status: 'operativa' | 'en_revision' | 'mantenimiento' | string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Inspection {
  id: string;
  machineId: string;
  technician: string;
  checks: Record<string, boolean>;
  status: string;
  notes?: string;
  date: string;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ accessToken: string; user: User }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getProfile(): Promise<User> {
    return request('/auth/me');
  },

  // Users Management (Admin)
  async getUsers(): Promise<User[]> {
    return request('/users');
  },

  async createUser(data: { name: string; email: string; password: string; role?: string }): Promise<User> {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateUser(id: string, data: { name?: string; email?: string; password?: string; role?: string }): Promise<User> {
    return request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Machines Management
  async getMachines(status?: string): Promise<Machine[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request(`/machines${query}`);
  },

  async getMachine(id: string): Promise<Machine> {
    return request(`/machines/${id}`);
  },

  async createMachine(data: Omit<Machine, 'createdAt' | 'updatedAt'>): Promise<Machine> {
    return request('/machines', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMachine(id: string, data: Partial<Machine>): Promise<Machine> {
    return request(`/machines/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteMachine(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/machines/${id}`, {
      method: 'DELETE',
    });
  },

  // Inspections
  async getInspections(machineId: string): Promise<Inspection[]> {
    return request(`/machines/${machineId}/inspections`);
  },

  async addInspection(machineId: string, data: { technician: string; checks: Record<string, boolean>; status: string; notes?: string }): Promise<Inspection> {
    return request(`/machines/${machineId}/inspections`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
