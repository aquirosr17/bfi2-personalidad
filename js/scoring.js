// Motor psicométrico oficial del BFI-2 (Soto & John, 2017)
import { BFI2_ITEMS } from './data/items.js';
import { DOMAINS, FACETS } from './data/definitions.js';

/**
 * Calcula las puntuaciones oficiales del BFI-2 para dominios y facetas.
 * @param {Object} rawAnswers - Objeto con claves de 1 a 60 y valores del 1 al 5.
 * @returns {Object} Objeto con puntuaciones de dominios, facetas y detalles.
 */
export function calculateBFI2Scores(rawAnswers) {
  // 1. Corregir respuestas (inversión si corresponde: 6 - respuesta)
  const scoredItems = {};
  for (const item of BFI2_ITEMS) {
    const rawVal = Number(rawAnswers[item.id]);
    if (!rawVal || rawVal < 1 || rawVal > 5) {
      throw new Error(Respuesta inválida o faltante para el ítem : );
    }
    const finalScore = item.reverse ? (6 - rawVal) : rawVal;
    scoredItems[item.id] = {
      ...item,
      rawScore: rawVal,
      finalScore: finalScore
    };
  }

  // 2. Calcular puntuaciones de las 15 facetas (media de 4 ítems)
  const facetScores = {};
  for (const facetKey in FACETS) {
    const facetDef = FACETS[facetKey];
    const facetItems = BFI2_ITEMS.filter(it => it.facet === facetKey);
    if (facetItems.length !== 4) {
      throw new Error(La faceta  debe tener exactamente 4 ítems, encontrados );
    }
    const sum = facetItems.reduce((acc, it) => acc + scoredItems[it.id].finalScore, 0);
    const mean = sum / 4.0;
    facetScores[facetKey] = {
      id: facetKey,
      name: facetDef.name,
      domainId: facetDef.domainId,
      definition: facetDef.definition,
      score: mean,
      scoreFormatted: mean.toFixed(2),
      itemIds: facetItems.map(it => it.id)
    };
  }

  // 3. Calcular puntuaciones de los 5 grandes dominios (media de 12 ítems)
  const domainScores = {};
  for (const domainKey in DOMAINS) {
    const domainDef = DOMAINS[domainKey];
    const domainItems = BFI2_ITEMS.filter(it => it.domain === domainKey);
    if (domainItems.length !== 12) {
      throw new Error(El dominio  debe tener exactamente 12 ítems, encontrados );
    }
    const sum = domainItems.reduce((acc, it) => acc + scoredItems[it.id].finalScore, 0);
    const mean = sum / 12.0;

    // Obtener las 3 facetas correspondientes a este dominio
    const domainFacets = domainDef.facets.map(fKey => facetScores[fKey]);

    domainScores[domainKey] = {
      id: domainKey,
      name: domainDef.name,
      definition: domainDef.definition,
      score: mean,
      scoreFormatted: mean.toFixed(2),
      itemIds: domainItems.map(it => it.id),
      facets: domainFacets
    };
  }

  return {
    scoredItems,
    facets: facetScores,
    domains: domainScores
  };
}
