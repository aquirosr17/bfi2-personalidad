# Cuestionario de Personalidad BFI-2 para Bachillerato

Aplicación web estática, completa, rigurosa y visualmente cuidada para realizar el cuestionario psicológico **Big Five Inventory-2 (BFI-2)** de Christopher J. Soto y Oliver P. John (2017), en su adaptación oficial al español (Gallardo-Pujol, Oceja, Cortijos-Bernabeu y Rouco).

Diseñada específicamente para estudiantes de 16-17 años en la asignatura de **Psicología de 1.º de Bachillerato**, orientada a fines pedagógicos y lista para su publicación directa en **GitHub Pages**.

---

## 1. Objetivos Pedagógicos

La aplicación está concebida como un instrumento didáctico para ayudar a los estudiantes a:
1. **Comprender qué es la personalidad** y cómo describe tendencias habituales de comportamiento, sin clasificar a las personas en categorías rígidas.
2. **Conocer el modelo Big Five**, que estructura la personalidad en cinco grandes dimensiones: *Extraversión*, *Cordialidad*, *Responsabilidad*, *Emocionalidad negativa* y *Apertura de mente*.
3. **Descubrir el valor de las facetas**: comprender que cada gran rasgo agrupa tendencias más específicas y que las 15 facetas proporcionan descripciones mucho más precisas de la individualidad.
4. **Relacionar rasgos con conductas reales**, reflexionando sobre el propio comportamiento cotidiano mediante actividades escritas.
5. **Comprender para qué se mide la personalidad**, conociendo los ámbitos profesionales de los tests psicológicos (investigación, psicología del trabajo y evaluación clínica).

> *El cuestionario no se presenta como entretenimiento, como diagnóstico ni como asignación de un "tipo" de personalidad.*

---

## 2. Recorrido de la Aplicación

El alumno avanza a través de cuatro etapas progresivas:
1. **Inicio**: Información general e identificación obligatoria del alumno (Nombre y Apellidos).
2. **Cuestionario**: 60 afirmaciones presentadas en 10 bloques de 6 preguntas cada uno.
   - Recordatorio permanente en cada bloque: *«Contesta pensando en cómo eres habitualmente, no solo en cómo te encuentras hoy ni en cómo te gustaría ser»*.
   - Escala horizontal de 5 puntos (estilo *SeeMyPersonality*).
   - Bloqueo de avance con resaltado de afirmaciones pendientes si se intenta continuar sin responderlas.
   - Posibilidad de retroceder y modificar respuestas en cualquier momento.
3. **Tus cinco grandes rasgos**: Puntuaciones generales de 1 a 5 con representaciones lineales continuas (dot plots) y definiciones didácticas oficiales adaptadas de Soto y John.
4. **Tus rasgos específicos y actividades (en una misma pantalla con scroll)**:
   - Acordeón interactivo con los 5 dominios y sus **15 facetas específicas**, con sus respectivas puntuaciones (1 a 5), gráficos lineales y definiciones didácticas.
   - **Tres actividades educativas escritas**:
     - *Actividad 1*: Relación entre un rasgo específico y una conducta habitual propia.
     - *Actividad 2*: Ventaja explicativa de conocer las 15 facetas frente a solo los 5 dominios (con selector de gran rasgo).
     - *Actividad 3*: Aplicaciones de los tests de personalidad (con tabla informativa, selector de ámbito, formulación de pregunta de investigación y reflexión sobre rasgos a medir).
   - **Botón «GENERAR PDF»**: Valida las actividades (criterio interno de 10 palabras sin revelarlo al alumno) y descarga un PDF A4 vertical de **estrictamente dos páginas**.

---

## 3. Corrección Psicométrica Oficial

- **Escala de respuestas**: Enteros del 1 al 5 (1 = Muy en desacuerdo ... 5 = Muy de acuerdo).
- **Ítems Inversos (R)**: Se corrigen mediante $\text{puntuación\_corregida} = 6 - \text{respuesta}$.
  - Contiene exactamente 30 ítems directos y 30 ítems inversos (2 directos y 2 inversos por faceta, 6 directos y 6 inversos por dominio), garantizando un equilibrio de aquiescencia perfecto.
- **Dominios**: Media aritmética de sus 12 ítems tras corregir inversos.
- **Facetas**: Media aritmética de sus 4 ítems tras corregir inversos.
- **Escala final**: Todas las puntuaciones oscilan entre 1.00 y 5.00. No se emplean percentiles, porcentajes ni barras de logro.

### Clave de Facetas y Dominios

- **Extraversión**:
  - *Sociabilidad*: 1, 16R, 31R, 46
  - *Asertividad*: 6, 21, 36R, 51R
  - *Nivel de energía*: 11R, 26R, 41, 56
- **Cordialidad**:
  - *Compasión*: 2, 17R, 32, 47R
  - *Respeto*: 7, 22R, 37R, 52
  - *Confianza*: 12R, 27, 42R, 57
- **Responsabilidad**:
  - *Organización*: 3R, 18, 33, 48R
  - *Productividad*: 8R, 23R, 38, 53
  - *Cumplimiento de compromisos*: 13, 28R, 43, 58R
