import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BackHandler } from 'react-native';

const ErrorScreen = () => {
    const handlePress = () => {
        BackHandler.exitApp();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>Erro na conexão com o banco de dados. Contate o administrador do sistema.</Text>
            <Button title="OK" onPress={handlePress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
        color: 'red',
    },
});

export default ErrorScreen;