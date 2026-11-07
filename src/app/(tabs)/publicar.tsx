
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/publicar.styles';

export default function PublicarScreen() {
  const seleccionarPublicacion = (tipo: string) => {
    Alert.alert(
      tipo,
      'Próximamente podrás completar los datos de tu publicación.'
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.contenido}>

        {/* Encabezado */}
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>
            ¿Qué deseas publicar?
          </Text>

          <Text style={styles.subtitulo}>
            Comparte tus habilidades o pide ayuda a tu comunidad.
          </Text>
        </View>

        {/* Ofrecer servicio */}
        <TouchableOpacity
          style={styles.tarjeta}
          activeOpacity={0.8}
          onPress={() => seleccionarPublicacion('Ofrecer servicio')}
        >
          <View style={styles.iconoServicio}>
            <MaterialCommunityIcons
              name="tools"
              size={30}
              color="#146C67"
            />
          </View>

          <View style={styles.textos}>
            <Text style={styles.tarjetaTitulo}>
              Ofrecer un servicio
            </Text>

            <Text style={styles.tarjetaDescripcion}>
              Publica lo que sabes hacer para ayudar a tus vecinos.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#146C67"
          />
        </TouchableOpacity>

        {/* Solicitar favor */}
        <TouchableOpacity
          style={styles.tarjeta}
          activeOpacity={0.8}
          onPress={() => seleccionarPublicacion('Solicitar favor')}
        >
          <View style={styles.iconoFavor}>
            <MaterialCommunityIcons
              name="handshake-outline"
              size={30}
              color="#B66C20"
            />
          </View>

          <View style={styles.textos}>
            <Text style={styles.tarjetaTitulo}>
              Solicitar un favor
            </Text>

            <Text style={styles.tarjetaDescripcion}>
              Cuéntale a tu comunidad en qué necesitas ayuda.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#146C67"
          />
        </TouchableOpacity>

        {/* Mensaje informativo */}
        <View style={styles.informacion}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#146C67"
          />

          <Text style={styles.informacionTexto}>
            Tu publicación permitirá que otros vecinos
            conozcan lo que ofreces o necesitas.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
