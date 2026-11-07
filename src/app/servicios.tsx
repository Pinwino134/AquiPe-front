
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  principal: '#146C67',
  fondo: '#F6F7F3',
  verdeClaro: '#E8F2ED',
  texto: '#243746',
  secundario: '#526A67',
  blanco: '#FFFFFF',
  borde: '#DFE7E2',
};

const categorias = [
  'Todos',
  'Hogar',
  'Educación',
  'Tecnología',
  'Salud',
];

const servicios = [
  {
    id: 1,
    nombre: 'Electricista',
    profesional: 'Carlos R.',
    categoria: 'Hogar',
    calificacion: '4.8',
    opiniones: 12,
    distancia: '3 cuadras',
    icono: '⚡',
    telefono: '999111222',
  },
  {
    id: 2,
    nombre: 'Gasfitero',
    profesional: 'Luis M.',
    categoria: 'Hogar',
    calificacion: '4.6',
    opiniones: 8,
    distancia: '5 cuadras',
    icono: '🔧',
    telefono: '999222333',
  },
  {
    id: 3,
    nombre: 'Clases particulares',
    profesional: 'Andrea P.',
    categoria: 'Educación',
    calificacion: '4.9',
    opiniones: 21,
    distancia: '2 cuadras',
    icono: '📚',
    telefono: '999333444',
  },
  {
    id: 4,
    nombre: 'Soporte técnico',
    profesional: 'Miguel T.',
    categoria: 'Tecnología',
    calificacion: '4.7',
    opiniones: 15,
    distancia: '4 cuadras',
    icono: '💻',
    telefono: '999444555',
  },
  {
    id: 5,
    nombre: 'Enfermería a domicilio',
    profesional: 'Lucía G.',
    categoria: 'Salud',
    calificacion: '4.9',
    opiniones: 18,
    distancia: '6 cuadras',
    icono: '🩺',
    telefono: '999555666',
  },
];

