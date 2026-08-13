// js/services/authService.js — Capa de abstracción sobre Firebase Auth

import { auth, firebase } from '../firebase/config.js';

export function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

export function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

export function register(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
}

export function logout() {
    return auth.signOut();
}

export function sendPasswordReset(email) {
    return auth.sendPasswordResetEmail(email);
}

export function updateDisplayName(user, name) {
    return user.updateProfile({ displayName: name });
}
export function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    provider.setCustomParameters({
        prompt: 'select_account'
    });

    return auth.signInWithPopup(provider);
}