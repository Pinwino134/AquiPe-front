
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { Api, type Publicacion } from '@/lib/api';
import {
  emojiCategoria,
  mostrarError,
  tiempoRelativo,
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

type TipoFavor = 'necesito' | 'ofrezco';

type Favor = {
  id: string;
  titulo: string;
  persona: string;
  tiempo: string;
  icono: string;
  tipo: TipoFavor;
};

const aFavor = (p: Publicacion): Favor => ({
  id: p.id,
  titulo: p.titulo,
  persona: p.autor.nombre_completo,
  tiempo: tiempoRelativo(p.created_at),
  icono: emojiCategoria(p.categoria?.nombre ?? 'Apoyo'),
  tipo: p.direccion === 'SOLICITA' ? 'necesito' : 'ofrezco',
});

export default function Favores() {
  const [pestana, setPestana] =
    useState<TipoFavor>('necesito');

  const [favores, setFavores] = useState<Favor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const lista = await Api.publicaciones({ tipo: 'FAVOR' });
      setFavores(lista.map(aFavor));
    } catch (e) {
      mostrarError(e, 'No se pudieron cargar los favores');
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const [modalVisible, setModalVisible] =
    useState(false);

  const [titulo, setTitulo] = useState('');
  const [nombre, setNombre] = useState('');

  const filtrados = favores.filter(
    (favor) => favor.tipo === pestana
  );

  // El campo "nombre" del formulario original ahora guarda los detalles del favor:
  // el autor ya se conoce por la sesión.
  const publicar = async () => {
    if (!titulo.trim()) {
      Alert.alert(
        'Campos incompletos',
        'Escribe el título del favor.'
      );
      return;
    }

    setEnviando(true);

    try {
      await Api.crearPublicacion({
        tipo: 'FAVOR',
        direccion:
          pestana === 'necesito' ? 'SOLICITA' : 'OFRECE',
        titulo: titulo.trim().slice(0, 80),
        descripcion: (nombre.trim() || titulo.trim()).slice(0, 1000),
      });

      setTitulo('');
      setNombre('');
      setModalVisible(false);
      await cargar();
    } catch (e) {
      mostrarError(e, 'No se pudo publicar el favor');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Decoraciones superiores */}
      <View
        style={styles.decoracionSuperior}
        pointerEvents="none"
      >
        <View style={styles.burbujaGrande} />
        <View style={styles.burbujaPequena} />
      </View>

      {/* Encabezado */}
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
          Cadena de favores
        </Text>
      </View>

      {/* Pestañas */}
      <View style={styles.pestanas}>
        <Pressable
          style={[
            styles.pestana,
            pestana === 'necesito' &&
              styles.pestanaActiva,
          ]}
          onPress={() => setPestana('necesito')}
          accessibilityRole="button"
          accessibilityState={{
            selected: pestana === 'necesito',
          }}
        >
          <Text
            style={[
              styles.textoPestana,
              pestana === 'necesito' &&
                styles.textoActivo,
            ]}
          >
            Necesito ayuda
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.pestana,
            pestana === 'ofrezco' &&
              styles.pestanaActiva,
          ]}
          onPress={() => setPestana('ofrezco')}
          accessibilityRole="button"
          accessibilityState={{
            selected: pestana === 'ofrezco',
          }}
        >
          <Text
            style={[
              styles.textoPestana,
              pestana === 'ofrezco' &&
                styles.textoActivo,
            ]}
          >
            Puedo ayudar
          </Text>
        </Pressable>
      </View>

      {/* Lista de favores */}
      <ScrollView
        style={styles.scrollLista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
      >
        <View style={styles.encabezadoLista}>
          <View style={styles.titulosLista}>
            <Text style={styles.subtitulo}>
              {pestana === 'necesito'
                ? 'Vecinos que necesitan ayuda'
                : 'Vecinos que ofrecen ayuda'}
            </Text>

            <Text style={styles.descripcionLista}>
              Conectando personas de tu comunidad
            </Text>
          </View>

          <View style={styles.contador}>
            <Text style={styles.contadorTexto}>
              {filtrados.length}
            </Text>
          </View>
        </View>

        {cargando ? (
          <ActivityIndicator
            color={C.principal}
            style={{ marginTop: 30 }}
          />
        ) : filtrados.length === 0 ? (
          <View style={styles.vacio}>
            <View style={styles.vacioIconoContenedor}>
              <Ionicons
                name="people-outline"
                size={34}
                color={C.principal}
              />
            </View>

            <Text style={styles.vacioTitulo}>
              Todavía no hay publicaciones
            </Text>

            <Text style={styles.vacioTexto}>
              Sé el primero en publicar un favor
              para tu comunidad.
            </Text>
          </View>
        ) : (
          filtrados.map((favor) => (
            <View
              key={favor.id}
              style={styles.tarjeta}
            >
              <View style={styles.iconoContenedor}>
                <Text style={styles.iconoFavor}>
                  {favor.icono}
                </Text>
              </View>

              <View style={styles.informacion}>
                <Text
                  style={styles.nombreFavor}
                  numberOfLines={2}
                >
                  {favor.titulo}
                </Text>

                <Text style={styles.persona}>
                  {favor.persona}
                </Text>

                <View style={styles.tiempoContenedor}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={C.secundario}
                  />

                  <Text style={styles.tiempo}>
                    {favor.tiempo}
                  </Text>
                </View>
              </View>

              <View style={styles.iconoDerecha}>
                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={C.principal}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Botón para publicar */}
      <Pressable
        style={styles.botonAgregar}
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Publicar un favor"
      >
        <Ionicons
          name="add"
          size={29}
          color={C.blanco}
        />
      </Pressable>

      {/* Modal de publicación */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <KeyboardAvoidingView
          style={styles.modalFondo}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <View style={styles.modalContenido}>
            <View style={styles.modalEncabezado}>
              <View style={styles.modalTitulos}>
                <Text style={styles.modalTitulo}>
                  {pestana === 'necesito'
                    ? 'Solicitar ayuda'
                    : 'Ofrecer ayuda'}
                </Text>

                <Text style={styles.modalDescripcion}>
                  Comparte tu favor con el barrio
                </Text>
              </View>

              <Pressable
                style={styles.botonCerrar}
                onPress={() =>
                  setModalVisible(false)
                }
                accessibilityRole="button"
                accessibilityLabel="Cerrar formulario"
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={C.secundario}
                />
              </Pressable>
            </View>

            <Text style={styles.label}>
              Detalles (opcional)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Cuándo, dónde, qué necesitas exactamente…"
              placeholderTextColor={C.secundario}
              value={nombre}
              onChangeText={setNombre}
              maxLength={500}
            />

            <Text style={styles.label}>
              {pestana === 'necesito'
                ? '¿Qué ayuda necesitas?'
                : '¿En qué puedes ayudar?'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Describe el favor"
              placeholderTextColor={C.secundario}
              value={titulo}
              onChangeText={setTitulo}
            />

            <Pressable
              style={styles.botonPublicar}
              onPress={publicar}
              disabled={enviando}
              accessibilityRole="button"
            >
              {enviando ? (
                <ActivityIndicator color={C.blanco} />
              ) : (
                <Text style={styles.textoPublicar}>
                  Publicar favor
                </Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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

  pestanas: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: C.verdeClaro,
    padding: 5,
    borderRadius: 16,
    gap: 6,
    marginBottom: 18,
  },

  pestana: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.blanco,
  },

  pestanaActiva: {
    backgroundColor: C.principal,
  },

  textoPestana: {
    fontSize: 13,
    fontWeight: '800',
    color: C.texto,
  },

  textoActivo: {
    color: C.blanco,
  },

  scrollLista: {
    flex: 1,
  },

  lista: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  encabezadoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 10,
  },

  titulosLista: {
    flex: 1,
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

  iconoContenedor: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: C.verdeClaro,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  iconoFavor: {
    fontSize: 23,
  },

  informacion: {
    flex: 1,
  },

  nombreFavor: {
    fontSize: 14,
    fontWeight: '800',
    color: C.texto,
  },

  persona: {
    fontSize: 12,
    color: C.secundario,
    marginTop: 2,
  },

  tiempoContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },

  tiempo: {
    fontSize: 11,
    color: C.secundario,
  },

  iconoDerecha: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  botonAgregar: {
    position: 'absolute',
    bottom: 25,
    right: 22,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.principal,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: C.principal,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
    fontSize: 16,
    fontWeight: '800',
    color: C.texto,
    marginTop: 10,
    textAlign: 'center',
  },

  vacioTexto: {
    fontSize: 13,
    color: C.secundario,
    marginTop: 7,
    textAlign: 'center',
  },

  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(36,55,70,0.45)',
    justifyContent: 'flex-end',
  },

  modalContenido: {
    backgroundColor: C.blanco,
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 40,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  modalEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  modalTitulos: {
    flex: 1,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: '800',
    color: C.principal,
  },

  modalDescripcion: {
    fontSize: 13,
    color: C.secundario,
    marginTop: 5,
  },

  botonCerrar: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: C.texto,
    marginBottom: 9,
  },

  input: {
    height: 54,
    borderRadius: 14,
    backgroundColor: C.blanco,
    borderWidth: 1,
    borderColor: C.borde,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 15,
    color: C.texto,
  },

  botonPublicar: {
    backgroundColor: C.principal,
    height: 55,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  textoPublicar: {
    fontSize: 16,
    fontWeight: '800',
    color: C.blanco,
  },
});
