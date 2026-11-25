# -*- coding: utf-8 -*-
"""
Suite de pruebas automatizadas para el cuestionario BFI-2
Verifica psicometría, mapeo de ítems, inversiones y validaciones.
"""
import json
import re
import sys

def load_items():
    with open('js/data/items.js', 'r', encoding='utf-8') as f:
        content = f.read()
    # Extraer el array JSON
    match = re.search(r'export const BFI2_ITEMS =\s*(\[[\s\S]*?\]);', content)
    if not match:
        raise ValueError("No se pudo parsear BFI2_ITEMS de items.js")
    return json.loads(match.group(1))

def test_items_structure(items):
    print("-> Verificando estructura de ítems...")
    assert len(items) == 60, f"Debe haber 60 ítems, encontrados {len(items)}"
    
    seen_ids = set()
    reverse_count = 0
    direct_count = 0

    for idx, it in enumerate(items, 1):
        assert it['id'] == idx, f"Ítem {idx} tiene id incorrecto: {it['id']}"
        assert it['id'] not in seen_ids, f"ID duplicado: {it['id']}"
        seen_ids.add(it['id'])

        assert 'original' in it and len(it['original'].strip()) > 0
        assert 'text' in it and len(it['text'].strip()) > 0
        assert it['domain'] in ['extraversion', 'agreeableness', 'conscientiousness', 'negative_emotionality', 'open_mindedness']
        assert it['facet'] in [
            'sociabilidad', 'asertividad', 'energia',
            'compasion', 'respeto', 'confianza',
            'organizacion', 'productividad', 'cumplimiento_compromisos',
            'ansiedad', 'depresion', 'volatilidad',
            'curiosidad_intelectual', 'sensibilidad_estetica', 'imaginacion_creativa'
        ]
        if it['reverse']:
            reverse_count += 1
        else:
            direct_count += 1

    assert reverse_count == 30, f"Debe haber 30 ítems inversos, encontrados {reverse_count}"
    assert direct_count == 30, f"Debe haber 30 ítems directos, encontrados {direct_count}"
    print(f"   [OK] 60 ítems verificados (30 directos, 30 inversos equilibrados).")

