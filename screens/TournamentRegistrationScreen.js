import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

import { ScrollView } from 'react-native-gesture-handler'
import { formatDate, formatTime, convertToDate, convertToTime } from '../utils/funcoes.js'

export default function TournamentRegistrationScreen({ navigation, route }) {

  const today = new Date()

  const { loggedUser } = route.params ? route.params : null

  const [name, setName] = useState('UNDB Open Checkers Tournament')
  const [location, setLocation] = useState('UNDB')
  const [price, setPrice] = useState(0.00)
  const [participantsNumber, setParticipantsNumber] = useState(20)

  const [tournamentStartDate, setTournamentStartDate] = useState(formatDate(today))
  const [tournamentEndDate, setTournamentEndDate] = useState(formatDate(today))
  const [tournamentStartTime, setTournamentStartTime] = useState(formatTime(today))
  const [tournamentEndTime, setTournamentEndTime] = useState(formatTime(today))
  const [registrationStartDate, setRegistrationStartDate] = useState(formatDate(today))
  const [registrationEndDate, setRegistrationEndDate] = useState(formatDate(today))


  const convertDataAndGoToSecondScreen = () => {

    const tournament_start_date = convertToDate(tournamentStartDate);
    const tournament_end_date = convertToDate(tournamentEndDate);
    const tournament_start_time = convertToTime(tournamentStartTime);
    const tournament_end_time = convertToTime(tournamentEndTime);
    const registration_start_date = convertToDate(registrationStartDate);
    const registration_end_date = convertToDate(registrationEndDate);

    const tournamentData = {
      name,
      location,
      price,
      participantsNumber,
      tournament_start_date,
      tournament_end_date,
      tournament_start_time,
      tournament_end_time,
      registration_start_date,
      registration_end_date
    }

    navigation.navigate("Cadastro de Torneio (2/2)", { tournamentData, loggedUser })

  }

  

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Torneio</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Período do Torneio</Text>
        <View style={styles.dateTimeContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={tournamentStartDate}
            placeholder="Data de Início"
            onChangeText={setTournamentStartDate}
          />
  
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={tournamentEndDate}
            placeholder="Data de Fim"
            onChangeText={setTournamentEndDate}
          />

        </View>

        <Text style={styles.label}>Horário do Torneio</Text>
        <View style={styles.dateTimeContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={tournamentStartTime}
            placeholder="Hora de Início"
            onChangeText={setTournamentStartTime}
          />

          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={tournamentEndTime}
            placeholder="Hora de Fim"
            onChangeText={setTournamentEndTime}
          />

        </View>

        <Text style={styles.label}>Período de Inscrição</Text>
        <View style={styles.dateTimeContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={registrationStartDate}
            placeholder="Data de Início"
            onChangeText={setRegistrationStartDate}
          />

          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={registrationEndDate}
            placeholder="Data de Fim"
            onChangeText={setRegistrationEndDate}
          />
        </View>

        <Text style={styles.label}>Local</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} />

        <Text style={styles.label}>Preço</Text>
        <View style={styles.priceContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={String(price)}
            onChangeText={(text) => setPrice(Number(text))}
          />
        </View>

        <Text style={styles.label}>Número de Participantes</Text>
        <TextInput
          style={styles.input}
          value={String(participantsNumber)}
          onChangeText={(text) => setParticipantsNumber(Number(text))}
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={convertDataAndGoToSecondScreen}>
            <Text style={styles.nextButtonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#6b52ae'
  },
  cancelButtonText: {
    color: '#6b52ae',
    fontWeight: 'bold'
  },
  nextButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
})
