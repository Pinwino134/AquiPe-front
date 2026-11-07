
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F3',
  },

  contenido: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 35,
  },

  volver: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginBottom: 15,
  },

  volverTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#146C67',
  },

  encabezado: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logoCirculo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F2ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  logo: {
    fontSize: 42,
  },

  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#146C67',
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 15,
    color: '#526A67',
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 8,
  },

  formulario: {
    gap: 17,
  },

  campo: {
    gap: 7,
  },

  etiqueta: {
    fontSize: 15,
    fontWeight: '600',
    color: '#243746',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE7E2',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#243746',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE7E2',
    borderRadius: 12,
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#243746',
  },

  mostrar: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    color: '#146C67',
    fontWeight: '600',
  },

  terminos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#146C67',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxActivo: {
    backgroundColor: '#146C67',
  },

  checkTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  terminosTexto: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#526A67',
  },

  boton: {
    backgroundColor: '#146C67',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  botonTexto: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  iniciarSesion: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 25,
  },

  textoNormal: {
    color: '#526A67',
    fontSize: 15,
  },

  textoEnlace: {
    color: '#146C67',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
