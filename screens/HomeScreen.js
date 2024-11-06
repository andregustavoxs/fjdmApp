import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { getAllTournaments, chooseStatus } from '../utils/funcoes.js';

const HomeScreen = ({ navigation, route }) => {
  const [eventName, setEventName] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { loggedUser } = route.params || {};
  const scrollY = new Animated.Value(0);

  // Mantendo a lógica de filtros e useEffects existente...
  const filterByDate = () => {
    const twentyDaysFromNow = new Date();
    const twentyDaysAgo = new Date();
    twentyDaysFromNow.setDate(twentyDaysFromNow.getDate() + 20);
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

    const eventsInDateRange = allEvents.filter(eventSnapshot => {
      const event = eventSnapshot.data();
      const tournamentStartDate = new Date(event.tournament_start_date.seconds * 1000);
      const tournamentEndDate = new Date(event.tournament_end_date.seconds * 1000);
      return tournamentStartDate >= twentyDaysAgo && tournamentEndDate <= twentyDaysFromNow;
    });

    setFilteredEvents(eventsInDateRange);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getAllTournaments();
        setAllEvents(events);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (allEvents.length > 0) {
      filterByDate();
    }
  }, [allEvents]);

  useEffect(() => {
    const fetchEventsByName = () => {
      if (eventName) {
        const filteredByName = allEvents.filter(eventSnapshot => {
          const event = eventSnapshot.data();
          return event.name.toLowerCase().includes(eventName.toLowerCase());
        });
        setFilteredEvents(filteredByName);
      } else {
        filterByDate();
      }
    };
    fetchEventsByName();
  }, [eventName]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Em andamento':
        return '#10B981';
      case 'Inscrições abertas':
        return '#3B82F6';
      case 'Finalizado':
        return '#6B7280';
      default:
        return '#F59E0B';
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerContent}>
          {loggedUser && loggedUser.is_admin ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('Cadastro de Torneio (1/2)', { loggedUser })}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Criar Torneio</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login', { "screenName": 'Home' })}
            >
              <Text style={styles.loginText}>Entrar</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Torneios Recentes</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar torneios..."
              placeholderTextColor="#94A3B8"
              value={eventName}
              onChangeText={setEventName}
            />
          </View>
        </View>
      </Animated.View>

      {/* Tournament List */}
      {allEvents.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando torneios...</Text>
        </View>
      ) : (
        <Animated.ScrollView
          style={styles.tournamentList}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {filteredEvents.map(eventSnapshot => {
            const event = eventSnapshot.data();
            const tournamentStartDate = new Date(event.tournament_start_date.seconds * 1000);
            const tournamentEndDate = new Date(event.tournament_end_date.seconds * 1000);
            const registrationStartDate = new Date(event.registration_start_date.seconds * 1000);
            const registrationEndDate = new Date(event.registration_end_date.seconds * 1000);
            const status = chooseStatus(tournamentStartDate, tournamentEndDate, registrationStartDate, registrationEndDate);

            return (
              <TouchableOpacity
                key={eventSnapshot.id}
                style={styles.eventCard}
                onPress={() =>
                  navigation.navigate('Informações do Torneio', {
                    eventContext: event,
                    eventId: eventSnapshot.id,
                    loggedUser,
                  })
                }
              >
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                    <Text style={styles.statusText}>{status}</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventDate}>
                    📅 {tournamentStartDate.toLocaleDateString()} - {tournamentEndDate.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home', { loggedUser })}>
          <Text style={[styles.navIcon, styles.activeNav]}>🏠</Text>
          <Text style={[styles.navText, styles.activeNav]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Buscar Torneio', { loggedUser })}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={styles.navText}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Configurações')}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Configurações</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Informações da Conta', { loggedUser })}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginVertical: 16,
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  tournamentList: {
    flex: 1,
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 14,
    color: '#64748B',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#64748B',
  },
  activeNav: {
    color: '#3B82F6',
  },
});

export default HomeScreen;
