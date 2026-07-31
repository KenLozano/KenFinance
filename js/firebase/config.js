// js/firebase/config.js - Firebase initialization (Compat SDK from CDN)

const firebaseConfig = window.__KONTEO_FIREBASE_CONFIG__;
const firebase = window.firebase;

if (!firebase) {
    throw new Error('Firebase SDK no esta cargado en window.firebase');
}

if (!firebaseConfig || typeof firebaseConfig !== 'object') {
    throw new Error('Falta la configuracion de Firebase en window.__KONTEO_FIREBASE_CONFIG__');
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export { firebase };

db.enablePersistence({ synchronizeTabs: true }).catch(() => { });
