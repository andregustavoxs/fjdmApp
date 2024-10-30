import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, ImageBackground } from 'react-native';
import {verificarSeOsCamposDaTelaDeLoginEstaoVazios, verificarLogin} from '../utils/funcoes';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!verificarSeOsCamposDaTelaDeLoginEstaoVazios(email, password)) {
            return;
        }

        await verificarLogin(email, password);
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/Checkers.png')} style={styles.backgroundImage}></ImageBackground>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Logar</Text>
            </TouchableOpacity>
            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Cadastre-se</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.link}>Esqueci minha senha</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    backgroundImage: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        marginBottom: 40,
        fontWeight: 'bold',
        paddingTop: 30,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linksContainer: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    link: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;