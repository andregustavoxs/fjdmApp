// utils.js
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

/**
 * Verifica se um email já está registrado no banco de dados.
 *
 * @param {string} email - O email a ser verificado.
 * @returns {Promise<boolean>} - Retorna uma promessa que resolve para `true` se o email estiver registrado, caso contrário, `false`.
 */
export const verificarSeOEmailEstaRegistrado = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

/**
 * Registra um novo usuário no banco de dados.
 *
 * @param {Object} dadosDoUsuario - Os dados do usuário a serem registrados.
 * @param {Object} navegacao - O objeto de navegação para redirecionamento após o registro.
 * @returns {Promise<void>} - Retorna uma promessa que resolve quando o registro for concluído.
 */
export const registrarUsuario = async (dadosDoUsuario, navegacao) => {
    const referenciaUsuarios = collection(db, 'users');
    try {
        await addDoc(referenciaUsuarios, dadosDoUsuario);
        alert('Registro bem-sucedido');
        await navegacao.navigate('Login');
    } catch (error) {
        alert('Erro ao registrar: ' + error.message);
    }
};

/**
 * Verifica se todos os campos obrigatórios da tela de Registro estão preenchidos.
 *
 * @param {string} name - O nome do usuário.
 * @param {string} email - O email do usuário.
 * @param {string} number - O número de telefone do usuário.
 * @param {string} city - A cidade do usuário.
 * @param {string} password - A senha do usuário.
 * @param {string} confirmPassword - A confirmação da senha do usuário.
 * @returns {boolean} - Retorna `true` se todos os campos estiverem preenchidos, caso contrário, `false`.
 */
export const verificarSeOsCamposDaTelaDeRegistroEstaoVazios = (name, email, number, city, password, confirmPassword) => {
    if (!name || !email || !number || !city || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }
    return true;
};

/**
 * Verifica se as senhas fornecidas são iguais.
 *
 * @param {string} password - A senha do usuário.
 * @param {string} confirmPassword - A confirmação da senha do usuário.
 * @returns {boolean} - Retorna `true` se as senhas coincidirem, caso contrário, `false`.
 */
export const verificarSeAsSenhasSaoIguais = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return false;
    }
    return true;
};

/**
 * Verifica se o email e a senha da tela de Login estão preenchidos.
 *
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {boolean} - Retorna `true` se ambos os campos estiverem preenchidos, caso contrário, `false`.
 */
export const verificarSeOsCamposDaTelaDeLoginEstaoVazios = (email, password) => {
    if (!email || !password) {
        alert('Por favor, insira um email e uma senha.');
        return false;
    }
    return true;
};

/**
 * Verifica as credenciais de login do usuário.
 *
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<void>} - Retorna uma promessa que resolve quando a verificação for concluída.
 */
export const verificarLogin = async (email, password) => {
    const userData = await obterDadosDoUsuarioPorEmail(email);
    validarCredenciaisDoUsuario(userData, password);
};

/**
 * Obtém os dados do usuário pelo email.
 *
 * @param {string} email - O email do usuário.
 * @returns {Promise<Object|null>} - Retorna uma promessa que resolve para os dados do usuário se encontrado, caso contrário, `null`.
 */
const obterDadosDoUsuarioPorEmail = async (email) => {
    const referenciaUsuarios = collection(db, 'users');
    const consulta = query(referenciaUsuarios, where('email', '==', email));
    const resultadoConsulta = await getDocs(consulta);

    if (!resultadoConsulta.empty) {
        const documentoUsuario = resultadoConsulta.docs[0];
        return documentoUsuario.data();
    }
    return null;
};

/**
 * Valida as credenciais do usuário.
 *
 * @param {Object} userData - Os dados do usuário.
 * @param {string} password - A senha do usuário.
 */
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
