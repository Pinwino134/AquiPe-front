
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
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
  MapPressEvent,
  Marker,
  Region,
} from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Api, type Publicacion } from '@/lib/api';
import { guardarPuestos } from '@/lib/offline';
import { mostrarError, zonaMasCercana } from '@/lib/ui';

const C = {
  principal: '#146C67',
  fondo: '#F6F7F3',
  verdeClaro: '#E8F2ED',
  texto: '#243746',
  secundario: '#526A67',
  blanco: '#FFFFFF',
  borde: '#DFE7E2',
};

type Accion = 'solicitar' | 'ofrecer';
type Vista = 'recursos' | 'reportes' | null;

type Ubicacion = {
  latitude: number;
  longitude: number;
};

type Registro = {
  id: string;
  tipo: Accion;
  titulo: string;
  descripcion: string;
  zona: string;
  cantidad?: string;
  ubicacion: Ubicacion;
};

const NUMEROS = [
  { n: '105', t: 'Policía Nacional', i: 'shield' as const, c: '#168BE0' },
  { n: '116', t: 'Bomberos', i: 'flame' as const, c: '#E5533D' },
  { n: '106', t: 'SAMU (ambulancia)', i: 'medkit' as const, c: '#18B69A' },
  { n: '115', t: 'Defensa Civil', i: 'warning' as const, c: '#F28B30' },
  { n: '100', t: 'Violencia familiar', i: 'heart' as const, c: '#F05A7E' },
  { n: '113', t: 'Salud (MINSA)', i: 'pulse' as const, c: '#7A5AF0' },
];

const REGION_INICIAL: Region = {
  latitude: -16.3989,
  longitude: -71.535,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};

const aRegistro = (p: Publicacion): Registro | null => {
  if (p.latitud == null || p.longitud == null) return null;

  return {
    id: p.id,
    tipo: p.direccion === 'OFRECE' ? 'ofrecer' : 'solicitar',
    titulo: p.titulo,
    descripcion: p.descripcion,
    zona: p.zona?.nombre ?? 'Sin zona',
    cantidad: p.emergencia?.detalle_cantidad ?? undefined,
    ubicacion: {
      latitude: p.latitud,
      longitude: p.longitud,
    },
  };
};

