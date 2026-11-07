
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, {
  Marker,
  Region,
} from 'react-native-maps';
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

type Tipo = 'Servicios' | 'Favores' | 'Recursos';
type Accion = 'solicitar' | 'ayudar';

type Punto = {
  id: number;
  tipo: Tipo;
  nombre: string;
  persona: string;
  descripcion: string;
  icono: string;
  latitud: number;
  longitud: number;
  accion?: Accion;
};

const puntos: Punto[] = [
  {
    id: 1,
    tipo: 'Servicios',
    nombre: 'Electricista cercano',
    persona: 'Carlos R.',
    descripcion:
      'Instalaciones eléctricas, reparaciones y mantenimiento.',
    icono: '⚡',
    latitud: -16.3988,
    longitud: -71.5369,
    accion: 'solicitar',
  },
  {
    id: 2,
    tipo: 'Servicios',
    nombre: 'Soporte técnico',
    persona: 'Miguel T.',
    descripcion:
      'Reparación y mantenimiento de computadoras.',
    icono: '💻',
    latitud: -16.4015,
    longitud: -71.5295,
    accion: 'solicitar',
  },
  {
    id: 3,
    tipo: 'Servicios',
    nombre: 'Gasfitero',
    persona: 'Luis M.',
    descripcion:
      'Reparación de tuberías y mantenimiento.',
    icono: '🔧',
    latitud: -16.395,
    longitud: -71.541,
    accion: 'solicitar',
  },
  {
    id: 4,
    tipo: 'Favores',
    nombre: 'Préstamo de escalera',
    persona: 'María',
    descripcion:
      'Necesito una escalera para realizar una reparación en casa.',
    icono: '🪜',
    latitud: -16.3948,
    longitud: -71.532,
    accion: 'ayudar',
  },
  {
    id: 5,
    tipo: 'Favores',
    nombre: 'Apoyo en tareas',
    persona: 'José',
    descripcion:
      'Busco ayuda para resolver tareas escolares.',
    icono: '📚',
    latitud: -16.405,
    longitud: -71.538,
    accion: 'ayudar',
  },
  {
    id: 6,
    tipo: 'Favores',
    nombre: 'Clases de matemáticas',
    persona: 'Andrea',
    descripcion:
      'Ofrezco apoyo con ejercicios de matemáticas.',
    icono: '📖',
    latitud: -16.403,
    longitud: -71.525,
    accion: 'solicitar',
  },
  {
    id: 7,
    tipo: 'Recursos',
    nombre: 'Punto de apoyo comunitario',
    persona: 'Comunidad AquiPe',
    descripcion:
      'Espacio comunitario de referencia para recibir orientación.',
    icono: '📍',
    latitud: -16.409,
    longitud: -71.533,
  },
];

const tipos: Tipo[] = [
  'Servicios',
  'Favores',
  'Recursos',
];

const REGION_INICIAL: Region = {
  latitude: -16.3989,
  longitude: -71.535,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

export default function Mapa() {
  const mapaRef = useRef<MapView>(null);
  const regionRef = useRef<Region>(REGION_INICIAL);

  const [activos, setActivos] =
    useState<Tipo[]>(tipos);

  const [seleccionado, setSeleccionado] =
    useState<Punto | null>(null);

  const [detalleVisible, setDetalleVisible] =
    useState(false);

  const [formularioVisible, setFormularioVisible] =
    useState(false);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');

  const alternar = (tipo: Tipo) => {
    setActivos((anteriores) =>
      anteriores.includes(tipo)
        ? anteriores.filter((t) => t !== tipo)
        : [...anteriores, tipo]
    );
  };

  const abrirDetalle = (punto: Punto) => {
    setSeleccionado(punto);
    setDetalleVisible(true);
  };

  const obtenerAccion = () => {
    if (!seleccionado) {
      return 'Continuar';
    }

    if (seleccionado.tipo === 'Servicios') {
      return 'Solicitar servicio';
    }

    if (seleccionado.accion === 'ayudar') {
      return 'Ofrecer mi ayuda';
    }

    return 'Solicitar ayuda';
  };

  const abrirFormulario = () => {
    setDetalleVisible(false);

    // Se abre el formulario después de cerrar
    // el modal de información.
    setTimeout(() => {
      setFormularioVisible(true);
    }, 350);
  };

  const cerrarFormulario = () => {
    setFormularioVisible(false);
    setNombre('');
    setTelefono('');
    setMensaje('');
  };

  const enviarSolicitud = () => {
    if (
      !nombre.trim() ||
      !telefono.trim() ||
      !mensaje.trim()
    ) {
      Alert.alert(
        'Campos incompletos',
        'Completa tu nombre, teléfono y mensaje.'
      );
      return;
    }

    if (!seleccionado) {
      return;
    }

    const titulo = seleccionado.nombre;

    cerrarFormulario();

    Alert.alert(
      'Solicitud registrada',
      `Tu solicitud relacionada con "${titulo}" se registró correctamente en esta demostración.`
    );
  };

  const cambiarZoom = (factor: number) => {
    const actual = regionRef.current;

    const nuevaRegion: Region = {
      ...actual,
      latitudeDelta: Math.max(
        0.002,
        Math.min(0.2, actual.latitudeDelta * factor)
      ),
      longitudeDelta: Math.max(
        0.002,
        Math.min(0.2, actual.longitudeDelta * factor)
      ),
    };

    regionRef.current = nuevaRegion;

    mapaRef.current?.animateToRegion(
      nuevaRegion,
      300
    );
  };

  const centrarMapa = () => {
    regionRef.current = REGION_INICIAL;

    mapaRef.current?.animateToRegion(
      REGION_INICIAL,
      400
    );
  };

  return (
    <SafeAreaView style={s.page}>
      {/* Encabezado */}
      <View style={s.header}>
        <Pressable
          style={s.back}
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

        <View style={s.headerTextos}>
          <Text style={s.title}>
            Mapa comunitario
          </Text>

          <Text style={s.subtitle}>
            Encuentra servicios y favores cerca de ti
          </Text>
        </View>
      </View>

      {/* Mapa interactivo */}
      <View style={s.mapContainer}>
        <MapView
          ref={mapaRef}
          style={s.map}
          initialRegion={REGION_INICIAL}
          mapType="standard"
          showsCompass
          showsUserLocation={false}
          showsMyLocationButton={false}
          rotateEnabled={false}
          onRegionChangeComplete={(nuevaRegion) => {
            regionRef.current = nuevaRegion;
          }}
        >
          {puntos
            .filter((punto) =>
              activos.includes(punto.tipo)
            )
            .map((punto) => (
              <Marker
                key={punto.id}
                coordinate={{
                  latitude: punto.latitud,
                  longitude: punto.longitud,
                }}
                title={punto.nombre}
                description={punto.persona}
                pinColor={C.principal}
                onPress={() => abrirDetalle(punto)}
              />
            ))}
        </MapView>

        {/* Controles */}
        <View style={s.controles}>
          <Pressable
            style={s.controlBoton}
            onPress={() => cambiarZoom(0.65)}
            accessibilityRole="button"
            accessibilityLabel="Acercar mapa"
          >
            <Ionicons
              name="add"
              size={23}
              color={C.principal}
            />
          </Pressable>

          <View style={s.controlSeparador} />

          <Pressable
            style={s.controlBoton}
            onPress={() => cambiarZoom(1.5)}
            accessibilityRole="button"
            accessibilityLabel="Alejar mapa"
          >
            <Ionicons
              name="remove"
              size={23}
              color={C.principal}
            />
          </Pressable>

          <View style={s.controlSeparador} />

          <Pressable
            style={s.controlBoton}
            onPress={centrarMapa}
            accessibilityRole="button"
            accessibilityLabel="Centrar mapa"
          >
            <Ionicons
              name="locate-outline"
              size={21}
              color={C.principal}
            />
          </Pressable>
        </View>

        <View style={s.indicadorMapa}>
          <Ionicons
            name="location-outline"
            size={15}
            color={C.principal}
          />

          <Text style={s.indicadorTexto}>
            Explora tu comunidad
          </Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={s.filters}>
        {tipos.map((tipo) => {
          const activo = activos.includes(tipo);

          const icono =
            tipo === 'Servicios'
              ? 'construct-outline'
              : tipo === 'Favores'
              ? 'heart-outline'
              : 'location-outline';

          return (
            <Pressable
              key={tipo}
              style={[
                s.filter,
                activo && s.filterActivo,
              ]}
              onPress={() => alternar(tipo)}
              accessibilityRole="button"
              accessibilityState={{
                selected: activo,
              }}
            >
              <Ionicons
                name={icono}
                size={15}
                color={
                  activo
                    ? C.blanco
                    : C.principal
                }
              />

              <Text
                style={[
                  s.filterText,
                  activo && s.filterTextActivo,
                ]}
              >
                {tipo}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={s.bottomNote}>
        Toca un marcador para consultar su información.
      </Text>

      {/* Detalle de servicio o favor */}
      <Modal
        visible={detalleVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setDetalleVisible(false)
        }
      >
        <View style={s.modalFondo}>
          <View style={s.modalContenido}>
            <View style={s.modalBarra} />

            <View style={s.modalEncabezado}>
              <View style={s.modalIcono}>
                <Text style={s.modalEmoji}>
                  {seleccionado?.icono}
                </Text>
              </View>

              <Pressable
                style={s.cerrar}
                onPress={() =>
                  setDetalleVisible(false)
                }
                accessibilityLabel="Cerrar detalle"
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={C.secundario}
                />
              </Pressable>
            </View>

            <Text style={s.modalCategoria}>
              {seleccionado?.tipo}
            </Text>

            <Text style={s.modalTitulo}>
              {seleccionado?.nombre}
            </Text>

            <View style={s.personaFila}>
              <Ionicons
                name="person-outline"
                size={16}
                color={C.secundario}
              />

              <Text style={s.modalPersona}>
                {seleccionado?.persona}
              </Text>
            </View>

            <Text style={s.modalDescripcion}>
              {seleccionado?.descripcion}
            </Text>

            {seleccionado?.tipo === 'Recursos' ? (
              <Pressable
                style={s.botonPrincipal}
                onPress={() =>
                  setDetalleVisible(false)
                }
              >
                <Text style={s.botonTexto}>
                  Entendido
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={s.botonPrincipal}
                onPress={abrirFormulario}
              >
                <Text style={s.botonTexto}>
                  {obtenerAccion()}
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color={C.blanco}
                />
              </Pressable>
            )}
          </View>
        </View>
      </Modal>

      {/* Formulario */}
      <Modal
        visible={formularioVisible}
        transparent
        animationType="slide"
        onRequestClose={cerrarFormulario}
      >
        <KeyboardAvoidingView
          style={s.modalFondo}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <ScrollView
            contentContainerStyle={s.formScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={s.modalContenido}>
              <View style={s.modalBarra} />

              <View style={s.modalEncabezado}>
                <Text style={s.formTitulo}>
                  {obtenerAccion()}
                </Text>

                <Pressable
                  style={s.cerrar}
                  onPress={cerrarFormulario}
                  accessibilityLabel="Cerrar formulario"
                >
                  <Ionicons
                    name="close"
                    size={21}
                    color={C.secundario}
                  />
                </Pressable>
              </View>

              <View style={s.servicioSeleccionado}>
                <Text style={s.servicioIcono}>
                  {seleccionado?.icono}
                </Text>

                <View style={s.servicioInfo}>
                  <Text style={s.servicioNombre}>
                    {seleccionado?.nombre}
                  </Text>

                  <Text style={s.servicioPersona}>
                    {seleccionado?.persona}
                  </Text>
                </View>
              </View>

              <Text style={s.label}>
                Nombre completo
              </Text>

              <TextInput
                style={s.input}
                placeholder="Escribe tu nombre"
                placeholderTextColor={C.secundario}
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
              />

              <Text style={s.label}>
                Teléfono de contacto
              </Text>

              <TextInput
                style={s.input}
                placeholder="Ejemplo: 999888777"
                placeholderTextColor={C.secundario}
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />

              <Text style={s.label}>
                {seleccionado?.accion === 'ayudar'
                  ? '¿Cómo puedes ayudar?'
                  : 'Describe lo que necesitas'}
              </Text>

              <TextInput
                style={[
                  s.input,
                  s.inputMensaje,
                ]}
                placeholder="Escribe tu mensaje..."
                placeholderTextColor={C.secundario}
                value={mensaje}
                onChangeText={setMensaje}
                multiline
                textAlignVertical="top"
              />

              <Text style={s.avisoFormulario}>
                Esta solicitud es de demostración.
                No se enviarán mensajes reales.
              </Text>

              <Pressable
                style={s.botonPrincipal}
                onPress={enviarSolicitud}
              >
                <Text style={s.botonTexto}>
                  Enviar solicitud
                </Text>

                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={C.blanco}
                />
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: C.fondo,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 17,
  },

  back: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.blanco,
    borderWidth: 1,
    borderColor: C.borde,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTextos: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: C.principal,
  },

  subtitle: {
    fontSize: 12,
    color: C.secundario,
    marginTop: 3,
  },

  mapContainer: {
    flex: 1,
    minHeight: 250,
    marginHorizontal: 14,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.borde,
    backgroundColor: C.verdeClaro,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  controles: {
    position: 'absolute',
    right: 12,
    bottom: 52,
    backgroundColor: C.blanco,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: C.borde,
    elevation: 3,
    overflow: 'hidden',
  },

  controlBoton: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlSeparador: {
    height: 1,
    backgroundColor: C.borde,
  },

  indicadorMapa: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: C.blanco,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: C.borde,
  },

  indicadorTexto: {
    fontSize: 11,
    color: C.secundario,
    fontWeight: '600',
  },

  filters: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 15,
    paddingBottom: 10,
    gap: 7,
  },

  filter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 11,
    paddingHorizontal: 5,
    borderRadius: 13,
    backgroundColor: C.blanco,
    borderWidth: 1,
    borderColor: C.borde,
  },

  filterActivo: {
    backgroundColor: C.principal,
    borderColor: C.principal,
  },

  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.texto,
  },

  filterTextActivo: {
    color: C.blanco,
  },

  bottomNote: {
    textAlign: 'center',
    fontSize: 12,
    color: C.secundario,
    paddingBottom: 18,
    paddingHorizontal: 15,
  },

  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(36,55,70,0.48)',
    justifyContent: 'flex-end',
  },

  modalContenido: {
    backgroundColor: C.blanco,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 35,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  modalBarra: {
    width: 45,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.borde,
    alignSelf: 'center',
    marginBottom: 22,
  },

  modalEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  modalIcono: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalEmoji: {
    fontSize: 27,
  },

  cerrar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCategoria: {
    fontSize: 12,
    fontWeight: '800',
    color: C.principal,
    marginBottom: 6,
  },

  modalTitulo: {
    fontSize: 23,
    fontWeight: '800',
    color: C.texto,
    marginBottom: 12,
  },

  personaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 15,
  },

  modalPersona: {
    fontSize: 14,
    color: C.secundario,
  },

  modalDescripcion: {
    fontSize: 14,
    color: C.secundario,
    lineHeight: 22,
    marginBottom: 25,
  },

  botonPrincipal: {
    height: 55,
    backgroundColor: C.principal,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 10,
  },

  botonTexto: {
    fontSize: 16,
    fontWeight: '800',
    color: C.blanco,
  },

  formScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },

  formTitulo: {
    fontSize: 22,
    fontWeight: '800',
    color: C.principal,
    flex: 1,
  },

  servicioSeleccionado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.verdeClaro,
    padding: 13,
    borderRadius: 15,
    marginBottom: 24,
  },

  servicioIcono: {
    fontSize: 26,
  },

  servicioInfo: {
    flex: 1,
  },

  servicioNombre: {
    fontSize: 14,
    fontWeight: '800',
    color: C.texto,
  },

  servicioPersona: {
    fontSize: 12,
    color: C.secundario,
    marginTop: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: C.texto,
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: C.blanco,
    borderWidth: 1,
    borderColor: C.borde,
    paddingHorizontal: 15,
    fontSize: 14,
    color: C.texto,
    marginBottom: 17,
  },

  inputMensaje: {
    height: 95,
    paddingTop: 13,
  },

  avisoFormulario: {
    fontSize: 12,
    color: C.secundario,
    lineHeight: 18,
    marginBottom: 10,
  },
});
