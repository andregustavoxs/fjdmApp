import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from "./RegisterScreen";
import Login from './LoginScreen';
import ErrorScreen from './ErrorScreen';
import LoginScreen from "./LoginScreen";

const Stack = createStackNavigator();

export default function App() {
    const [error, setError] = useState(false);

    useEffect(() => {
        const loginAutomatically = async () => {
            const email = 'admin@fjdm.com.br'; // Substitua pelo email do usuário
            const password = '12345678'; // Substitua pela senha do usuário
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                setError(true);
            }
        };

        loginAutomatically();
    }, []);

    if (error) {
        return <ErrorScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});














// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import Login from './login';
//
// export default function App() {
//   return (
//       <View style={styles.container}>
//         <Login />
//       </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });

