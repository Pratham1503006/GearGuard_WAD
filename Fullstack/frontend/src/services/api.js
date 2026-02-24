import axios from 'axios';
import { mockData } from './mockData';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCK = true; // Always use mock API to fully disconnect backend

const realApi = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// Mock API implementation
const mockApi = {
  get: async (url, config) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    if (url === '/maintenance') {
      const params = config?.params || {};
      const equipmentId = params?.equipment_id ? Number(params.equipment_id) : null;
      const workCenterId = params?.work_center_id ? Number(params.work_center_id) : null;
      const filtered = mockData.maintenance.filter((m) => {
        if (equipmentId && Number(m.equipment_id) !== equipmentId) return false;
        if (workCenterId && Number(m.work_center_id) !== workCenterId) return false;
        return true;
      });
      return { data: { data: filtered } };
    }
    if (url === '/maintenance/calendar') {
      const list = mockData.maintenance.map((m) => ({
        ...m,
        scheduled_date: m.scheduled_date || m.created_date
      }));
      return { data: { data: list } };
    }
    if (url.startsWith('/maintenance/')) {
      const id = parseInt(url.split('/')[2]);
      const request = mockData.maintenance.find(m => m.id === id);
      return { data: { data: request } };
    }
    if (url === '/equipment') {
      return { data: { data: mockData.equipment } };
    }
    if (url.startsWith('/equipment/')) {
      const id = parseInt(url.split('/')[2]);
      const equipment = mockData.equipment.find(e => e.id === id);
      return { data: { data: equipment } };
    }
    if (url === '/work-centers') {
      return { data: { data: mockData.workCenters } };
    }
    if (url.startsWith('/work-centers/')) {
      const id = parseInt(url.split('/')[2]);
      const wc = mockData.workCenters.find(w => w.id === id);
      if (url.includes('/alternatives')) {
        return { data: { data: [] } };
      }
      return { data: { data: wc } };
    }
    if (url === '/teams') {
      return { data: { success: true, data: mockData.teams } };
    }
    return { data: { data: [] } };
  },
  
  post: async (url, data, config) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (url === '/auth/login') {
      const user = mockData.users.find(u => u.email === data.email && u.password === data.password);
      if (user) {
        return { data: { success: true, user: { id: user.id, name: user.name, email: user.email } } };
      }
      throw { response: { status: 401, data: { message: 'Invalid credentials' } } };
    }
    if (url === '/auth/signup') {
      const exists = mockData.users.find(u => u.email === data.email);
      if (exists) {
        throw { response: { status: 409, data: { message: 'Email already registered' } } };
      }
      const newUser = {
        id: Math.max(...mockData.users.map(u => u.id)) + 1,
        name: data.name,
        email: data.email,
        password: data.password
      };
      mockData.users.push(newUser);
      return { data: { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } } };
    }
    if (url === '/auth/forget-password') {
      return { data: { success: true, message: 'Password reset link sent to email' } };
    }
    if (url === '/auth/reset-password') {
      return { data: { success: true, message: 'Password reset successfully' } };
    }
    if (url === '/maintenance') {
      const newRequest = {
        id: Math.max(...mockData.maintenance.map(m => m.id), 0) + 1,
        ...data,
        status: 'open',
        created_date: new Date().toISOString()
      };
      mockData.maintenance.push(newRequest);
      return { data: { success: true, data: newRequest } };
    }
    if (url === '/teams') {
      const newTeam = {
        id: Math.max(...mockData.teams.map(t => t.id)) + 1,
        name: data.name,
        members_count: 0
      };
      mockData.teams.push(newTeam);
      return { data: { success: true, data: newTeam } };
    }
    if (url === '/work-centers') {
      const newWc = {
        id: Math.max(...mockData.workCenters.map(w => w.id)) + 1,
        name: data.name,
        location: data.location
      };
      mockData.workCenters.push(newWc);
      return { data: { success: true, data: newWc } };
    }
    if (url.includes('/work-centers/') && url.includes('/alternatives')) {
      return { data: { success: true, data: [] } };
    }
    return { data: { data: {} } };
  },
  
  patch: async (url, data, config) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (url.includes('/maintenance/') && url.includes('/status')) {
      const id = parseInt(url.split('/')[2]);
      const request = mockData.maintenance.find(m => m.id === id);
      if (request) {
        request.status = data.status;
      }
      return { data: { data: request } };
    }
    if (url.includes('/maintenance/') && url.includes('/assign')) {
      const id = parseInt(url.split('/')[2]);
      const request = mockData.maintenance.find(m => m.id === id);
      const user = mockData.users.find(u => u.id === data.user_id);
      if (request && user) {
        request.assigned_to_user_id = user.id;
        request.assigned_to_name = user.name;
      }
      return { data: { data: request } };
    }
    return { data: { data: {} } };
  }
};

// Export API that uses mock or real based on config
export const api = USE_MOCK ? mockApi : realApi;
