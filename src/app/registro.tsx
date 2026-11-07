
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from '../styles/registro.styles';

export default function RegistroScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const crearCuenta = () => {
    if (
      !nombre.trim() ||
      !correo.trim() ||
      !celular.trim() ||
      !contrasena ||
      !confirmar
    ) {
      Alert.alert(
        'Campos incompletos',
        'Por favor, completa todos los campos.'
      );
      return;
    }

    if (nombre.trim().split(/\s+/).length < 2) {
      Alert.alert(
        'Nombre incompleto',
        'Ingresa tu nombre y apellido.'
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

    if (!/^9\d{8}$/.test(celular.trim())) {
      Alert.alert(
        'Celular inválido',
        'Ingresa un número peruano de 9 dígitos que comience con 9.'
      );
      return;
    }

    if (contrasena.length < 8) {
      Alert.alert(
        'Contraseña corta',
        'La contraseña debe tener al menos 8 caracteres.'
      );
      return;
    }

    if (contrasena !== confirmar) {
      Alert.alert(
        'Contraseñas diferentes',
        'Las contraseñas no coinciden.'
      );
      return;
    }

    if (!aceptaTerminos) {
      Alert.alert(
        'Términos pendientes',
        'Debes aceptar los términos para continuar.'
      );
      return;
    }

    Alert.alert(
      'Formulario validado',
      'Tus datos están listos. Falta conectar el registro con el servidor.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Regresar */}
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
            <View style={styles.logoCirculo}>
              <Text style={styles.logo}> </Text>
            </View>

            <Text style={styles.titulo}>
              Únete a Nombre
            </Text>

            <Text style={styles.subtitulo}>
              Crea tu cuenta y empieza a conectar
              con tu comunidad.
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formulario}>

            <View style={styles.campo}>
              <Text style={styles.etiqueta}>
                Nombre completo
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nombre y apellido"
                placeholderTextColor="#879A94"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

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
                Número de celular
              </Text>
              <TextInput
                style={styles.input}
                placeholder="987654321"
                placeholderTextColor="#879A94"
                keyboardType="phone-pad"
                maxLength={9}
                value={celular}
                onChangeText={setCelular}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.etiqueta}>
                Contraseña
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#879A94"
                  secureTextEntry={!mostrarPassword}
                  autoCapitalize="none"
                  value={contrasena}
                  onChangeText={setContrasena}
                />
                <Text
                  style={styles.mostrar}
                  onPress={() =>
                    setMostrarPassword(!mostrarPassword)
                  }
                >
                  {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </View>
            </View>

            <View style={styles.campo}>
              <Text style={styles.etiqueta}>
                Confirmar contraseña
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#879A94"
                secureTextEntry={!mostrarPassword}
                autoCapitalize="none"
                value={confirmar}
                onChangeText={setConfirmar}
              />
            </View>

            {/* Términos */}
            <TouchableOpacity
              style={styles.terminos}
              onPress={() =>
                setAceptaTerminos(!aceptaTerminos)
              }
              activeOpacity={0.8}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: aceptaTerminos,
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  aceptaTerminos && styles.checkboxActivo,
                ]}
              >
                {aceptaTerminos && (
                  <Text style={styles.checkTexto}>✓</Text>
                )}
              </View>

              <Text style={styles.terminosTexto}>
                He leído y acepto los términos
                y la política de privacidad.
              </Text>
            </TouchableOpacity>

            {/* Crear cuenta */}
            <TouchableOpacity
              style={styles.boton}
              onPress={crearCuenta}
            >
              <Text style={styles.botonTexto}>
                Crear mi cuenta
              </Text>
            </TouchableOpacity>

          </View>

          {/* Ir a Login */}
          <View style={styles.iniciarSesion}>
            <Text style={styles.textoNormal}>
              ¿Ya tienes una cuenta?{' '}
            </Text>
            <Text
              style={styles.textoEnlace}
              onPress={() => router.push('/login')}
            >
              Inicia sesión
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
