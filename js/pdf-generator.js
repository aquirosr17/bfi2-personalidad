// Generador de PDF oficial de exactamente 2 páginas A4 para BFI-2
import { DOMAINS, FACETS } from './data/definitions.js';
import { PROFESSIONAL_AMBITS } from './data/ambits.js';

/**
 * Normaliza nombres para el archivo descargable.
 */
export function sanitizeFileName(lastName, firstName) {
  const normalize = (str) =>
    (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

  const normLast = normalize(lastName) || 'Apellidos';
  const normFirst = normalize(firstName) || 'Nombre';
  return 'BFI2_' + normLast + '_' + normFirst + '.pdf';
}

/**
 * Registra fuentes Unicode Roboto en jsPDF si están disponibles en window.BFI_FONTS.
 */
function setupFonts(doc) {
  if (window.BFI_FONTS) {
    try {
      doc.addFileToVFS('Roboto-Regular.ttf', window.BFI_FONTS['Roboto-Regular.ttf']);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      doc.addFileToVFS('Roboto-Bold.ttf', window.BFI_FONTS['Roboto-Bold.ttf']);
      doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
      doc.setFont('Roboto', 'normal');
      return true;
    } catch (e) {
      console.warn('Error registrando fuentes TTF personalizadas:', e);
    }
  }
  doc.setFont('helvetica', 'normal');
  return false;
}

/**
 * Dibuja una escala horizontal lineal con punto indicador (1 a 5).
 */
function drawScoreBar(doc, x, y, width, score, dotColor = [15, 23, 42]) {
  const clamped = Math.max(1, Math.min(5, score));
  // Línea base
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.6);
  doc.line(x, y, x + width, y);

  // Marcas de escala (1, 2, 3, 4, 5)
  for (let i = 1; i <= 5; i++) {
    const tx = x + ((i - 1) / 4) * width;
    doc.setDrawColor(148, 163, 184); // slate-400
    doc.setLineWidth(0.4);
    doc.line(tx, y - 1.2, tx, y + 1.2);
  }

  // Punto indicador
  const dotX = x + ((clamped - 1) / 4) * width;
  doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
  doc.circle(dotX, y, 1.6, 'F');
}

/**
 * Genera el documento PDF completo de exactamente dos páginas A4.
 */
