// Validación de respuestas y actividades pedagógicas

/**
 * Cuenta palabras válidas ignorando espacios repetidos y signos aislados.
 * No revela requisitos cuantitativos al usuario.
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  // Divide por espacios y filtra tokens que contengan al menos una letra o número
  const tokens = text.trim().split(/\\s+/);
  const validTokens = tokens.filter(t => /[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]/.test(t));
  return validTokens.length;
}

/**
 * Valida los datos del alumno en la pantalla inicial.
 */
export function validateStudentInfo(firstName, lastName) {
  const errors = {};
  if (!firstName || !firstName.trim()) {
    errors.firstName = 'Por favor, introduce tu nombre.';
  }
  if (!lastName || !lastName.trim()) {
    errors.lastName = 'Por favor, introduce tus apellidos.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida las tres actividades pedagógicas previas a la generación del PDF.
 * Cumple estrictamente con la confidencialidad del criterio de 10 palabras.
 */
export function validateActivities(activities) {
  const errors = {};

  // Actividad 1: Mínimo 10 palabras
  const q1Words = countWords(activities.q1Text);
  if (!activities.q1Text || !activities.q1Text.trim()) {
    errors.q1Text = 'Completa esta respuesta para continuar.';
  } else if (q1Words < 10) {
    errors.q1Text = 'Desarrolla un poco más tu respuesta antes de continuar.';
  }

  // Actividad 2: Gran rasgo obligatorio
  if (!activities.q2Domain || activities.q2Domain === '') {
    errors.q2Domain = 'Selecciona un gran rasgo.';
  }
  // Actividad 2: Texto mínimo 10 palabras
  const q2Words = countWords(activities.q2Text);
  if (!activities.q2Text || !activities.q2Text.trim()) {
    errors.q2Text = 'Completa esta respuesta para continuar.';
  } else if (q2Words < 10) {
    errors.q2Text = 'Desarrolla un poco más tu respuesta antes de continuar.';
  }

  // Actividad 3: Ámbito obligatorio
  if (!activities.q3Ambit || activities.q3Ambit === '') {
    errors.q3Ambit = 'Selecciona un ámbito.';
  }
  // Actividad 3: Pregunta de investigación (escrita y no vacía, sin mínimo de 10 palabras)
  if (!activities.q3Question || !activities.q3Question.trim()) {
    errors.q3Question = 'Formula tu pregunta de investigación antes de continuar.';
  }
  // Actividad 3: Rasgos y utilidad (mínimo 10 palabras)
  const q3TraitsWords = countWords(activities.q3Traits);
  if (!activities.q3Traits || !activities.q3Traits.trim()) {
    errors.q3Traits = 'Completa esta respuesta para continuar.';
  } else if (q3TraitsWords < 10) {
    errors.q3Traits = 'Desarrolla un poco más tu respuesta antes de continuar.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
