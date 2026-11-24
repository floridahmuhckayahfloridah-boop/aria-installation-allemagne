import { GermanModule } from '../types';

export const GERMAN_CURRICULUM: GermanModule[] = [
  {
    id: 'a1-mod-1',
    level: 'A1',
    moduleNumber: 1,
    title: 'Arrivée dans la famille ou en colocation',
    theme: 'Premiers échanges et salutations',
    situation: 'Tu viens de poser tes valises. La maman d’accueil ou ton colocataire t’accueille chaleureusement dans le hall d’entrée.',
    grammarFocus: 'Les salutations, le tutoiement (Du) vs vouvoiement (Sie), le verbe "heißen" et "kommen".',
    dialogue: [
      {
        speaker: 'Gastmutter (Katja)',
        avatarColor: 'bg-emerald-600',
        de: 'Hallo! Herzlich willkommen in Deutschland! Wie war deine Reise?',
        fr: 'Bonjour ! Bienvenue chaleureuse en Allemagne ! Comment s’est passé ton voyage ?',
        phonetic: 'Ha-lo ! Herts-lich vil-ko-men in Doïtch-land ! Vi var daï-ne Raï-ze ?'
      },
      {
        speaker: 'Toi (Arrivant)',
        avatarColor: 'bg-teal-600',
        de: 'Guten Tag Katja! Danke sehr. Die Reise war gut, aber ich bin ein bisschen müde.',
        fr: 'Bonjour Katja ! Merci beaucoup. Le voyage s’est bien passé, mais je suis un peu fatigué(e).',
        phonetic: 'Gou-ten Tak Kat-ya ! Dan-ke zér. Di Raï-ze var gout, a-ber ich bin aïn biss-chen miu-de.'
      },
      {
        speaker: 'Gastmutter (Katja)',
        avatarColor: 'bg-emerald-600',
        de: 'Das verstehe ich! Komm erst mal rein. Möchtest du ein Glas Wasser oder einen Tee?',
        fr: 'Je comprends tout à fait ! Entre d’abord. Voudrais-tu un verre d’eau ou un thé ?',
        phonetic: 'Das fer-chte-he ich ! Kom erst mal raïn. Meuch-test dou aïn Glas Vas-ser o-der aï-nen Té ?'
      },
      {
        speaker: 'Toi (Arrivant)',
        avatarColor: 'bg-teal-600',
        de: 'Sehr gerne, ein Glas Wasser bitte! Vielen Dank für die herzliche Aufnahme.',
        fr: 'Très volontiers, un verre d’eau s’il vous plaît ! Merci mille fois pour votre accueil chaleureux.',
        phonetic: 'Zér guer-ne, aïn Glas Vas-ser bi-te ! Fi-len Dank fiur di herts-li-che Auf-na-me.'
      }
    ],
    vocabulary: [
      { de: 'Herzlich willkommen', fr: 'Bienvenue chaleureuse', exampleDe: 'Herzlich willkommen bei uns!', exampleFr: 'Bienvenue chez nous !' },
      { de: 'die Reise', article: 'die', fr: 'le voyage', exampleDe: 'Gute Reise!', exampleFr: 'Bon voyage !' },
      { de: 'müde', fr: 'fatigué(e)', exampleDe: 'Ich bin sehr müde.', exampleFr: 'Je suis très fatigué(e).' },
      { de: 'bitte', fr: 's’il te / vous plaît (ou de rien)', exampleDe: 'Ein Glas Wasser, bitte.', exampleFr: 'Un verre d’eau, s’il vous plaît.' },
      { de: 'danke sehr / vielen Dank', fr: 'merci beaucoup / mille mercis', exampleDe: 'Vielen Dank für deine Hilfe.', exampleFr: 'Mille mercis pour ton aide.' },
      { de: 'das Zimmer', article: 'das', fr: 'la chambre', exampleDe: 'Hier ist dein Zimmer.', exampleFr: 'Voici ta chambre.' }
    ],
    speakingPrompts: [
      { phraseDe: 'Ich freue mich, hier zu sein!', phraseFr: 'Je suis ravi(e) d’être ici !', tip: 'Prononce bien le son "ch" doux comme un souffle léger contre le palais.' },
      { phraseDe: 'Können Sie das bitte wiederholen?', phraseFr: 'Pouvez-vous répéter cela s’il vous plaît ?', tip: 'La phrase de survie essentielle quand quelqu’un parle trop vite !' }
    ],
    quiz: [
      {
        question: 'Comment dit-on poliment "Pouvez-vous répéter s’il vous plaît ?" en allemand ?',
        options: ['Guten Appetit!', 'Können Sie das bitte wiederholen?', 'Ich habe keine Zeit.', 'Auf Wiedersehen!'],
        correctIndex: 1,
        explanation: '"Können Sie das bitte wiederholen?" est la formule polie indispensable pour demander de répéter.'
      },
      {
        question: 'Quelle est la réponse la plus polie si votre hôte vous propose une boisson ?',
        options: ['Sehr gerne, danke!', 'Nein, niemals!', 'Ich weiß nicht.', 'Später vielleicht.'],
        correctIndex: 0,
        explanation: '"Sehr gerne, danke!" signifie "Très volontiers, merci !".'
      }
    ]
  },
  {
    id: 'a1-mod-2',
    level: 'A1',
    moduleNumber: 2,
    title: 'Faire ses courses au supermarché',
    theme: 'Alimentation, pesée et passage en caisse',
    situation: 'Tu es chez ALDI ou REWE. Tu cherches un produit et tu dois passer rapidement tes articles à la caisse.',
    grammarFocus: 'Les prix en euros, les formules de politesse en caisse, le verbe "suchen" et "kosten".',
    dialogue: [
      {
        speaker: 'Toi (Client)',
        avatarColor: 'bg-teal-600',
        de: 'Entschuldigung, wo finde ich die Milch und den Reis bitte?',
        fr: 'Excusez-moi, où puis-je trouver le lait et le riz s’il vous plaît ?',
        phonetic: 'Ent-chul-di-goung, vo fin-de ich di Milch ound den Raïs bi-te ?'
      },
      {
        speaker: 'Mitarbeiter (Employé)',
        avatarColor: 'bg-amber-600',
        de: 'Die Milch ist in Gang drei und der Reis ganz hinten rechts.',
        fr: 'Le lait est dans l’allée trois et le riz tout au fond à droite.',
        phonetic: 'Di Milch ist in Gang draï ound der Raïs gants hin-ten rechts.'
      },
      {
        speaker: 'Kassiererin (Caissière)',
        avatarColor: 'bg-emerald-600',
        de: 'Hallo! Brauchen Sie den Kassenbon? Zahlen Sie bar oder mit Karte?',
        fr: 'Bonjour ! Avez-vous besoin du ticket de caisse ? Payez-vous en liquide ou par carte ?',
        phonetic: 'Ha-lo ! Braou-chen Zi den Kas-sen-bon ? Tsa-len Zi bar o-der mit Kar-te ?'
      },
      {
        speaker: 'Toi (Client)',
        avatarColor: 'bg-teal-600',
        de: 'Mit Karte bitte. Und ja, den Bon nehme ich gerne mit. Einen schönen Tag noch!',
        fr: 'Par carte s’il vous plaît. Et oui, je prends volontiers le ticket. Bonne journée à vous !',
        phonetic: 'Mit Kar-te bi-te. Ound ya, den Bon né-me ich guer-ne mit. Aï-nen cheu-nen Tak noch !'
      }
    ],
    vocabulary: [
      { de: 'der Kassenbon / die Quittung', article: 'der', fr: 'le ticket de caisse', exampleDe: 'Brauchen Sie den Kassenbon?', exampleFr: 'Avez-vous besoin du reçu ?' },
      { de: 'bar zahlen', fr: 'payer en liquide', exampleDe: 'Ich möchte bar zahlen.', exampleFr: 'J’aimerais payer en liquide.' },
      { de: 'mit Karte zahlen', fr: 'payer par carte bancaire', exampleDe: 'Geht das mit Karte?', exampleFr: 'Est-ce possible par carte ?' },
      { de: 'die Pfandflasche', article: 'die', fr: 'la bouteille consignée', exampleDe: 'Wo ist der Pfandautomat?', exampleFr: 'Où se trouve la machine à consigne ?' },
      { de: 'die Tüte', article: 'die', fr: 'le sachet / cabas', exampleDe: 'Brauchen Sie eine Tüte?', exampleFr: 'Avez-vous besoin d’un sac ?' }
    ],
    speakingPrompts: [
      { phraseDe: 'Zahlen Sie bar oder mit Karte?', phraseFr: 'Payez-vous en liquide ou par carte ?', tip: 'En Allemagne, on te posera cette question à chaque passage en caisse !' },
      { phraseDe: 'Einen schönen Feierabend!', phraseFr: 'Bonne fin de journée !', tip: 'Expression très appréciée en fin d’après-midi pour saluer les commerçants.' }
    ],
    quiz: [
      {
        question: 'Que signifie "Pfand" sur les bouteilles en plastique ou verre en Allemagne ?',
        options: ['La date de péremption', 'La consigne remboursable (0,25 € ou 0,08 €)', 'Le taux de sucre', 'La marque du supermarché'],
        correctIndex: 1,
        explanation: 'En Allemagne, ne jetez jamais les bouteilles avec le logo Pfand ! Vous récupérez 0,25 € par bouteille dans les automates de supermarché.'
      }
    ]
  },
  {
    id: 'a2-mod-1',
    level: 'A2',
    moduleNumber: 3,
    title: 'Démarches au Bürgeramt : L’Anmeldung',
    theme: 'Administration, guichet et déclaration de domicile',
    situation: 'Tu as rendez-vous à la mairie de quartier. L’agent administratif vérifie tes pièces d’identité et ton formulaire.',
    grammarFocus: 'Vocabulaire administratif, le subjonctif de politesse "Ich hätte gern" et les questions directes.',
    dialogue: [
      {
        speaker: 'Beamter (Agent d’état civil)',
        avatarColor: 'bg-slate-700',
        de: 'Guten Tag, Nummer 42 bitte! Sie möchten sich in Berlin anmelden?',
        fr: 'Bonjour, numéro 42 s’il vous plaît ! Vous souhaitez déclarer votre domicile à Berlin ?',
        phonetic: 'Gou-ten Tak, Noum-mer tsvaï-ound-firtsich bi-te ! Zi meuch-ten zich in Ber-lin an-mel-den ?'
      },
      {
        speaker: 'Toi (Usager)',
        avatarColor: 'bg-teal-600',
        de: 'Guten Tag. Ja genau. Hier sind mein Reisepass und die Wohnungsgeberbestätigung.',
        fr: 'Bonjour. Oui exactement. Voici mon passeport et l’attestation de logement signée.',
        phonetic: 'Gou-ten Tak. Ya gue-naou. Hir zint maïn Raï-ze-pass ound di Voh-nounts-gué-ber-be-chté-ti-goung.'
      },
      {
        speaker: 'Beamter (Agent d’état civil)',
        avatarColor: 'bg-slate-700',
        de: 'Sehr gut, die Unterlagen sind vollständig. Sind Sie Mitglied einer Kirche?',
        fr: 'Très bien, le dossier est complet. Êtes-vous membre d’une église ? (Question sur la taxe ecclésiastique)',
        phonetic: 'Zér gout, di Oun-ter-la-guen zint fol-chten-dich. Zint Zi Mit-glit aï-ner Kir-che ?'
      },
      {
        speaker: 'Toi (Usager)',
        avatarColor: 'bg-teal-600',
        de: 'Nein, ohne Religionszugehörigkeit bitte. Das ist wichtig für die Kirchensteuer.',
        fr: 'Non, sans affiliation religieuse s’il vous plaît. (Important pour ne pas payer l’impôt d’église de 8-9%).',
        phonetic: 'Naïn, oh-ne Re-li-guions-tsou-gue-heu-rich-kaït bi-te.'
      }
    ],
    vocabulary: [
      { de: 'die Wohnungsgeberbestätigung', article: 'die', fr: 'attestation de bailleur obligatoire', exampleDe: 'Haben Sie die Wohnungsgeberbestätigung?', exampleFr: 'Avez-vous l’attestation de votre logeur ?' },
      { de: 'die Meldebestätigung', article: 'die', fr: 'attestation officielle d’enregistrement', exampleDe: 'Hier ist Ihre Meldebestätigung.', exampleFr: 'Voici votre attestation de déclaration de domicile.' },
      { de: 'die Kirchensteuer', article: 'die', fr: 'impôt d’église (8 à 9% du revenu)', exampleDe: 'Möchten Sie Kirchensteuer zahlen?', exampleFr: 'Souhaitez-vous payer l’impôt d’église ?' },
      { de: 'der Reisepass', article: 'der', fr: 'le passeport', exampleDe: 'Gültiger Reisepass.', exampleFr: 'Passeport en cours de validité.' },
      { de: 'vollständig', fr: 'complet / exhaustif', exampleDe: 'Ihre Unterlagen sind vollständig.', exampleFr: 'Vos documents sont au complet.' }
    ],
    speakingPrompts: [
      { phraseDe: 'Ich bin neu in der Stadt und möchte mich anmelden.', phraseFr: 'Je suis nouveau dans la ville et je souhaite m’enregistrer.', tip: 'Parle calmement et présente tes documents dans l’ordre.' }
    ],
    quiz: [
      {
        question: 'Pourquoi l’agent du Bürgeramt demande-t-il si vous appartenez à une église ("Kirchensteuer") ?',
        options: ['Pour vous inviter à la messe', 'Pour prélever légalement l’impôt sur le culte (8 à 9%) sur vos futurs revenus', 'Pour vérifier votre visa', 'C’est une obligation touristique'],
        correctIndex: 1,
        explanation: 'En Allemagne, si vous cochez protestant ou catholique, l’administration prélève automatiquement l’impôt d’église sur votre salaire. Beaucoup de jeunes indiquent "ohne Religionsgemeinschaft" pour éviter cette retenue.'
      }
    ]
  },
  {
    id: 'b1-mod-1',
    level: 'B1',
    moduleNumber: 4,
    title: 'Chez le médecin & Arrêt maladie (Krankmeldung)',
    theme: 'Santé, symptômes et justification auprès de l’organisme',
    situation: 'Tu te réveilles avec de la fièvre et un mal de gorge intense. Tu dois appeler le cabinet médical pour un rendez-vous rapide et obtenir une Krankschreibung.',
    grammarFocus: 'Les verbes de douleur ("wehtun", "leiden an"), les propositions subordonnées avec "weil" et "dass".',
    dialogue: [
      {
        speaker: 'Praxis-Assistentin (Secrétaire médicale)',
        avatarColor: 'bg-rose-700',
        de: 'Praxis Dr. Schmidt, guten Tag. Was kann ich für Sie tun?',
        fr: 'Cabinet Dr Schmidt, bonjour. Que puis-je faire pour vous ?',
        phonetic: 'Prak-sis Dok-tor Chmidt, gou-ten Tak. Vas kan ich fiur Zi toun ?'
      },
      {
        speaker: 'Toi (Patient)',
        avatarColor: 'bg-teal-600',
        de: 'Guten Tag. Ich fühle mich sehr schlecht. Ich habe hohes Fieber und starke Halsschmerzen. Brauche ich heute einen Termin?',
        fr: 'Bonjour. Je me sens très mal. J’ai une forte fièvre et un mal de gorge violent. Puis-je avoir un rendez-vous aujourd’hui ?',
        phonetic: 'Gou-ten Tak. Ich fiu-le mich zér chlecht...'
      },
      {
        speaker: 'Praxis-Assistentin',
        avatarColor: 'bg-rose-700',
        de: 'Kommen Sie bitte in unsere Akutsprechstunde um 11:30 Uhr. Bringen Sie Ihre Gesundheitskarte mit.',
        fr: 'Venez s’il vous plaît à notre consultation sans rendez-vous d’urgence à 11h30. Apportez votre carte de santé.',
        phonetic: 'Kom-men Zi bi-te in oun-ze-re A-kout-chprech-chtoun-de...'
      },
      {
        speaker: 'Toi (Patient)',
        avatarColor: 'bg-teal-600',
        de: 'Vielen Dank. Ich brauche auch eine Arbeitsunfähigkeitsbescheinigung für meine Organisation.',
        fr: 'Merci beaucoup. J’ai aussi besoin d’un certificat d’arrêt maladie pour mon organisme.',
        phonetic: 'Fi-len Dank. Ich braou-che aouch aï-ne Ar-baïts-oun-fe-hich-kaïts-be-chaï-ni-goung...'
      }
    ],
    vocabulary: [
      { de: 'die Akutsprechstunde', article: 'die', fr: 'consultation d’urgence du matin sans rdv', exampleDe: 'Kommen Sie in die Akutsprechstunde.', exampleFr: 'Venez à la consultation d’urgence.' },
      { de: 'die Arbeitsunfähigkeitsbescheinigung (eAU)', article: 'die', fr: 'arrêt maladie officiel', exampleDe: 'Der Arzt stellt die Krankschreibung aus.', exampleFr: 'Le médecin délivre l’arrêt maladie.' },
      { de: 'das Rezept', article: 'das', fr: 'l’ordonnance médicale', exampleDe: 'Ein rotes oder grünes Rezept.', exampleFr: 'Une ordonnance rouge ou verte.' },
      { de: 'die Apotheke', article: 'die', fr: 'la pharmacie', exampleDe: 'Medikamente in der Apotheke holen.', exampleFr: 'Chercher les médicaments en pharmacie.' }
    ],
    speakingPrompts: [
      { phraseDe: 'Mir ist schwindelig und ich habe Schmerzen.', phraseFr: 'J’ai des vertiges et des douleurs.', tip: 'Le médecin allemand écoute précisément la localisation de la douleur.' }
    ],
    quiz: [
      {
        question: 'En Allemagne, comment appelle-t-on le justificatif d’arrêt maladie que vous devez transmettre à votre employeur ou organisme ?',
        options: ['Der Urlaubsantrag', 'Die Arbeitsunfähigkeitsbescheinigung (AU / Krankschreibung)', 'Der Führerschein', 'Der Mietvertrag'],
        correctIndex: 1,
        explanation: 'La Krankschreibung (AU) est obligatoire en cas d’absence pour maladie. De nos jours, elle est même transmise électroniquement (eAU) à la caisse de santé.'
      }
    ]
  },
  {
    id: 'b2-mod-1',
    level: 'B2',
    moduleNumber: 5,
    title: 'Comprendre un contrat & Négociation formelle',
    theme: 'Conditions de travail, avenants et litiges administratifs',
    situation: 'Tu constates que tes heures supplémentaires dépassent le cadre légal prévu par ton contrat et tu sollicites un entretien avec ton référent.',
    grammarFocus: 'Le passif avec verbes de modalité ("muss eingehalten werden"), le subjonctif II ("Ich würde gerne besprechen").',
    dialogue: [
      {
        speaker: 'Betreuer (Tuteur / Coordinateur)',
        avatarColor: 'bg-indigo-700',
        de: 'Guten Tag! Du wolltest über die Einsatzzeiten im Projekt sprechen?',
        fr: 'Bonjour ! Tu souhaitais échanger sur les horaires de mission dans le projet ?',
        phonetic: 'Gou-ten Tak ! Dou vol-test iu-ber di Aïn-zats-tsaï-ten im Pro-yekt chpre-chen ?'
      },
      {
        speaker: 'Toi (Volontaire / Stagiaire)',
        avatarColor: 'bg-teal-600',
        de: 'Ja, danke für den Termin. Laut Vereinbarung sind maximal dreißig Stunden pro Woche vorgesehen. In den letzten zwei Wochen habe ich jedoch vierzig Stunden geleistet.',
        fr: 'Oui, merci pour ce rendez-vous. Selon la convention, un maximum de 30 heures par semaine est prévu. Cependant, lors des deux dernières semaines, j’en ai effectué 40.',
        phonetic: 'Ya, dan-ke fiur den Ter-min. Laout Fer-aïn-ba-roung zint mak-si-mal...'
      },
      {
        speaker: 'Betreuer (Tuteur)',
        avatarColor: 'bg-indigo-700',
        de: 'Vielen Dank für deine Offenheit. Das muss selbstverständlich im Freizeitausgleich kompensiert werden.',
        fr: 'Merci pour ta franchise. Cela doit bien évidemment être compensé par des jours de récupération.',
        phonetic: 'Fi-len Dank fiur daï-ne Of-fen-haït...'
      }
    ],
    vocabulary: [
      { de: 'die Vereinbarung', article: 'die', fr: 'la convention / l’accord contractuel', exampleDe: 'Gemäß unserer Vereinbarung.', exampleFr: 'Conformément à notre convention.' },
      { de: 'der Freizeitausgleich', article: 'der', fr: 'la compensation en temps de repos (récupération)', exampleDe: 'Überstunden als Freizeitausgleich abbauen.', exampleFr: 'Récupérer ses heures supplémentaires en repos.' },
      { de: 'die Frist einhalten', fr: 'respecter le délai légal', exampleDe: 'Wir müssen die gesetzliche Frist einhalten.', exampleFr: 'Nous devons respecter le délai légal.' },
      { de: 'der Kündigungsschutz', article: 'der', fr: 'protection contre le licenciement abusif', exampleDe: 'Rechtlicher Kündigungsschutz.', exampleFr: 'Protection juridique de l’emploi.' }
    ],
    speakingPrompts: [
      { phraseDe: 'Ich möchte gerne einen Kompromiss finden, der beiden Seiten entspricht.', phraseFr: 'J’aimerais trouver un compromis qui convienne aux deux parties.', tip: 'Formulation diplomatique et respectueuse très valorisée dans le monde professionnel allemand.' }
    ],
    quiz: [
      {
        question: 'En Allemagne, que signifie le terme "Freizeitausgleich" ?',
        options: ['Une prime de vacances en espèces', 'Le rattrapage des heures supplémentaires sous forme de jours ou heures de repos', 'Un sport obligatoire', 'Une taxe sur le temps libre'],
        correctIndex: 1,
        explanation: 'Le "Freizeitausgleich" est le droit de compenser les heures travaillées en plus par du repos payé.'
      }
    ]
  }
];
