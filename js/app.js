// Punto de entrada de la aplicación BFI-2
import { BFI2App } from './ui.js';

function initApp() {
  if (!window.bfiApp) {
    window.bfiApp = new BFI2App();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
