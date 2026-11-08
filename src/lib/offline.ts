import AsyncStorage from '@react-native-async-storage/async-storage';

/** Almacenamiento local (no requiere sesión ni red) para el modo emergencia. */
export type Contacto = { id: string; nombre: string; telefono: string };
export type PuestoGuardado = {
  id: string;
  titulo: string;
  detalle: string;
  zona: string;
  tipo: 'ofrecer' | 'solicitar';
  latitude: number;
  longitude: number;
};

const K = {
  contactos: 'aquipe.offline.contactos',
  medicos: 'aquipe.offline.medicos',
  puestos: 'aquipe.offline.puestos',
};

async function leer<T>(clave: string, defecto: T): Promise<T> {
  try {
    const crudo = await AsyncStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : defecto;
  } catch {
    return defecto;
  }
}

const escribir = (clave: string, valor: unknown) =>
  AsyncStorage.setItem(clave, JSON.stringify(valor)).catch(() => {});

export const leerContactos = () => leer<Contacto[]>(K.contactos, []);
export const guardarContactos = (c: Contacto[]) => escribir(K.contactos, c);
export const leerMedicos = () => leer<string>(K.medicos, '');
export const guardarMedicos = (t: string) => escribir(K.medicos, t);
export const leerPuestos = () => leer<PuestoGuardado[]>(K.puestos, []);
export const guardarPuestos = (p: PuestoGuardado[]) => escribir(K.puestos, p);
