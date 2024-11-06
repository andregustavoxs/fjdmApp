/* Conexão com a API do firebase */
import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './config/firebaseConfig'

/* Gerenciador de Telas */
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

/* Telas */
import RegisterScreen from './screens/RegisterScreen'
import ErrorScreen from './screens/ErrorScreen'
import LoginScreen from './screens/LoginScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import SplashScreen from './screens/SplashScreen'
import HomeScreen from './screens/HomeScreen'
import SearchEventScreen from './screens/SearchEventScreen'
import EventInfoScreen from './screens/EventInfoScreen'
import TournamentRegistrationScreen from './screens/TournamentRegistrationScreen'
import TournamentRegistration2Screen from './screens/TournamentRegistration2Screen'
import AccountInfoScreen from './screens/AccountInfoScreen'
import ListScreen from './screens/ListScreen'

const Stack = createStackNavigator()

export default function App() {
  const [error, setError] = useState(false)

  useEffect(() => {
    const fazerConexaoComOBancoDeDados = async () => {
      const email = 'admin@fjdm.com.br' // Email do administrador do Banco de Dados
      const password = '12345678' // Senha do administrador do Banco de Dados
      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch (error) {
        setError(true)
      }
    }

    fazerConexaoComOBancoDeDados()
  }, [])

  if (error) {
    return <ErrorScreen />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        {console.log(HomeScreen)}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Buscar Torneio"
          component={SearchEventScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Informações do Torneio"
          component={EventInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro de Torneio (1/2)"
          component={TournamentRegistrationScreen}
        />
        <Stack.Screen
          name="Cadastro de Torneio (2/2)"
          component={TournamentRegistration2Screen}
        />
        <Stack.Screen
          name="Informações da Conta"
          component={AccountInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Lista de Participantes"
          component={ListScreen}
          options={{ headerShown: true, title: 'Participantes do Torneio' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
