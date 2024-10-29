import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import {
    verificarSeOEmailEstaRegistrado,
    registrarUsuario,
    verificarSeAsSenhasSaoIguais,
    verificarSeOsCamposEstaoVazios
} from './funcoes';
import {db} from "./firebaseConfig";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (!verificarSeOsCamposEstaoVazios(name, email, number, city, password, confirmPassword)) {
            return;
        }

        if (!verificarSeAsSenhasSaoIguais(password, confirmPassword)) {
            return;
        }

        if (await verificarSeOEmailEstaRegistrado(email)) {
            alert('E-mail já cadastrado.');
            return;
        }

        const userData = { name, email, number, city, password };
        await registrarUsuario(userData, navigation);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrar</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />
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
                placeholder="Número"
                value={number}
                onChangeText={setNumber}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Município"
                value={city}
                onChangeText={setCity}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity onPress={handleRegister} style={styles.button}>
                <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Já tem uma conta? Logue Agora</Text>
            </TouchableOpacity>
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
    title: {
        fontSize: 32,
        marginBottom: 40,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 20,
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
    loginText: {
        color: '#007BFF',
        textDecorationLine: 'underline',
        marginTop: 20,
    },
});

export default RegisterScreen;