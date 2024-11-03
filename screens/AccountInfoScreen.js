import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity
  
 } from 'react-native';

export default function AccountInfoScreen({navigation, route}) {

  const { loggedUser } = route.params ? route.params : {}

  useEffect(() => {
     
    const verifyIfIsLogged = () => {
      if (!loggedUser) {

        navigation.navigate("Login", { screenName: "Informações da Conta"});
        
      }
    }
  
    verifyIfIsLogged();
  }, []);

  return (

    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      { loggedUser && (
        <>
        <View style={ styles.header }>
          <Text style={styles.title}>Informações da Conta</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{loggedUser.name}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{loggedUser.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Cidade</Text>
          <Text style={styles.value}>{loggedUser.city}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Número</Text>
          <Text style={styles.value}>{loggedUser.number}</Text>
        </View>
      </>
      )}
    </ScrollView>
    {/* Bottom Navigation */}
    <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home', { loggedUser })}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Buscar Torneio', { loggedUser })}>
          <Text style={styles.navIcon}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navIcon}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Informações da Conta', { loggedUser })}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    color: '#888',
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navIcon: {
    fontSize: 24
  }
});