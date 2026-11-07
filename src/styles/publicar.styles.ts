
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F3',
  },

  contenido: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 35,
  },

  encabezado: {
    marginBottom: 30,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#243746',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 15,
    color: '#526A67',
    lineHeight: 22,
  },

  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 17,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DFE7E2',
    elevation: 2,
  },

  iconoServicio: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: '#E8F2ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  iconoFavor: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: '#FFF0DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  textos: {
    flex: 1,
    paddingRight: 8,
  },

  tarjetaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#243746',
    marginBottom: 5,
  },

  tarjetaDescripcion: {
    fontSize: 13,
    color: '#526A67',
    lineHeight: 19,
  },

  informacion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F2ED',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    gap: 10,
  },

  informacionTexto: {
    flex: 1,
    fontSize: 13,
    color: '#526A67',
    lineHeight: 20,
  },
});
