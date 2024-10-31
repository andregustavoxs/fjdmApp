import React, {useEffect, useState} from 'react';
import {View, Text, ImageBackground, StyleSheet, Animated} from 'react-native';
import {criarAnimacaoDeSplash} from "../utils/funcoes";

const SplashScreen = ({navigation}) => {
    /*
    No valor 0, o componente será completamente transparente.
    Quando a animação é iniciada, esse valor será alterado gradualmente até o valor final especificado na configuração da animação
    (no caso, seria 1 para opacidade total).
     */
    const [animacao] = useState(new Animated.Value(0));

    useEffect(() => {
        criarAnimacaoDeSplash(animacao, navigation);
    }, [animacao, navigation]);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/draughts-background.jpg')} style={styles.image}>
                <View style={styles.overlay}/>
                <Animated.View style={{...styles.textContainer, opacity: animacao}}>
                    <Text style={styles.text}>Bem-vindo à FJDM</Text>
                </Animated.View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black with 50% opacity
    },
    textContainer: {
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default SplashScreen;