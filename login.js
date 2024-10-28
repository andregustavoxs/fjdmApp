import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import {Text, TextInput, TouchableOpacity, View, StyleSheet} from "react-native";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage('Logado com sucesso');
        } catch (error) {
            setMessage('Usuário ou senha inválidos.');
        }
    };

    return (
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
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
                </View>
                {message ? <Text>{message}</Text> : null}
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 32,
        marginBottom: 40,
        fontWeight: 'bold',
    },
    form: {
        width: '100%',
    },
    input: {
        marginVertical: 10,
        padding: 15,
        fontSize: 18,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        color: 'red',
    },
});

export default Login;