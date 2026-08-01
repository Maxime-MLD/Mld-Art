/* =========================================================================
   MLD DEV — Système d'animation (FICHIER UNIQUE)
   Stack : GSAP + ScrollTrigger pour les animations, Lenis pour le smooth
   scroll. Aucun IntersectionObserver maison.
   -------------------------------------------------------------------------
   Sommaire
     1. Préférence « animations réduites »
     2. Smooth scroll — Lenis
     3. Entrée des sections — fade-in-up
     4. Filets de structure — déploiement de 0 à 100 %
     5. Portfolio — micro-zoom au survol
     6. FAQ — accordéons
     7. État final immédiat (accessibilité / repli)
     8. Point d'entrée
   -------------------------------------------------------------------------
   Règle transverse : aucun effet de rebond. Uniquement des courbes `power2`.
   Les transitions de couleur et de soulignement des liens et des boutons
   sont gérées en CSS Tailwind, pas ici.
   ========================================================================= */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------
   1. PRÉFÉRENCE UTILISATEUR — animations réduites
   Si l'utilisateur a activé « réduire les animations » au niveau de son OS :
   pas de Lenis, pas d'animation d'entrée, tout est affiché en état final.
   ------------------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------
   2. SMOOTH SCROLL — Lenis
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
   3. ENTRÉE DES SECTIONS — fade-in-up
   Titres, textes, cartes : tout ce qui porte `data-anim`.
   Montée lente de 30px, sans rebond. `batch` regroupe les éléments qui
   entrent dans la même frame pour produire une cascade naturelle, et couvre
   aussi ceux déjà visibles au chargement.
   ------------------------------------------------------------------------- */
/* Point de déclenchement par défaut : l'élément atteint 85 % de la hauteur
   de fenêtre. Un composant peut retarder son entrée avec l'attribut
   `data-anim-start` (ex. les réalisations, qui gagnent à se déclencher plus
   bas pour que le mouvement soit réellement perçu). */
const DEFAULT_START = 'top 85%';

function initSectionReveals() {
  const targets = gsap.utils.toArray('[data-anim]');
  if (targets.length === 0) return;

  // Un seul batch : le seuil est calculé élément par élément. `start` accepte
  // une fonction, ce qui évite de créer plusieurs batches concurrents.
  ScrollTrigger.batch(targets, {
    start: (self) => self.trigger.dataset.animStart || DEFAULT_START,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.12,
        // On nettoie le transform en fin d'animation : les éléments
        // retrouvent un contexte de rendu normal (utile pour le sticky
        // et pour la netteté du texte).
        clearProps: 'transform',
      }),
  });

  // État de départ, posé en JS pour rester cohérent avec l'opacité du CSS
  gsap.set(targets, { y: 30 });
}

/* -------------------------------------------------------------------------
   3 bis. NAVBAR — descente depuis le haut
   SÉQUENCE D'ENTRÉE
   Une seule timeline, lue comme une chorégraphie continue d'environ deux
   secondes : les filets se déploient, les éléments de la navbar tombent en
   cascade, les lignes du titre émergent de leur masque pendant que le visuel
   se dévoile, puis le sous-texte et le bouton se posent.
   Les états de départ sont déjà appliqués en CSS (règles `.js [data-…]`) :
   les `fromTo` ci-dessous les reprennent à l'identique, sans provoquer de
   saut au démarrage.
   ------------------------------------------------------------------------- */
