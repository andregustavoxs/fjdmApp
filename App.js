import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/firebaseConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from "./screens/RegisterScreen";
import ErrorScreen from './screens/ErrorScreen';
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import SplashScreen from './screens/SplashScreen';


const Stack = createStackNavigator();

export default function App() {
    const [error, setError] = useState(false);

    useEffect(() => {
        const fazerConexaoComOBancoDeDados = async () => {
            const email = 'admin@fjdm.com.br'; // Email do administrador do Banco de Dados
            const password = '12345678'; // Senha do administrador do Banco de Dados
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                setError(true);
            }
        };

        fazerConexaoComOBancoDeDados();
    }, []);

    if (error) {
        return <ErrorScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});