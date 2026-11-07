import { useSyncExternalStore } from 'react';

import type { Usuario } from './api';

/**
 * Sesión en memoria. El backend (modo desarrollo) identifica al usuario con el
 * header X-User-Id, así que basta con guardar el usuario que devuelve /auth/login.
 * Al cerrar la app hay que volver a iniciar sesión.
 */
let usuario: Usuario | null = null;
const oyentes = new Set<() => void>();

export const getUsuario = () => usuario;

export function setUsuario(nuevo: Usuario | null) {
  usuario = nuevo;
  oyentes.forEach((fn) => fn());
}

const suscribir = (fn: () => void) => {
  oyentes.add(fn);
  return () => {
    oyentes.delete(fn);
  };
};

/** Devuelve el usuario con sesión iniciada (o null) y re-renderiza al cambiar. */
export function useUsuario() {
  return useSyncExternalStore(suscribir, getUsuario, getUsuario);
}