function initEntranceSequence() {
  // Chaque cible est optionnelle : la page /realisations n'a pas de Hero.
  const filets = gsap.utils.toArray('[data-hero-filet]');
  const navItems = gsap.utils.toArray('[data-nav-item]');
  const lignes = gsap.utils.toArray('[data-hero-line]');
  const masque = gsap.utils.toArray('[data-hero-mask]');
  const visuel = gsap.utils.toArray('[data-hero-image]');
  const fades = gsap.utils.toArray('[data-hero-fade]');

  const tl = gsap.timeline();

  // 0.0 s — les filets de structure se déploient du haut vers le bas
  if (filets.length) {
    tl.fromTo(
      filets,
      { scaleY: 0, transformOrigin: 'top' },
      { scaleY: 1, duration: 1.2, ease: 'power2.inOut' },
      0
    );
  }

  // 0.2 s — logo, liens, bouton et burger descendent un par un sur la barre
  if (navItems.length) {
    tl.fromTo(
      navItems,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
      0.2
    );
  }

  /* 0.5 s — les lignes du titre remontent depuis le bas de leur masque.
     Aucune opacité : c'est le masque qui révèle, le rendu est plus net. */
  if (lignes.length) {
    /* `y: 0` est indispensable en plus de `yPercent` : GSAP garde deux
       composantes de translation, l'une en pixels et l'autre en pourcentage.
       En lisant le `translateY(110%)` posé par le CSS, il le range côté
       pixels ; remettre le seul `yPercent` à 0 laisserait ce résidu et les
       lignes s'arrêteraient à mi-course. */
    tl.fromTo(
      lignes,
      { yPercent: 110, y: 0 },
      { yPercent: 0, y: 0, duration: 1, stagger: 0.12, ease: 'power4.out' },
      0.5
    );
  }

  // 0.5 s — le visuel se dévoile en même temps que le titre, pas après
  if (masque.length) {
    tl.fromTo(
      masque,
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.inOut' },
      0.5
    );
  }
  if (visuel.length) {
    tl.fromTo(
      visuel,
      { scale: 1.12 },
      { scale: 1, duration: 1.2, ease: 'power2.out' },
      0.5
    );
  }

  // 0.9 s — sous-texte puis bouton
  if (fades.length) {
    tl.fromTo(
      fades,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
      0.9
    );
  }

  return tl;
}

/* -------------------------------------------------------------------------
   4. FILETS DE STRUCTURE — déploiement de 0 à 100 %
   Les filets sont dessinés par un pseudo-élément dont l'échelle horizontale
   est portée par la variable CSS `--filet` (voir global.css). On anime la
   variable : le bloc lui-même ne subit aucune transformation, donc la mise
   en page ne bouge pas.
   ------------------------------------------------------------------------- */
function initStructuralLines() {
  const lines = gsap.utils.toArray('[data-anim-line]');
  if (lines.length === 0) return;

  lines.forEach((line) => {
    gsap.fromTo(
      line,
      { '--filet': 0 },
      {
        '--filet': 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: line,
          // Même réglage fin que les entrées de blocs : un filet peut être
          // retardé via `data-anim-start`.
          start: line.dataset.animStart || 'top 90%',
          once: true,
        },
      }
    );
  });
}

/* -------------------------------------------------------------------------
   5. PORTFOLIO — micro-zoom au survol
   Le cadre porte `overflow-hidden` : c'est l'image qui grandit, le filet
   fin qui l'encadre ne bouge pas d'un pixel.
   Réservé aux périphériques à survol réel : sur écran tactile, un `hover`
   resterait collé après le tap.
   ------------------------------------------------------------------------- */
function initPortfolioHover() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('[data-project-image]').forEach((image) => {
    const frame = image.parentElement;
    if (!frame) return;

    const zoom = (scale) =>
      gsap.to(image, {
        scale,
        duration: 0.7,
        ease: 'power2.out',
        overwrite: 'auto',
      });

    frame.addEventListener('mouseenter', () => zoom(1.03));
    frame.addEventListener('mouseleave', () => zoom(1));
  });
}

/* -------------------------------------------------------------------------
   5 bis. CRITIQUES — bandeau défilant (marquee)
   La piste contient deux copies identiques de la liste d'avis : la déplacer
   de -50 % ramène donc exactement la seconde copie à la place de la première,
   d'où une boucle sans raccord visible.
   Le déplacement est purement transformé — aucune zone scrollable — pour que
   la molette continue de faire défiler la page au survol du bandeau.
   ------------------------------------------------------------------------- */
