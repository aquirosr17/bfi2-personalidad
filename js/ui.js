// Renderizado y control de la interfaz de usuario
import { BFI2_ITEMS } from './data/items.js';
import { DOMAINS, FACETS, SCALE_OPTIONS } from './data/definitions.js';
import { PROFESSIONAL_AMBITS } from './data/ambits.js';
import { validateActivities, validateStudentInfo } from './validation.js';
import { calculateBFI2Scores } from './scoring.js';
import { generateBFI2Pdf, sanitizeFileName } from './pdf-generator.js';
import { saveSessionState, loadSessionState, clearSessionState } from './storage.js';

export class BFI2App {
  constructor() {
    this.state = {
      currentStep: 'intro', // 'intro' | 'questionnaire' | 'domains' | 'facets_activities'
      currentBlock: 0,      // 0..9 (bloques de 6 preguntas)
      student: {
        firstName: '',
        lastName: ''
      },
      answers: {},          // { [itemId]: 1..5 }
      activities: {
        q1Text: '',
        q2Domain: '',
        q2Text: '',
        q3Ambit: '',
        q3Question: '',
        q3Traits: ''
      }
    };

    this.initElements();
    this.loadPersistedState();
    this.attachEventListeners();
    this.render();
  }

  initElements() {
    this.el = {
      // Pantallas
      screenIntro: document.getElementById('screen-intro'),
      screenQuestionnaire: document.getElementById('screen-questionnaire'),
      screenDomains: document.getElementById('screen-domains'),
      screenFacetsActivities: document.getElementById('screen-facets-activities'),

      // Inputs pantalla inicial
      inputFirstName: document.getElementById('student-first-name'),
      inputLastName: document.getElementById('student-last-name'),
      btnStart: document.getElementById('btn-start-questionnaire'),
      introError: document.getElementById('intro-error-msg'),

      // Componentes cuestionario
      qBlockIndicator: document.getElementById('q-block-indicator'),
      qTotalIndicator: document.getElementById('q-total-indicator'),
      qProgressBar: document.getElementById('q-progress-bar'),
      qItemsContainer: document.getElementById('q-items-container'),
      qBlockError: document.getElementById('q-block-error'),
      btnPrevBlock: document.getElementById('btn-prev-block'),
      btnNextBlock: document.getElementById('btn-next-block'),

      // Pantalla de dominios
      domainsListContainer: document.getElementById('domains-list-container'),
      btnGoToFacets: document.getElementById('btn-go-to-facets'),

      // Pantalla final (facetas y actividades)
      facetsAccordionContainer: document.getElementById('facets-accordion-container'),
      ambitsTableContainer: document.getElementById('ambits-table-container'),
      q1Text: document.getElementById('act-q1-text'),
      q2Domain: document.getElementById('act-q2-domain'),
      q2Text: document.getElementById('act-q2-text'),
      q3Ambit: document.getElementById('act-q3-ambit'),
      q3Question: document.getElementById('act-q3-question'),
      q3Traits: document.getElementById('act-q3-traits'),
      btnGeneratePdf: document.getElementById('btn-generate-pdf'),
      pdfStatusMsg: document.getElementById('pdf-status-msg'),

      // Botón global de reiniciar
      btnRestartGlobal: document.getElementById('btn-restart-global')
    };
  }

  loadPersistedState() {
    const saved = loadSessionState();
    if (saved) {
      this.state = {
        ...this.state,
        ...saved,
        student: { ...this.state.student, ...(saved.student || {}) },
        answers: { ...(saved.answers || {}) },
        activities: { ...this.state.activities, ...(saved.activities || {}) }
      };
      if (this.el.inputFirstName) this.el.inputFirstName.value = this.state.student.firstName || '';
      if (this.el.inputLastName) this.el.inputLastName.value = this.state.student.lastName || '';
      if (this.el.q1Text) this.el.q1Text.value = this.state.activities.q1Text || '';
      if (this.el.q2Domain) this.el.q2Domain.value = this.state.activities.q2Domain || '';
      if (this.el.q2Text) this.el.q2Text.value = this.state.activities.q2Text || '';
      if (this.el.q3Ambit) this.el.q3Ambit.value = this.state.activities.q3Ambit || '';
      if (this.el.q3Question) this.el.q3Question.value = this.state.activities.q3Question || '';
      if (this.el.q3Traits) this.el.q3Traits.value = this.state.activities.q3Traits || '';
    }
  }

