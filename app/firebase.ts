import { initializeApp } from 'firebase/app';
const firebaseConfig = {
    apiKey: 'AIzaSyDln_aynwxbhCOh9O3xcT1RXQnfQkNgPPc',
    authDomain: 'fnr-devops.firebaseapp.com',
    projectId: 'fnr-devops',
    storageBucket: 'fnr-devops.appspot.com',
    messagingSenderId: '893145544957',
    appId: '1:893145544957:web:8884874c956f24bbce2694',
    measurementId: 'G-WDYGHM4JM8'
};

export const app = initializeApp(firebaseConfig);