import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  chooseStatus,
  formatDate,
  formatTime,
  getCategoriesByTournamentId
} from '../utils/funcoes';


export default function EventInfoScreen({ route, navigation }) {
  const { eventContext, eventId, loggedUser } = route.params;
  const [eventCategories, setEventCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categories = await getCategoriesByTournamentId(eventId);
        setEventCategories(categories);
      } catch (error) {
        console.error('Erro ao carregar categories:', error);
        setError('Não foi possível carregar as categorias');
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (!eventContext) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>Torneio não encontrado</Text>
      </View>
    );
  }

  const tournamentStartDate = new Date(eventContext.tournament_start_date.seconds * 1000);
  const tournamentEndDate = new Date(eventContext.tournament_end_date.seconds * 1000);
  const tournamentStartTime = new Date(eventContext.tournament_start_time.seconds * 1000);
  const tournamentEndTime = new Date(eventContext.tournament_end_time.seconds * 1000);
  const registrationStartDate = new Date(eventContext.registration_start_date.seconds * 1000);
  const registrationEndDate = new Date(eventContext.registration_end_date.seconds * 1000);

  const InfoItem = ({ label, value }) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Inscrições Abertas":
        return "#4CAF50"; // Verde
      case "Em Andamento":
        return "#2196F3"; // Azul
      case "Em Espera":
        return "#F44336"; // Vermelho 
      case "Encerrado":
        return "#FF9800"; // Laranja
      case "FINALIZADO":
        return "#9E9E9E"; // Cinza
      default:
        return "#9E9E9E";
    }
  };

  const status = chooseStatus(
    tournamentStartDate,
    tournamentEndDate,
    registrationStartDate,
    registrationEndDate
  );

  const statusColor = getStatusColor(status);

  const renderCategories = () => {
    if (loading) {
      return <Text style={styles.loadingText}>Carregando categorias...</Text>;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    return eventCategories.map((category, index) => (
      <View key={index} style={styles.categoryItem}>
        <View style={[styles.categoryDot, { backgroundColor: statusColor }]} />
        <Text style={styles.categoryText}>{category}</Text>
      </View>
    ));
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container}>
        <ImageBackground
          source={{ uri: 'https://placeholder.com/tournament-background' }}
          style={styles.header}
        >
          <LinearGradient
            colors={['transparent', '#1a1a1a']}
            style={styles.gradient}
          >
            <View style={styles.headerContent}>
              <Text style={styles.title}>{eventContext.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{status}</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informações do Torneio</Text>
            <InfoItem 
              label="Data"
              value={`${formatDate(tournamentStartDate)} a ${formatDate(tournamentEndDate)}`}
            />
            <InfoItem 
              label="Horário"
              value={`${formatTime(tournamentStartTime)} às ${formatTime(tournamentEndTime)}`}
            />
            <InfoItem 
              label="Inscrições"
              value={`${formatDate(registrationStartDate)} a ${formatDate(registrationEndDate)}`}
            />
            <InfoItem 
              label="Local"
              value={eventContext.location}
            />
            <InfoItem 
              label="Valor"
              value={`R$ ${eventContext.price}`}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Categorias</Text>
            {renderCategories()}
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={() => navigation.navigate('Lista de Participantes')}
            >
              <Text style={styles.outlineButtonText}>Ver Participantes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={() => navigation.navigate('Cadastro de Torneio', { eventId })}
            >
              <Text style={styles.outlineButtonText}>Editar Torneio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => alert('Participação confirmada!')}
            >
              <Text style={styles.primaryButtonText}>Quero Participar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 250,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerContent: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    marginTop: -30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  buttonGroup: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  primaryButton: {
    backgroundColor: '#0066cc',
  },
  outlineButtonText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loaderText: {
    fontSize: 18,
    color: '#666666',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    padding: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    padding: 10,
  },
});