// Gestión de estado en sessionStorage

const STORAGE_KEY = 'bfi2_personality_session_v1';

export function saveSessionState(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('No se pudo guardar la sesión en sessionStorage', e);
  }
}

export function loadSessionState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Error leyendo sessionStorage', e);
    return null;
  }
}

export function clearSessionState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Error limpiando sessionStorage', e);
  }
}