function initCritiquesMarquee() {
  const marquee = document.getElementById('critiques-marquee');
  const track = document.getElementById('critiques-track');
  if (!marquee || !track) return;

  // Vitesse constante, en pixels par seconde : la durée se déduit de la
  // largeur réellement rendue, pour que le rythme ne change pas d'un
  // breakpoint à l'autre (cartes de 300px en mobile, 380px en desktop).
  const VITESSE = 40;
  let defilement;

  const construire = () => {
    if (defilement) defilement.kill();
    gsap.set(track, { xPercent: 0 });

    const largeurCopie = track.scrollWidth / 2;
    if (largeurCopie === 0) return;

    defilement = gsap.to(track, {
      xPercent: -50,
      duration: largeurCopie / VITESSE,
      ease: 'none',
      repeat: -1,
    });
  };

  construire();

  // Recalcul après redimensionnement, temporisé : la largeur des cartes
  // change au passage de breakpoint, donc la durée aussi.
  let minuteur;
  window.addEventListener('resize', () => {
    clearTimeout(minuteur);
    minuteur = setTimeout(construire, 200);
  });

  /* Pause au survol : on anime `timeScale` plutôt que de mettre en pause
     sèchement, pour un ralenti puis une reprise en douceur. */
  const vitesseVers = (valeur) => {
    if (!defilement) return;
    gsap.to(defilement, { timeScale: valeur, duration: 0.4, ease: 'power2.out' });
  };

  marquee.addEventListener('mouseenter', () => vitesseVers(0));
  marquee.addEventListener('mouseleave', () => vitesseVers(1));
}

/* -------------------------------------------------------------------------
   5 ter. BANNIÈRE — parallaxe au scroll
   L'image est agrandie de 12 % dans un conteneur `overflow-hidden` : cette
   marge est exactement ce qui lui permet de coulisser de -6 % à +6 % sans
   jamais découvrir de bord. Le texte, lui, ne bouge pas.
   Le `scale` est posé ici et non en CSS : sans JavaScript — ou en
   « animations réduites » — l'image reste à l'échelle 1, comme demandé.
   ------------------------------------------------------------------------- */
function initBanniereParallaxe() {
  const banniere = document.querySelector('[data-banniere]');
  const image = document.querySelector('[data-banniere-image]');
  if (!banniere || !image) return;

  gsap.fromTo(
    image,
    { yPercent: -6, y: 0, scale: 1.12 },
    {
      yPercent: 6,
      y: 0,
      scale: 1.12,
      ease: 'none',
      scrollTrigger: {
        trigger: banniere,
        // Toute la traversée du bandeau, de son entrée à sa sortie d'écran
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );
}

/* -------------------------------------------------------------------------
   5 quater. RÉALISATIONS — descriptions dépliables
   La troncature est posée en CSS (`max-height` en em, scopée à `.js`) ; le
   texte reste donc entier dans le DOM et lisible par un lecteur d'écran, y
   compris replié. Rien n'est masqué en `display` ni en `visibility`.
   Cette fonction est appelée dans les deux cas de figure : en « animations
   réduites », le dépliage est instantané mais le bouton reste opérant.
   ------------------------------------------------------------------------- */
function initDescriptionsDepliables(anime) {
  document.querySelectorAll('[data-desc]').forEach((bloc) => {
    const contenu = bloc.querySelector('[data-desc-contenu]');
    const bouton = bloc.querySelector('[data-desc-bouton]');
    if (!contenu || !bouton) return;

    let deplie = false;

    /* Le fondu est un `mask-image` posé en CSS (voir global.css). On le
       neutralise en inline le temps du dépliage : laissé en place, il
       estomperait le bas du texte intégral. La valeur inline est effacée au
       repli, ce qui rend la main à la règle CSS. */
    const appliquerMasque = (actif) => {
      const valeur = actif ? '' : 'none';
      contenu.style.maskImage = valeur;
      contenu.style.webkitMaskImage = valeur;
    };

    /* Hauteur repliée, mesurée à la demande plutôt que mise en cache : elle
       change au passage du breakpoint md (4 lignes en mobile, 5 au-delà). */
    const mesurerHauteurRepliee = () => {
      const hauteurInline = contenu.style.height;
      const maxInline = contenu.style.maxHeight;
      contenu.style.height = '';
      contenu.style.maxHeight = '';
      const mesure = contenu.offsetHeight;
      contenu.style.height = hauteurInline;
      contenu.style.maxHeight = maxInline;
      return mesure;
    };

    bouton.addEventListener('click', () => {
      if (gsap.isTweening(contenu)) return;

      deplie = !deplie;
      bouton.setAttribute('aria-expanded', String(deplie));
      bouton.textContent = deplie ? 'Voir moins' : 'Voir plus';

      const duree = anime ? 0.6 : 0;

      /* Le masque disparaît dès le début de l'ouverture et revient dès le
         début de la fermeture : dans les deux cas, en même temps que la
         hauteur s'anime. */
      appliquerMasque(!deplie);

      if (deplie) {
        const depart = contenu.offsetHeight;
        /* `maxHeight: none` reste posé en inline après l'animation : le
           nettoyer laisserait la règle CSS de troncature reprendre la main
           et le texte se replierait tout seul. */
        gsap.set(contenu, { maxHeight: 'none', height: depart });
        gsap.to(contenu, {
          height: contenu.scrollHeight,
          duration: duree,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(contenu, { height: 'auto' });
            ScrollTrigger.refresh();
          },
        });
      } else {
        const arrivee = mesurerHauteurRepliee();
        gsap.fromTo(
          contenu,
          { height: contenu.offsetHeight },
          {
            height: arrivee,
            duration: duree,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(contenu, { clearProps: 'height,maxHeight' });
              ScrollTrigger.refresh();
            },
          }
        );
      }

    });
  });
}

