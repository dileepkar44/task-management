import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

const useTasksStore = create((set, get) => ({
  tasks: [], // This should be the tasks array, not logs
  loading: false,
  error: null,
  
  // Initialize tasks listener for a user
  initializeTasks: (userId) => {
    set({ loading: true });
    const q = query(collection(db, 'tasks'), where('createdBy', '==', userId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = [];  // Ensure this is the tasks data, not logs
      snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      set({ tasks, loading: false });
    }, (error) => {
      set({ error: error.message, loading: false });
    });
    
    return unsubscribe;
  },
  
  // Add new task
  addTask: async (taskData) => {
    try {
      set({ loading: true });
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: new Date().toISOString(),
      });
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Update task
  updateTask: async (taskId, updates) => {
    try {
      set({ loading: true });
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, updates);
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Delete task
  deleteTask: async (taskId) => {
    try {
      set({ loading: true });
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Clear store
  clearTasks: () => {
    set({ tasks: [], loading: false, error: null });
  }
}));

export default useTasksStore;
