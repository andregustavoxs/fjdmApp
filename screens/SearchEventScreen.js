import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal
} from 'react-native'

import RNDateTimePicker from '@react-native-community/datetimepicker'

import { getAllTournaments, chooseStatus } from '../utils/funcoes.js'

export default function SearchEventScreen({ navigation, route }) {
  const { loggedUser } = route.params ? route.params : {}

  const [filterVisible, setFilterVisible] = useState(false)
  const [dateButtonPressed, setDateButtonState] = useState(false)
  const [statusButtonPressed, setStatusButtonState] = useState(false)
  const [datePeriodVisible, setDatePeriodButtonsVisible] = useState(false)
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false)
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false)

  const [eventName, setEventName] = useState('')
  const [selectedDateOption, setSelectedDateOption] = useState('Sem Filtro')
  const [selectedStatusOption, setSelectedStatusOption] = useState('Sem Filtro')

  const [filteredEvents, setFilteredEvents] = useState([])
  const [allEvents, setAllEvents] = useState([]) // Para armazenar todos os torneios

  const [startDatePeriod, setStartDatePeriod] = useState(new Date())
  const [endDatePeriod, setEndDatePeriod] = useState(new Date())

  const [loading, setLoading] = useState(true)

  const defineStartDatePeriod = dateInfo => {
    const contextDate = new Date(dateInfo.nativeEvent.timestamp)
    const newContextDate = new Date(
      contextDate.getFullYear(),
      contextDate.getMonth(),
      contextDate.getDate()
    )

    setStartDatePeriod(newContextDate)
    setStartDatePickerVisible(false)
  }

  const defineEndDatePeriod = dateInfo => {
    const contextDate = new Date(dateInfo.nativeEvent.timestamp)
    const newContextDate = new Date(
      contextDate.getFullYear(),
      contextDate.getMonth(),
      contextDate.getDate()
    )

    setEndDatePeriod(newContextDate)
    setEndDatePickerVisible(false)
  }

  const toggleFilter = () => {
    setFilterVisible(!filterVisible)
  }

  const toggleDateButtonState = () => {
    setDateButtonState(!dateButtonPressed)
  }

  const toggleStatusButtonState = () => {
    setStatusButtonState(!statusButtonPressed)
  }

  const toggleDatePeriod = () => {
    setSelectedStatusOption('Sem Filtro')
    setTimeout(() => {
      setSelectedDateOption('Customizado')
    }, 100)
    setDatePeriodButtonsVisible(true)
    toggleDateButtonState()
  }

  const selectDateOption = option => {
    setSelectedStatusOption('Sem Filtro')
    setTimeout(() => {
      setSelectedDateOption(option)
    }, 100)
    setDatePeriodButtonsVisible(false)
    toggleDateButtonState()
  }

  const selectStatusOption = option => {
    setSelectedDateOption('Sem Filtro')
    setTimeout(() => {
      setSelectedStatusOption(option)
    }, 100)
    setDatePeriodButtonsVisible(false)
    toggleStatusButtonState()
  }

  const filterByName = () => {
    if (loading) return

    if (allEvents.length > 0) {
      setFilteredEvents(
        allEvents.filter(eventSnapshot => {
          const event = eventSnapshot.data()

          return event.name.match(eventName)
        })
      )
      console.log('Filtered by Name: ', filteredEvents)
    }
  }

  const filterByStatus = () => {
    if (loading) return

    if (allEvents.length > 0) {
      setFilteredEvents(
        allEvents.filter(eventSnapshot => {
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

          const status = chooseStatus(
            tournamentStartDate,
            tournamentEndDate,
            registrationStartDate,
            registrationEndDate
          )

          if (selectedStatusOption !== 'Sem Filtro') {
            return status === selectedStatusOption
          } else {
            return true
          }
        })
      )
    }

    console.log('Filtered by Status: ', filteredEvents)
  }

  const filterByDate = () => {
    if (loading) return

    if (allEvents.length > 0) {
      setFilteredEvents(
        allEvents.filter(eventSnapshot => {
          const event = eventSnapshot.data()

          const eventStartDate = new Date(
            event.tournament_start_date.seconds * 1000
          )
          const eventEndDate = new Date(
            event.tournament_end_date.seconds * 1000
          )

          console.log(startDatePeriod)
          console.log(endDatePeriod)

          switch (selectedDateOption) {
            case 'Sem Filtro':
              return true

            case 'Hoje':
              return eventStartDate.toDateString() === new Date().toDateString()

            case 'Essa Semana':
              const today = new Date()

              const startOfWeek = new Date(
                today.setDate(today.getDate() - today.getDay())
              )
              const newStartOfWeek = new Date(
                startOfWeek.getFullYear(),
                startOfWeek.getMonth(),
                startOfWeek.getDate(),
                0,
                0,
                0
              )

              return eventStartDate >= newStartOfWeek

            case 'Esse Mês':
              const startOfMonth = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              )
              return eventStartDate >= startOfMonth

            case 'Esse Ano':
              const startOfYear = new Date(new Date().getFullYear(), 0, 1)
              return eventStartDate >= startOfYear

            case 'Customizado':
              return (
                endDatePeriod >= startDatePeriod &&
                eventStartDate >= startDatePeriod &&
                eventEndDate <= endDatePeriod
              )

            default:
              return false
          }
        })
      )
    }
  }

  // Pega todos os torneios e armazena em allEvents
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const tournaments = await getAllTournaments() // Chama a função para buscar os torneios
        setAllEvents(tournaments) // Armazena todos os torneios
        setFilteredEvents(tournaments) // Inicializa a lista filtrada com todos os torneios
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar torneios:', error)
      }
    }

    fetchEvents()
  }, [])

  useEffect(filterByName, [eventName])
  useEffect(filterByStatus, [selectedStatusOption])
  useEffect(filterByDate, [selectedDateOption, startDatePeriod, endDatePeriod])

  return (
    <View style={styles.container}>
      {loading ? ( // Exibe um carregando enquanto os dados estão sendo buscados
        <Text>Carregando eventos...</Text>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Lista de Torneios</Text>
          </View>

          {/* Search Bar and Filter Icon */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              value={eventName}
              onChangeText={setEventName}
            />
            <TouchableOpacity
              onPress={toggleFilter}
              style={styles.filterButton}
            >
              <Text style={styles.filterIcon}>☰</Text>
            </TouchableOpacity>
          </View>

          {/* Exibe os botões de filtro apenas se o botão de filtro for apertado */}
          {filterVisible && (
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.filterOptionButton}
                onPress={toggleDateButtonState}
              >
                <Text style={styles.filterOptionButtonText}>
                  Período de Torneio
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterOptionButton}
                onPress={toggleStatusButtonState}
              >
                <Text style={styles.filterOptionButtonText}>Status</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Modais para seleção de filtro */}
          <Modal
            visible={dateButtonPressed}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.filterOptions}>
                {[
                  'Sem Filtro',
                  'Hoje',
                  'Essa Semana',
                  'Esse Mês',
                  'Esse Ano'
                ].map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => selectDateOption(option)}
                    style={styles.filterOption}
                  >
                    <Text style={styles.optionText}>
                      {selectedDateOption === option ? '● ' : '○ '}
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  key={'Customizado'}
                  onPress={toggleDatePeriod}
                  style={styles.filterOption}
                >
                  <Text style={styles.optionText}>
                    {selectedDateOption === 'Customizado' ? '● ' : '○ '}
                    Customizado
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={statusButtonPressed}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.filterOptions}>
                {[
                  'Sem Filtro',
                  'Inscrições Abertas',
                  'Em Andamento',
                  'Encerrado'
                ].map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => selectStatusOption(option)}
                    style={styles.filterOption}
                  >
                    <Text style={styles.optionText}>
                      {selectedStatusOption === option ? '● ' : '○ '}
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>

          {datePeriodVisible && (
            <View style={styles.datePeriodContainer}>
              {startDatePickerVisible && (
                <RNDateTimePicker
                  mode="date"
                  value={startDatePeriod}
                  onChange={defineStartDatePeriod}
                />
              )}
              {endDatePickerVisible && (
                <RNDateTimePicker
                  mode="date"
                  value={endDatePeriod}
                  onChange={defineEndDatePeriod}
                />
              )}

              <TouchableOpacity
                onPress={() => setStartDatePickerVisible(true)}
                style={styles.datePeriodButton}
              >
                <Text style={styles.datePeriodButtonText}>Data de Início</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEndDatePickerVisible(true)}
                style={styles.datePeriodButton}
              >
                <Text style={styles.datePeriodButtonText}>Data de Término</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de eventos filtrados */}
          <ScrollView style={styles.eventList}>
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
          </ScrollView>
        </>
      )}

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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { marginBottom: 5, marginTop: 40, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8
  },
  filterButton: { marginLeft: 8 },
  filterIcon: { fontSize: 24 },
  filterContainer: { marginBottom: 16, padding: 16 },
  filterOptionButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginVertical: 4
  },
  filterOptionButtonText: { fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterOptions: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16
  },
  filterOption: { padding: 8 },
  optionText: { fontSize: 16 },
  datePeriodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16
  },
  datePeriodButton: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 4 },
  datePeriodButtonText: { fontSize: 16 },
  eventList: { padding: 16, flexGrow: 1 },
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