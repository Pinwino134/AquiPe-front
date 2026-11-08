import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { getUsuario, getAccessToken } from './session';

/* ------------------------------------------------------------------ */
/* URL del backend                                                     */
/* ------------------------------------------------------------------ */
/**
 * Orden de prioridad:
 * 1. EXPO_PUBLIC_API_URL (archivo .env del frontend)  -> recomendado para despliegue
 * 2. La IP de tu PC, que Expo ya conoce (hostUri)       -> funciona solo en desarrollo
 * 3. Android emulador: 10.0.2.2 · resto: localhost
 */
function resolverBaseUrl(): string {
  const env = process.env.EXPO_PUBLIC_API_URL;
  if (env) return env.replace(/\/$/, '');

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:8000`;

  if (Platform.OS === 'android') return 'http://10.0.2.2:8000';
  return 'http://localhost:8000';
}

export const API_URL = resolverBaseUrl();

/* ------------------------------------------------------------------ */
/* Tipos (espejo de app/schemas.py del backend)                        */
/* ------------------------------------------------------------------ */
export type TipoPublicacion = 'SERVICIO' | 'FAVOR' | 'RECURSO' | 'EMERGENCIA';
export type Direccion = 'SOLICITA' | 'OFRECE';
export type EstadoPublicacion =
  | 'ABIERTA'
  | 'PAUSADA'
  | 'ASIGNADA'
  | 'EN_CURSO'
  | 'COMPLETADA'
  | 'CANCELADA'
  | 'EXPIRADA';
export type TipoPrecio = 'FIJO' | 'POR_HORA' | 'A_CONVENIR';
export type Urgencia = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type Zona = {
  id: number;
  nombre: string;
  distrito: string;
  ciudad: string;
  latitud: number;
  longitud: number;
};

export type Categoria = {
  id: number;
  nombre: string;
  icono: string | null;
  padre_id: number | null;
  aplica_a: TipoPublicacion[];
};

export type UsuarioResumen = {
  id: string;
  nombre_completo: string;
  foto_url: string | null;
  calificacion_promedio: number;
  total_resenas: number;
};

export type Usuario = UsuarioResumen & {
    access_token?: string;
  correo: string;
  telefono: string;
  zona: Zona | null;
  latitud: number | null;
  longitud: number | null;
  perfil_publico: boolean;
  notificaciones_activas: boolean;
  perfil_proveedor: {
    biografia: string | null;
    anios_experiencia: number | null;
    disponibilidad: string | null;
    verificado: boolean;
  } | null;
  created_at: string;
};

export type UsuarioPublico = UsuarioResumen & {
  zona: Zona | null;
  perfil_proveedor: Usuario['perfil_proveedor'];
  telefono: string | null;
};

export type Publicacion = {
  id: string;
  tipo: TipoPublicacion;
  direccion: Direccion;
  titulo: string;
  descripcion: string;
  estado: EstadoPublicacion;
  latitud: number | null;
  longitud: number | null;
  created_at: string;
  autor: UsuarioResumen;
  categoria: { id: number; nombre: string; icono: string | null } | null;
  zona: Zona | null;
  servicio: {
    tipo_precio: TipoPrecio;
    monto: number | null;
    moneda: string;
    modalidad: Modalidad;
    radio_km: number | null;
    disponibilidad: string | null;
    presupuesto_min: number | null;
    presupuesto_max: number | null;
    fecha_requerida?: string | null;
    urgencia: Urgencia;
  } | null;
  emergencia: {
    cantidad: number | null;
    unidad: string | null;
    detalle_cantidad: string | null;
    nivel_urgencia: Urgencia;
  } | null;
  distancia_km: number | null;
};

export type NuevaPublicacion = {
  tipo: TipoPublicacion;
  direccion: Direccion;
  categoria_id?: number | null;
  titulo: string;
  descripcion: string;
  zona_id?: number | null;
  latitud?: number | null;
  longitud?: number | null;
  servicio?: Record<string, unknown>;
  emergencia?: Record<string, unknown>;
};

export type Respuesta = {
  id: string;
  publicacion_id: string;
  mensaje: string;
  precio_propuesto: number | null;
  estado: EstadoRespuesta;
  created_at: string;
  usuario: UsuarioResumen;
};
export type EstadoRespuesta = 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA' | 'RETIRADA';
export type EstadoAcuerdo = 'PROGRAMADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
export type Modalidad = 'DOMICILIO' | 'VIRTUAL' | 'EN_LOCAL';

export type RespuestaMia = Respuesta & {
  publicacion: { id: string; tipo: TipoPublicacion; direccion: Direccion; titulo: string; estado: EstadoPublicacion };
};

export type Acuerdo = {
  id: string;
  estado: EstadoAcuerdo;
  precio_acordado: number | null;
  fecha_programada: string | null;
  completado_at: string | null;
  cancelado_at: string | null;
  motivo_cancelacion: string | null;
  created_at: string;
  publicacion: { id: string; tipo: TipoPublicacion; direccion: Direccion; titulo: string; estado: EstadoPublicacion };
  solicitante: UsuarioResumen;
  proveedor: UsuarioResumen;
};

export type Resena = {
  id: string;
  acuerdo_id: string;
  calificacion: number;
  comentario: string | null;
  created_at: string;
  autor: UsuarioResumen;
};

export type Recurso = {
  id: string;
  usuario_id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  disponible: boolean;
  created_at: string;
};

export type NuevoRecurso = {
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  disponible: boolean;

};

/* ------------------------------------------------------------------ */
/* Cliente HTTP                                                        */
/* ------------------------------------------------------------------ */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** FastAPI devuelve `detail` como texto (reglas de negocio) o como lista (validación). */
function mensajeDeError(detail: unknown): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: { loc?: unknown[]; msg?: string }) => {
        const campo = d.loc?.[d.loc.length - 1];
        const msg = (d.msg ?? '').replace(/^Value error, /, '');
        return campo && campo !== 'body' ? `${String(campo)}: ${msg}` : msg;
      })
      .join('\n');
  }
  return 'Ocurrió un error inesperado';
}

export async function api<T = unknown>(
  ruta: string,
  init: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const { json, headers, ...resto } = init;
  const usuario = getUsuario();
  const token = getAccessToken();

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...resto,
      headers: {
        'Content-Type': 'application/json',
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : usuario
            ? { 'X-User-Id': usuario.id }
            : {}),
        ...(headers as Record<string, string> | undefined),
      },
      body: json !== undefined ? JSON.stringify(json) : resto.body,
    });
  } catch {
    throw new ApiError(
      0,
      `No se pudo conectar con el servidor (${API_URL}). Revisa que el backend esté encendido y que tu celular esté en la misma red Wi-Fi.`
    );
  }

  if (respuesta.status === 204) return null as T;

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, mensajeDeError(datos?.detail));
  }
  return datos as T;
}

const query = (params: Record<string, unknown>) => {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return q ? `?${q}` : '';
};

/* ------------------------------------------------------------------ */
/* Endpoints                                                           */
/* ------------------------------------------------------------------ */
export const Api = {
  // Auth
  login: (correo: string, password: string) =>
    api<Usuario>('/auth/login', { method: 'POST', json: { correo, password } }),
  registro: (datos: {
    nombre_completo: string;
    correo: string;
    telefono: string;
    password: string;
    zona_id?: number | null;
  }) => api<Usuario>('/auth/registro', { method: 'POST', json: datos }),

  // Catálogos
  zonas: () => api<Zona[]>('/zonas'),
  categorias: (tipo?: TipoPublicacion) =>
    api<Categoria[]>(`/categorias${query({ tipo })}`),

  // Usuarios
  miPerfil: () => api<Usuario>('/usuarios/me'),
  actualizarPerfil: (cambios: Partial<{
    nombre_completo: string;
    telefono: string;
    zona_id: number | null;
    latitud: number;
    longitud: number;
    perfil_publico: boolean;
    notificaciones_activas: boolean;
  }>) => api<Usuario>('/usuarios/me', { method: 'PATCH', json: cambios }),
  usuario: (id: string) => api<UsuarioPublico>(`/usuarios/${id}`),

  // Publicaciones
  publicaciones: (filtros: {
    tipo?: TipoPublicacion;
    direccion?: Direccion;
    categoria_id?: number;
    q?: string;
    lat?: number;
    lng?: number;
    radio_km?: number;
    zona_id?: number;
    estado?: EstadoPublicacion;
    autor_id?: string;
    limit?: number;
  } = {}) =>
    api<Publicacion[]>(`/publicaciones${query({ limit: 100, ...filtros })}`),
  publicacion: (id: string) => api<Publicacion>(`/publicaciones/${id}`),
  misPublicaciones: () => api<Publicacion[]>('/publicaciones/mias'),
  crearPublicacion: (datos: NuevaPublicacion) =>
    api<Publicacion>('/publicaciones', { method: 'POST', json: datos }),
  eliminarPublicacion: (id: string) =>
    api<null>(`/publicaciones/${id}`, { method: 'DELETE' }),

  // Respuestas (postularse / contratar / ofrecer ayuda)
  responder: (publicacionId: string, mensaje: string, precio_propuesto?: number) =>
    api<Respuesta>(`/publicaciones/${publicacionId}/respuestas`, {
      method: 'POST',
      json: { mensaje, precio_propuesto },
    }),
  editarPublicacion: (
    id: string,
    cambios: Partial<{ titulo: string; descripcion: string; estado: 'ABIERTA' | 'PAUSADA' | 'CANCELADA' }>
  ) => api<Publicacion>(`/publicaciones/${id}`, { method: 'PATCH', json: cambios }),

  // Proveedor y reseñas de usuarios
  guardarProveedor: (d: { biografia?: string; anios_experiencia?: number; disponibilidad?: string }) =>
    api<NonNullable<Usuario['perfil_proveedor']>>('/usuarios/me/proveedor', { method: 'PUT', json: d }),
  resenasDeUsuario: (id: string, limit = 20, offset = 0) =>
    api<Resena[]>(`/usuarios/${id}/resenas${query({ limit, offset })}`),

  // Respuestas: gestión
  respuestasDePublicacion: (id: string) => api<Respuesta[]>(`/publicaciones/${id}/respuestas`),
  misRespuestas: (estado?: EstadoRespuesta) =>
    api<RespuestaMia[]>(`/respuestas/mias${query({ estado })}`),
  retirarRespuesta: (rid: string) => api<Respuesta>(`/respuestas/${rid}/retirar`, { method: 'POST' }),
  rechazarRespuesta: (rid: string) => api<Respuesta>(`/respuestas/${rid}/rechazar`, { method: 'POST' }),
  aceptarRespuesta: (rid: string, fecha_programada?: string) =>
    api<Acuerdo>(`/respuestas/${rid}/aceptar`, { method: 'POST', json: { fecha_programada } }),

  // Acuerdos y reseñas
  misAcuerdos: (estado?: EstadoAcuerdo) => api<Acuerdo[]>(`/acuerdos/mios${query({ estado })}`),
  acuerdo: (id: string) => api<Acuerdo>(`/acuerdos/${id}`),
  cambiarEstadoAcuerdo: (id: string, estado: EstadoAcuerdo, motivo?: string) =>
    api<Acuerdo>(`/acuerdos/${id}/estado`, { method: 'PATCH', json: { estado, motivo } }),
  resenar: (acuerdoId: string, calificacion: number, comentario?: string) =>
    api<Resena>(`/acuerdos/${acuerdoId}/resenas`, { method: 'POST', json: { calificacion, comentario } }),

// Recursos personales (aún sin endpoint en el backend)
misRecursos: () =>
  api<Recurso[]>('/recursos/mios'),

crearRecurso: (datos: NuevoRecurso) =>
  api<Recurso>('/recursos', {
    method: 'POST',
    json: datos,
  }),

actualizarRecurso: (
  id: string,
  cambios: Partial<NuevoRecurso>
) =>
  api<Recurso>(`/recursos/${id}`, {
    method: 'PATCH',
    json: cambios,
  }),

eliminarRecurso: (id: string) =>
  api<null>(`/recursos/${id}`, {
    method: 'DELETE',
  }),
};
