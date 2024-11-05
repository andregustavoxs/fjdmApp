import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const years = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];

export default function RankScreen() {
  return (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Rank dos Vencedores de Cada Campeonato</Text>
      </View>

      {/* Lista de anos */}
      <FlatList
        data={years}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.yearItem}>
            <Text style={styles.yearText}>{item}</Text>
            <Ionicons name="arrow-forward" size={20} color="black" />
          </TouchableOpacity>
        )}
      />

      {/* Barra de navegação inferior */}
      <View style={styles.footer}>
        <Ionicons name="home-outline" size={30} color="black" />
        <Ionicons name="search-outline" size={30} color="black" />
        <Ionicons name="settings-outline" size={30} color="black" />
        <Ionicons name="person-outline" size={30} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#d3d3d3',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  yearItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  yearText: {
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
