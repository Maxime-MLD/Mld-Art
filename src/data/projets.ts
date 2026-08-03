/* =========================================================================
   projets.ts — Données des réalisations
   -------------------------------------------------------------------------
   Seule donnée du projet sortie de son composant, et pour une raison précise :
   elle est consommée à deux endroits — la section d'accueil (3 premiers
   projets) et la page /realisations (les 6). La règle « les données restent
   dans le composant » du CLAUDE.md ne vaut que tant qu'un seul composant les
   affiche.
   ========================================================================= */

/* --- VISUELS ---
   Importés depuis src/assets pour être optimisés par astro:assets.

   ⚠️ FORMAT DES CAPTURES : 1600 × 1000 px, pris en DPR 2 — soit un fichier
   source de 3200 × 2000 px. Le ratio 16/10 est celui du cadre d'affichage,
   la capture n'est donc pas recadrée ; toute image d'un autre ratio sera
   rognée par le BAS (voir ProjectCard.astro). Le DPR 2 n'est pas une
   coquetterie : ce sont des images de texte fin, qui deviennent illisibles
   sur écran Retina si la source est en 1x. */
// TODO: remplacer par les captures définitives des sites livrés
import projet01 from "../assets/placeholders/projet-01.png";
import projet02 from "../assets/placeholders/projet-02.png";
import projet03 from "../assets/placeholders/projet-03.png";
import projet04 from "../assets/placeholders/projet-04.png";
// import projet05 from "../assets/placeholders/projet-05.jpg";
// import projet06 from "../assets/placeholders/projet-06.jpg";

export interface Projet {
  title: string;
  category: string;
  /* Version courte, affichée sur l'accueil. */
  description: string;
  /* Version longue, affichée uniquement sur /realisations, tronquée et
     dépliable. Un paragraphe par entrée : contexte, problématique, choix de
     conception, résultat. */
  descriptionLongue: string[];
  imageSrc: ImageMetadata;
  imageAlt: string;
  projectUrl: string;
}

/* L'alternance image gauche / image droite n'est pas stockée ici : elle est
   calculée à l'affichage à partir de l'index, pour rester correcte quel que
   soit le nombre de projets rendus. */
