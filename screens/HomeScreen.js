import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native'
import { getAllTournaments, chooseStatus } from '../utils/funcoes.js' // Ajuste para a função que retorna os eventos

export default function HomeScreen({ navigation, route }) {
  const [eventName, setEventName] = useState('')
  const [allEvents, setAllEvents] = useState([]) // Inicializa com array vazio
  const [filteredEvents, setFilteredEvents] = useState([])

  const { loggedUser } = route.params ? route.params : {}

  // Filtra apenas os eventos que irão começar em 20 dias e que terminaram em 20 dias
  const filterByDate = () => {
    setFilteredEvents(
      allEvents.filter(eventSnapshot => {
        const event = eventSnapshot.data()

        const tournamentStartDate = new Date(
          event.tournament_start_date.seconds * 1000
        )
        const tournamentEndDate = new Date(
          event.tournament_end_date.seconds * 1000
        )

        const startDatePeriod = new Date()
        const endDatePeriod = new Date()

        startDatePeriod.setHours(0)
        startDatePeriod.setMinutes(0)
        startDatePeriod.setSeconds(0)

        startDatePeriod.setDate(startDatePeriod.getDate() - 20)

        endDatePeriod.setHours(0)
        endDatePeriod.setMinutes(0)
        endDatePeriod.setSeconds(0)

        endDatePeriod.setDate(endDatePeriod.getDate() + 20)

        return (
          tournamentStartDate >= startDatePeriod &&
          tournamentEndDate <= endDatePeriod
        )
      })
    )
  }

  useEffect(() => {

    console.log("UseEffect Executado!")
    
    const fetchEvents = async () => {
      try {
        const events = await getAllTournaments() // Carrega os dados assincronamente
        setAllEvents(events)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    }

    fetchEvents();
  }, [])

  // Só irá chamar o filtro quando allEvents for resolvido
  useEffect(() => {
    if (allEvents.length > 0) {
      console.log("Filtrando eventos por data!");
      filterByDate();
    }
  }, [allEvents]);

  /* Realizar a filtragem dos eventos */
  useEffect(() => {
    if (eventName) {
      const fetchEventsByName = () => {
        try {
          const filteredEventsByName = allEvents.filter(eventSnapshot => {
            const event = eventSnapshot.data()

            return event.name.toLowerCase().includes(eventName.toLowerCase())
          })

          filterByDate() // Reseta o filteredEvents

          setFilteredEvents(
            filteredEventsByName.filter(eventSnapshot => {
              const dateFilteredEventNames = filteredEvents.map(
                eventSnapshot2 => eventSnapshot2.data().name
              )

              return dateFilteredEventNames.includes(eventSnapshot.data().name)
            })
          )
        } catch (error) {
          console.error('Erro ao carregar eventos:', error)
        }
      }
      fetchEventsByName()
    } else {
      filterByDate()
    }
  }, [eventName])

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Apenas gestores (is_admin == true) podem criar torneios*/}
        <View style={styles.headerButtons}>
          {loggedUser && loggedUser.is_admin && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Cadastro de Torneio (1/2)', { loggedUser })
              }
              style={styles.plusButton}
            >
              <Text style={styles.plusButtonText}>+</Text>
            </TouchableOpacity>
          )}
          {!loggedUser && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() =>
                navigation.navigate('Login', { screenName: 'Home' })
              }
            >
              <Text style={styles.loginText}>Logar</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title}>Lista de Torneios</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          value={eventName}
          onChangeText={setEventName}
        />
      </View>

      {/* Tournament List */}
      { !allEvents ? (<View style={ styles.loadingContainer }>
        <Text style={ styles.loadingText }>Carregando Eventos...</Text>
      </View>) : (<ScrollView style={styles.tournamentList}>
        {filteredEvents.map(eventSnapshot => {
          const event = eventSnapshot.data()

          const tournamentStartDate = new Date(
            event.tournament_start_date.seconds * 1000
          )
          const tournamentEndDate = new Date(
            event.tournament_end_date.seconds * 1000
          )
          const registrationStartDate = new Date(
            event.registration_start_date.seconds * 1000
          )
          const registrationEndDate = new Date(
            event.registration_end_date.seconds * 1000
          )

          return (
            <View key={eventSnapshot.id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.name}</Text>
              <Text>{`Status: ${chooseStatus(
                tournamentStartDate,
                tournamentEndDate,
                registrationStartDate,
                registrationEndDate
              )}`}</Text>
              <Text>{`Data de Início: ${tournamentStartDate.toLocaleDateString()}`}</Text>
              <Text>{`Data de Término: ${tournamentEndDate.toLocaleDateString()}`}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Informações do Torneio', {
                    eventContext: event,
                    eventId: eventSnapshot.id,
                    loggedUser: loggedUser
                  })
                }
                style={styles.eventButton}
              >
                <Text style={styles.eventButtonText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>)}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home', { loggedUser })}
        >
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Buscar Torneio', { loggedUser })}
        >
          <Text style={styles.navIcon}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navIcon}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Informações da Conta', { loggedUser })
          }
        >
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    margin: 20
  },
  headerButtons: {
    alignItems: 'center',
    padding: 20,
    margin: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  plusButton: {
    position: 'absolute',
    right: 175,
  },
  plusButtonText: {
    fontSize: 20
  },
  loginButton: {
    backgroundColor: '#64C8A9',
    position: 'absolute',
    left: 120,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  loadingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: "#000",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10
  },
  tournamentList: {
    flex: 1,
    paddingHorizontal: 20
  },
  eventCard: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    marginBottom: 8
  },
  eventTitle: { fontSize: 18, fontWeight: 'bold' },
  eventButton: {
    marginTop: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    padding: 8
  },
  eventButtonText: { color: '#fff', textAlign: 'center' },
  openText: {
    color: '#64C8A9',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  navIcon: {
    fontSize: 24
  }
})