export default function Emergencias() {
  const mapaRef = useRef<MapView>(null);

  const [accion, setAccion] =
    useState<Accion | null>(null);

  const [vista, setVista] =
    useState<Vista>(null);

  const [ubicacionVisible, setUbicacionVisible] =
    useState(false);

  const [mapaDetalleVisible, setMapaDetalleVisible] =
    useState(false);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [zona, setZona] = useState('');
  const [cantidad, setCantidad] = useState('');

  const [ubicacion, setUbicacion] =
    useState<Ubicacion | null>(null);

  const [ubicacionDetalle, setUbicacionDetalle] =
    useState<Ubicacion | null>(null);

  const [registroSeleccionado, setRegistroSeleccionado] =
    useState<Registro | null>(null);

  const [recursos, setRecursos] = useState<Registro[]>([]);
  const [reportes, setReportes] = useState<Registro[]>([]);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const lista = await Api.publicaciones({
        tipo: 'EMERGENCIA',
      });

      const registros = lista
        .map(aRegistro)
        .filter((r): r is Registro => r !== null);

      // Copia local para el modo emergencia sin conexión
      guardarPuestos(
        registros.slice(0, 60).map((r) => ({
          id: r.id,
          titulo: r.titulo,
          detalle: r.cantidad ?? '',
          zona: r.zona,
          tipo: r.tipo,
          latitude: r.ubicacion.latitude,
          longitude: r.ubicacion.longitude,
        }))
      );

      setRecursos(registros.filter((r) => r.tipo === 'ofrecer'));
      setReportes(registros.filter((r) => r.tipo === 'solicitar'));
    } catch (e) {
      mostrarError(e, 'No se pudieron cargar las emergencias');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const [regionMapa, setRegionMapa] =
    useState<Region>(REGION_INICIAL);

  const abrirFormulario = (tipo: Accion) => {
    setTitulo('');
    setDescripcion('');
    setZona('');
    setCantidad('');
    setUbicacion(null);
    setAccion(tipo);
  };

  const cerrarFormulario = () => {
    setAccion(null);
  };

  const seleccionarUbicacion = (
    evento: MapPressEvent
  ) => {
    const coordenadas =
      evento.nativeEvent.coordinate;

    setUbicacion({
      latitude: coordenadas.latitude,
      longitude: coordenadas.longitude,
    });
  };

  const confirmarUbicacion = () => {
    if (!ubicacion) {
      Alert.alert(
        'Selecciona una ubicación',
        'Toca el mapa para marcar el lugar.'
      );
      return;
    }

    setUbicacionVisible(false);
  };

  const guardar = async () => {
    if (
      !titulo.trim() ||
      !descripcion.trim()
    ) {
      Alert.alert(
        'Campos incompletos',
        'Completa el título y la descripción.'
      );
      return;
    }

    if (!ubicacion) {
      Alert.alert(
        'Ubicación requerida',
        'Selecciona un punto en el mapa.'
      );
      return;
    }

    if (accion === 'ofrecer' && !cantidad.trim()) {
      Alert.alert(
        'Cantidad requerida',
        'Indica la cantidad de recursos disponibles.'
      );
      return;
    }

    if (!accion) return;

    if (guardando) return;
    setGuardando(true);

    try {
      // La zona se deduce del punto marcado en el mapa.
      const zonaId = (
        await zonaMasCercana(ubicacion.latitude, ubicacion.longitude)
      )?.id ?? null;

      await Api.crearPublicacion({
        tipo: 'EMERGENCIA',
        direccion: accion === 'ofrecer' ? 'OFRECE' : 'SOLICITA',
        titulo: titulo.trim().slice(0, 80),
        descripcion: descripcion.trim().slice(0, 1000),
        zona_id: zonaId,
        latitud: ubicacion.latitude,
        longitud: ubicacion.longitude,
        emergencia: {
          nivel_urgencia: 'ALTA',
          ...(accion === 'ofrecer'
            ? {
                // "20 botellas de agua" -> cantidad 20 + texto completo
                cantidad: parseInt(cantidad.match(/\d+/)?.[0] ?? '1', 10) || 1,
                detalle_cantidad: cantidad.trim().slice(0, 200),
              }
            : {}),
        },
      });

      setAccion(null);
      setTitulo('');
      setDescripcion('');
      setZona('');
      setCantidad('');
      setUbicacion(null);

      await cargar();

      Alert.alert(
        'Registro guardado',
        'Tu información ya está visible para otros vecinos.'
      );
    } catch (e) {
      mostrarError(e, 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  const verEnMapa = (registro: Registro) => {
    setRegistroSeleccionado(registro);
    setUbicacionDetalle(registro.ubicacion);

    setRegionMapa({
      ...registro.ubicacion,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    });

    setMapaDetalleVisible(true);
  };

  const cerrarMapaDetalle = () => {
    setMapaDetalleVisible(false);
    setRegistroSeleccionado(null);
    setUbicacionDetalle(null);
  };

  const renderRegistro = (registro: Registro) => (
    <View
      key={registro.id}
      style={s.registroCard}
    >
      <View style={s.registroHeader}>
        <View style={s.registroIcono}>
          <Ionicons
            name={
              registro.tipo === 'ofrecer'
                ? 'cube-outline'
                : 'alert-circle-outline'
            }
            size={21}
            color={C.principal}
          />
        </View>

        <View style={s.registroInfo}>
          <Text style={s.registroTitulo}>
            {registro.titulo}
          </Text>

          <View style={s.zonaFila}>
            <Ionicons
              name="location-outline"
              size={13}
              color={C.secundario}
            />

            <Text style={s.registroZona}>
              {registro.zona}
            </Text>
          </View>
        </View>
      </View>

      <Text style={s.registroDescripcion}>
        {registro.descripcion}
      </Text>

      {registro.cantidad && (
        <View style={s.cantidadBox}>
          <Ionicons
            name="cube-outline"
            size={14}
            color={C.principal}
          />

          <Text style={s.cantidadTexto}>
            Disponible: {registro.cantidad}
          </Text>
        </View>
      )}

      <Pressable
        style={s.verMapaBoton}
        onPress={() => verEnMapa(registro)}
      >
        <Ionicons
          name="map-outline"
          size={17}
          color={C.blanco}
        />

        <Text style={s.verMapaTexto}>
          Ver en el mapa
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={s.page}>
      {/* Encabezado */}
      <View style={s.header}>
        <Pressable
          style={s.back}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={23}
            color={C.principal}
          />
        </Pressable>

        <Text style={s.title}>
          Modo Emergencia
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >
        {/* Banner */}
        <View style={s.alertBanner}>
          <View style={s.bannerIcono}>
            <Ionicons
              name="shield-checkmark-outline"
              size={29}
              color={C.principal}
            />
          </View>

          <Text style={s.alertTitle}>
            Ayuda comunitaria
          </Text>

          <Text style={s.alertSubtitle}>
            Solicita apoyo o comparte recursos
            con tu comunidad.
          </Text>
        </View>

        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: '#D9402B',
            borderRadius: 16,
            padding: 14,
            marginBottom: 14,
          }}
          onPress={() => router.push('/emergencia-offline')}
          accessibilityRole="button"
        >
          <Ionicons name="cloud-offline-outline" size={24} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
              Modo emergencia sin conexión
            </Text>
            <Text style={{ color: '#FFE3DE', fontSize: 12 }}>
              SOS por SMS, primeros auxilios y contactos sin internet
            </Text>
          </View>
        </Pressable>

        {/* Advertencia */}
        <View style={s.warning}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={C.principal}
          />

          <Text style={s.warningText}>
            Ante un peligro inmediato, contacta
            directamente a los servicios de
            emergencia. Esta pantalla no envía
            alertas reales.
          </Text>
        </View>

        {/* Acciones */}
        <Text style={s.sectionTitle}>
          ¿Qué deseas hacer?
        </Text>

        <View style={s.actions}>
          <Pressable
            style={s.actionCard}
            onPress={() =>
              abrirFormulario('solicitar')
            }
          >
            <View style={s.actionIcono}>
              <Ionicons
                name="hand-left-outline"
                size={29}
                color={C.principal}
              />
            </View>

            <Text style={s.actionText}>
              Solicitar ayuda
            </Text>

            <Text style={s.actionDescripcion}>
              Registra una necesidad y su ubicación
            </Text>
          </Pressable>

          <Pressable
            style={s.actionCard}
            onPress={() =>
              abrirFormulario('ofrecer')
            }
          >
            <View style={s.actionIcono}>
              <Ionicons
                name="cube-outline"
                size={29}
                color={C.principal}
              />
            </View>

            <Text style={s.actionText}>
              Ofrecer recurso
            </Text>

            <Text style={s.actionDescripcion}>
              Publica recursos y un puesto de ayuda
            </Text>
          </Pressable>
        </View>

        {/* Números de emergencia */}
        <Text style={s.sectionTitle}>Números de emergencia</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
          {NUMEROS.map((x) => (
            <Pressable
              key={x.n}
              style={{
                width: '48%',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#fff',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#DFE7E2',
                padding: 12,
              }}
              onPress={() => Linking.openURL(`tel:${x.n}`)}
              accessibilityRole="button"
              accessibilityLabel={`Llamar al ${x.n}, ${x.t}`}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: x.c + '22',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name={x.i} size={20} color={x.c} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: x.c }}>{x.n}</Text>
                <Text style={{ fontSize: 11, color: '#526A67' }} numberOfLines={1}>
                  {x.t}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Mapa general */}
        <Text style={s.sectionTitle}>Mapa de emergencias</Text>

        <View style={{ height: 210, borderRadius: 18, overflow: 'hidden', marginBottom: 8 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={REGION_INICIAL}
            showsUserLocation
          >
            {reportes.map((r) => (
              <Marker
                key={r.id}
                coordinate={r.ubicacion}
                pinColor="#E5533D"
                title={r.titulo}
                description={r.zona}
              />
            ))}
            {recursos.map((r) => (
              <Marker
                key={r.id}
                coordinate={r.ubicacion}
                pinColor="#18B69A"
                title={r.titulo}
                description={r.cantidad ?? r.zona}
              />
            ))}
          </MapView>
        </View>

        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 22 }}>
          <Text style={{ fontSize: 12, color: '#526A67' }}>🔴 Solicitudes de ayuda</Text>
          <Text style={{ fontSize: 12, color: '#526A67' }}>🟢 Recursos y puestos</Text>
        </View>

        {/* Consultas */}
        <Text style={s.sectionTitle}>
          Información comunitaria
        </Text>

        <Pressable
          style={s.listCard}
          onPress={() => setVista('recursos')}
        >
          <View style={s.listIcono}>
            <Ionicons
              name="medkit-outline"
              size={25}
              color={C.principal}
            />
          </View>

          <View style={s.listContent}>
            <Text style={s.listTitle}>
              Recursos disponibles
            </Text>

            <Text style={s.listSubtitle}>
              {recursos.length} puestos de ayuda y recursos
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={C.principal}
          />
        </Pressable>

        <Pressable
          style={s.listCard}
          onPress={() => setVista('reportes')}
        >
          <View style={s.listIcono}>
            <Ionicons
              name="document-text-outline"
              size={25}
              color={C.principal}
            />
          </View>

          <View style={s.listContent}>
            <Text style={s.listTitle}>
              Reportes de la zona
            </Text>

            <Text style={s.listSubtitle}>
              {reportes.length} reportes registrados
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={C.principal}
          />
        </Pressable>
      </ScrollView>

      {/* Formulario de solicitud/recurso */}
      <Modal
        visible={accion !== null}
        transparent
        animationType="slide"
        onRequestClose={cerrarFormulario}
      >
        <KeyboardAvoidingView
          style={s.modalBackdrop}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <ScrollView
            contentContainerStyle={s.modalScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={s.modal}>
              <View style={s.modalHead}>
                <Text style={s.modalTitle}>
                  {accion === 'solicitar'
                    ? 'Solicitar ayuda'
                    : 'Ofrecer recurso'}
                </Text>

                <Pressable
                  style={s.closeButton}
                  onPress={cerrarFormulario}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={C.secundario}
                  />
                </Pressable>
              </View>

              <Text style={s.label}>
                {accion === 'solicitar'
                  ? '¿Qué ayuda necesitas?'
                  : 'Nombre del recurso o puesto de ayuda'}
              </Text>

              <TextInput
                style={s.input}
                value={titulo}
                onChangeText={setTitulo}
                placeholder={
                  accion === 'solicitar'
                    ? 'Ej. Necesito agua potable'
                    : 'Ej. Puesto de alimentos'
                }
                placeholderTextColor={C.secundario}
              />

              <Text style={s.label}>
                Descripción
              </Text>

              <TextInput
                multiline
                style={[s.input, s.inputMultilinea]}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Describe la situación o los recursos..."
                placeholderTextColor={C.secundario}
                textAlignVertical="top"
              />

              {accion === 'ofrecer' && (
                <>
                  <Text style={s.label}>
                    Recursos disponibles y cantidad
                  </Text>

                  <TextInput
                    style={s.input}
                    value={cantidad}
                    onChangeText={setCantidad}
                    placeholder="Ej. 10 botellas de agua"
                    placeholderTextColor={C.secundario}
                  />
                </>
              )}

              <Text style={s.label}>
                Ubicación en el mapa
              </Text>

              <Pressable
                style={s.ubicacionBoton}
                onPress={() =>
                  setUbicacionVisible(true)
                }
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={C.principal}
                />

                <Text style={s.ubicacionTexto}>
                  {ubicacion
                    ? 'Ubicación seleccionada'
                    : 'Seleccionar ubicación'}
                </Text>

                <Ionicons
                  name={
                    ubicacion
                      ? 'checkmark-circle'
                      : 'chevron-forward'
                  }
                  size={20}
                  color={C.principal}
                />
              </Pressable>

              <Pressable
                style={s.submit}
                onPress={guardar}
              >
                <Text style={s.submitText}>
                  Guardar registro
                </Text>
              </Pressable>

              <Text style={s.modalNote}>
                Esto no reemplaza a los servicios de
                emergencia. En una urgencia real, llama al 105 (Policía)
                o al 116 (Bomberos).
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Selector de ubicación */}
      <Modal
        visible={ubicacionVisible}
        animationType="slide"
        onRequestClose={() =>
          setUbicacionVisible(false)
        }
      >
        <SafeAreaView style={s.mapPage}>
          <View style={s.mapHeader}>
            <Pressable
              onPress={() =>
                setUbicacionVisible(false)
              }
              style={s.back}
            >
              <Ionicons
                name="chevron-back"
                size={23}
                color={C.principal}
              />
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text style={s.mapTitle}>
                Seleccionar ubicación
              </Text>

              <Text style={s.mapSubtitle}>
                Toca el mapa para colocar un marcador
              </Text>
            </View>
          </View>

          <View style={s.mapContainer}>
            <MapView
              style={s.map}
              initialRegion={
                ubicacion
                  ? {
                      ...ubicacion,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.015,
                    }
                  : REGION_INICIAL
              }
              onPress={seleccionarUbicacion}
            >
              {ubicacion && (
                <Marker
                  coordinate={ubicacion}
                  pinColor={C.principal}
                />
              )}
            </MapView>
          </View>

          <View style={s.mapFooter}>
            <Text style={s.mapFooterTexto}>
              {ubicacion
                ? 'Punto marcado correctamente'
                : 'Selecciona el lugar en el mapa'}
            </Text>

            <Pressable
              style={s.submit}
              onPress={confirmarUbicacion}
            >
              <Text style={s.submitText}>
                Confirmar ubicación
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Listas de recursos y reportes */}
      <Modal
        visible={vista !== null}
        animationType="slide"
        onRequestClose={() => setVista(null)}
      >
        <SafeAreaView style={s.page}>
          <View style={s.header}>
            <Pressable
              style={s.back}
              onPress={() => setVista(null)}
            >
              <Ionicons
                name="chevron-back"
                size={23}
                color={C.principal}
              />
            </Pressable>

            <Text style={s.title}>
              {vista === 'recursos'
                ? 'Recursos disponibles'
                : 'Reportes de la zona'}
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={s.listaRegistros}
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.listaDescripcion}>
              {vista === 'recursos'
                ? 'Consulta los puestos de ayuda, los recursos disponibles y su ubicación.'
                : 'Consulta los reportes comunitarios y localiza cada situación en el mapa.'}
            </Text>

            {(vista === 'recursos'
              ? recursos
              : reportes
            ).map(renderRegistro)}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Mapa de detalle */}
      <Modal
        visible={mapaDetalleVisible}
        animationType="slide"
        onRequestClose={cerrarMapaDetalle}
      >
        <SafeAreaView style={s.mapPage}>
          <View style={s.mapHeader}>
            <Pressable
              style={s.back}
              onPress={cerrarMapaDetalle}
            >
              <Ionicons
                name="chevron-back"
                size={23}
                color={C.principal}
              />
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text style={s.mapTitle}>
                Ubicación del registro
              </Text>

              <Text style={s.mapSubtitle}>
                {registroSeleccionado?.zona}
              </Text>
            </View>
          </View>

          <View style={s.mapContainer}>
            <MapView
              ref={mapaRef}
              style={s.map}
              region={regionMapa}
              onRegionChangeComplete={setRegionMapa}
            >
              {ubicacionDetalle && (
                <Marker
                  coordinate={ubicacionDetalle}
                  title={registroSeleccionado?.titulo}
                  description={registroSeleccionado?.descripcion}
                  pinColor={C.principal}
                />
              )}
            </MapView>
          </View>

          <View style={s.mapFooter}>
            <Text style={s.detalleMapaTitulo}>
              {registroSeleccionado?.titulo}
            </Text>

            <Text style={s.detalleMapaDescripcion}>
              {registroSeleccionado?.descripcion}
            </Text>

            {registroSeleccionado?.cantidad && (
              <Text style={s.detalleMapaCantidad}>
                Recursos: {registroSeleccionado.cantidad}
              </Text>
            )}

            <Pressable
              style={s.submit}
              onPress={cerrarMapaDetalle}
            >
              <Text style={s.submitText}>
                Volver a la lista
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 17,
    gap: 12,
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

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: C.principal,
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  alertBanner: {
    backgroundColor: C.principal,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 14,
  },

  bannerIcono: {
    width: 55,
    height: 55,
    borderRadius: 17,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  alertTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: C.blanco,
  },

  alertSubtitle: {
    fontSize: 13,
    color: C.blanco,
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 19,
  },

  warning: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: C.verdeClaro,
    padding: 14,
    borderRadius: 13,
    marginBottom: 23,
  },

  warningText: {
    flex: 1,
    fontSize: 12,
    color: C.texto,
    lineHeight: 19,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.texto,
    marginBottom: 13,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },

  actionCard: {
    flex: 1,
    backgroundColor: C.blanco,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 21,
    borderWidth: 1,
    borderColor: C.borde,
  },

  actionIcono: {
    width: 55,
    height: 55,
    borderRadius: 17,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
  },

  actionText: {
    fontSize: 14,
    fontWeight: '800',
    color: C.texto,
    textAlign: 'center',
  },

  actionDescripcion: {
    fontSize: 11,
    color: C.secundario,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },

  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.blanco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.borde,
  },

  listIcono: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  listContent: {
    flex: 1,
  },

  listTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.texto,
  },

  listSubtitle: {
    fontSize: 12,
    color: C.secundario,
    marginTop: 4,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(36,55,70,0.48)',
    justifyContent: 'flex-end',
  },

  modalScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: C.blanco,
    padding: 24,
    paddingBottom: 38,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  modalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.principal,
    flex: 1,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: C.texto,
    marginBottom: 8,
  },

  input: {
    minHeight: 52,
    backgroundColor: C.blanco,
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: C.texto,
    marginBottom: 17,
  },

  inputMultilinea: {
    minHeight: 90,
  },

  ubicacionBoton: {
    height: 54,
    backgroundColor: C.verdeClaro,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.borde,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },

  ubicacionTexto: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: C.principal,
  },

  submit: {
    backgroundColor: C.principal,
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },

  submitText: {
    color: C.blanco,
    fontWeight: '800',
    fontSize: 15,
  },

  modalNote: {
    fontSize: 12,
    color: C.secundario,
    textAlign: 'center',
    marginTop: 13,
    lineHeight: 18,
  },

  mapPage: {
    flex: 1,
    backgroundColor: C.fondo,
  },

  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 12,
  },

  mapTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: C.principal,
  },

  mapSubtitle: {
    fontSize: 12,
    color: C.secundario,
    marginTop: 4,
  },

  mapContainer: {
    flex: 1,
    minHeight: 250,
    marginHorizontal: 14,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.borde,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapFooter: {
    backgroundColor: C.blanco,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: C.borde,
  },

  mapFooterTexto: {
    fontSize: 13,
    color: C.secundario,
    textAlign: 'center',
  },

  listaRegistros: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  listaDescripcion: {
    fontSize: 13,
    color: C.secundario,
    lineHeight: 20,
    marginBottom: 18,
  },

  registroCard: {
    backgroundColor: C.blanco,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.borde,
    marginBottom: 10,
  },

  registroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 11,
  },

  registroIcono: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  registroInfo: {
    flex: 1,
  },

  registroTitulo: {
    fontSize: 14,
    fontWeight: '800',
    color: C.texto,
  },

  zonaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },

  registroZona: {
    fontSize: 12,
    color: C.secundario,
  },

  registroDescripcion: {
    fontSize: 13,
    color: C.secundario,
    lineHeight: 19,
    marginBottom: 10,
  },

  cantidadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: C.verdeClaro,
    padding: 10,
    borderRadius: 10,
    marginBottom: 11,
  },

  cantidadTexto: {
    fontSize: 12,
    color: C.principal,
    fontWeight: '700',
    flex: 1,
  },

  verMapaBoton: {
    backgroundColor: C.principal,
    borderRadius: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  verMapaTexto: {
    color: C.blanco,
    fontSize: 13,
    fontWeight: '800',
  },

  detalleMapaTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: C.texto,
    marginBottom: 5,
  },

  detalleMapaDescripcion: {
    fontSize: 13,
    color: C.secundario,
    lineHeight: 19,
  },

  detalleMapaCantidad: {
    fontSize: 12,
    fontWeight: '700',
    color: C.principal,
    marginTop: 8,
  },
});
