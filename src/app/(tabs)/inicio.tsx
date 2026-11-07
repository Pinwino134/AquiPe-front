
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/inicio.styles';

export default function InicioScreen() {
  const router = useRouter();

  // Datos temporales hasta conectar el backend
  const nombre = 'Vecino';
  const barrio = 'Mi comunidad';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        {/* Saludo */}
        <View style={styles.encabezado}>
          <Text style={styles.saludo}>
            Hola, {nombre} 👋
          </Text>

          <Text style={styles.barrio}>
            Barrio: {barrio}
          </Text>
        </View>

        {/* Tarjetas principales */}
        <View style={styles.cuadricula}>

          {/* Servicios */}
          <TouchableOpacity
            style={[styles.tarjeta, styles.servicios]}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/servicios')}
          >
            <MaterialCommunityIcons
              name="wrench"
              size={34}
              color="#FFFFFF"
            />
            <Text style={styles.tarjetaTexto}>
              Servicios
            </Text>
          </TouchableOpacity>

          {/* Favores */}
          <TouchableOpacity
            style={[styles.tarjeta, styles.favores]}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                'Favores',
                'Esta pantalla estará disponible próximamente.'
              )
            }
          >
            <MaterialCommunityIcons
              name="handshake"
              size={34}
              color="#243746"
            />
            <Text style={styles.tarjetaTextoOscuro}>
              Favores
            </Text>
          </TouchableOpacity>

          {/* Mapa */}
          <TouchableOpacity
            style={[styles.tarjeta, styles.mapa]}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                'Mapa',
                'Próximamente podrás explorar tu comunidad.'
              )
            }
          >
            <Ionicons
              name="location"
              size={34}
              color="#FFFFFF"
            />
            <Text style={styles.tarjetaTexto}>
              Mapa
            </Text>
          </TouchableOpacity>

          {/* Emergencia */}
          <TouchableOpacity
            style={[styles.tarjeta, styles.emergencia]}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                'Emergencias',
                'Esta función está en desarrollo. Para una emergencia real, contacta a los servicios de emergencia.'
              )
            }
          >
            <MaterialCommunityIcons
              name="alarm-light"
              size={34}
              color="#FFFFFF"
            />
            <Text style={styles.tarjetaTexto}>
              Emergencia
            </Text>
          </TouchableOpacity>
        </View>

        {/* Coincidencias */}
        <TouchableOpacity
          style={styles.coincidencias}
          activeOpacity={0.8}
          onPress={() =>
            Alert.alert(
              'Coincidencias',
              'Próximamente verás sugerencias de tu comunidad.'
            )
          }
        >
          <View style={styles.coincidenciaIcono}>
            <MaterialCommunityIcons
              name="account-group"
              size={26}
              color="#146C67"
            />
          </View>

          <View style={styles.coincidenciaContenido}>
            <Text style={styles.coincidenciaTitulo}>
              Coincidencias
            </Text>

            <Text style={styles.coincidenciaDescripcion}>
              Descubre nuevas oportunidades
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#146C67"
          />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