def test_official_key(items):
    print("-> Verificando clave oficial de corrección...")
    # Claves oficiales según Colby BFI-2 Spanish Form
    official_domains = {
        'extraversion': [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56],
        'agreeableness': [2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57],
        'conscientiousness': [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58],
        'negative_emotionality': [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59],
        'open_mindedness': [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
    }
    
    official_reverse = [
        3, 4, 5, 8, 9, 11, 12, 16, 17, 22, 23, 24, 25, 26, 28, 29, 30, 31,
        36, 37, 42, 44, 45, 47, 48, 49, 50, 51, 55, 58
    ]

    official_facets = {
        'sociabilidad': [1, 16, 31, 46],
        'asertividad': [6, 21, 36, 51],
        'energia': [11, 26, 41, 56],
        'compasion': [2, 17, 32, 47],
        'respeto': [7, 22, 37, 52],
        'confianza': [12, 27, 42, 57],
        'organizacion': [3, 18, 33, 48],
        'productividad': [8, 23, 38, 53],
        'cumplimiento_compromisos': [13, 28, 43, 58],
        'ansiedad': [4, 19, 34, 49],
        'depresion': [9, 24, 39, 54],
        'volatilidad': [14, 29, 44, 59],
        'curiosidad_intelectual': [10, 25, 40, 55],
        'sensibilidad_estetica': [5, 20, 35, 50],
        'imaginacion_creativa': [15, 30, 45, 60]
    }

    item_dict = {it['id']: it for it in items}

    for dom, expected_ids in official_domains.items():
        actual_ids = [it['id'] for it in items if it['domain'] == dom]
        assert sorted(actual_ids) == sorted(expected_ids), f"Discrepancia en dominio {dom}"

    for fac, expected_ids in official_facets.items():
        actual_ids = [it['id'] for it in items if it['facet'] == fac]
        assert sorted(actual_ids) == sorted(expected_ids), f"Discrepancia en faceta {fac}"

    actual_reverse = [it['id'] for it in items if it['reverse']]
    assert sorted(actual_reverse) == sorted(official_reverse), f"Discrepancia en ítems inversos"

    print("   [OK] Correspondencia 100% idéntica con el BFI-2 oficial de Colby.")

def score_test_answers(items, answers):
    scored = {}
    for it in items:
        ans = answers[it['id']]
        final_val = (6 - ans) if it['reverse'] else ans
        scored[it['id']] = final_val

    facets = {}
    for it in items:
        f = it['facet']
        facets.setdefault(f, []).append(scored[it['id']])
    
    facet_means = {f: sum(vals)/len(vals) for f, vals in facets.items()}

    domains = {}
    for it in items:
        d = it['domain']
        domains.setdefault(d, []).append(scored[it['id']])
    domain_means = {d: sum(vals)/len(vals) for d, vals in domains.items()}

    return domain_means, facet_means

def test_psychometrics(items):
    print("-> Verificando psicometría y corrección matemática...")

    # 1. Todas las respuestas = 3 (Neutro)
    ans_all_3 = {i: 3 for i in range(1, 61)}
    dom_3, fac_3 = score_test_answers(items, ans_all_3)
    for d, score in dom_3.items():
        assert score == 3.0, f"Dominio {d} debió ser 3.0, fue {score}"
    for f, score in fac_3.items():
        assert score == 3.0, f"Faceta {f} debió ser 3.0, fue {score}"
    print("   [OK] Caso neutro (todas 3) = 3.00 exacto en dominios y facetas.")

    # 2. Máxima puntuación teórica: Directos = 5, Inversos = 1
    ans_max = {it['id']: (1 if it['reverse'] else 5) for it in items}
    dom_max, fac_max = score_test_answers(items, ans_max)
    for d, score in dom_max.items():
        assert score == 5.0, f"Dominio {d} debió ser 5.0, fue {score}"
    for f, score in fac_max.items():
        assert score == 5.0, f"Faceta {f} debió ser 5.0, fue {score}"
    print("   [OK] Caso máximo teórico = 5.00 exacto en dominios y facetas.")

    # 3. Mínima puntuación teórica: Directos = 1, Inversos = 5
    ans_min = {it['id']: (5 if it['reverse'] else 1) for it in items}
    dom_min, fac_min = score_test_answers(items, ans_min)
    for d, score in dom_min.items():
        assert score == 1.0, f"Dominio {d} debió ser 1.0, fue {score}"
    for f, score in fac_min.items():
        assert score == 1.0, f"Faceta {f} debió ser 1.0, fue {score}"
    print("   [OK] Caso mínimo teórico = 1.00 exacto en dominios y facetas.")

    # 4. Aquiescencia: Todas 5 -> por balanceo psicométrico da exactamente 3.00
    ans_all_5 = {i: 5 for i in range(1, 61)}
    dom_5, fac_5 = score_test_answers(items, ans_all_5)
    for d, score in dom_5.items():
        assert score == 3.0, f"Dominio {d} debió ser 3.0, fue {score}"
    for f, score in fac_5.items():
        assert score == 3.0, f"Faceta {f} debió ser 3.0, fue {score}"
    print("   [OK] Balance de aquiescencia (todas 5) = 3.00 exacto.")

def count_words(text):
    if not text:
        return 0
    tokens = text.strip().split()
    valid = [t for t in tokens if re.search(r'[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]', t)]
    return len(valid)

def test_validation():
    print("-> Verificando regla oculta de conteo de palabras...")
    assert count_words("uno dos tres cuatro cinco") == 5
    assert count_words("   uno    dos   ...   tres  ---  cuatro  cinco   ") == 5
    assert count_words("Este es un texto con diez palabras para probar validación.") == 10
    assert count_words("Nueve palabras en esta frase para probar el fallo") == 9
    assert count_words("") == 0
    assert count_words("    ...   ---   ,,,   ") == 0
    print("   [OK] Algoritmo de conteo de palabras robusto y exacto.")

if __name__ == '__main__':
    print("==========================================")
    print("EJECUTANDO PRUEBAS AUTOMATIZADAS DEL BFI-2")
    print("==========================================")
    items = load_items()
    test_items_structure(items)
    test_official_key(items)
    test_psychometrics(items)
    test_validation()
    print("==========================================")
    print("¡TODAS LAS PRUEBAS AUTOMÁTICAS HAN PASADO!")
    print("==========================================")
