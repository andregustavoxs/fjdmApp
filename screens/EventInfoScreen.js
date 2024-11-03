import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native'

import {
  chooseStatus,
  formatDate,
  formatTime,
  getCategoriesByTournamentId
} from '../utils/funcoes'

export default function EventInfoScreen({ route, navigation }) {

  const { eventContext, eventId, loggedUser } = route.params

  const [eventCategories, setEventCategories] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getCategoriesByTournamentId(eventId) // Carrega os dados assincronamente
        setEventCategories(categories)
      } catch (error) {
        console.error('Erro ao carregar categories:', error)
      }
    }

    loadCategories()
  }, [])

  if (!eventContext) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Torneio não encontrado</Text>
      </View>
    )
  }

  {
    console.log(eventContext)
  }

  const tournamentStartDate = new Date(eventContext.tournament_start_date.seconds * 1000);
  const tournamentEndDate = new Date(eventContext.tournament_end_date.seconds * 1000);
  const tournamentStartTime = new Date(eventContext.tournament_start_time.seconds * 1000);
  const tournamentEndTime = new Date(eventContext.tournament_end_time.seconds * 1000);
  const registrationStartDate = new Date(eventContext.registration_start_date.seconds * 1000);
  const registrationEndDate = new Date(eventContext.registration_end_date.seconds * 1000);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título do Torneio */}
      <Text style={styles.title}>{eventContext.name}</Text>

      {/* Informações do Torneio */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Data do Torneio:</Text>{' '}
          {formatDate(
            tournamentStartDate
          )}{' '}
          a{' '}
          {formatDate(
            tournamentEndDate
          )}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Horário do Torneio:</Text>{' '}
          {formatTime(
            tournamentStartTime
          )}{' '}
          às{' '}
          {formatTime(
            tournamentEndTime
          )}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Data de Inscrição:</Text>{' '}
          {formatDate(
            registrationStartDate
          )}{' '}
          às{' '}
          {formatDate(
            registrationEndDate
          )}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Local:</Text> {eventContext.location}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Preço:</Text>{' '}
          <Text>R$ {eventContext.price}</Text>
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Status:</Text> <Text>{ chooseStatus(
            tournamentStartDate,
            tournamentEndDate,
            registrationStartDate,
            registrationEndDate
          )}</Text>
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Categorias:</Text>{' '}
          <Text> {'\n' + eventCategories.map((category) => ' - ' + category).join('\n')} </Text>
        </Text>
      </View>

      {/* Botões de Ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Lista de Participantes')}
        >
          <Text style={styles.buttonText}>Participantes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Cadastro de Torneio', { eventId })
          }
        >
          <Text style={styles.buttonText}>Editar Torneio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('Participação confirmada!')}
        >
          <Text style={styles.buttonText}>Quero Participar</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center'
  },
  imageContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 10
  },
  image: {
    width: 300,
    height: 200
  },
  infoContainer: {
    marginVertical: 15,
    width: '100%'
  },
  infoText: {
    fontSize: 16,
    marginVertical: 3
  },
  label: {
    fontWeight: 'bold'
  },
  greenText: {
    color: 'green'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navText: {
    fontSize: 24
  }
})