/* -------------------------------------------------------------------------
   6. FAQ — accordéons
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
            // La hauteur de page a changé : les déclencheurs se recalent
            ScrollTrigger.refresh();
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
            onComplete: () => ScrollTrigger.refresh(),
          }
        );
      }
    });
  });
}

/* -------------------------------------------------------------------------
   7. ÉTAT FINAL IMMÉDIAT
   Utilisé quand les animations sont désactivées : on neutralise les états
   initiaux posés en CSS pour que rien ne reste invisible.
   ------------------------------------------------------------------------- */
function applyFinalState() {
  if (document.querySelector('[data-anim]')) {
    gsap.set('[data-anim]', { opacity: 1, y: 0, clearProps: 'transform' });
  }
  if (document.querySelector('[data-anim-line]')) {
    gsap.set('[data-anim-line]', { '--filet': 1 });
  }
  /* Retirer la classe `js` suffit à annuler tous les états initiaux de la
     séquence d'entrée : ils y sont scopés. Rien à nettoyer élément par
     élément, et aucun style inline résiduel. */
  document.documentElement.classList.remove('js');
}

/* -------------------------------------------------------------------------
   8. POINT D'ENTRÉE
   ------------------------------------------------------------------------- */
function init() {
  if (prefersReducedMotion) {
    // Aucune animation : l'ouverture native des accordéons est conservée,
    // elle est instantanée et parfaitement accessible.
    applyFinalState();
    // Les descriptions restent dépliables, mais sans transition.
    initDescriptionsDepliables(false);
    return;
  }

  initSmoothScroll();
  initSectionReveals();
  initStructuralLines();
  initPortfolioHover();
  initCritiquesMarquee();
  initBanniereParallaxe();
  initDescriptionsDepliables(true);
  initFaqAccordions();

  /* La séquence d'entrée attend le chargement des polices : sans ça, le H1
     serait remesuré en pleine animation et les lignes sauteraient dans leur
     masque.

     Mais cette attente est plafonnée à 400 ms. Le texte du Hero est
     l'élément LCP de la page, et il reste invisible tant que la séquence
     n'a pas démarré : laisser `fonts.ready` seul aux commandes, c'est
     accepter que le LCP dépende entièrement du réseau. Les deux polices
     critiques étant préchargées dans le <head>, la course se gagne
     normalement bien avant l'échéance ; le délai n'est qu'un garde-fou.

     Les déclencheurs de scroll sont recalés dans la foulée, les hauteurs
     ayant pu changer. */
  const policesPretes = Promise.race([
    document.fonts.ready,
    new Promise((resoudre) => setTimeout(resoudre, 400)),
  ]);

  policesPretes.then(() => {
    initEntranceSequence();
    ScrollTrigger.refresh();
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

init();