  persist() {
    saveSessionState(this.state);
  }

  attachEventListeners() {
    // Inicio
    this.el.btnStart.addEventListener('click', () => this.handleStartQuestionnaire());

    // Navegación cuestionario
    this.el.btnPrevBlock.addEventListener('click', () => this.handlePrevBlock());
    this.el.btnNextBlock.addEventListener('click', () => this.handleNextBlock());

    // Transición a facetas y actividades
    this.el.btnGoToFacets.addEventListener('click', () => {
      this.state.currentStep = 'facets_activities';
      this.persist();
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Inputs de actividades (auto-guardado al escribir)
    const syncActivities = () => {
      this.state.activities.q1Text = this.el.q1Text.value;
      this.state.activities.q2Domain = this.el.q2Domain.value;
      this.state.activities.q2Text = this.el.q2Text.value;
      this.state.activities.q3Ambit = this.el.q3Ambit.value;
      this.state.activities.q3Question = this.el.q3Question.value;
      this.state.activities.q3Traits = this.el.q3Traits.value;
      this.persist();
    };

    [this.el.q1Text, this.el.q2Domain, this.el.q2Text, this.el.q3Ambit, this.el.q3Question, this.el.q3Traits].forEach(elem => {
      if (elem) {
        elem.addEventListener('input', syncActivities);
        elem.addEventListener('change', syncActivities);
      }
    });

    // Generar PDF
    this.el.btnGeneratePdf.addEventListener('click', () => this.handleGeneratePdf());

    // Botón reiniciar
    if (this.el.btnRestartGlobal) {
      this.el.btnRestartGlobal.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas reiniciar el cuestionario? Se borrarán las respuestas actuales.')) {
          clearSessionState();
          window.location.reload();
        }
      });
    }
  }

  handleStartQuestionnaire() {
    const firstName = this.el.inputFirstName.value.trim();
    const lastName = this.el.inputLastName.value.trim();

    const validation = validateStudentInfo(firstName, lastName);
    if (!validation.isValid) {
      this.el.introError.textContent = validation.errors.firstName || validation.errors.lastName || '';
      this.el.introError.classList.remove('hidden');
      return;
    }

    this.el.introError.classList.add('hidden');
    this.state.student.firstName = firstName;
    this.state.student.lastName = lastName;
    this.state.currentStep = 'questionnaire';
    this.persist();
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handlePrevBlock() {
    if (this.state.currentBlock > 0) {
      this.state.currentBlock--;
      this.persist();
      this.renderQuestionnaireBlock();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handleNextBlock() {
    const blockItems = BFI2_ITEMS.slice(this.state.currentBlock * 6, (this.state.currentBlock + 1) * 6);
    const unanswered = blockItems.filter(it => !this.state.answers[it.id]);

    if (unanswered.length > 0) {
      this.el.qBlockError.textContent = 'Por favor, responde a todas las afirmaciones del bloque antes de continuar.';
      this.el.qBlockError.classList.remove('hidden');

      // Resaltar tarjetas pendientes
      unanswered.forEach(it => {
        const card = document.getElementById(`item-card-${it.id}`);
        if (card) {
          card.classList.add('card-error');
        }
      });

      // Desplazar a la primera tarjeta pendiente
      const firstCard = document.getElementById(`item-card-${unanswered[0].id}`);
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.el.qBlockError.classList.add('hidden');

    if (this.state.currentBlock < 9) {
      this.state.currentBlock++;
      this.persist();
      this.renderQuestionnaireBlock();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Bloque final completado: pasar a resultados
      this.state.currentStep = 'domains';
      this.persist();
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  render() {
    // Control de pantallas visibles
    const screens = [
      { id: 'intro', el: this.el.screenIntro },
      { id: 'questionnaire', el: this.el.screenQuestionnaire },
      { id: 'domains', el: this.el.screenDomains },
      { id: 'facets_activities', el: this.el.screenFacetsActivities }
    ];

    screens.forEach(s => {
      if (s.id === this.state.currentStep) {
        s.el.classList.remove('hidden');
      } else {
        s.el.classList.add('hidden');
      }
    });

    // Renderizado según pantalla
    if (this.state.currentStep === 'questionnaire') {
      this.renderQuestionnaireBlock();
    } else if (this.state.currentStep === 'domains') {
      this.renderDomainsScreen();
    } else if (this.state.currentStep === 'facets_activities') {
      this.renderFacetsActivitiesScreen();
    }
  }

  renderQuestionnaireBlock() {
    const blockIndex = this.state.currentBlock;
    const blockNum = blockIndex + 1;
    const totalAnswered = Object.keys(this.state.answers).length;

    this.el.qBlockIndicator.textContent = `Bloque ${blockNum} de 10`;
    this.el.qTotalIndicator.textContent = `${totalAnswered} de 60 afirmaciones respondidas`;
    this.el.qProgressBar.style.width = `${(totalAnswered / 60) * 100}%`;

    this.el.btnPrevBlock.style.visibility = blockIndex === 0 ? 'hidden' : 'visible';
    this.el.btnNextBlock.textContent = blockIndex === 9 ? 'Ver mis resultados' : 'Siguiente bloque';
    this.el.qBlockError.classList.add('hidden');

    const blockItems = BFI2_ITEMS.slice(blockIndex * 6, (blockIndex + 1) * 6);
    this.el.qItemsContainer.innerHTML = '';

    blockItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'question-card';
      card.id = `item-card-${item.id}`;

      const itemNumber = document.createElement('span');
      itemNumber.className = 'question-number';
      itemNumber.textContent = `${item.id}.`;

      const itemText = document.createElement('h3');
      itemText.className = 'question-text';
      itemText.textContent = item.text;

      // Escala de respuesta estilo SeeMyPersonality
      const scaleContainer = document.createElement('div');
      scaleContainer.className = 'scale-options-container';
      scaleContainer.setAttribute('role', 'radiogroup');
      scaleContainer.setAttribute('aria-label', `Pregunta ${item.id}: ${item.text}`);

      SCALE_OPTIONS.forEach(opt => {
        const isSelected = this.state.answers[item.id] === opt.value;

        const optionBtn = document.createElement('button');
        optionBtn.type = 'button';
        optionBtn.className = `scale-circle-btn ${isSelected ? 'active' : ''} opt-val-${opt.value}`;
        optionBtn.setAttribute('role', 'radio');
        optionBtn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        optionBtn.setAttribute('aria-label', opt.label);

        const circleIcon = document.createElement('span');
        circleIcon.className = 'circle-indicator';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'circle-label';
        labelSpan.textContent = opt.shortLabel;

        optionBtn.appendChild(circleIcon);
        optionBtn.appendChild(labelSpan);

        optionBtn.addEventListener('click', () => {
          this.state.answers[item.id] = opt.value;
          this.persist();
          card.classList.remove('card-error');

          // Actualizar estado visual de los botones del grupo
          scaleContainer.querySelectorAll('.scale-circle-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-checked', 'false');
          });
          optionBtn.classList.add('active');
          optionBtn.setAttribute('aria-checked', 'true');

          // Actualizar contador general
          const updatedAnswered = Object.keys(this.state.answers).length;
          this.el.qTotalIndicator.textContent = `${updatedAnswered} de 60 afirmaciones respondidas`;
          this.el.qProgressBar.style.width = `${(updatedAnswered / 60) * 100}%`;
        });

        scaleContainer.appendChild(optionBtn);
      });

      card.appendChild(itemNumber);
      card.appendChild(itemText);
      card.appendChild(scaleContainer);
      this.el.qItemsContainer.appendChild(card);
    });
  }

  renderDomainsScreen() {
    let scores;
    try {
      scores = calculateBFI2Scores(this.state.answers);
    } catch (e) {
      console.error(e);
      alert('Se detectaron respuestas pendientes. Por favor completa todo el cuestionario.');
      this.state.currentStep = 'questionnaire';
      this.render();
      return;
    }

    this.el.domainsListContainer.innerHTML = '';
    const domainOrder = ['extraversion', 'agreeableness', 'conscientiousness', 'negative_emotionality', 'open_mindedness'];

    domainOrder.forEach(domKey => {
      const dom = scores.domains[domKey];
      const card = document.createElement('div');
      card.className = 'domain-card';

      const pct = ((dom.score - 1) / 4) * 100;

      card.innerHTML = `
        <div class="domain-header">
          <h3 class="domain-name">${dom.name}</h3>
          <div class="domain-score">
            <span class="score-number">${dom.scoreFormatted}</span>
            <span class="score-scale">/ 5.00</span>
          </div>
        </div>
        <div class="score-visual-track">
          <div class="score-track-labels">
            <span>1 (Muy bajo)</span>
            <span>3 (Medio)</span>
            <span>5 (Muy alto)</span>
          </div>
          <div class="score-track-line">
            <div class="score-track-dot" style="left: ${pct}%;"></div>
          </div>
        </div>
        <p class="domain-definition">${dom.definition}</p>
      `;

      this.el.domainsListContainer.appendChild(card);
    });
  }

  renderFacetsActivitiesScreen() {
    let scores;
    try {
      scores = calculateBFI2Scores(this.state.answers);
    } catch (e) {
      console.error(e);
      return;
    }

    // 1. Renderizar acordeón de facetas
    this.el.facetsAccordionContainer.innerHTML = '';
    const domainOrder = ['extraversion', 'agreeableness', 'conscientiousness', 'negative_emotionality', 'open_mindedness'];

    domainOrder.forEach((domKey, idx) => {
      const dom = scores.domains[domKey];
      const accItem = document.createElement('div');
      accItem.className = 'accordion-item';

      const isFirst = idx === 0;

      accItem.innerHTML = `
        <button type="button" class="accordion-header ${isFirst ? 'open' : ''}" aria-expanded="${isFirst ? 'true' : 'false'}">
          <div class="accordion-title-wrap">
            <span class="accordion-domain-name">${dom.name}</span>
            <span class="accordion-domain-score">${dom.scoreFormatted} / 5</span>
          </div>
          <span class="accordion-arrow">▼</span>
        </button>
        <div class="accordion-content ${isFirst ? 'open' : ''}">
          <p class="accordion-domain-def"><strong>Descripción general:</strong> ${dom.definition}</p>
          <div class="facets-subgrid">
            ${dom.facets.map(f => {
              const fPct = ((f.score - 1) / 4) * 100;
              return `
                <div class="facet-card">
                  <div class="facet-header">
                    <h4 class="facet-name">${f.name}</h4>
                    <span class="facet-score">${f.scoreFormatted}</span>
                  </div>
                  <div class="score-track-line mini">
                    <div class="score-track-dot" style="left: ${fPct}%;"></div>
                  </div>
                  <p class="facet-definition">${f.definition}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      const headerBtn = accItem.querySelector('.accordion-header');
      const contentDiv = accItem.querySelector('.accordion-content');

      headerBtn.addEventListener('click', () => {
        const isOpen = contentDiv.classList.contains('open');
        if (isOpen) {
          contentDiv.classList.remove('open');
          headerBtn.classList.remove('open');
          headerBtn.setAttribute('aria-expanded', 'false');
        } else {
          contentDiv.classList.add('open');
          headerBtn.classList.add('open');
          headerBtn.setAttribute('aria-expanded', 'true');
        }
      });

      this.el.facetsAccordionContainer.appendChild(accItem);
    });

    // 2. Renderizar tabla de ámbitos profesionales
    if (this.el.ambitsTableContainer) {
      this.el.ambitsTableContainer.innerHTML = `
        <table class="ambits-table">
          <thead>
            <tr>
              <th>Ámbito</th>
              <th>Para qué se utilizan</th>
            </tr>
          </thead>
          <tbody>
            ${PROFESSIONAL_AMBITS.map(a => `
              <tr>
                <td class="ambit-name"><strong>${a.name}</strong></td>
                <td class="ambit-desc">${a.description}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  }

  handleGeneratePdf() {
    // Sincronizar datos de actividades
    this.state.activities.q1Text = this.el.q1Text.value;
    this.state.activities.q2Domain = this.el.q2Domain.value;
    this.state.activities.q2Text = this.el.q2Text.value;
    this.state.activities.q3Ambit = this.el.q3Ambit.value;
    this.state.activities.q3Question = this.el.q3Question.value;
    this.state.activities.q3Traits = this.el.q3Traits.value;
    this.persist();

    // Limpiar errores previos en la UI
    document.querySelectorAll('.field-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    this.el.pdfStatusMsg.classList.add('hidden');

    // Validar
    const validation = validateActivities(this.state.activities);
    if (!validation.isValid) {
      let firstErrorEl = null;

      const fieldMap = {
        q1Text: this.el.q1Text,
        q2Domain: this.el.q2Domain,
        q2Text: this.el.q2Text,
        q3Ambit: this.el.q3Ambit,
        q3Question: this.el.q3Question,
        q3Traits: this.el.q3Traits
      };

      for (const fieldKey in validation.errors) {
        const inputElem = fieldMap[fieldKey];
        if (inputElem) {
          inputElem.classList.add('input-error');

          const errorSpan = document.createElement('div');
          errorSpan.className = 'field-error-msg';
          errorSpan.textContent = validation.errors[fieldKey];
          inputElem.parentNode.insertBefore(errorSpan, inputElem.nextSibling);

          if (!firstErrorEl) firstErrorEl = inputElem;
        }
      }

      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorEl.focus();
      }
      return;
    }

    // Validación superada: generar PDF
    try {
      this.el.btnGeneratePdf.disabled = true;
      this.el.btnGeneratePdf.textContent = 'Generando documento PDF...';

      const scores = calculateBFI2Scores(this.state.answers);
      const doc = generateBFI2Pdf({
        student: this.state.student,
        scores: scores,
        activities: this.state.activities
      });

      const fileName = sanitizeFileName(this.state.student.lastName, this.state.student.firstName);
      doc.save(fileName);

      this.el.pdfStatusMsg.textContent = `¡PDF generado con éxito! Archivo descargado: ${fileName}`;
      this.el.pdfStatusMsg.className = 'pdf-status-msg success';
      this.el.pdfStatusMsg.classList.remove('hidden');
    } catch (e) {
      console.error('Error generando PDF:', e);
      this.el.pdfStatusMsg.textContent = 'Ocurrió un error al generar el PDF. Por favor, inténtalo de nuevo.';
      this.el.pdfStatusMsg.className = 'pdf-status-msg error';
      this.el.pdfStatusMsg.classList.remove('hidden');
    } finally {
      this.el.btnGeneratePdf.disabled = false;
      this.el.btnGeneratePdf.innerHTML = `
        <svg class="pdf-btn-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        GENERAR PDF
      `;
    }
  }
}
