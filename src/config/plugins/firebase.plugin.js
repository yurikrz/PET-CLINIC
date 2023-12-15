import { initializeApp } from 'firebase/app';
import { envs } from '../enviroments/enviroments.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: envs.FIREBASE_API_KEY,
  projectId: envs.FIREBASE_PROJECT,
  storageBucket: envs.FIREBASE_STORAGE,
  appId: envs.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export const utilsFireBase = {
  storage: storage,
  ref,
  uploadBytes,
  getDownloadURL,
};
