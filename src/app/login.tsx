
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from '../styles/login.styles';

export default function LoginScreen() {
  const router = useRouter();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Inicio de sesión temporal para probar la aplicación
  const iniciarSesion = () => {
    if (!correo.trim() || !contrasena) {
      Alert.alert(
        'Campos incompletos',
        'Ingresa tu correo y contraseña.'
      );
      return;
    }

    const correoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());

    if (!correoValido) {
      Alert.alert(
        'Correo inválido',
        'Ingresa un correo electrónico válido.'
      );
      return;
    }

    if (
      __DEV__ &&
      correo.trim().toLowerCase() === 'vecino@gmail.com' &&
      contrasena === 'vecino123'
    ) {
      router.replace('/(tabs)/inicio');
      return;
    }

    Alert.alert(
      'Datos incorrectos',
      'El correo o la contraseña no son correctos.'
    );
  };

  const recuperarContrasena = () => {
    Alert.alert(
      'Recuperar contraseña',
      'Esta función todavía está en desarrollo.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F6F7F3"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Volver */}
          <TouchableOpacity
            style={styles.volver}
            onPress={() => router.back()}
          >
            <Text style={styles.volverTexto}>
              ← Volver
            </Text>
          </TouchableOpacity>

          {/* Encabezado */}
          <View style={styles.encabezado}>
            <Text style={styles.nombre}>
              NOMBRE
            </Text>

            <Text style={styles.titulo}>
              ¡Bienvenido de nuevo!
            </Text>

            <Text style={styles.subtitulo}>
              Inicia sesión para conectar con tu comunidad.
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formulario}>
            <View style={styles.campo}>
              <Text style={styles.etiqueta}>
                Correo electrónico
              </Text>

              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#879A94"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={correo}
                onChangeText={setCorreo}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.etiqueta}>
                Contraseña
              </Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#879A94"
                  secureTextEntry={!mostrarPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  value={contrasena}
                  onChangeText={setContrasena}
                />

                <TouchableOpacity
                  onPress={() =>
                    setMostrarPassword(!mostrarPassword)
                  }
                >
                  <Text style={styles.mostrar}>
                    {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recuperar contraseña */}
            <TouchableOpacity
              style={styles.recuperar}
              onPress={recuperarContrasena}
            >
              <Text style={styles.recuperarTexto}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Botón iniciar sesión */}
            <TouchableOpacity
              style={styles.boton}
              activeOpacity={0.8}
              onPress={iniciarSesion}
            >
              <Text style={styles.botonTexto}>
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>

          {/* Crear cuenta */}
          <View style={styles.registro}>
            <Text style={styles.textoNormal}>
              ¿No tienes una cuenta?{' '}
            </Text>

            <Text
              style={styles.textoEnlace}
              onPress={() => router.push('/registro')}
            >
              Regístrate
            </Text>
          </View>

          {/* Pie de página */}
          <Text style={styles.footer}>
            Juntos construimos una comunidad mejor
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
