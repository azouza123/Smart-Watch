const API_BASE_URL = 'http://localhost:8081/api';

// Fonction utilitaire pour les appels API
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// ==================== AUTH ====================
export const authApi = {
  login: (email: string, password: string) =>
    apiCall<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: any) =>
    apiCall<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// ==================== ADMIN ====================
export const adminApi = {
  // Utilisateurs
  getUsers: () => apiCall<any[]>('/admin/accounts'),
  getUser: (id: number) => apiCall<any>(`/admin/accounts/${id}`),
  createUser: (userData: any) =>
    apiCall<any>('/admin/accounts', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  updateUser: (id: number, userData: any) =>
    apiCall<any>(`/admin/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  deleteUser: (id: number) =>
    apiCall<void>(`/admin/accounts/${id}`, { method: 'DELETE' }),

  // Bâtiments
  getBuildings: () => apiCall<any[]>('/admin/buildings'),
  getBuilding: (id: number) => apiCall<any>(`/admin/buildings/${id}`),
  createBuilding: (buildingData: any) =>
    apiCall<any>('/admin/buildings', {
      method: 'POST',
      body: JSON.stringify(buildingData),
    }),
  updateBuilding: (id: number, buildingData: any) =>
    apiCall<any>(`/admin/buildings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(buildingData),
    }),
  deleteBuilding: (id: number) =>
    apiCall<void>(`/admin/buildings/${id}`, { method: 'DELETE' }),

  // Capteurs
  getSensors: () => apiCall<any[]>('/admin/sensors'),
  getSensor: (id: number) => apiCall<any>(`/admin/sensors/${id}`),
  createSensor: (sensorData: any) =>
    apiCall<any>('/admin/sensors', {
      method: 'POST',
      body: JSON.stringify(sensorData),
    }),
  updateSensor: (id: number, sensorData: any) =>
    apiCall<any>(`/admin/sensors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sensorData),
    }),
  deleteSensor: (id: number) =>
    apiCall<void>(`/admin/sensors/${id}`, { method: 'DELETE' }),
  getSensorsByBuilding: (buildingId: number) =>
    apiCall<any[]>(`/admin/sensors/batiment/${buildingId}`),

  // Seuils
  getThresholds: () => apiCall<any>('/admin/thresholds'),
  configureThresholds: (thresholds: any) =>
    apiCall<any>('/admin/thresholds', {
      method: 'POST',
      body: JSON.stringify(thresholds),
    }),
};

// ==================== MANAGER ====================
export const managerApi = {
  getConsumption: () => apiCall<any[]>('/manager/consumption'),
  getConsumptionByBuilding: (buildingId: number) =>
    apiCall<any[]>(`/manager/consumption/batiment/${buildingId}`),
  getTargets: () => apiCall<any[]>('/manager/targets'),
  getTargetByBuilding: (buildingId: number) =>
    apiCall<any>(`/manager/targets/${buildingId}`),
  getAlerts: () => apiCall<any[]>('/manager/alerts'),
  getAlertsByManager: (managerId: number) =>
    apiCall<any[]>(`/manager/alerts/${managerId}`),
  manageAction: (actionData: any) =>
    apiCall<any>('/manager/actions', {
      method: 'POST',
      body: JSON.stringify(actionData),
    }),
  getAllActions: () => apiCall<any[]>('/manager/actions'),
  getBuildingDetails: (buildingId: number) =>
    apiCall<any>(`/manager/details/batiment/${buildingId}`),
};

// ==================== OCCUPANT ====================
export const occupantApi = {
  getWaterConsumption: () => apiCall<any[]>('/occupant/water'),
  getWaterConsumptionByBuilding: (buildingId: number) =>
    apiCall<any[]>(`/occupant/water/batiment/${buildingId}`),
  sendAlert: (alertData: any) =>
    apiCall<any>('/occupant/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    }),
  getMyAlerts: (occupantId: number) =>
    apiCall<any[]>(`/occupant/alerts/${occupantId}`),
  getAdvice: () => apiCall<any[]>('/occupant/advice'),
  getComparison: () => apiCall<any>('/occupant/comparison'),
  getComparisonByBuilding: (buildingId: number) =>
    apiCall<any>(`/occupant/comparison/batiment/${buildingId}`),
};

// ==================== TECHNICIAN ====================
export const technicianApi = {
  createIntervention: (interventionData: any) =>
    apiCall<any>('/technician/interventions', {
      method: 'POST',
      body: JSON.stringify(interventionData),
    }),
  getAllInterventions: () => apiCall<any[]>('/technician/interventions'),
  getTasks: () => apiCall<any[]>('/technician/tasks'),
  getTasksByTechnician: (technicianId: number) =>
    apiCall<any[]>(`/technician/tasks/${technicianId}`),
  getSensorStats: () => apiCall<any[]>('/technician/sensor-stats'),
  getSensorStatsById: (sensorId: number) =>
    apiCall<any>(`/technician/sensor-stats/${sensorId}`),
  getSensorsByEtat: (etat: boolean) =>
    apiCall<any[]>(`/technician/sensor-stats/etat/${etat}`),
  getAlerts: () => apiCall<any[]>('/technician/alerts'),
  getAlertsByTechnician: (technicianId: number) =>
    apiCall<any[]>(`/technician/alerts/${technicianId}`),
  getAlertsBySensor: (sensorId: number) =>
    apiCall<any[]>(`/technician/alerts/capteur/${sensorId}`),
};

// ==================== DASHBOARD ====================
export const dashboardApi = {
  getStats: () => apiCall<any>('/dashboard/stats'),
  getAlerts: () => apiCall<any[]>('/dashboard/alerts'),
  getConsumption: () => apiCall<any[]>('/dashboard/consumption'),
  getSensorData: () => apiCall<any[]>('/dashboard/sensors'),
};

// ==================== BÂTIMENTS (utilisé par plusieurs rôles) ====================
export const batimentApi = {
  getAll: () => apiCall<any[]>('/batiments'),
  getById: (id: number) => apiCall<any>(`/batiments/${id}`),
  create: (data: any) =>
    apiCall<any>('/batiments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/batiments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<void>(`/batiments/${id}`, { method: 'DELETE' }),
};

// ==================== UTILISATEURS (utilisé par plusieurs rôles) ====================
export const utilisateurApi = {
  getAll: () => apiCall<any[]>('/utilisateurs'),
  getById: (id: number) => apiCall<any>(`/utilisateurs/${id}`),
  create: (data: any) =>
    apiCall<any>('/utilisateurs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/utilisateurs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<void>(`/utilisateurs/${id}`, { method: 'DELETE' }),
};

