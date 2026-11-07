
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificacionesScreen() {
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#F6F7F3',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#146C67',
      }}>
        Notificaciones
      </Text>

      <Text style={{
        color: '#526A67',
        marginTop: 10,
      }}>
        Aquí aparecerán tus notificaciones.
      </Text>
    </SafeAreaView>
  );
}
