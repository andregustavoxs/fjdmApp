import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handlePasswordReset = () => {
        Alert.alert('Email enviado', 'Enviamos o link para redefinir sua senha por e-mail!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Esqueci minha senha</Text>
            <Text style={styles.description}>
                Por favor, insira o endereço de e-mail para o qual você gostaria que a confirmação de redefinição de senha fosse enviada.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o seu e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
                <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Voltar para a tela de login</Text>
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
        marginBottom: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
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

export default ForgotPasswordScreen;