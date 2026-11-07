
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
import { styles } from '../../styles/inicio.styles';

export default function InicioScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.encabezado}>
          <Text style={styles.saludo}>
            ¡Hola, vecino!
          </Text>

          <Text style={styles.titulo}>
            Bienvenido a NOMBRE
          </Text>
        </View>

        {/* Presentación */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitulo}>
            Tu comunidad, más conectada
          </Text>

          <Text style={styles.descripcion}>
            Encuentra ayuda, oportunidades y
            personas de tu comunidad.
          </Text>
        </View>

        <Text style={styles.seccion}>
          ¿Qué necesitas hoy?
        </Text>

        {/* Opciones */}
        <View style={styles.tarjetas}>

          <TouchableOpacity
            style={styles.tarjeta}
            onPress={() => router.push('/servicios')}
          >
            <Text style={styles.icono}>💼</Text>
            <Text style={styles.tarjetaTitulo}>
              Servicios
            </Text>
            <Text style={styles.tarjetaDescripcion}>
              Encuentra trabajos y servicios
              ofrecidos por tus vecinos.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tarjeta}
            onPress={() =>
              Alert.alert(
                'Favores',
                'Esta sección estará disponible próximamente.'
              )
            }
          >
            <Text style={styles.icono}>🤝</Text>
            <Text style={styles.tarjetaTitulo}>
              Intercambio de favores
            </Text>
            <Text style={styles.tarjetaDescripcion}>
              Comparte ayuda con personas
              de tu comunidad.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tarjeta, styles.emergencia]}
            onPress={() =>
              Alert.alert(
                'Emergencias',
                'Esta sección todavía está en desarrollo. Si necesitas ayuda urgente, contacta a los servicios de emergencia.'
              )
            }
          >
            <Text style={styles.icono}>🚨</Text>
            <Text
              style={[
                styles.tarjetaTitulo,
                styles.emergenciaTitulo,
              ]}
            >
              Emergencias
            </Text>
            <Text style={styles.tarjetaDescripcion}>
              Solicita apoyo cuando más
              lo necesites.
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
