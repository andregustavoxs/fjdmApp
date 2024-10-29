// utils.js
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const verificarSeOEmailEstaRegistrado = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

export const registrarUsuario = async (userData, navigation) => {
    const usersRef = collection(db, 'users');
    try {
        await addDoc(usersRef, userData);
        alert('Registro bem-sucedido');
        await navigation.navigate('Login');
    } catch (error) {
        alert('Erro ao registrar: ' + error.message);
    }
};

export const verificarSeOsCamposEstaoVazios = (name, email, number, city, password, confirmPassword) => {
    if (!name || !email || !number || !city || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }
    return true;
};

export const verificarSeAsSenhasSaoIguais = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return false;
    }
    return true;
};

export const verificarSeOEmailESenhaEstaoVazios = (email, password) => {
    if (!email || !password) {
        alert('Por favor, insira um email e uma senha.');
        return false;
    }
    return true;
};

export const verificarLogin = async (email, password) => {
    const userData = await obterDadosDoUsuarioPorEmail(email);
    validarCredenciaisDoUsuario(userData, password);
};

const obterDadosDoUsuarioPorEmail = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.data();
    }
    return null;
};

const validarCredenciaisDoUsuario = (userData, password) => {
    if (userData) {
        if (userData.password === password) {
            alert('Login bem-sucedido');
        } else {
            alert('Senha incorreta');
        }
    } else {
        alert('Email inexistente');
    }
};