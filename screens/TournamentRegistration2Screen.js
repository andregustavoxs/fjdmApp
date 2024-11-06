import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { Picker } from '@react-native-picker/picker'

import { db } from '../config/firebaseConfig.js'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'

export default function TournamentRegistration2Screen({ navigation, route }) {

  const { tournamentData, loggedUser } = route.params

  const [categories, setCategories] = useState([])

  const registerAndRedirectHome = async () => {

    console.log(loggedUser);

    await registerTournament(tournamentData, loggedUser, categories)
    navigation.navigate('Home', { loggedUser })

  }

  // Colocar depois em funcoes.js
  const registerTournament = async (tournamentData, loggedUser, categories) => {

    const tournamentsRef = collection(db, 'tournaments');
    const categoriesRef = collection(db, 'categories');
    const usersTournamentsRef = collection(db, 'users_tournaments');
    const tournamentsCategoriesRef = collection(db, 'tournaments_categories');

    try {
      const registeredTournament = await addDoc(tournamentsRef, tournamentData); // Cadastro do documento na coleção torneios

      // Relaciona o torneio cadastrado ao usuário logado
      await addDoc(usersTournamentsRef, {
        user_id: `users/${loggedUser.id}`,
        tournament_id: `tournaments/${registeredTournament.id}`,
        relation_type: "creation",
      });

      const categoriesQuery = query(
        categoriesRef,
        where('name', 'in', categories)
      );

      console.log(categories);
      console.log(categoriesQuery);

      const categoriesDocs = await getDocs(categoriesQuery)

      console.log(categoriesDocs);

      // Relaciona as categorias definidas ao torneio cadastrado
      categoriesDocs.docs.map(async (doc) => {
          await addDoc(tournamentsCategoriesRef, {
          category_id: `categories/${doc.id}`,
          tournament_id: `tournaments/${registeredTournament.id}`
        })
      })
        
    } catch (error) {
      alert('Erro ao registrar: ' + error.message)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categories[categories.length - 1]}
            onValueChange={itemValue => setCategories(!categories.includes(itemValue) ? categories.concat(itemValue) : categories)}
            style={styles.picker}
            dropdownIconColor="white"
          >
            <Picker.Item label="Selecione Uma ou Mais Opções" value="" />
            <Picker.Item label="Iniciante" value="Iniciante" />
            <Picker.Item label="Júnior" value="Junior" />
            <Picker.Item label="Pleno" value="Pleno" />
            <Picker.Item label="Sênior" value="Senior" />
          </Picker>
        </View>
        <Text style={styles.selectedCategoriesText}>Categorias Selecionadas: {categories.join(", ")} </Text>
        <TouchableOpacity style={styles.clearButton} onPress={() => setCategories([])}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Cadastro de Torneio (1/2)')}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={registerAndRedirectHome}
        >
          <Text style={styles.registerButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  section: {
    width: '100%',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5
  },
  pickerContainer: {
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden'
  },
  picker: {
    color: 'white',
    backgroundColor: '#000',
    height: 50,
    paddingHorizontal: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30
  },
  backButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7a42f4',
    alignItems: 'center',
    marginRight: 10
  },
  backButtonText: {
    color: '#7a42f4',
    fontSize: 16
  },
  registerButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f00',
    alignItems: 'center',
    marginLeft: 10
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16
  },
  selectedCategoriesText: {
    fontSize: 16,
    color: '#555', // Cor do texto das categorias selecionadas
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: '#ff6347', // Cor de fundo do botão
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff', // Cor do texto do botão
    fontSize: 16,
    fontWeight: 'bold',
  },
})
