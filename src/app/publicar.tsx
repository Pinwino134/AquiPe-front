
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
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

type Categoria =
  | 'Herramienta'
  | 'Apoyo'
  | 'Donación'
  | 'Otro';

const categorias = [
  {
    nombre: 'Herramienta' as Categoria,
    icono: 'build' as const,
  },
  {
    nombre: 'Apoyo' as Categoria,
    icono: 'people' as const,
  },
  {
    nombre: 'Donación' as Categoria,
    icono: 'cube' as const,
  },
  {
    nombre: 'Otro' as Categoria,
    icono: 'grid' as const,
  },
];

export default function Publicar() {
  const [paso, setPaso] = useState(1);
  const [categoria, setCategoria] =
    useState<Categoria | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [zona, setZona] = useState('');

  const siguiente = () => {
    if (paso === 1) {
      if (!categoria) {
        Alert.alert(
          'Selecciona una opción',
          'Indica qué tipo de ayuda necesitas.'
        );
        return;
      }
      setPaso(2);
      return;
    }

    if (paso === 2) {
      if (!titulo.trim() || !descripcion.trim()) {
        Alert.alert(
          'Campos incompletos',
          'Escribe un título y una descripción.'
        );
        return;
      }

      if (!zona.trim()) {
        Alert.alert(
          'Falta la zona',
          'Indica el barrio o zona de tu solicitud.'
        );
        return;
      }

      setPaso(3);
    }
  };

  const regresar = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    } else {
      router.back();
    }
  };

  const publicar = () => {
    Alert.alert(
      '¡Solicitud publicada!',
      'Tu solicitud se registró como demostración. Todavía no se envía a otros vecinos ni se guarda en una base de datos.',
      [
        {
          text: 'Entendido',
          onPress: () => router.replace('/inicio'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={s.page}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <View style={s.header}>
          <Pressable
            style={s.back}
            onPress={regresar}
            accessibilityLabel="Regresar"
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color={C.texto}
            />
          </Pressable>

          <Text style={s.headerTitle}>
            Publicar solicitud
          </Text>
        </View>

        <View style={s.progress}>
          {[1, 2, 3].map((numero, indice) => (
            <View
              key={numero}
              style={s.progressGroup}
            >
              <View
                style={[
                  s.progressCircle,
                  numero <= paso &&
                    s.progressCircleActive,
                ]}
              >
                <Text
                  style={[
                    s.progressNumber,
                    numero <= paso &&
                      s.progressNumberActive,
                  ]}
                >
                  {numero}
                </Text>
              </View>

              {indice < 2 && (
                <View
                  style={[
                    s.progressLine,
                    numero < paso &&
                      s.progressLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <ScrollView
          style={s.flex}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {paso === 1 && (
            <>
              <Text style={s.title}>
                1. ¿Qué necesitas?
              </Text>

              <Text style={s.subtitle}>
                Selecciona el tipo de ayuda que buscas
                en tu comunidad.
              </Text>

              <View style={s.categoryGrid}>
                {categorias.map((item) => {
                  const activo =
                    categoria === item.nombre;

                  return (
                    <Pressable
                      key={item.nombre}
                      style={[
                        s.categoryCard,
                        activo && s.categoryActive,
                      ]}
                      onPress={() =>
                        setCategoria(item.nombre)
                      }
                      accessibilityRole="button"
                      accessibilityState={{
                        selected: activo,
                      }}
                    >
                      <Ionicons
                        name={item.icono}
                        size={40}
                        color={
                          activo
                            ? C.blanco
                            : C.principal
                        }
                      />

                      <Text
                        style={[
                          s.categoryText,
                          activo &&
                            s.categoryTextActive,
                        ]}
                      >
                        {item.nombre}
                      </Text>

                      {activo && (
                        <View style={s.selectedBadge}>
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color={C.principal}
                          />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {paso === 2 && (
            <>
              <Text style={s.title}>
                2. Cuéntanos más
              </Text>

              <Text style={s.subtitle}>
                Describe lo que necesitas para que
                otros vecinos puedan ayudarte.
              </Text>

              <View style={s.selectedCategory}>
                <Ionicons
                  name="checkmark-circle"
                  size={19}
                  color={C.principal}
                />
                <Text style={s.selectedCategoryText}>
                  {categoria}
                </Text>
              </View>

              <Text style={s.label}>
                Título de la solicitud
              </Text>

              <TextInput
                style={s.input}
                placeholder="Ej. Necesito una escalera"
                placeholderTextColor={C.secundario}
                value={titulo}
                onChangeText={setTitulo}
                maxLength={80}
              />

              <Text style={s.label}>
                Descripción
              </Text>

              <TextInput
                style={[s.input, s.textarea]}
                placeholder="Explica qué necesitas, para cuándo y cualquier detalle importante..."
                placeholderTextColor={C.secundario}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                textAlignVertical="top"
                maxLength={500}
              />

              <Text style={s.label}>
                Barrio o zona
              </Text>

              <View style={s.locationInput}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={C.principal}
                />

                <TextInput
                  style={s.locationText}
                  placeholder="Ej. Mi barrio"
                  placeholderTextColor={C.secundario}
                  value={zona}
                  onChangeText={setZona}
                  maxLength={100}
                />
              </View>

              <View style={s.infoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color={C.principal}
                />
                <Text style={s.infoText}>
                  Evita publicar direcciones exactas
                  o información personal sensible.
                </Text>
              </View>
            </>
          )}

          {paso === 3 && (
            <>
              <Text style={s.title}>
                3. Revisa tu solicitud
              </Text>

              <Text style={s.subtitle}>
                Comprueba la información antes de
                publicarla.
              </Text>

              <View style={s.summaryCard}>
                <View style={s.summaryHeader}>
                  <View style={s.summaryIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={25}
                      color={C.principal}
                    />
                  </View>

                  <View style={s.summaryHeaderText}>
                    <Text style={s.summaryTitle}>
                      {titulo}
                    </Text>
                    <Text style={s.summaryCategory}>
                      {categoria}
                    </Text>
                  </View>
                </View>

                <View style={s.separator} />

                <Text style={s.summaryLabel}>
                  Descripción
                </Text>
                <Text style={s.summaryValue}>
                  {descripcion}
                </Text>

                <Text style={s.summaryLabel}>
                  Ubicación
                </Text>

                <View style={s.summaryLocation}>
                  <Ionicons
                    name="location-outline"
                    size={17}
                    color={C.principal}
                  />
                  <Text style={s.summaryValue}>
                    {zona}
                  </Text>
                </View>

                <View style={s.statusBox}>
                  <Ionicons
                    name="time-outline"
                    size={17}
                    color={C.principal}
                  />
                  <Text style={s.statusText}>
                    Estado inicial: Pendiente
                  </Text>
                </View>
              </View>

              <View style={s.infoBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color={C.principal}
                />
                <Text style={s.infoText}>
                  Esta publicación es una
                  demostración. No será visible
                  para otros usuarios.
                </Text>
              </View>

              <Pressable
                style={s.editButton}
                onPress={() => setPaso(2)}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={C.principal}
                />
                <Text style={s.editText}>
                  Editar información
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>

        <View style={s.footer}>
          <Pressable
            style={s.nextButton}
            onPress={
              paso === 3 ? publicar : siguiente
            }
          >
            <Text style={s.nextText}>
              {paso === 3
                ? 'Publicar solicitud'
                : 'Siguiente'}
            </Text>

            <Ionicons
              name={
                paso === 3
                  ? 'checkmark-circle-outline'
                  : 'arrow-forward'
              }
              size={21}
              color={C.blanco}
            />
          </Pressable>

          <Text style={s.footerNote}>
            Paso {paso} de 3
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },

  page: {
    flex: 1,
    backgroundColor: C.fondo,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 14,
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

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.texto,
  },

  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 65,
    marginBottom: 27,
  },

  progressGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.borde,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressCircleActive: {
    backgroundColor: C.principal,
  },

  progressNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: C.secundario,
  },

  progressNumberActive: {
    color: C.blanco,
  },

  progressLine: {
    width: 55,
    height: 3,
    backgroundColor: C.borde,
  },

  progressLineActive: {
    backgroundColor: C.principal,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },

  title: {
    fontSize: 23,
    fontWeight: '900',
    color: C.texto,
    marginBottom: 9,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: C.secundario,
    marginBottom: 24,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },

  categoryCard: {
    width: '48%',
    height: 140,
    borderRadius: 18,
    backgroundColor: C.verdeClaro,
    borderWidth: 1,
    borderColor: C.borde,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 13,
  },

  categoryActive: {
    backgroundColor: C.principal,
    borderColor: C.principal,
  },

  categoryText: {
    fontSize: 15,
    fontWeight: '800',
    color: C.texto,
  },

  categoryTextActive: {
    color: C.blanco,
  },

  selectedBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedCategory: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: C.verdeClaro,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
    marginBottom: 23,
  },

  selectedCategoryText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.principal,
  },

  label: {
    fontSize: 14,
    fontWeight: '800',
    color: C.texto,
    marginBottom: 9,
  },

  input: {
    backgroundColor: C.blanco,
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    fontSize: 14,
    color: C.texto,
    marginBottom: 20,
  },

  textarea: {
    height: 125,
    paddingTop: 14,
  },

  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: C.blanco,
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 14,
    paddingHorizontal: 13,
    marginBottom: 20,
  },

  locationText: {
    flex: 1,
    height: 52,
    fontSize: 14,
    color: C.texto,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: C.verdeClaro,
    borderRadius: 14,
    padding: 14,
    marginTop: 5,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
    color: C.secundario,
  },

  summaryCard: {
    backgroundColor: C.blanco,
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: C.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryHeaderText: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.texto,
  },

  summaryCategory: {
    fontSize: 12,
    color: C.principal,
    marginTop: 5,
  },

  separator: {
    height: 1,
    backgroundColor: C.borde,
    marginVertical: 18,
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: C.texto,
    marginBottom: 7,
  },

  summaryValue: {
    fontSize: 13,
    color: C.secundario,
    lineHeight: 20,
    marginBottom: 18,
  },

  summaryLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },

  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.verdeClaro,
    borderRadius: 10,
    padding: 11,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: C.principal,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 15,
    marginTop: 14,
  },

  editText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.principal,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 13,
    paddingBottom: 15,
    backgroundColor: C.fondo,
    borderTopWidth: 1,
    borderTopColor: C.borde,
  },

  nextButton: {
    height: 53,
    borderRadius: 14,
    backgroundColor: C.principal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  nextText: {
    color: C.blanco,
    fontSize: 16,
    fontWeight: '800',
  },

  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: C.secundario,
    marginTop: 10,
  },
});
