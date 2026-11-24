import { AdminProcedure } from '../types';

export const ADMINISTRATIVE_PROCEDURES: AdminProcedure[] = [
  {
    id: 'anmeldung-buergeramt',
    title: 'Déclaration de domicile (Anmeldung)',
    germanTitle: 'Anmeldung einer Wohnung beim Bürgeramt',
    category: 'priority_arrival',
    applicableStatuses: ['au_pair', 'fsj_bfd', 'ausbildung', 'studium', 'autre'],
    legalDeadline: '14 jours calendaires après l’emménagement',
    legalBasis: '§ 17 BMG (Bundesmeldegesetz)',
    verifiedDate: 'Novembre 2026',
    officialSourceName: 'Bundesministerium des Innern und für Heimat (BMI)',
    officialSourceUrl: 'https://verwaltung.bund.de/leistungsverzeichnis/FR/leistung/99115004015000',
    importance: 'critical',
    shortSummary: 'La démarche la plus urgente en Allemagne. Sans Anmeldung, impossible d’ouvrir un compte bancaire classique, d’obtenir son identifiant fiscal ou de finaliser son titre de séjour.',
    requiredDocuments: [
      'Passeport valide avec visa d’entrée',
      'Wohnungsgeberbestätigung (attestation de votre logeur, propriétaire ou famille d’accueil - Formulaire légal signé)',
      'Formulaire d’Anmeldung rempli et signé (Anmeldeformular)',
      'Contrat au-pair ou attestation d’engagement FSJ (recommandé en complément)'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Obtenir la Wohnungsgeberbestätigung',
        description: 'Demandez impérativement à votre famille d’accueil ou propriétaire de remplir et signer ce document officiel attestant votre date d’emménagement.',
        germanTerms: ['Wohnungsgeberbestätigung', 'Vermieter', 'Einzugsdatum'],
        tips: 'Attention : un simple contrat de bail ou un accord oral ne suffit pas. Le document spécifique est obligatoire par la loi fédérale § 19 BMG.'
      },
      {
        stepNumber: 2,
        title: 'Prendre rendez-vous au Bürgeramt / Bürgerbüro',
        description: 'Connectez-vous sur le site de la mairie de votre ville (ex: service.berlin.de ou muenchen.de). Prenez le créneau "Anmeldung einer Wohnung".',
        germanTerms: ['Termin buchen', 'Bürgeramt', 'Bürgerbüro'],
        tips: 'Dans les grandes métropoles (Berlin, Munich, Francfort), les créneaux partent vite : regardez tôt le matin (vers 7h30 - 8h) pour les annulations du jour.'
      },
      {
        stepNumber: 3,
        title: 'Se présenter et récupérer la Meldebestätigung',
        description: 'Le jour J, l’agent enregistre votre adresse et vous remet immédiatement l’attestation officielle (Meldebestätigung).',
        germanTerms: ['Meldebestätigung', 'Amtliche Bescheinigung'],
        tips: 'Conservez ce document précieusement : faites-en 3 copies papier et une photo dans votre téléphone.'
      }
    ],
    commonPitfalls: [
      'Attendre plus de 14 jours : théoriquement passible d’une amende jusqu’à 1 000 € (bien que souvent avec un avertissement bienveillant pour les nouveaux arrivants).',
      'Confondre le contrat de bail (Mietvertrag) et la Wohnungsgeberbestätigung.',
      'Ne pas mettre son nom sur la boîte aux lettres dès le premier jour : en Allemagne, si le facteur ne voit pas votre nom exact, les courriers administratifs repartent immédiatement à l’expéditeur.'
    ],
    financialCost: 'Gratuit (dans 95% des mairies allemandes, rarement 10 à 12 € dans quelques communes)'
  },
  {
    id: 'girokonto-bank',
    title: 'Ouverture du compte bancaire (Girokonto)',
    germanTitle: 'Eröffnung eines Girokontos mit deutscher IBAN',
    category: 'banking_money',
    applicableStatuses: ['au_pair', 'fsj_bfd', 'ausbildung', 'studium', 'autre'],
    legalDeadline: 'Dès l’obtention de la Meldebestätigung',
    legalBasis: '§ 31 ZKG (Zahlungskontengesetz / Droit au compte de base)',
    verifiedDate: 'Novembre 2026',
    officialSourceName: 'BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht)',
    officialSourceUrl: 'https://www.bafin.de/DE/Verbraucher/Finanzwissen/Bank/Basiskonto/basiskonto_node.html',
    importance: 'critical',
    shortSummary: 'Nécessaire pour recevoir son argent de poche mensuel (Au-Pair 280 € min.), ses indemnités FSJ/BFD ou sa rémunération d’Ausbildung, et payer son forfait.',
    requiredDocuments: [
      'Passeport valide',
      'Meldebestätigung (attestation de domicile délivrée par le Bürgeramt)',
      'Identifiant fiscal allemand (Steuer-ID) si déjà reçu par courrier',
      'Contrat de volontariat ou convention Au-pair'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Choisir le type de banque',
        description: 'Banque en ligne mobile (N26, Revolut DE, DKB) avec vérification vidéo immédiate en français/anglais, ou banque traditionnelle avec agence physique (Sparkasse, Deutsche Bank, Commerzbank).',
        germanTerms: ['Direktbank', 'Filialbank', 'Girokonto'],
        tips: 'Pour les jeunes au pair et étudiants, les comptes en ligne N26 ou Revolut (avec IBAN DE) s’ouvrent en 15 minutes sur smartphone sans frais de tenue de compte.'
      },
      {
        stepNumber: 2,
        title: 'Vérification d’identité (VideoIdent ou PostIdent)',
        description: 'Vérification de sécurité obligatoire par caméra avec un agent ou dans un bureau de poste de la Deutsche Post.',
        germanTerms: ['VideoIdent', 'PostIdent-Verfahren'],
        tips: 'Assurez-vous d’avoir un bon éclairage et votre passeport original en main (la carte d’identité nationale de certains pays tiers peut ne pas être acceptée sans puce biométrique).'
      },
      {
        stepNumber: 3,
        title: 'Transmettre votre IBAN allemand',
        description: 'Donnez votre nouveau relevé d’identité bancaire (DE...) à votre organisme de tutelle (famille d’accueil, association FSJ ou employeur).',
        germanTerms: ['Bankverbindung', 'Kontonummer', 'Taschengeldüberweisung']
      }
    ],
    commonPitfalls: [
      'Conserver uniquement un compte bancaire étranger : de nombreux organismes et employeurs allemands exigent un IBAN allemand (DE...) pour la comptabilité.',
      'Ignorer les frais de tenue de compte après 27 ans dans certaines banques traditionnelles.'
    ],
    financialCost: '0 € (gratuit pour les jeunes et étudiants dans la plupart des banques)'
  },
  {
    id: 'krankenversicherung',
    title: 'Assurance maladie & Carte de santé (eGK)',
    germanTitle: 'Krankenversicherungspflicht & Elektronische Gesundheitskarte',
    category: 'health_insurance',
    applicableStatuses: ['au_pair', 'fsj_bfd', 'ausbildung', 'studium', 'autre'],
    legalDeadline: 'Dès le 1er jour sur le territoire allemand',
    legalBasis: '§ 193 Abs. 3 VVG (Versicherungsvertragsgesetz)',
    verifiedDate: 'Novembre 2026',
    officialSourceName: 'Bundesgesundheitsministerium (BMG)',
    officialSourceUrl: 'https://www.bundesgesundheitsministerium.de/themen/krankenversicherung.html',
    importance: 'critical',
    shortSummary: 'L’assurance maladie est strictement obligatoire en Allemagne. Le statut dépend de votre programme (régime légal GKV ou contrat privé au pair pris en charge).',
    requiredDocuments: [
      'Passeport et visa',
      'Contrat Au-Pair (la famille paie légalement l’assurance spécifique)',
      'OU contrat d’engagement FSJ (l’organisme payeur verse les cotisations)',
      'Photo d’identité conforme pour la carte de santé avec puce (eGK)'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Vérifier la prise en charge selon votre statut',
        description: 'Au-Pair : Votre famille d’accueil doit obligatoirement souscrire et payer une assurance maladie, accident et responsabilité civile (ex: Care Concept, Dr. Walter). FSJ/Ausbildung : Vous êtes affilié au régime public (TK, AOK, Barmer).',
        germanTerms: ['Gesetzliche Krankenversicherung (GKV)', 'Private Krankenversicherung (PKV)', 'Gastfamilie'],
        tips: 'Règle d’or Au-Pair : Ne payez jamais vous-même votre assurance santé ! La convention fédérale impose que la famille d’accueil en assume la totalité du coût.'
      },
      {
        stepNumber: 2,
        title: 'Transmettre sa photo pour la carte eGK',
        description: 'Téléchargez une photo de face sur le portail en ligne de votre caisse de santé pour recevoir la carte plastifiée.',
        germanTerms: ['Elektronische Gesundheitskarte (eGK)', 'Versicherungsnummer'],
        tips: 'En attendant la carte physique, demandez une "Mitgliedsbescheinigung" (attestation provisoire) en PDF pour aller chez le médecin sans attendre.'
      }
    ],
    commonPitfalls: [
      'Avancer des frais de santé sans garder les ordonnances (Rezepte) et factures (Rechnungen).',
      'Ne pas savoir qui est son "Hausarzt" (médecin traitant généraliste) dans son quartier en cas de grippe ou urgence.'
    ],
    financialCost: '0 € pour l’Au-Pair (100% payé par la famille) ; cotisations automatiques partagées employeur/salarié pour FSJ/Ausbildung'
  },
  {
    id: 'rundfunkbeitrag-ard-zdf',
    title: 'Redevance audiovisuelle (Rundfunkbeitrag ARD/ZDF)',
    germanTitle: 'Rundfunkbeitrag — Beitragsservice von ARD, ZDF und Deutschlandradio',
    category: 'housing_living',
    applicableStatuses: ['au_pair', 'fsj_bfd', 'ausbildung', 'studium', 'autre'],
    legalDeadline: 'Dans le mois suivant la réception de la première lettre',
    legalBasis: 'Rundfunkbeitragsstaatsvertrag (RBStV)',
    verifiedDate: 'Novembre 2026',
    officialSourceName: 'ARD ZDF Deutschlandradio Beitragsservice',
    officialSourceUrl: 'https://www.rundfunkbeitrag.de',
    importance: 'high',
    shortSummary: 'Le piège n°1 de tous les arrivants en Allemagne ! Une lettre arrive automatiquement après votre Anmeldung. La taxe est de 18,36 €/mois PAR LOGEMENT, et non par personne.',
    requiredDocuments: [
      'Courrier reçu d’ARD ZDF avec votre numéro d’identification (Aktenzeichen)',
      'Le numéro de contribution (Beitragsnummer) du titulaire du foyer (famille d’accueil, propriétaire ou colocataire qui paie déjà)'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Ne pas ignorer la lettre',
        description: 'Le fisc audiovisuel allemand reçoit automatiquement vos données du Bürgeramt. Même si vous n’avez ni téléviseur ni radio, la taxe s’applique au logement.',
        germanTerms: ['Beitragsservice', 'Aktenzeichen', 'Wohnung'],
        tips: 'Ne jetez jamais ce courrier : les relances s’accumulent avec des pénalités.'
      },
      {
        stepNumber: 2,
        title: 'Si vous êtes Au-Pair ou en Colocation : Se rattacher !',
        description: 'Demandez à votre famille d’accueil ou colocataire son "Beitragsnummer". Allez sur rundfunkbeitrag.de et indiquez que la taxe est déjà payée pour ce logement.',
        germanTerms: ['Zahlung durch Mitbewohner', 'Beitragsnummer'],
        tips: 'Vous ne payerez alors STRICTEMENT RIEN (0 €). C’est une simple formalité de rattachement informatique.'
      },
      {
        stepNumber: 3,
        title: 'Si vous vivez seul dans un studio étudiant',
        description: 'Vous devez alors déclarer le logement et choisir le mode de prélèvement trimestriel (SEPA-Lastschrift).',
        germanTerms: ['SEPA-Lastschriftmandat', 'Vierteljährlich']
      }
    ],
    commonPitfalls: [
      'Payer une seconde fois alors que la famille d’accueil paye déjà pour toute la maison !',
      'Ignorer les relances en pensant que c’est une arnaque : il s’agit d’un organisme officiel avec pouvoirs de recouvrement public.'
    ],
    financialCost: '18,36 € / mois par logement (GRATUIT si déjà payé par la famille d’accueil ou un colocataire)'
  },
  {
    id: 'aufenthaltstitel-auslaenderbehorde',
    title: 'Titre de séjour & Visum (Ausländerbehörde)',
    germanTitle: 'Beantragung / Verlängerung des Aufenthaltstitels',
    category: 'legal_stay',
    applicableStatuses: ['au_pair', 'fsj_bfd', 'ausbildung', 'studium', 'autre'],
    legalDeadline: 'Prendre rendez-vous 6 à 8 semaines avant la fin du visa initial (D-Visum)',
    legalBasis: '§ 18, § 19e, § 16b AufenthG (Aufenthaltsgesetz)',
    verifiedDate: 'Novembre 2026',
    officialSourceName: 'Bundesamt für Migration und Flüchtlinge (BAMF)',
    officialSourceUrl: 'https://www.bamf.de/DE/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/zuwandererdrittstaaten-node.html',
    importance: 'critical',
    shortSummary: 'Les ressortissants hors Union européenne (comme Madagascar) entrent avec un visa national D de 3 ou 6 mois qui doit être converti en carte de séjour électronique (eAT).',
    requiredDocuments: [
      'Passeport avec visa D',
      'Meldebestätigung récente',
      'Contrat complet (Au-Pair signé, convention FSJ ou inscription universitaire Immatrikulationsbescheinigung)',
      'Preuve de moyens financiers (Sperrkonto ou attestation de prise en charge Verpflichtungserklärung)',
      'Preuve d’assurance maladie',
      '1 photo d’identité biométrique récente',
      'Formulaire de demande de titre de séjour complété'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Anticiper la prise de rendez-vous',
        description: 'L’Ausländerbehörde (ou LEA à Berlin, KVR à Munich) a souvent de longs délais d’attente. Faites la demande dès vos premières semaines.',
        germanTerms: ['Aufenthaltstitel', 'Elektronischer Aufenthaltstitel (eAT)', 'Vorsprache'],
        tips: 'Si votre visa expire avant le jour du rendez-vous officiel, demandez une "Fiktionsbescheinigung" qui prolonge légalement vos droits sur le territoire.'
      },
      {
        stepNumber: 2,
        title: 'Prise des empreintes et remise du dossier',
        description: 'Lors du rendez-vous, un agent vérifie les originaux et prend vos empreintes digitales.',
        germanTerms: ['Fingerabdrücke', 'Bearbeitungsgebühr']
      },
      {
        stepNumber: 3,
        title: 'Réception du code PIN et retrait de la carte eAT',
        description: 'Quelques semaines plus tard, vous recevez une lettre PIN par la poste, puis retirez votre carte de séjour plastifiée.',
        germanTerms: ['PIN-Brief', 'Abholung']
      }
    ],
    commonPitfalls: [
      'Attendre la dernière semaine du visa pour chercher un rendez-vous.',
      'Voyager hors de l’espace Schengen pendant la transition sans document de prolongation officiel.'
    ],
    financialCost: 'Environ 100 € (souvent réduit à 50 € pour les volontaires FSJ/BFD sur justificatif ou pris en charge selon convention)'
  },
  {
    id: 'steuer-id-finanzamt',
    title: 'Numéro d’identification fiscale (Steuer-ID)',
    germanTitle: 'Steuerliche Identifikationsnummer (IdNr)',
    category: 'banking_money',
    applicableStatuses: ['au_pair', 'fsj_bfd', 'ausbildung', 'studium', 'autre'],
    legalDeadline: 'Automatique par courrier sous 2 à 4 semaines après l’Anmeldung',
    legalBasis: '§ 139b AO (Abgabenordnung)',
    verifiedDate: 'Novembre 2026',
    officialSourceName: 'Bundeszentralamt für Steuern (BZSt)',
    officialSourceUrl: 'https://www.bzst.de/DE/Privatpersonen/SteuerlicheIdentifikationsnummer/steuerlicheidentifikationsnummer_node.html',
    importance: 'high',
    shortSummary: 'Un numéro à 11 chiffres unique et attribué à vie. Indispensable pour votre employeur ou organisme payeur, ainsi que pour votre banque allemande.',
    requiredDocuments: [
      'Aucun document à soumettre : déclenché automatiquement par la mairie lors de l’Anmeldung'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Surveiller sa boîte aux lettres',
        description: 'Une lettre officielle du Bundeszentralamt für Steuern arrive à votre nom environ 15 à 20 jours après votre inscription en mairie.',
        germanTerms: ['Steueridentifikationsnummer', 'Briefkasten'],
        tips: 'Vérifiez impérativement que votre nom et prénom figurent lisiblement sur votre boîte aux lettres !'
      },
      {
        stepNumber: 2,
        title: 'Transmettre le numéro',
        description: 'Fournissez ce numéro à votre banque (obligatoire pour la conformité fiscale) et à votre employeur / structure FSJ.',
        germanTerms: ['Arbeitgeber', 'Lohnsteuerabzug'],
        tips: 'Pour les Au-Pairs : Le "Taschengeld" (argent de poche) n’est pas un salaire soumis à l’impôt sur le revenu allemand, mais la banque a tout de même besoin de votre Steuer-ID.'
      }
    ],
    commonPitfalls: [
      'Si vous n’avez rien reçu après 6 semaines : vous pouvez demander un renvoi gratuit en ligne sur le portail bzst.de.'
    ],
    financialCost: 'Entièrement gratuit'
  },
  {
    id: 'deutschlandticket-mobilite',
    title: 'Transports en commun & Deutschlandticket',
    germanTitle: 'Deutschlandticket (49 € / mois) & Öffentlicher Nahverkehr (ÖPNV)',
    category: 'daily_essentials',
    applicableStatuses: ['au_pair', 'fsj_bfd', 'ausbildung', 'studium', 'autre'],
    legalDeadline: 'Dès l’arrivée pour circuler librement',
    legalBasis: 'Règlementation fédérale des transports ÖPNV',
    verifiedDate: 'Novembre 2026',
    officialSourceName: 'Deutsche Bahn & VDV (Verband Deutscher Verkehrsunternehmen)',
    officialSourceUrl: 'https://www.bahn.de/angebot/regio/deutschland-ticket',
    importance: 'high',
    shortSummary: 'Permet de voyager en illimité dans tous les métros (U-Bahn), trains de banlieue (S-Bahn), trams, bus et trains régionaux (RB/RE) de toute l’Allemagne !',
    requiredDocuments: [
      'Compte bancaire (IBAN) ou carte de paiement',
      'Smartphone avec l’application de transport (ex: DB Navigator, BVG, MVV)',
      'Pour les étudiants/volontaires : justificatif de statut pour tarif réduit si proposé par le Land'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Souscrire l’abonnement mensuel',
        description: 'Téléchargez l’application officielle DB Navigator ou celle de votre réseau urbain local.',
        germanTerms: ['Deutschlandticket', 'Abo', 'Nahverkehr'],
        tips: 'Attention : Il s’agit d’un abonnement à reconduction tacite. Si vous devez l’arrêter, résiliez avant le 10 du mois en cours.'
      },
      {
        stepNumber: 2,
        title: 'Comprendre où le ticket est valable',
        description: 'Valable sur TOUS les transports régionaux et urbains de TOUTE l’Allemagne. Non valable uniquement sur les trains à grande vitesse (ICE, IC, EC) et Flixbus/Flixtrain.',
        germanTerms: ['Regionalexpress (RE)', 'Regionalbahn (RB)', 'Fernverkehr ausgeschlossen']
      }
    ],
    commonPitfalls: [
      'Monter dans un train blanc ICE ou IC avec le Deutschlandticket : vous risquez une surtaxe immédiate et une amende de 60 €.',
      'Prendre les transports sans ticket validé : les contrôleurs en civil sont très fréquents en Allemagne et aucune négociation n’est possible.'
    ],
    financialCost: '49 € / mois (souvent 29 € ou réduit pour les apprentis, volontaires FSJ et étudiants selon les Länder)'
  },
  {
    id: 'droits-garanties-au-pair',
    title: 'Charte des droits & garanties Au-Pair',
    germanTitle: 'Rechte und Pflichten als Au-Pair in Deutschland',
    category: 'daily_essentials',
    applicableStatuses: ['au_pair'],
    legalDeadline: 'À vérifier dès la signature du contrat et au quotidien',
    legalBasis: 'Directives fédérales de la Bundesagentur für Arbeit (BA)',
    verifiedDate: 'Novembre 2026',
    officialSourceName: 'Bundesagentur für Arbeit',
    officialSourceUrl: 'https://www.arbeitsagentur.de/datei/au-pair-in-germany-en_ba014418.pdf',
    importance: 'critical',
    shortSummary: 'En tant qu’Au-Pair en Allemagne, vous êtes protégée par la loi fédérale. Vous n’êtes pas une employée de ménage à plein temps mais un membre temporaire de la famille.',
    requiredDocuments: [
      'Contrat officiel Au-Pair type RAL ou Gütegemeinschaft',
      'Tableau des horaires hebdomadaires tenu à jour'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Horaires stricts : Maximum 30 heures par semaine',
        description: 'Votre temps d’aide (garde d’enfants + légères tâches ménagères liées aux enfants) ne doit JAMAIS dépasser 6 heures par jour et 30 heures par semaine au total (baby-sitting du soir inclus).',
        germanTerms: ['Arbeitszeit', '30 Stunden pro Woche', 'Kinderbetreuung']
      },
      {
        stepNumber: 2,
        title: 'Argent de poche légal : 280 € nets par mois',
        description: 'La famille d’accueil doit vous verser au minimum 280 € par mois d’argent de poche, même pendant vos congés payés ou si vous êtes malade.',
        germanTerms: ['Taschengeld (mind. 280 €)', 'Krankheitstage', 'Urlaubsanspruch']
      },
      {
        stepNumber: 3,
        title: 'Participation obligatoire aux cours d’allemand : 70 € / mois',
        description: 'En plus du Taschengeld, la famille DOIT légalement verser 70 € par mois d’aide financière pour vos cours de langue (Sprachkurs).',
        germanTerms: ['Sprachkurszuschuss (70 €)', 'Sprachschule']
      },
      {
        stepNumber: 4,
        title: 'Repos et congés payés',
        description: 'Vous avez droit à au moins 1,5 jour de repos consécutif par semaine (dont au moins un dimanche complet par mois) et 4 semaines de congés payés pour une année complète (2 jours ouvrés par mois).',
        germanTerms: ['Freizeit', 'Ruhetag', 'Urlaub']
      }
    ],
    commonPitfalls: [
      'Accepter d’effectuer des gros travaux ménagers (repeindre, laver les vitres de toute la maison, jardinage intensif) : c’est strictement interdit par la réglementation au pair.',
      'Rester isolée en cas de conflit avec la famille : contactez immédiatement votre agence de placement ou les numéros d’urgence ARIA / Au-pair Hotline.'
    ],
    financialCost: 'Vous ne payez rien. La famille assume logement, nourriture, assurance et abonnement transport local.'
  }
];
