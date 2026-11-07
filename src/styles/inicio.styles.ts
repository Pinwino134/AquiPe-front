
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F3',
  },

  contenido: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 35,
  },

  encabezado: {
    marginBottom: 25,
  },

  saludo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#243746',
    marginBottom: 6,
  },

  barrio: {
    fontSize: 15,
    color: '#526A67',
  },

  cuadricula: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 20,
  },

  tarjeta: {
    width: '48%',
    height: 135,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 2,
  },

  servicios: {
    backgroundColor: '#146C67',
  },

  favores: {
    backgroundColor: '#F2A65A',
  },

  mapa: {
    backgroundColor: '#3A9A88',
  },

  emergencia: {
    backgroundColor: '#C43D45',
  },

  tarjetaTexto: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  tarjetaTextoOscuro: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#243746',
  },

  coincidencias: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F2ED',
    borderRadius: 15,
    padding: 15,
    gap: 12,
    borderWidth: 1,
    borderColor: '#DFE7E2',
  },

  coincidenciaIcono: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  coincidenciaContenido: {
    flex: 1,
    gap: 4,
  },

  coincidenciaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#243746',
  },

  coincidenciaDescripcion: {
    fontSize: 12,
    color: '#526A67',
  },
});
