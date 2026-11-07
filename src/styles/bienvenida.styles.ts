
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F3',
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 35,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 45,
  },

  logoCircle: {
    width: 135,
    height: 135,
    borderRadius: 70,
    backgroundColor: '#E8F2ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  logo: {
    fontSize: 72,
  },

  nombre: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#146C67',
  },

  eslogan: {
    fontSize: 15,
    color: '#526A67',
    textAlign: 'center',
    marginTop: 8,
  },

  descripcion: {
    alignItems: 'center',
    marginBottom: 45,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#243746',
    textAlign: 'center',
    marginBottom: 15,
  },

  subtitulo: {
    fontSize: 16,
    color: '#526A67',
    textAlign: 'center',
    lineHeight: 25,
  },

  botones: {
    gap: 15,
  },

  botonPrincipal: {
    backgroundColor: '#146C67',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
  },

  textoPrincipal: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  botonSecundario: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#146C67',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  textoSecundario: {
    color: '#146C67',
    fontSize: 17,
    fontWeight: 'bold',
  },

  footer: {
    textAlign: 'center',
    color: '#526A67',
    fontSize: 13,
    marginTop: 45,
  },
});
