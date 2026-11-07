
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F3',
  },

  contenido: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 35,
  },

  volver: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
  },

  volverTexto: {
    color: '#146C67',
    fontSize: 15,
    fontWeight: '600',
  },

  encabezado: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 35,
  },

  nombre: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#146C67',
    marginBottom: 30,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#243746',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 15,
    color: '#526A67',
    textAlign: 'center',
    lineHeight: 23,
  },

  formulario: {
    width: '100%',
    gap: 18,
  },

  campo: {
    gap: 8,
  },

  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#243746',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE7E2',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 54,
    fontSize: 15,
    color: '#243746',
  },

  passwordContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE7E2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 54,
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#243746',
  },

  mostrar: {
    color: '#146C67',
    fontSize: 13,
    fontWeight: '600',
    paddingLeft: 10,
  },

  recuperar: {
    alignSelf: 'flex-end',
    marginTop: -5,
  },

  recuperarTexto: {
    color: '#146C67',
    fontSize: 13,
    fontWeight: '600',
  },

  boton: {
    backgroundColor: '#146C67',
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  registro: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 30,
  },

  textoNormal: {
    fontSize: 14,
    color: '#526A67',
  },

  textoEnlace: {
    fontSize: 14,
    color: '#146C67',
    fontWeight: 'bold',
  },

  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#526A67',
    marginTop: 45,
  },
});