// TODO: remplacer par les vrais projets (titre, secteur, description, URL)
export const projets: Projet[] = [
  {
    title: "Salon Nails",
    category: "Prothésiste ongulaire — Roanne",
    description:
      "Création sur mesure pour cette prothésiste ongulaire à Roanne : un design coloré, élégant et immersif pensé pour inspirer instantanément confiance, valoriser son savoir-faire et booster ses réservations.",

    descriptionLongue: [
      "Pour ce projet, tout l'enjeu était de créer un véritable coup de cœur visuel pour cette prothésiste ongulaire de Roanne. J'ai conçu un univers sur-mesure, à la fois doux, moderne et très soigné, qui reflète immédiatement la qualité et le professionnalisme de ses prestations. L'interface purifiée met en avant les avis des clientes pour inspirer une confiance immédiate et intègre un accès direct à la réservation en ligne pour transformer naturellement les simples visiteurs en nouveaux rendez-vous",
    ],
    imageSrc: projet01,
    imageAlt: "Page de présentation des prestations du Salon Nails à Roanne",
    projectUrl: "https://nails-beta-gules.vercel.app/",
  },
  {
    title: "Denis Soudure",
    category: "Métallerie & soudure — Roanne",
    description:
      "Une identité visuelle puissante et brute pour cet artisan soudeur à Roanne. Ce design immersif met en lumière des créations d'exception et impose instantanément une image de robustesse et de professionnalisme haut de gamme.",

    descriptionLongue: [
      "Pour cet artisan soudeur basé à Roanne, ma mission était de créer un impact visuel fort à la hauteur de la robustesse et de la technicité de son travail. J'ai conçu un univers digital brut et haut de gamme, jouant sur un contraste puissant entre des noirs profonds et des touches d'orange industriel, afin de capturer l'essence même de l'artisanat du métal dès les premières secondes. Chaque choix de mise en page a été pensé pour valoriser la qualité de ses créations d'exception tout en intégrant des accès directs aux demandes de devis, transformant ce site en un outil commercial redoutable.",
    ],
    imageSrc: projet02,
    imageAlt:
      "Page d'accueil du site vitrine de l'atelier de métallerie Denis Soudure",
    projectUrl: "https://denis-soudure.vercel.app/",
  },
  {
    title: "Cabinet Dentaire",
    category: "Cabinet dentaire — Roanne",
    description:
      "Un design médical épuré et rassurant conçu pour ce cabinet basé à Roanne. L'utilisation de tons bleus apaisants et d'un visuel 3D percutant instaure immédiatement un climat de confiance, de professionnalisme et de haute technicité.",

    descriptionLongue: [
      "Pour ce cabinet dentaire basé à Roanne, l’enjeu principal était de concevoir une interface moderne qui brise les codes parfois austères du milieu médical tout en inspirant une sérénité absolue. J'ai imaginé un univers graphique lumineux, associant des nuances de bleu apaisantes à une illustration 3D centrale percutante, afin d'installer immédiatement un climat de propreté et de haute technicité. Au-delà de l'esthétique, l'ergonomie a été entièrement pensée pour simplifier le parcours des patients, mettre en valeur les avis rassurants de la patientèle et fluidifier la prise de rendez-vous en ligne en un clic.",
    ],
    imageSrc: projet03,
    imageAlt: "Page d'accueil du site du cabinet dentaire du Coteau",
    projectUrl: "https://cabinet-dentaire-jade-chi.vercel.app/",
  },
  {
    title: "Maçon Moderne",
    category: "Entreprise de Maçonnerie — Roanne",
    description:
      "Un site immersif conçu pour cette entreprise de maçonnerie à Roanne. Grâce à une animation interactive au scroll en trois étapes, l'utilisateur voit la maison se construire sous ses yeux jusqu'au rendu final haut de gamme, instaurant immédiatement un sentiment d'expertise et de précision.",

    descriptionLongue: [
      "Pour cette entreprise de maçonnerie moderne à Roanne, l’objectif était de marquer les esprits avec une expérience utilisateur inédite dans le secteur du bâtiment. Nous avons conçu un site vitrine haut de gamme basé sur une animation interactive au scroll : en arrivant sur la page, le visiteur voit une maison contemporaine se construire étape par étape sous ses yeux, des fondations jusqu'à la livraison finale. Cette approche visuelle unique valorise la rigueur technique de l'artisan, installe une confiance immédiate et guide de manière captivante l'utilisateur vers la demande de devis gratuit.",
    ],
    imageSrc: projet04,
    imageAlt: "Page d'accueil du site d'une entreprise de maçonnerie à Roanne",
    projectUrl: "https://macon-modern.vercel.app/",
  },
  // {
  //   title: "Atelier Vernay",
  //   category: "Menuiserie sur-mesure — Mably",
  //   description:
  //     "Un portfolio d'artisan pensé comme un catalogue d'ouvrages : chaque chantier présenté avant/après, demande de devis en trois champs, et un référencement local qui sort désormais sur « menuisier Roanne ».",
  //   // TODO: rédiger la description longue définitive
  //   descriptionLongue: [
  //     "L'Atelier Vernay conçoit du mobilier et des agencements sur-mesure à Mably. Escaliers, bibliothèques, cuisines : des chantiers longs, dont le résultat se comprend surtout quand on voit l'état des lieux avant travaux.",
  //     "Le menuisier recevait des demandes trop vagues pour être chiffrées, et perdait du temps en visites qui n'aboutissaient pas. À l'inverse, il n'apparaissait sur aucune recherche locale : taper « menuisier Roanne » ne menait jamais à lui.",
  //     "Chaque chantier est présenté en avant/après, ce qui rend l'ampleur du travail immédiatement lisible sans avoir à l'expliquer. La demande de devis a été réduite à trois champs, avec une question ouverte unique. Le référencement local a été travaillé sur les termes réellement tapés par ses clients, pas sur le vocabulaire du métier.",
  //     "L'atelier ressort désormais sur ses principales requêtes locales, et les demandes reçues sont assez précises pour être chiffrées sans déplacement préalable.",
  //   ],
  //   imageSrc: projet05,
  //   imageAlt:
  //     "Page portfolio du site de l'Atelier Vernay, menuiserie sur-mesure à Mably",
  //   projectUrl: "#", // TODO: URL réelle du projet
  // },
  // {
  //   title: "Garage Perrin",
  //   category: "Mécanique & carrosserie — Roanne",
  //   description:
  //     "Un site utilitaire avant tout : prestations et tarifs d’entretien lisibles d’un coup d’œil, prise de rendez-vous par formulaire, et un temps de chargement divisé par six après refonte.",
  //   // TODO: rédiger la description longue définitive
  //   descriptionLongue: [
  //     "Le Garage Perrin assure mécanique et carrosserie à Roanne. Il disposait déjà d'un site, construit une dizaine d'années plus tôt, devenu illisible sur téléphone et si lent qu'une partie des visiteurs repartait avant l'affichage.",
  //     "Le sujet n'était pas l'image mais l'usage. Un automobiliste qui cherche un garage veut trois choses : savoir si la prestation est assurée, à quel prix approximatif, et comment prendre rendez-vous. L'ancien site enterrait ces trois réponses sous une présentation de l'entreprise.",
  //     "La refonte a inversé la hiérarchie : prestations et fourchettes tarifaires d'entretien arrivent en premier, lisibles d'un coup d'œil et sans tableau à faire défiler horizontalement. La prise de rendez-vous passe par un formulaire court. Les anciennes adresses ont été redirigées une à une pour ne pas perdre le positionnement acquis.",
  //     "Le temps de chargement a été divisé par six. Le garage a conservé ses positions dans les résultats de recherche malgré le changement complet de structure, ce qui était la principale crainte du client.",
  //   ],
  //   imageSrc: projet06,
  //   imageAlt:
  //     "Page des prestations du site du Garage Perrin, mécanique et carrosserie à Roanne",
  //   projectUrl: "#", // TODO: URL réelle du projet
  // },
];
