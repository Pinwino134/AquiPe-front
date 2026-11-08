
import { useSyncExternalStore } from 'react';

import type { Usuario } from './api';

let usuario: Usuario | null = null;
let accessToken: string | null = null;

const oyentes = new Set<() => void>();

export const getUsuario = () => usuario;

export const getAccessToken = () => accessToken;

export function setUsuario(nuevo: Usuario | null) {
  usuario = nuevo;

  // El login devuelve el token junto con los datos del usuario.
  if (nuevo) {
    accessToken =
      (nuevo as Usuario & { access_token?: string }).access_token ??
      accessToken;
  } else {
    accessToken = null;
  }

  oyentes.forEach((fn) => fn());

}
const suscribir = (fn: () => void) => {
  oyentes.add(fn);

  return () => {
    oyentes.delete(fn);
  };
};

export function useUsuario() {
  return useSyncExternalStore(
    suscribir,
    getUsuario,
    getUsuario
  );
}
