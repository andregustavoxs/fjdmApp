// utils.js
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { Animated } from 'react-native'

/**
 * Verifica se um email já está registrado no banco de dados.
 *
 * @param {string} email - O email a ser verificado.
 * @returns {Promise<boolean>} - Retorna uma promessa que resolve para `true` se o email estiver registrado, caso contrário, `false`.
 */
export const verificarSeOEmailEstaRegistrado = async email => {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('email', '==', email))
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty
}

/**
 * Registra um novo usuário no banco de dados.
 *
 * @param {Object} dadosDoUsuario - Os dados do usuário a serem registrados.
 * @param {Object} navegacao - O objeto de navegação para redirecionamento após o registro.
 * @returns {Promise<void>} - Retorna uma promessa que resolve quando o registro for concluído.
 */
export const registrarUsuario = async (dadosDoUsuario, navegacao) => {
  const referenciaUsuarios = collection(db, 'users')
  const is_admin = false
  try {
    await addDoc(referenciaUsuarios, { dadosDoUsuario, is_admin })
    alert('Registro bem-sucedido')
    await navegacao.navigate('Login')
  } catch (error) {
    alert('Erro ao registrar: ' + error.message)
  }
}

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
export const verificarSeOsCamposDaTelaDeRegistroEstaoVazios = (
  name,
  email,
  number,
  city,
  password,
  confirmPassword
) => {
  if (!name || !email || !number || !city || !password || !confirmPassword) {
    alert('Por favor, preencha todos os campos.')
    return false
  }
  return true
}

/**
 * Verifica se as senhas fornecidas são iguais.
 *
 * @param {string} password - A senha do usuário.
 * @param {string} confirmPassword - A confirmação da senha do usuário.
 * @returns {boolean} - Retorna `true` se as senhas coincidirem, caso contrário, `false`.
 */
export const verificarSeAsSenhasSaoIguais = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    alert('As senhas não coincidem.')
    return false
  }
  return true
}

/**
 * Verifica se o email e a senha da tela de Login estão preenchidos.
 *
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {boolean} - Retorna `true` se ambos os campos estiverem preenchidos, caso contrário, `false`.
 */
export const verificarSeOsCamposDaTelaDeLoginEstaoVazios = (
  email,
  password
) => {
  if (!email || !password) {
    alert('Por favor, insira um email e uma senha.')
    return false
  }
  return true
}

/**
 * Verifica as credenciais de login do usuário.
 *
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<void>} - Retorna uma promessa que resolve quando a verificação for concluída.
 */
export const verificarLogin = async (
  email,
  password,
  previousScreen,
  navigation
) => {
  const userData = await obterDadosDoUsuarioPorEmail(email)

  if (validarCredenciaisDoUsuario(userData, password)) {
    await navigation.navigate(previousScreen, { loggedUser: userData })
  }
}

/**
 * Obtém os dados do usuário pelo email.
 *
 * @param {string} email - O email do usuário.
 * @returns {Promise<Object|null>} - Retorna uma promessa que resolve para os dados do usuário se encontrado, caso contrário, `null`.
 */
const obterDadosDoUsuarioPorEmail = async email => {
  const referenciaUsuarios = collection(db, 'users')
  const consulta = query(referenciaUsuarios, where('email', '==', email))
  const resultadoConsulta = await getDocs(consulta)

  if (!resultadoConsulta.empty) {
    const documentoUsuario = resultadoConsulta.docs[0]
    return documentoUsuario.data()
  }
  return null
}

/**
 * Valida as credenciais do usuário.
 *
 * @param {Object} userData - Os dados do usuário.
 * @param {string} password - A senha do usuário.
 */
const validarCredenciaisDoUsuario = (userData, password) => {
  if (userData) {
    if (userData.password === password) {
      alert('Login bem-sucedido')
      return true
    } else {
      alert('Senha incorreta')
      return false
    }
  } else {
    alert('Email inexistente')
    return false
  }
}

/**
 * Cria uma animação quando o usuário abre o aplicativo e navega para a tela de login após a animação.
 *
 * @param {Animated.Value} animacao - O valor de animação para controlar a opacidade.
 * @param {Object} navegacao - O objeto de navegação para redirecionamento após a animação.
 */
export const criarAnimacaoDeSplash = (animacao, navegacao) => {
  Animated.timing(animacao, {
    toValue: 1,
    duration: 2000,
    useNativeDriver: true
  }).start(() => {
    setTimeout(() => {
      navegacao.replace('Home')
    }, 2000)
  })
}

// Obtem todos os torneios cadastrados (Retorna um array de DocumentSnapshot)
export const getAllTournaments = async () => {
  const tournamentsRef = collection(db, 'tournaments')
  const tournamentsQuery = query(tournamentsRef)
  const tournamentsDocs = await getDocs(tournamentsQuery)

  if (!tournamentsDocs.empty) {
    const tournamentDocs = tournamentsDocs.docs
    return tournamentDocs
  }

  return null
}

// Obtem os nomes das categories de um torneio pelo id desse torneio
export const getCategoriesByTournamentId = async tournamentId => {

  const tournamentsCategoriesRef = collection(db, 'tournaments_categories')
  const categoriesRef = collection(db, 'categories')

  const tournamentsCategoriesQuery = query(
    tournamentsCategoriesRef,
    where('tournament_id', '==', `tournaments/${tournamentId}`)
  )
  const tournamentsCategoriesDocs = await getDocs(tournamentsCategoriesQuery)

  const categoriesQuery = query(categoriesRef)
  const categoriesDocs = await getDocs(categoriesQuery)

  const contextCategories = categoriesDocs.docs.filter(doc => {

    const contextCategoriesId = tournamentsCategoriesDocs.docs.map(doc2 => doc2.data().category_id)

    console.log(contextCategoriesId);
    console.log(doc.id);

    return contextCategoriesId.includes(`categories/${doc.id}`);

  });

  console.log(contextCategories);

  const contextCategoriesNames = contextCategories.map((categorySnapshot) => categorySnapshot.data().name)

  return contextCategoriesNames
  
}

// Função para formatar a data no formato "dd/mm/yyyy"
export const formatDate = date => {
  if (!(date instanceof Date)) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Função para formatar a hora no formato "HH:mm"
export const formatTime = date => {
  if (!(date instanceof Date)) return ''
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// Conversor de string para Date (apenas data, ignorando o horário)
export const convertToDate = text => {
  console.log('---' + text)

  const [day, month, year] = text.split('/').map(Number)
  if (!day || !month || !year) return new Date() // Retorna a data atual se a entrada for inválida
  return new Date(year, month - 1, day)
}

// Conversor de string para Date (apenas hora, ignorando a data)
export const convertToTime = text => {
  const [hours, minutes] = text.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) return new Date() // Retorna a data atual se a entrada for inválida
  const date = new Date(1970, 1, 1, 0, 0, 0)
  date.setHours(hours)
  date.setMinutes(minutes)
  return date
}

// Define o status de um torneio a partir dos dados de data
export const chooseStatus = (
  tournament_start_date,
  tournament_end_date,
  registration_start_date,
  registration_end_date
) => {
  const today = new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)

  const status_per_periods = {
    'Inscrições Abertas':
      today >= registration_start_date && today <= registration_end_date,
    'Em Andamento':
      today >= tournament_start_date && today <= tournament_end_date,
    Encerrado: today > tournament_end_date,
    'Em Espera': true
  }

  for (const status_per_period in status_per_periods) {
    if (status_per_periods[status_per_period]) {
      return status_per_period
    }
  }
}
