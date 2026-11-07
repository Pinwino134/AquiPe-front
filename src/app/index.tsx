
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from '../styles/bienvenida.styles';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F6F7F3"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
          </View>

          <Text style={styles.nombre}>
            nombre
          </Text>

          <Text style={styles.eslogan}>
            Donde tu comunidad te acompaña
          </Text>
        </View>

        {/* Bienvenida */}
        <View style={styles.descripcion}>
          <Text style={styles.titulo}>
            ¡Bienvenido a Aylluma!
          </Text>

          <Text style={styles.subtitulo}>
            Conecta con tus vecinos, encuentra
            oportunidades y comparte ayuda
            cuando más se necesita.
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.botones}>

          {/* Iniciar sesión */}
          <TouchableOpacity
            style={styles.botonPrincipal}
            activeOpacity={0.8}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.textoPrincipal}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          {/* Crear cuenta */}
          <TouchableOpacity
            style={styles.botonSecundario}
            activeOpacity={0.8}
            onPress={() => router.push('/registro')}
          >
            <Text style={styles.textoSecundario}>
              Crear cuenta
            </Text>
          </TouchableOpacity>

        </View>

        {/* Pie de página */}
        <Text style={styles.footer}>
          Juntos construimos una comunidad mejor
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
