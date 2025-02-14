import { create } from 'zustand';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';

const useActivityLogStore = create((set, get) => ({
  logs: [],
  loading: false,
  error: null,
  
  // Initialize logs listener
  initializeLogs: (userId) => {
    set({ loading: true });

    // Firestore query to fetch logs for the current user
    const q = query(
      collection(db, 'activityLogs'),
      where('userId', '==', userId), // Ensure this matches your Firestore schema
      orderBy('timestamp', 'desc'),  // Order by timestamp
      limit(100)                     // Limit to 100 logs
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logs = [];
        snapshot.forEach((doc) => {
          logs.push({ id: doc.id, ...doc.data() });
        });
        set({ logs, loading: false });
      },
      (error) => {
        console.error('Error fetching logs:', error);
        set({ error: error.message, loading: false });
      }
    );

    // Return unsubscribe function to clean up the listener
    return unsubscribe;
  },
  
  // Add new activity log
  addLog: async (logData) => {
    try {
      set({ loading: true });
      await addDoc(collection(db, 'activityLogs'), {
        ...logData,
        timestamp: new Date().toISOString(),
      });
      set({ loading: false });
    } catch (error) {
      console.error('Error adding log:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  // Clear logs
  clearLogs: () => {
    set({ logs: [], loading: false, error: null });
  }
}));

export default useActivityLogStore;