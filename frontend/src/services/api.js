import axios from 'axios';
const API_URL = 'http://localhost:4000';

export const getTasks = () => axios.get(`${API_URL}/tasks`).then(res => res.data);
export const createTask = (task) => axios.post(`${API_URL}/tasks`, task).then(res => res.data);
export const updateTask = (id, task) => axios.put(`${API_URL}/tasks/${id}`, task).then(res => res.data);
export const deleteTask = (id) => axios.delete(`${API_URL}/tasks/${id}`).then(res => res.data);
