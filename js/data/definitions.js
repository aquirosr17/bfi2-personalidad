// Definiciones didácticas oficiales del BFI-2 para 1.º de Bachillerato

export const DOMAINS = {
  extraversion: {
    id: 'extraversion',
    name: 'Extraversión',
    definition: 'Tendencia a buscar la compañía de otras personas, participar activamente en situaciones sociales, tomar la iniciativa y mostrarse enérgico y entusiasmado.',
    facets: ['sociabilidad', 'asertividad', 'energia']
  },
  agreeableness: {
    id: 'agreeableness',
    name: 'Cordialidad',
    definition: 'Tendencia a preocuparse por los demás, tener en cuenta sus sentimientos y necesidades, tratarlos con respeto y confiar en sus buenas intenciones.',
    facets: ['compasion', 'respeto', 'confianza']
  },
  conscientiousness: {
    id: 'conscientiousness',
    name: 'Responsabilidad',
    definition: 'Tendencia a mantener las cosas organizadas, esforzarse para conseguir lo que uno se propone y cumplir con las tareas y compromisos que asume.',
    facets: ['organizacion', 'productividad', 'cumplimiento_compromisos']
  },
  negative_emotionality: {
    id: 'negative_emotionality',
    name: 'Emocionalidad negativa',
    definition: 'Tendencia a experimentar con frecuencia emociones desagradables, como preocupación, miedo, tristeza o irritación, y a alterarse emocionalmente con facilidad.',
    facets: ['ansiedad', 'depresion', 'volatilidad']
  },
  open_mindedness: {
    id: 'open_mindedness',
    name: 'Apertura de mente',
    definition: 'Tendencia a interesarse por ideas y cuestiones que invitan a pensar, apreciar el arte y la belleza, y utilizar la imaginación para crear cosas nuevas.',
    facets: ['curiosidad_intelectual', 'sensibilidad_estetica', 'imaginacion_creativa']
  }
};

export const FACETS = {
  // Extraversión
  sociabilidad: {
    id: 'sociabilidad',
    domainId: 'extraversion',
    name: 'Sociabilidad',
    definition: 'Tendencia a buscar la compañía de otras personas y disfrutar pasando tiempo con ellas, conversando y participando en actividades sociales.'
  },
  asertividad: {
    id: 'asertividad',
    domainId: 'extraversion',
    name: 'Asertividad',
    definition: 'Tendencia a hacerse escuchar, expresar lo que uno quiere y piensa, influir en las decisiones de los demás y asumir el liderazgo en situaciones de grupo, en lugar de dejar que otros tomen siempre la iniciativa.'
  },
  energia: {
    id: 'energia',
    domainId: 'extraversion',
    name: 'Nivel de energía',
    definition: 'Tendencia a sentirse activo, con ganas de hacer cosas y a mostrar entusiasmo e ilusión por lo que ocurre o por lo que está haciendo.'
  },

  // Cordialidad
  compasion: {
    id: 'compasion',
    domainId: 'agreeableness',
    name: 'Compasión',
    definition: 'Tendencia a preocuparse sinceramente por lo que les ocurre a los demás, especialmente cuando lo están pasando mal, y a querer ayudarles.'
  },
  respeto: {
    id: 'respeto',
    domainId: 'agreeableness',
    name: 'Respeto',
    definition: 'Tendencia a tratar a los demás con educación y consideración, teniendo en cuenta sus derechos y evitando comportarse de manera ofensiva, agresiva o desagradable con ellos, incluso cuando hay desacuerdos.'
  },
  confianza: {
    id: 'confianza',
    domainId: 'agreeableness',
    name: 'Confianza',
    definition: 'Tendencia a pensar que los demás suelen tener buenas intenciones, en lugar de sospechar de ellos o pensar de entrada que quieren engañarnos o perjudicarnos.'
  },

  // Responsabilidad
  organizacion: {
    id: 'organizacion',
    domainId: 'conscientiousness',
    name: 'Organización',
    definition: 'Tendencia a preferir que las cosas estén ordenadas y a mantener un cierto orden tanto en los espacios que utiliza como en la manera de hacer las cosas.'
  },
  productividad: {
    id: 'productividad',
    domainId: 'conscientiousness',
    name: 'Productividad',
    definition: 'Tendencia a ponerse a trabajar en lo que uno tiene que hacer, esforzarse para conseguir sus objetivos y continuar trabajando hasta terminar lo que ha empezado, incluso cuando requiere esfuerzo.'
  },
  cumplimiento_compromisos: {
    id: 'cumplimiento_compromisos',
    domainId: 'conscientiousness',
    name: 'Cumplimiento de compromisos',
    definition: 'Tendencia a cumplir con las propias obligaciones y con aquello que uno se ha comprometido a hacer, de manera que los demás saben que pueden contar con esa persona.'
  },

  // Emocionalidad negativa
  ansiedad: {
    id: 'ansiedad',
    domainId: 'negative_emotionality',
    name: 'Tendencia a la ansiedad',
    definition: 'Tendencia a preocuparse mucho por lo que puede pasar, ponerse nervioso o sentirse tenso y experimentar miedo con facilidad ante situaciones que generan incertidumbre o estrés.'
  },
  depresion: {
    id: 'depresion',
    domainId: 'negative_emotionality',
    name: 'Tendencia a la depresión',
    definition: 'Tendencia a sentirse triste, decaído o desanimado con frecuencia, y a tener dificultades para mantener el optimismo cuando las cosas salen mal.'
  },
  volatilidad: {
    id: 'volatilidad',
    domainId: 'negative_emotionality',
    name: 'Volatilidad emocional',
    definition: 'Tendencia a alterarse, irritarse o enfadarse con facilidad y a experimentar cambios bruscos de humor, pasando rápidamente de un estado de ánimo a otro.'
  },

  // Apertura de mente
  curiosidad_intelectual: {
    id: 'curiosidad_intelectual',
    domainId: 'open_mindedness',
    name: 'Curiosidad intelectual',
    definition: 'Tendencia a interesarse por comprender cómo y por qué son las cosas, hacerse preguntas y disfrutar pensando y conversando sobre ideas y cuestiones complejas, como las que plantea la ciencia o la filosofía.'
  },
  sensibilidad_estetica: {
    id: 'sensibilidad_estetica',
    domainId: 'open_mindedness',
    name: 'Sensibilidad estética',
    definition: 'Tendencia a apreciar la belleza y disfrutar de experiencias relacionadas con el arte, como escuchar música, contemplar una pintura, leer literatura o asistir a una obra de teatro.'
  },
  imaginacion_creativa: {
    id: 'imaginacion_creativa',
    domainId: 'open_mindedness',
    name: 'Imaginación creativa',
    definition: 'Tendencia a utilizar la imaginación, tener ideas originales y encontrar maneras nuevas o diferentes de hacer las cosas o resolver problemas.'
  }
};

export const SCALE_OPTIONS = [
  { value: 1, label: 'Muy en desacuerdo', shortLabel: 'Muy en desacuerdo' },
  { value: 2, label: 'Algo en desacuerdo', shortLabel: 'Algo en desacuerdo' },
  { value: 3, label: 'Neutral, sin opinión', shortLabel: 'Neutral' },
  { value: 4, label: 'Algo de acuerdo', shortLabel: 'Algo de acuerdo' },
  { value: 5, label: 'Muy de acuerdo', shortLabel: 'Muy de acuerdo' }
];
