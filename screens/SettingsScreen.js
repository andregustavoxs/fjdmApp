import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, useColorScheme } from 'react-native';

export default function SettingsScreen({ navigation }) {
    const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);
    const [isDarkModeEnabled, setIsDarkModeEnabled] = React.useState(false);
    const colorScheme = useColorScheme();

    const toggleNotificationsSwitch = () => setIsNotificationsEnabled(previousState => !previousState);
    const toggleDarkModeSwitch = () => setIsDarkModeEnabled(previousState => !previousState);

    const isDarkMode = isDarkModeEnabled || colorScheme === 'dark';

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Configurações</Text>

            <View style={[styles.optionContainer, isDarkMode && styles.darkOptionContainer]}>
                <Text style={[styles.optionText, isDarkMode && styles.darkOptionText]}>Notificações</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleNotificationsSwitch}
                    value={isNotificationsEnabled}
                />
            </View>

            <View style={[styles.optionContainer, isDarkMode && styles.darkOptionContainer]}>
                <Text style={[styles.optionText, isDarkMode && styles.darkOptionText]}>Modo Escuro</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isDarkModeEnabled ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleDarkModeSwitch}
                    value={isDarkModeEnabled}
                />
            </View>

            <TouchableOpacity
                style={[styles.backButton, isDarkMode && styles.darkBackButton]}
                onPress={() => navigation.goBack()}
            >
                <Text style={[styles.backButtonText, isDarkMode && styles.darkBackButtonText]}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    darkContainer: {
        backgroundColor: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    darkTitle: {
        color: '#fff',
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    darkOptionContainer: {
        backgroundColor: '#444',
        shadowColor: '#fff',
    },
    optionText: {
        fontSize: 18,
        color: '#333',
    },
    darkOptionText: {
        color: '#fff',
    },
    backButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#007BFF',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    darkBackButton: {
        backgroundColor: '#0056b3',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    darkBackButtonText: {
        color: '#ccc',
    },
});