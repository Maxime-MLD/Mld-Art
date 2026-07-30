/* =========================================================================
   MLD DEV — Système d'animation (FICHIER UNIQUE)
   Stack : GSAP + ScrollTrigger pour les animations, Lenis pour le smooth scroll.
   -------------------------------------------------------------------------
   PHASE 1 : uniquement le socle — smooth scroll Lenis synchronisé avec le
   ticker GSAP + garde-fou `prefers-reduced-motion`.
   Les animations par composant (entrées de sections, filets de structure,
   hover portfolio, accordéons FAQ) seront ajoutées en Phase 7.
   ========================================================================= */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------
   PRÉFÉRENCE UTILISATEUR — animations réduites
   Si l'utilisateur a activé « réduire les animations » au niveau de son OS :
   pas de Lenis, pas d'animation d'entrée, tout est affiché en état final.
   ------------------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------
   SMOOTH SCROLL — Lenis
   Piloté par le ticker GSAP (une seule boucle de rendu pour tout le site,
   sinon le scroll et les ScrollTrigger se désynchronisent).
   ------------------------------------------------------------------------- */
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.1,     // inertie longue, cohérente avec le rythme « galerie »
    smoothWheel: true,
    // `syncTouch: false` (valeur par défaut) : le scroll tactile reste natif,
    // plus fluide et plus prévisible sur mobile.
    syncTouch: false,
  });

  // Lenis informe ScrollTrigger à chaque frame de scroll
  lenis.on('scroll', ScrollTrigger.update);

  // Une seule boucle : le ticker GSAP avance Lenis (temps en ms)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // GSAP lisse déjà les à-coups de frame : on désactive son propre lag smoothing
  gsap.ticker.lagSmoothing(0);

  // Exposée globalement : les composants qui doivent geler le scroll
  // (menu mobile plein écran) appellent window.lenis.stop() / .start().
  window.lenis = lenis;

  return lenis;
}

/* -------------------------------------------------------------------------
   FAQ — accordéons
   L'ouverture native de <details> est brutale : on intercepte le clic et on
   anime la hauteur du bloc de réponse. Aucun rebond (power2.inOut).
   ------------------------------------------------------------------------- */
function initFaqAccordions() {
  document.querySelectorAll('[data-faq]').forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('[data-faq-content]');
    if (!summary || !content) return;

    summary.addEventListener('click', (event) => {
      // On reprend la main sur l'ouverture/fermeture
      event.preventDefault();

      // Clic pendant l'animation : on ignore, sinon les hauteurs se marchent dessus
      if (gsap.isTweening(content)) return;

      if (details.open) {
        // Fermeture : on replie d'abord, on retire l'attribut `open` ensuite
        gsap.to(content, {
          height: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            details.open = false;
            gsap.set(content, { clearProps: 'height' });
          },
        });
      } else {
        // Ouverture : `open` d'abord pour que le contenu soit mesurable
        details.open = true;
        gsap.fromTo(
          content,
          { height: 0 },
          {
            height: 'auto',
            duration: 0.5,
            ease: 'power2.inOut',
            clearProps: 'height',
            // `lazy: false` : la hauteur de départ est appliquée dans la frame
            // du clic. Sans ça, le contenu s'affiche déplié pendant une frame
            // avant d'être replié — un sursaut visible.
            lazy: false,
          }
        );
      }
    });
  });
}

/* -------------------------------------------------------------------------
   ÉTAT FINAL IMMÉDIAT
   Utilisé quand les animations sont désactivées : on neutralise les états
   initiaux posés en CSS pour que rien ne reste invisible.
   ------------------------------------------------------------------------- */
function applyFinalState() {
  // On teste la présence des cibles : gsap.set() émet un avertissement si le
  // sélecteur ne correspond à rien (sections pas encore posées).
  if (document.querySelector('[data-anim]')) {
    gsap.set('[data-anim]', { opacity: 1, y: 0, clearProps: 'transform' });
  }
  if (document.querySelector('[data-anim-line]')) {
    gsap.set('[data-anim-line]', { opacity: 1, scaleX: 1, scaleY: 1 });
  }
}

/* -------------------------------------------------------------------------
   POINT D'ENTRÉE
   ------------------------------------------------------------------------- */
function init() {
  if (prefersReducedMotion) {
    // Aucune animation : l'ouverture native des accordéons est conservée,
    // elle est instantanée et parfaitement accessible.
    applyFinalState();
    return;
  }

  initSmoothScroll();
  initFaqAccordions();

  // TODO (Phase 7) : animations d'entrée des sections (fade-in-up),
  // déploiement des filets de structure, hover portfolio, accordéons FAQ.
  // En attendant, on force l'état final pour que rien ne reste masqué par
  // l'état initial `opacity: 0` posé en CSS. À retirer en Phase 7.
  applyFinalState();
}

init();
