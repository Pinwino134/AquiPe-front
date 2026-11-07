
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Region } from 'react-native-maps';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Api, type Publicacion } from '@/lib/api';
import { useUsuario } from '@/lib/session';
import {
  COLOR_TIPO,
  obtenerUbicacion,
  textoPrecio,
} from '@/lib/ui';

const C = {
  principal: '#146C67',
  fondo: '#F6F7F3',
  verdeClaro: '#E8F2ED',
  texto: '#243746',
  secundario: '#526A67',
  blanco: '#FFFFFF',
  borde: '#DFE7E2',
};

const REGION_INICIAL: Region = {
  latitude: -16.3989,
  longitude: -71.535,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

const ANCHO_PANTALLA = Dimensions.get('window').width;
const ANCHO_CONTENIDO = ANCHO_PANTALLA - 44;

const opciones = [
  {
    nombre: 'Servicios',
    icono: 'construct',
    color: '#168BE0',
    ruta: '/servicios',
  },
  {
    nombre: 'Favores',
    icono: 'heart',
    color: '#F05A7E',
    ruta: '/favores',
  },
  {
    nombre: 'Mapa',
    icono: 'location',
    color: '#18B69A',
    ruta: '/mapa',
  },
  {
    nombre: 'Emergencias',
    icono: 'warning',
    color: '#F28B30',
    ruta: '/emergencias',
  },
] as const;

const tabs = [
  {
    nombre: 'Inicio',
    icono: 'home-outline',
  },
  {
    nombre: 'Publicar',
    icono: 'add-circle-outline',
  },
  {
    nombre: 'Tutorial',
    icono: 'book-outline',
  },
  {
    nombre: 'Perfil',
    icono: 'person-outline',
  },
] as const;

type TarjetaPublicacion = {
  id: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  precio: string;
  icono: keyof typeof Ionicons.glyphMap;
  color: string;
};

const aTarjeta = (p: Publicacion): TarjetaPublicacion => ({
  id: p.id,
  titulo: p.titulo,
  categoria: p.categoria?.nombre ?? p.tipo,
  descripcion: p.descripcion,
  precio: p.servicio ? textoPrecio(p) : p.direccion === 'OFRECE' ? 'Ofrezco' : 'Necesito',
  icono: `${p.categoria?.icono ?? 'grid'}-outline` as keyof typeof Ionicons.glyphMap,
  color: COLOR_TIPO[p.tipo],
});

export default function Inicio() {
  const usuario = useUsuario();

  const mapaRef = useRef<MapView>(null);

  const [region, setRegion] =
    useState<Region>(REGION_INICIAL);

  const [ubicacionPermitida, setUbicacionPermitida] =
    useState(false);

  const [busqueda, setBusqueda] = useState('');

  const [tutorialVisible, setTutorialVisible] =
    useState(false);

  const [publicacionActual, setPublicacionActual] =
    useState(0);

  const nombreUsuario =
    usuario?.nombre_completo.trim().split(' ')[0] ||
    'visitante';

  const [publicacionesUsuario, setPublicacionesUsuario] =
    useState<TarjetaPublicacion[]>([]);

  const [serviciosCercanos, setServiciosCercanos] =
    useState<Publicacion[]>([]);

  // Se recarga cada vez que la pantalla vuelve a estar en foco
  // (por ejemplo, después de publicar algo nuevo).
  useFocusEffect(
    useCallback(() => {
      let activo = true;

      (async () => {
        try {
          const mias = await Api.misPublicaciones();
          if (activo) {
            setPublicacionesUsuario(mias.map(aTarjeta));
            setPublicacionActual(0);
          }
        } catch {
          /* se mantiene la lista anterior */
        }

        try {
          const pos = await obtenerUbicacion();
          const cerca = await Api.publicaciones({
            tipo: 'SERVICIO',
            direccion: 'OFRECE',
            lat: pos.latitude,
            lng: pos.longitude,
            radio_km: 15,
            limit: 30,
          });
          if (activo) setServiciosCercanos(cerca);
        } catch {
          /* sin conexión: el mapa queda sin marcadores */
        }
      })();

      return () => {
        activo = false;
      };
    }, [])
  );

  useEffect(() => {
    let activo = true;

    const obtenerUbicacion = async () => {
      try {
        const permiso =
          await Location.requestForegroundPermissionsAsync();

        if (permiso.status !== 'granted') {
          return;
        }

        const posicion =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

        if (!activo) {
          return;
        }

        const nuevaRegion: Region = {
          latitude: posicion.coords.latitude,
          longitude: posicion.coords.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        };

        setRegion(nuevaRegion);
        setUbicacionPermitida(true);

        mapaRef.current?.animateToRegion(
          nuevaRegion,
          700
        );
      } catch {
        if (activo) {
          setUbicacionPermitida(false);
        }
      }
    };

    obtenerUbicacion();

    return () => {
      activo = false;
    };
  }, []);

  const abrirNotificaciones = () => {
    Alert.alert(
      'Notificaciones',
      'Todavía no tienes notificaciones.'
    );
  };

  const abrirSoporte = () => {
    Alert.alert(
      'Soporte AquiPe',
      'Próximamente podrás contactar con nuestro equipo de ayuda.'
    );
  };

  const abrirWhatsApp = async () => {
    try {
      await Linking.openURL(
        'https://wa.me/?text=Hola%2C%20necesito%20ayuda%20con%20AquiPe'
      );
    } catch {
      Alert.alert(
        'WhatsApp',
        'No se pudo abrir WhatsApp.'
      );
    }
  };

  // NAVEGACIÓN DE LA BARRA INFERIOR
  const seleccionarTab = (nombreTab: string) => {
    if (nombreTab === 'Inicio') {
      return;
    }

    if (nombreTab === 'Perfil') {
      router.push('/perfil');
      return;
    }

    // NUEVA NAVEGACIÓN AL FORMULARIO
    if (nombreTab === 'Publicar') {
      router.push('/publicar');
      return;
    }

    if (nombreTab === 'Tutorial') {
      setTutorialVisible(true);
      return;
    }
  };

  const centrarUbicacion = async () => {
    try {
      const permiso =
        await Location.getForegroundPermissionsAsync();

      if (permiso.status !== 'granted') {
        const nuevoPermiso =
          await Location.requestForegroundPermissionsAsync();

        if (nuevoPermiso.status !== 'granted') {
          Alert.alert(
            'Ubicación',
            'Activa el permiso de ubicación para centrar el mapa.'
          );
          return;
        }
      }

      const posicion =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      const nuevaRegion: Region = {
        latitude: posicion.coords.latitude,
        longitude: posicion.coords.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      };

      setRegion(nuevaRegion);
      setUbicacionPermitida(true);

      mapaRef.current?.animateToRegion(
        nuevaRegion,
        700
      );
    } catch {
      Alert.alert(
        'Ubicación',
        'No se pudo obtener tu ubicación actual.'
      );
    }
  };

  return (
    <SafeAreaView style={s.page}>
      {/* ENCABEZADO */}
      <View style={s.topBar}>
        <View style={s.topBubbleLarge} />
        <View style={s.topBubbleMedium} />
        <View style={s.topBubbleSmall} />

        <View style={s.topRow}>
          <View style={s.logoContainer}>
            <Text
              style={s.logoText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Botame tu gaaa
            </Text>

            <View style={s.logoDot} />
          </View>

          <View style={s.topActions}>
            <Pressable
              style={s.actionButton}
              onPress={abrirNotificaciones}
              accessibilityRole="button"
              accessibilityLabel="Notificaciones"
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={C.blanco}
              />
            </Pressable>

            <Pressable
              style={s.actionButton}
              onPress={abrirSoporte}
              accessibilityRole="button"
              accessibilityLabel="Ayuda y soporte"
            >
              <Ionicons
                name="headset-outline"
                size={21}
                color={C.blanco}
              />
            </Pressable>

            <Pressable
              style={s.actionButton}
              onPress={abrirWhatsApp}
              accessibilityRole="button"
              accessibilityLabel="WhatsApp"
            >
              <Ionicons
                name="logo-whatsapp"
                size={21}
                color={C.blanco}
              />
            </Pressable>
          </View>
        </View>

        <Text style={s.greeting}>
          Hola, {nombreUsuario}
        </Text>

        <View style={s.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={C.principal}
          />

          <TextInput
            style={s.searchInput}
            placeholder="¿Qué servicio necesitas?"
            placeholderTextColor="#87948F"
            value={busqueda}
            onChangeText={setBusqueda}
            returnKeyType="search"
            onSubmitEditing={() =>
              router.push({
                pathname: '/servicios',
                params: { q: busqueda.trim() },
              })
            }
            autoCorrect={false}
            accessibilityLabel="Buscar servicios"
          />

          {busqueda.length > 0 && (
            <Pressable
              onPress={() => setBusqueda('')}
              accessibilityRole="button"
              accessibilityLabel="Limpiar búsqueda"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={C.secundario}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* CONTENIDO PRINCIPAL */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* ACCESOS RÁPIDOS */}
        <View style={s.quickAccess}>
          {opciones.map((item) => (
            <Pressable
              key={item.nombre}
              style={s.quickItem}
              onPress={() => router.push(item.ruta)}
              accessibilityRole="button"
              accessibilityLabel={item.nombre}
            >
              <View style={s.quickIconBox}>
                <Ionicons
                  name={item.icono}
                  size={26}
                  color={item.color}
                />
              </View>

              <Text
                style={s.quickLabel}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {item.nombre}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* TUS SERVICIOS */}
        <View style={s.myServicesHeader}>
          <Text style={s.sectionTitle}>
            Tus servicios
          </Text>

          <Text style={s.publicationCount}>
            {publicacionesUsuario.length} publicaciones
          </Text>
        </View>

        {publicacionesUsuario.length === 0 && (
          <Text style={s.mapInfoText}>
            Aún no tienes publicaciones. Usa «Publicar» para crear la primera.
          </Text>
        )}

        <FlatList
          data={publicacionesUsuario}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          style={s.publicationsList}
          onMomentumScrollEnd={(event) => {
            const indice = Math.round(
              event.nativeEvent.contentOffset.x /
                ANCHO_CONTENIDO
            );

            setPublicacionActual(
              Math.max(
                0,
                Math.min(
                  indice,
                  publicacionesUsuario.length - 1
                )
              )
            );
          }}
          renderItem={({ item }) => (
            <View
              style={[
                s.publicationSlide,
                { width: ANCHO_CONTENIDO },
              ]}
            >
              <View style={s.publicationCard}>
                <View style={s.publicationTop}>
                  <View
                    style={[
                      s.publicationIcon,
                      {
                        backgroundColor:
                          item.color + '18',
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icono}
                      size={27}
                      color={item.color}
                    />
                  </View>

                  <View style={s.publicationInfo}>
                    <Text
                      style={s.publicationCategory}
                    >
                      {item.categoria}
                    </Text>

                    <Text
                      style={s.publicationTitle}
                      numberOfLines={2}
                    >
                      {item.titulo}
                    </Text>
                  </View>

                  <Text style={s.publicationPrice}>
                    {item.precio}
                  </Text>
                </View>

                <Text
                  style={s.publicationDescription}
                  numberOfLines={2}
                >
                  {item.descripcion}
                </Text>
              </View>
            </View>
          )}
        />

        {/* INDICADORES DEL CARRUSEL */}
        <View style={s.pagination}>
          {publicacionesUsuario.map(
            (item, index) => (
              <View
                key={item.id}
                style={[
                  s.paginationDot,
                  index === publicacionActual &&
                    s.paginationDotActive,
                ]}
              />
            )
          )}
        </View>

        {/* COINCIDENCIAS */}
        <Pressable
          style={s.matches}
          onPress={() =>
            router.push('/coincidencias')
          }
          accessibilityRole="button"
          accessibilityLabel="Ver coincidencias"
        >
          <View style={s.matchesIcon}>
            <Ionicons
              name="sparkles-outline"
              size={25}
              color={C.principal}
            />
          </View>

          <View style={s.matchesContent}>
            <Text style={s.matchesTitle}>
              Coincidencias
            </Text>

            <Text style={s.matchesDesc}>
              Descubre nuevas oportunidades cerca
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={23}
            color={C.principal}
          />
        </Pressable>

        {/* MAPA DE SERVICIOS */}
        <View style={s.nearbySection}>
          <View style={s.nearbyHeader}>
            <View style={s.nearbyHeaderText}>
              <Text style={s.nearbyTitle}>
                Servicios cerca de ti
              </Text>

              <Text style={s.nearbyDescription}>
                Explora lo que ofrece tu comunidad
              </Text>
            </View>

            <Pressable
              style={s.locationButton}
              onPress={centrarUbicacion}
              accessibilityRole="button"
              accessibilityLabel="Centrar mapa en mi ubicación"
            >
              <Ionicons
                name="locate"
                size={23}
                color={C.principal}
              />
            </Pressable>
          </View>

          <View style={s.mapContainer}>
            <MapView
              ref={mapaRef}
              style={s.mapPreview}
              initialRegion={region}
              showsUserLocation={ubicacionPermitida}
              showsCompass
              zoomEnabled
              scrollEnabled
              rotateEnabled={false}
              pitchEnabled={false}
            >
              {serviciosCercanos
                .filter(
                  (servicio) =>
                    servicio.latitud != null &&
                    servicio.longitud != null
                )
                .map((servicio) => (
                  <Marker
                    key={servicio.id}
                    coordinate={{
                      latitude:
                        servicio.latitud as number,
                      longitude:
                        servicio.longitud as number,
                    }}
                    title={servicio.titulo}
                    description={
                      servicio.autor.nombre_completo
                    }
                    pinColor={COLOR_TIPO.SERVICIO}
                  />
                ))}
            </MapView>
          </View>

          <View style={s.mapInfoRow}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={C.secundario}
            />

            <Text style={s.mapInfoText}>
              {serviciosCercanos.length === 0
                ? 'No hay servicios publicados cerca todavía'
                : `${serviciosCercanos.length} servicios publicados cerca de ti`}
            </Text>
          </View>

          <Pressable
            style={s.mapFooter}
            onPress={() => router.push('/mapa')}
            accessibilityRole="button"
            accessibilityLabel="Explorar mapa completo"
          >
            <Text style={s.mapFooterText}>
              Explorar servicios cercanos
            </Text>

            <Ionicons
              name="arrow-forward"
              size={19}
              color={C.principal}
            />
          </Pressable>
        </View>

        {/* BANNER INFERIOR */}
        <View style={s.banner}>
          <View style={s.bannerCircle} />

          <Text style={s.bannerSmall}>
            AQUIPE CERCA DE TI
          </Text>

          <Text
            style={s.bannerTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
          >
            Tu barrio, tu mejor apoyo.
          </Text>

          <Text style={s.bannerSubtitle}>
            Comparte, conecta y crece con tus vecinos.
          </Text>
        </View>
      </ScrollView>

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <View style={s.navContainer}>
        <View style={s.nav}>
          {tabs.map((tab) => {
            const activa =
              tab.nombre === 'Inicio';

            return (
              <Pressable
                key={tab.nombre}
                style={[
                  s.navItem,
                  activa && s.navItemActive,
                ]}
                onPress={() =>
                  seleccionarTab(tab.nombre)
                }
                accessibilityRole="button"
                accessibilityLabel={tab.nombre}
                accessibilityState={{
                  selected: activa,
                }}
              >
                <Ionicons
                  name={tab.icono}
                  size={24}
                  color={
                    activa
                      ? C.blanco
                      : C.secundario
                  }
                />

                {activa && (
                  <Text style={s.navActiveText}>
                    {tab.nombre}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* TUTORIAL */}
      <Modal
        visible={tutorialVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setTutorialVisible(false)
        }
      >
        <View style={s.tutorialOverlay}>
          <View style={s.tutorialCard}>
            <Pressable
              style={s.tutorialClose}
              onPress={() =>
                setTutorialVisible(false)
              }
              accessibilityRole="button"
              accessibilityLabel="Cerrar tutorial"
            >
              <Ionicons
                name="close"
                size={22}
                color={C.secundario}
              />
            </Pressable>

            <Text style={s.tutorialTitle}>
              Tu comunidad, tu apoyo
            </Text>

            <View style={s.tutorialIllustration}>
              <View style={s.tutorialCircle}>
                <Ionicons
                  name="people-outline"
                  size={68}
                  color={C.principal}
                />
              </View>

              <View style={s.tutorialCheck}>
                <Ionicons
                  name="checkmark"
                  size={22}
                  color={C.blanco}
                />
              </View>
            </View>

            {[
              'Busca servicios de tu barrio',
              'Publica o responde favores',
              'Activa el modo emergencia cuando lo necesites',
            ].map((paso, indice) => (
              <View
                key={indice}
                style={s.tutorialStep}
              >
                <View style={s.tutorialNumber}>
                  <Text
                    style={s.tutorialNumberText}
                  >
                    {indice + 1}
                  </Text>
                </View>

                <Text style={s.tutorialStepText}>
                  {paso}
                </Text>
              </View>
            ))}

            <Pressable
              style={s.tutorialButton}
              onPress={() =>
                setTutorialVisible(false)
              }
              accessibilityRole="button"
            >
              <Text style={s.tutorialButtonText}>
                Entendido
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: C.fondo,
  },

  topBar: {
    backgroundColor: C.principal,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 22,
    overflow: 'hidden',
  },

  topBubbleLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#27817A',
    right: -75,
    bottom: -105,
    opacity: 0.65,
  },

  topBubbleMedium: {
    position: 'absolute',
    width: 115,
    height: 115,
    borderRadius: 58,
    backgroundColor: C.verdeClaro,
    right: 48,
    top: -80,
    opacity: 0.12,
  },

  topBubbleSmall: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: C.verdeClaro,
    right: -20,
    top: -25,
    opacity: 0.16,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    minWidth: 0,
  },

  logoText: {
    fontSize: 19,
    fontWeight: '900',
    color: C.blanco,
    letterSpacing: -0.5,
    flexShrink: 1,
  },

  logoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.verdeClaro,
    marginLeft: 4,
    marginTop: 10,
  },

  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginLeft: 8,
  },

  actionButton: {
    width: 30,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  greeting: {
    fontSize: 21,
    fontWeight: '800',
    color: C.blanco,
    marginTop: 20,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.blanco,
    borderRadius: 15,
    paddingHorizontal: 13,
    height: 44,
    marginTop: 12,
    gap: 9,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.texto,
    height: '100%',
    paddingVertical: 0,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 35,
  },

  quickAccess: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 25,
  },

  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
    minWidth: 0,
  },

  quickIconBox: {
    width: 56,
    height: 56,
    backgroundColor: C.blanco,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.borde,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: C.texto,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  quickLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.texto,
    textAlign: 'center',
  },

  myServicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: C.texto,
  },

  publicationCount: {
    fontSize: 11,
    fontWeight: '600',
    color: C.secundario,
  },

  publicationsList: {
    width: '100%',
    flexGrow: 0,
  },

  publicationSlide: {
    paddingRight: 0,
  },

  publicationCard: {
    backgroundColor: C.blanco,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borde,
    padding: 17,
    minHeight: 130,
    justifyContent: 'center',
  },

  publicationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  publicationIcon: {
    width: 49,
    height: 49,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  publicationInfo: {
    flex: 1,
  },

  publicationCategory: {
    fontSize: 11,
    color: C.secundario,
    marginBottom: 4,
  },

  publicationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.texto,
  },

  publicationPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: C.principal,
    marginLeft: 4,
  },

  publicationDescription: {
    fontSize: 12,
    color: C.secundario,
    lineHeight: 18,
    marginTop: 13,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginTop: 13,
    marginBottom: 23,
  },

  paginationDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CBD5D1',
  },

  paginationDotActive: {
    width: 20,
    backgroundColor: C.principal,
  },

  matches: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: C.verdeClaro,
    borderRadius: 20,
    padding: 16,
    marginBottom: 25,
  },

  matchesIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: C.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },

  matchesContent: {
    flex: 1,
  },

  matchesTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.texto,
  },

  matchesDesc: {
    fontSize: 12,
    color: C.secundario,
    marginTop: 3,
  },

  nearbySection: {
    marginBottom: 25,
  },

  nearbyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  nearbyHeaderText: {
    flex: 1,
  },

  nearbyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.texto,
  },

  nearbyDescription: {
    fontSize: 12,
    color: C.secundario,
    marginTop: 4,
  },

  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  mapContainer: {
    height: 195,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.borde,
    backgroundColor: C.verdeClaro,
  },

  mapPreview: {
    width: '100%',
    height: '100%',
  },

  mapInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },

  mapInfoText: {
    fontSize: 11,
    color: C.secundario,
  },

  mapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 12,
  },

  mapFooterText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.principal,
  },

  banner: {
    backgroundColor: C.principal,
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 22,
    overflow: 'hidden',
  },

  bannerCircle: {
    position: 'absolute',
    width: 175,
    height: 175,
    borderRadius: 90,
    backgroundColor: '#27817A',
    right: -65,
    top: -50,
  },

  bannerSmall: {
    color: C.verdeClaro,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },

  bannerTitle: {
    color: C.blanco,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
    marginTop: 12,
  },

  bannerSubtitle: {
    color: C.blanco,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    flexShrink: 1,
  },

  navContainer: {
    backgroundColor: C.fondo,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.verdeClaro,
    borderRadius: 40,
    padding: 6,
    minHeight: 65,
    elevation: 5,
    shadowColor: C.texto,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  navItem: {
    flex: 1,
    height: 53,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  navItemActive: {
    flex: 2,
    backgroundColor: C.principal,
  },

  navActiveText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.blanco,
  },

  tutorialOverlay: {
    flex: 1,
    backgroundColor: 'rgba(36,55,70,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  tutorialCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: C.fondo,
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 25,
    borderWidth: 1,
    borderColor: C.borde,
  },

  tutorialClose: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  tutorialTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: C.texto,
    textAlign: 'center',
    marginBottom: 18,
  },

  tutorialIllustration: {
    height: 145,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  tutorialCircle: {
    width: 135,
    height: 135,
    borderRadius: 68,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tutorialCheck: {
    position: 'absolute',
    right: '25%',
    bottom: 13,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.principal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: C.blanco,
  },

  tutorialStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 17,
  },

  tutorialNumber: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: C.principal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tutorialNumberText: {
    fontSize: 14,
    fontWeight: '900',
    color: C.blanco,
  },

  tutorialStepText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: C.texto,
    lineHeight: 20,
  },

  tutorialButton: {
    height: 49,
    borderRadius: 14,
    backgroundColor: C.principal,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  tutorialButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: C.blanco,
  },
});
