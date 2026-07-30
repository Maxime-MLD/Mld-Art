/* =========================================================================
   Déclarations de types globales
   ========================================================================= */

import type Lenis from 'lenis';

declare global {
  interface Window {
    /* Instance Lenis exposée par `animations.js` : permet aux composants
       (menu mobile, modales…) de suspendre le smooth scroll.
       Absente si l'utilisateur a activé « animations réduites ». */
    lenis?: Lenis;
  }
}

export {};