- **Emocionalidad negativa**:
  - *Tendencia a la ansiedad*: 4R, 19, 34, 49R
  - *Tendencia a la depresión*: 9R, 24R, 39, 54
  - *Volatilidad emocional*: 14, 29R, 44R, 59
- **Apertura de mente**:
  - *Curiosidad intelectual*: 10, 25R, 40, 55R
  - *Sensibilidad estética*: 5R, 20, 35, 50R
  - *Imaginación creativa*: 15, 30R, 45R, 60

---

## 4. Documento PDF de 2 Páginas

El PDF generado mediante la biblioteca local `jsPDF` está maquetado en A4 vertical y consta **estrictamente de dos páginas**:
- **Página 1 (Resultados)**:
  - Identificación del alumno/a, fecha y créditos científicos.
  - Tabla de los 5 grandes rasgos con valores numéricos y barras lineales vectoriales (escala 1 a 5).
  - Bloque estructurado a dos columnas con las 15 facetas organizadas por dominio.
  - Nota aclaratoria: las puntuaciones representan medias entre 1 y 5, no percentiles.
- **Página 2 (Actividades)**:
  - Encabezado con datos del estudiante.
  - Enunciados completos e instrucciones originales de las 3 actividades.
  - Respuestas desarrolladas íntegras del estudiante.
- **Tipografía**: Fuente Unicode (Roboto) incrustada en base64 para garantizar soporte total de caracteres en castellano (tildes, eñes, aperturas de interrogación y exclamación: `á, é, í, ó, ú, ü, ñ, ¿, ¡`).
- **Nombre del archivo**: `BFI2_Apellidos_Nombre.pdf` (caracteres normalizados).

---

## 5. Privacidad y Seguridad

- **100% en el cliente**: No se envían nombres, respuestas ni puntuaciones a ningún servidor.
- **Sin backend ni bases de datos**: Todo el cálculo psicométrico y la creación del PDF se realizan en el navegador del alumno.
- **Sin analíticas ni rastreo**: No se utilizan cookies publicitarias ni herramientas de telemetría.
- **Persistencia local de sesión**: Utiliza `sessionStorage` para no perder el progreso ante recargas accidentales, con opción de reinicio completo.

---

## 6. Estructura del Proyecto

```
bfi2-personalidad/
├── index.html              # Punto de entrada de la web
├── README.md               # Documentación general y pedagógica
├── css/
│   ├── main.css            # Resets, tipografía y variables de color
│   ├── intro.css           # Estilos pantalla inicial (tema azul marino)
│   ├── questionnaire.css   # Tarjetas de preguntas y escala horizontal
│   ├── results.css         # Visualización de dominios y acordeón de facetas
│   └── activities.css      # Actividades escritas, tabla de ámbitos y botón PDF
├── js/
│   ├── app.js              # Inicialización de la aplicación
│   ├── ui.js               # Control de pantallas, estado y eventos
│   ├── scoring.js          # Motor psicométrico y cálculo de medias
│   ├── validation.js       # Validación de campos y conteo de palabras
│   ├── storage.js          # Persistencia en sessionStorage
│   ├── pdf-generator.js    # Maquetación y generación del PDF en 2 páginas
│   └── data/
│       ├── items.js        # 60 ítems (original, adaptado, clave, dominio, faceta)
│       ├── definitions.js  # Definiciones didácticas oficiales
│       └── ambits.js       # Ámbitos profesionales de aplicación
├── lib/
│   ├── jspdf.umd.min.js    # Motor jsPDF local (sin CDNs externas)
│   └── pdf-fonts.js        # Fuentes Unicode Roboto base64 (Apache 2.0)
└── tests/
    ├── run-tests.py        # Suite de pruebas automatizadas en Python
    └── test-runner.html    # Suite de pruebas visual interactiva en navegador
```

---

## 7. Verificación y Pruebas

Para ejecutar las pruebas psicométricas y de validación automatizadas:
```bash
python tests/run-tests.py
```
O bien, abre `tests/test-runner.html` en cualquier navegador web moderno para verificar la suite completa en tiempo real.

---

## 8. Publicación en GitHub Pages

Para publicar la aplicación web de manera gratuita:
1. Sube los cambios a la rama `main` de tu repositorio de GitHub:
   ```bash
   git add .
   git commit -m "Implementación completa del cuestionario BFI-2 para Bachillerato"
   git push origin main
   ```
2. En GitHub, entra en el repositorio y dirígete a:
   **Settings** $\rightarrow$ **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: selecciona `main` y la carpeta `/ (root)`
   - Haz clic en **Save**.
4. En 1-2 minutos, tu cuestionario estará disponible públicamente en:
   `https://<tu-usuario>.github.io/bfi2-personalidad/`

---

## 9. Referencias y Reconocimientos

- **Instrumento original**: Soto, C. J., & John, O. P. (2017). *The next Big Five Inventory (BFI-2): Developing and assessing a hierarchical model with 15 facets to enhance bandwidth, fidelity, and predictive power*. Journal of Personality and Social Psychology, 113(1), 117-143.
- **Adaptación española**: David Gallardo-Pujol, Luís Oceja, Anna Cortijos-Bernabeu y Victor Rouco.
- **Distribución**: Consulta el formulario oficial en el [Colby College Personality Lab](https://www.colby.edu/wp-content/uploads/2022/07/bfi2-form-spanish.pdf).
