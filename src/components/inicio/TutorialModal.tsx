
import { Ionicons } from '@expo/vector-icons';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

const C = {
  principal: '#146C67',
  fondo: '#F6F7F3',
  verdeClaro: '#E8F2ED',
  texto: '#243746',
  secundario: '#526A67',
  blanco: '#FFFFFF',
  borde: '#DFE7E2',
};

const pasos = [
  'Busca servicios de tu barrio',
  'Publica o responde favores',
  'Activa el modo emergencia cuando lo necesites',
];

export default function TutorialModal({
  visible,
  onClose,
}: TutorialModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.tutorialOverlay}>
        <View style={styles.tutorialCard}>
          <Pressable
            style={styles.tutorialClose}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cerrar tutorial"
          >
            <Ionicons
              name="close"
              size={22}
              color={C.secundario}
            />
          </Pressable>

          <Text style={styles.tutorialTitle}>
            Tu comunidad, tu apoyo
          </Text>

          <View style={styles.tutorialIllustration}>
            <View style={styles.tutorialCircle}>
              <Ionicons
                name="people-outline"
                size={68}
                color={C.principal}
              />
            </View>

            <View style={styles.tutorialCheck}>
              <Ionicons
                name="checkmark"
                size={22}
                color={C.blanco}
              />
            </View>
          </View>

          {pasos.map((paso, indice) => (
            <View
              key={indice}
              style={styles.tutorialStep}
            >
              <View style={styles.tutorialNumber}>
                <Text style={styles.tutorialNumberText}>
                  {indice + 1}
                </Text>
              </View>

              <Text style={styles.tutorialStepText}>
                {paso}
              </Text>
            </View>
          ))}

          <Pressable
            style={styles.tutorialButton}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.tutorialButtonText}>
              Entendido
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