export default function Servicios() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todos');

  const filtrados = servicios.filter((servicio) => {
    const coincideCategoria =
      categoria === 'Todos' ||
      servicio.categoria === categoria;

    const texto =
      `${servicio.nombre} ${servicio.profesional}`.toLowerCase();

    return (
      coincideCategoria &&
      texto.includes(busqueda.trim().toLowerCase())
    );
  });

  const llamar = (telefono: string) => {
    Alert.alert(
      'Llamar al profesional',
      `¿Deseas llamar al ${telefono}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Llamar',
          onPress: () => {
            Linking.openURL(`tel:${telefono}`).catch(() => {
              Alert.alert(
                'Error',
                'No se pudo abrir la aplicación de llamadas.'
              );
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <View
        style={styles.decoracionSuperior}
        pointerEvents="none"
      >
        <View style={styles.burbujaGrande} />
        <View style={styles.burbujaPequena} />
      </View>

      <View style={styles.encabezado}>
        <Pressable
          style={styles.volver}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Regresar"
        >
          <Ionicons
            name="chevron-back"
            size={23}
            color={C.principal}
          />
        </Pressable>

        <Text style={styles.titulo}>
          Servicios de mi barrio
        </Text>
      </View>

      <View style={styles.buscador}>
        <Ionicons
          name="search-outline"
          size={21}
          color={C.principal}
        />

        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar servicio..."
          placeholderTextColor={C.secundario}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCorrect={false}
          returnKeyType="search"
        />

        {busqueda.length > 0 && (
          <Pressable
            onPress={() => setBusqueda('')}
            accessibilityRole="button"
            accessibilityLabel="Limpiar búsqueda"
          >
            <Ionicons
              name="close-circle"
              size={19}
              color={C.secundario}
            />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtros}
        style={styles.contenedorFiltros}
      >
        {categorias.map((item) => {
          const activo = categoria === item;

          return (
            <Pressable
              key={item}
              style={[
                styles.filtro,
                activo && styles.filtroActivo,
              ]}
              onPress={() => setCategoria(item)}
              accessibilityRole="button"
              accessibilityState={{ selected: activo }}
            >
              <Text
                style={[
                  styles.textoFiltro,
                  activo && styles.textoFiltroActivo,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scrollLista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
      >
        <View style={styles.encabezadoLista}>
          <View>
            <Text style={styles.subtitulo}>
              Profesionales cerca de ti
            </Text>

            <Text style={styles.descripcionLista}>
              Encuentra ayuda en tu comunidad
            </Text>
          </View>

          <View style={styles.contador}>
            <Text style={styles.contadorTexto}>
              {filtrados.length}
            </Text>
          </View>
        </View>

        {filtrados.length === 0 ? (
          <View style={styles.vacio}>
            <View style={styles.vacioIconoContenedor}>
              <Ionicons
                name="search-outline"
                size={34}
                color={C.principal}
              />
            </View>

            <Text style={styles.vacioTitulo}>
              No encontramos servicios
            </Text>

            <Text style={styles.vacioTexto}>
              Prueba con otra búsqueda o categoría.
            </Text>
          </View>
        ) : (
          filtrados.map((servicio) => (
            <View
              key={servicio.id}
              style={styles.tarjeta}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarIcono}>
                  {servicio.icono}
                </Text>
              </View>

              <View style={styles.informacion}>
                <Text
                  style={styles.nombreServicio}
                  numberOfLines={2}
                >
                  {servicio.nombre}
                </Text>

                <Text style={styles.profesional}>
                  {servicio.profesional}
                </Text>

                <View style={styles.calificacion}>
                  <Ionicons
                    name="star"
                    size={13}
                    color={C.principal}
                  />

                  <Text style={styles.calificacionTexto}>
                    {servicio.calificacion}
                  </Text>

                  <Text style={styles.opiniones}>
                    ({servicio.opiniones} opiniones)
                  </Text>
                </View>

                <View style={styles.ubicacion}>
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={C.secundario}
                  />

                  <Text style={styles.distancia}>
                    A {servicio.distancia}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.botonLlamar}
                onPress={() => llamar(servicio.telefono)}
                accessibilityRole="button"
                accessibilityLabel={`Llamar a ${servicio.profesional}`}
              >
                <Ionicons
                  name="call"
                  size={17}
                  color={C.blanco}
                />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: C.fondo,
  },

  decoracionSuperior: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 170,
    overflow: 'hidden',
  },

  burbujaGrande: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: C.verdeClaro,
    right: -75,
    top: -90,
  },

  burbujaPequena: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: C.verdeClaro,
    right: 75,
    top: -35,
    opacity: 0.7,
  },

  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 17,
    gap: 12,
  },

  volver: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.blanco,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.borde,
  },

  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: C.principal,
    flex: 1,
  },

  buscador: {
    height: 50,
    backgroundColor: C.blanco,
    marginHorizontal: 20,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: C.borde,
    gap: 10,
  },

  inputBusqueda: {
    flex: 1,
    fontSize: 14,
    color: C.texto,
    height: '100%',
  },

  contenedorFiltros: {
    flexGrow: 0,
  },

  filtros: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 8,
    alignItems: 'center',
  },

  filtro: {
    backgroundColor: C.blanco,
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borde,
  },

  filtroActivo: {
    backgroundColor: C.principal,
    borderColor: C.principal,
  },

  textoFiltro: {
    fontSize: 13,
    fontWeight: '700',
    color: C.texto,
  },

  textoFiltroActivo: {
    color: C.blanco,
  },

  scrollLista: {
    flex: 1,
  },

  lista: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  encabezadoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  subtitulo: {
    fontSize: 17,
    fontWeight: '800',
    color: C.texto,
  },

  descripcionLista: {
    fontSize: 12,
    color: C.secundario,
    marginTop: 4,
  },

  contador: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 11,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contadorTexto: {
    fontSize: 13,
    fontWeight: '800',
    color: C.principal,
  },

  tarjeta: {
    backgroundColor: C.blanco,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borde,
    elevation: 1,
    shadowColor: C.texto,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: C.verdeClaro,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  avatarIcono: {
    fontSize: 23,
  },

  informacion: {
    flex: 1,
  },

  nombreServicio: {
    fontSize: 14,
    fontWeight: '800',
    color: C.texto,
  },

  profesional: {
    fontSize: 12,
    color: C.secundario,
    marginTop: 2,
  },

  calificacion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 4,
    flexWrap: 'wrap',
  },

  calificacionTexto: {
    color: C.texto,
    fontSize: 12,
    fontWeight: '700',
  },

  opiniones: {
    color: C.secundario,
    fontSize: 11,
  },

  ubicacion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },

  distancia: {
    color: C.secundario,
    fontSize: 11,
  },

  botonLlamar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.principal,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  vacio: {
    alignItems: 'center',
    paddingVertical: 55,
  },

  vacioIconoContenedor: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  vacioTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: C.texto,
    marginTop: 10,
  },

  vacioTexto: {
    fontSize: 14,
    color: C.secundario,
    marginTop: 7,
    textAlign: 'center',
  },
});