export function generateBFI2Pdf({ student, scores, activities }) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const hasUnicodeFont = setupFonts(doc);
  const fontRegular = hasUnicodeFont ? 'Roboto' : 'helvetica';
  const fontBold = hasUnicodeFont ? 'Roboto' : 'helvetica';

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182 mm
  const todayStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // ==========================================
  // PÁGINA 1: RESULTADOS PSICOLÓGICOS BFI-2
  // ==========================================

  // Encabezado
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('INFORME PSICOLÓGICO DE PERSONALIDAD • BFI-2', marginX, 13);
  doc.text('Fecha: ' + todayStr, pageWidth - marginX, 13, { align: 'right' });

  doc.setFont(fontBold, 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Resultados del cuestionario BFI-2', marginX, 21);

  doc.setFont(fontBold, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Alumno/a: ' + student.firstName + ' ' + student.lastName, marginX, 27);

  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Big Five Inventory-2 (Soto y John, 2017) • Adaptación española: Gallardo-Pujol, Oceja, Cortijos-Bernabeu y Rouco', marginX, 32);

  // Línea divisoria
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(marginX, 35, pageWidth - marginX, 35);

  // 1. Resumen de los Cinco Grandes Rasgos
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('CINCO GRANDES RASGOS', marginX, 42);

  // Cabecera de la escala para los dominios
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const domScaleX = 90;
  const domScaleWidth = 92;
  doc.text('1 (Muy bajo)', domScaleX, 42);
  doc.text('3 (Medio)', domScaleX + domScaleWidth / 2, 42, { align: 'center' });
  doc.text('5 (Muy alto)', domScaleX + domScaleWidth, 42, { align: 'right' });

  let curY = 49;
  const domainOrder = ['extraversion', 'agreeableness', 'conscientiousness', 'negative_emotionality', 'open_mindedness'];
  for (const domKey of domainOrder) {
    const dom = scores.domains[domKey];
    doc.setFont(fontBold, 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(dom.name, marginX, curY + 1);

    doc.setFont(fontBold, 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(dom.scoreFormatted, marginX + 62, curY + 1, { align: 'right' });

    drawScoreBar(doc, domScaleX, curY, domScaleWidth, dom.score, [14, 116, 144]); // teal-700
    curY += 8.5;
  }

  // Línea divisoria
  curY += 1;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(marginX, curY, pageWidth - marginX, curY);

  // 2. Detalle de las 15 Facetas (organizadas en grupos)
  curY += 6;
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('QUINCE RASGOS ESPECÍFICOS (Facetas por gran rasgo)', marginX, curY);

  curY += 6;
  // Disposición en 2 columnas equilibradas
  const colWidth = 86;
  const col1X = marginX;
  const col2X = marginX + colWidth + 10; // 14 + 86 + 10 = 110 mm

  // Columna 1: Extraversión, Cordialidad, Responsabilidad
  let col1Y = curY;
  const col1Domains = ['extraversion', 'agreeableness', 'conscientiousness'];
  for (const domKey of col1Domains) {
    const dom = scores.domains[domKey];
    doc.setFont(fontBold, 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(14, 116, 144); // teal-700
    doc.text(dom.name.toUpperCase(), col1X, col1Y);
    col1Y += 4.5;

    for (const facet of dom.facets) {
      doc.setFont(fontRegular, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(facet.name, col1X, col1Y);

      doc.setFont(fontBold, 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(facet.scoreFormatted, col1X + 46, col1Y, { align: 'right' });

      drawScoreBar(doc, col1X + 50, col1Y - 1, 36, facet.score, [71, 85, 105]);
      col1Y += 5.5;
    }
    col1Y += 3.5;
  }

  // Columna 2: Emocionalidad negativa, Apertura de mente y cuadro pedagógico
  let col2Y = curY;
  const col2Domains = ['negative_emotionality', 'open_mindedness'];
  for (const domKey of col2Domains) {
    const dom = scores.domains[domKey];
    doc.setFont(fontBold, 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(14, 116, 144);
    doc.text(dom.name.toUpperCase(), col2X, col2Y);
    col2Y += 4.5;

    for (const facet of dom.facets) {
      doc.setFont(fontRegular, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(facet.name, col2X, col2Y);

      doc.setFont(fontBold, 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(facet.scoreFormatted, col2X + 46, col2Y, { align: 'right' });

      drawScoreBar(doc, col2X + 50, col2Y - 1, 36, facet.score, [71, 85, 105]);
      col2Y += 5.5;
    }
    col2Y += 3.5;
  }

  // Cuadro informativo en columna 2
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col2X, col2Y + 2, colWidth, 32, 2, 2, 'FD');
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('¿CÓMO INTERPRETAR LAS PUNTUACIONES?', col2X + 4, col2Y + 7);
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const noteLines = [
    '• Todas las puntuaciones oscilan entre 1.00 (mínimo) y 5.00 (máximo).',
    '• Representan la media aritmética de tus respuestas.',
    '• No indican percentiles ni porcentajes de la población.',
    '• Cada rasgo describe una tendencia habitual, no una etiqueta fija.',
    '• Las facetas permiten comprender los matices propios de cada gran rasgo.'
  ];
  let noteY = col2Y + 11.5;
  for (const line of noteLines) {
    doc.text(line, col2X + 4, noteY);
    noteY += 4.2;
  }

  // Pie de página 1
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Las puntuaciones representan medias de respuestas entre 1 y 5. No son percentiles.', marginX, pageHeight - 11);
  doc.text('Página 1 de 2', pageWidth - marginX, pageHeight - 11, { align: 'right' });

  // ==========================================
  // PÁGINA 2: ACTIVIDADES PEDAGÓGICAS
  // ==========================================
  doc.addPage('a4', 'portrait');
  setupFonts(doc);

  // Encabezado Página 2
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('INFORME DE PERSONALIDAD • BFI-2', marginX, 13);
  doc.text('Alumno/a: ' + student.firstName + ' ' + student.lastName, pageWidth - marginX, 13, { align: 'right' });

  doc.setFont(fontBold, 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text('Interpretación de los resultados', marginX, 21);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(marginX, 25, pageWidth - marginX, 25);

  let p2Y = 32;

  // ------------------------------------------
  // ACTIVIDAD 1
  // ------------------------------------------
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(14, 116, 144);
  doc.text('ACTIVIDAD 1. Rasgo específico y conducta habitual', marginX, p2Y);
  p2Y += 4.5;

  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const q1Prompt = 'Escoge uno de tus rasgos específicos y piensa en algún comportamiento habitual tuyo que pueda estar relacionado con él. Describe ese comportamiento y explica qué relación encuentras entre tu puntuación y tu manera de actuar.';
  const q1PromptLines = doc.splitTextToSize(q1Prompt, contentWidth);
  doc.text(q1PromptLines, marginX, p2Y);
  p2Y += q1PromptLines.length * 3.6 + 2;

  // Caja de respuesta Actividad 1
  const q1Text = (activities.q1Text || '').trim();
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const q1Lines = doc.splitTextToSize(q1Text, contentWidth - 6);
  const q1BoxH = Math.max(16, q1Lines.length * 3.7 + 4);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, p2Y, contentWidth, q1BoxH, 1.5, 1.5, 'FD');
  doc.text(q1Lines, marginX + 3, p2Y + 4);
  p2Y += q1BoxH + 6;

  // ------------------------------------------
  // ACTIVIDAD 2
  // ------------------------------------------
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(14, 116, 144);
  doc.text('ACTIVIDAD 2. Valor de las 15 facetas frente a los 5 grandes rasgos', marginX, p2Y);
  p2Y += 4.5;

  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const q2Prompt = 'El BFI-2 podría limitarse a mostrar los resultados de los cinco grandes rasgos. Sin embargo, también ofrece las puntuaciones de quince rasgos específicos. ¿Qué información importante sobre la personalidad de alguien perderíamos si solo conociéramos sus cinco puntuaciones generales? Utiliza uno de los grandes rasgos y sus tres rasgos específicos para explicar tu respuesta.';
  const q2PromptLines = doc.splitTextToSize(q2Prompt, contentWidth);
  doc.text(q2PromptLines, marginX, p2Y);
  p2Y += q2PromptLines.length * 3.6 + 2;

  // Gran rasgo elegido
  const q2DomName = DOMAINS[activities.q2Domain]?.name || activities.q2Domain || 'No seleccionado';
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Gran rasgo seleccionado: ', marginX, p2Y);
  doc.setFont(fontBold, 'bold');
  doc.setTextColor(14, 116, 144);
  doc.text(q2DomName, marginX + doc.getTextWidth('Gran rasgo seleccionado: '), p2Y);
  p2Y += 4.5;

  // Caja de respuesta Actividad 2
  const q2Text = (activities.q2Text || '').trim();
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const q2Lines = doc.splitTextToSize(q2Text, contentWidth - 6);
  const q2BoxH = Math.max(16, q2Lines.length * 3.7 + 4);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, p2Y, contentWidth, q2BoxH, 1.5, 1.5, 'FD');
  doc.text(q2Lines, marginX + 3, p2Y + 4);
  p2Y += q2BoxH + 6;

  // ------------------------------------------
  // ACTIVIDAD 3
  // ------------------------------------------
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(14, 116, 144);
  doc.text('ACTIVIDAD 3. ¿Para qué se utilizan los tests de personalidad?', marginX, p2Y);
  p2Y += 4.5;

  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const q3Prompt1 = 'Has utilizado el test de personalidad BFI-2 para conocer mejor tu personalidad, pero los psicólogos también utilizan cuestionarios de personalidad en ámbitos como la investigación, el trabajo o la evaluación psicológica.';
  const q3Prompt2 = 'Escoge uno de los ámbitos anteriores y realiza una pregunta que podríamos intentar responder estudiando la personalidad de las personas. ¿Qué rasgos concretos te interesaría medir y para qué serviría conocerlos?';
  const q3P1Lines = doc.splitTextToSize(q3Prompt1, contentWidth);
  doc.text(q3P1Lines, marginX, p2Y);
  p2Y += q3P1Lines.length * 3.6 + 1;

  const q3P2Lines = doc.splitTextToSize(q3Prompt2, contentWidth);
  doc.text(q3P2Lines, marginX, p2Y);
  p2Y += q3P2Lines.length * 3.6 + 2.5;

  // Ámbito elegido
  const ambitObj = PROFESSIONAL_AMBITS.find(a => a.id === activities.q3Ambit);
  const ambitName = ambitObj ? ambitObj.name : (activities.q3Ambit || 'No seleccionado');
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Ámbito elegido: ', marginX, p2Y);
  doc.setTextColor(14, 116, 144);
  doc.text(ambitName, marginX + doc.getTextWidth('Ámbito elegido: '), p2Y);
  p2Y += 4.5;

  // Pregunta de investigación
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Pregunta de investigación formulada:', marginX, p2Y);
  p2Y += 3.5;

  const q3Question = (activities.q3Question || '').trim();
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const q3QLines = doc.splitTextToSize(q3Question, contentWidth - 6);
  const q3QBoxH = Math.max(10, q3QLines.length * 3.7 + 3.5);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, p2Y, contentWidth, q3QBoxH, 1.5, 1.5, 'FD');
  doc.text(q3QLines, marginX + 3, p2Y + 3.5);
  p2Y += q3QBoxH + 4;

  // Rasgos a medir y para qué serviría
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Rasgos concretos a medir y utilidad de conocerlos:', marginX, p2Y);
  p2Y += 3.5;

  const q3Traits = (activities.q3Traits || '').trim();
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const q3TLines = doc.splitTextToSize(q3Traits, contentWidth - 6);
  const q3TBoxH = Math.max(12, q3TLines.length * 3.7 + 3.5);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, p2Y, contentWidth, q3TBoxH, 1.5, 1.5, 'FD');
  doc.text(q3TLines, marginX + 3, p2Y + 3.5);

  // Pie de página 2
  doc.setFont(fontRegular, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Cuestionario BFI-2 • 1.º de Bachillerato (Psicología)', marginX, pageHeight - 11);
  doc.text('Página 2 de 2', pageWidth - marginX, pageHeight - 11, { align: 'right' });

  // Garantizar exactamente 2 páginas
  const pageCount = doc.getNumberOfPages();
  if (pageCount > 2) {
    console.warn('El documento generó ' + pageCount + ' páginas, eliminando páginas excedentes.');
    while (doc.getNumberOfPages() > 2) {
      doc.deletePage(doc.getNumberOfPages());
    }
  }

  return doc;
}
