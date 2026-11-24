import { MapPlace } from '../types';

export interface CityCenter {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  zoom: number;
  description: string;
}

export const GERMAN_CITIES: CityCenter[] = [
  { id: 'berlin', name: 'Berlin', state: 'Berlin', lat: 52.5200, lng: 13.4050, zoom: 12, description: 'Capitale, pôle multiculturel et diplomatique' },
  { id: 'munich', name: 'München (Munich)', state: 'Bavière', lat: 48.1351, lng: 11.5820, zoom: 12, description: 'Bavière, grand pôle universitaire et économique' },
  { id: 'frankfurt', name: 'Frankfurt am Main', state: 'Hesse', lat: 50.1109, lng: 8.6821, zoom: 12, description: 'Hesse, carrefour des transports et de la finance' },
  { id: 'hamburg', name: 'Hamburg', state: 'Hambourg', lat: 53.5511, lng: 9.9937, zoom: 12, description: 'Ville hanséatique au nord, port majeur' },
  { id: 'cologne', name: 'Köln (Cologne)', state: 'Rhénanie-du-Nord-Westphalie', lat: 50.9375, lng: 6.9603, zoom: 12, description: 'Métropole rhénane, ambiance chaleureuse et festive' },
  { id: 'stuttgart', name: 'Stuttgart', state: 'Bade-Wurtemberg', lat: 48.7758, lng: 9.1829, zoom: 12, description: 'Sud-ouest, région industrielle et dynamique' },
  { id: 'leipzig', name: 'Leipzig', state: 'Saxe', lat: 51.3397, lng: 12.3731, zoom: 12, description: 'Est de l’Allemagne, ville culturelle et étudiante abordable' },
];

export const MAP_PLACES: MapPlace[] = [
  // BERLIN
  {
    id: 'berlin-buergeramt-mitte',
    name: 'Bürgeramt Mitte (Karl-Marx-Allee)',
    germanName: 'Bürgeramt Mitte',
    category: 'administration',
    city: 'Berlin',
    lat: 52.5186,
    lng: 13.4241,
    address: 'Karl-Marx-Allee 31, 10178 Berlin',
    openingHours: 'Lun-Mer 08h-15h, Jeu 11h-18h, Ven 08h-13h',
    phone: '+49 30 115',
    note: 'Lieu pour l’Anmeldung et la Meldebestätigung. Prendre rendez-vous tôt le matin sur service.berlin.de.',
    offlineAvailable: true
  },
  {
    id: 'berlin-lea-auslaenderbehorde',
    name: 'Landesamt für Einwanderung (LEA - Ausländerbehörde)',
    germanName: 'Landesamt für Einwanderung (LEA)',
    category: 'administration',
    city: 'Berlin',
    lat: 52.5401,
    lng: 13.3444,
    address: 'Friedrich-Krause-Ufer 24, 13353 Berlin',
    openingHours: 'Lun, Mar 07h-14h, Jeu 09h-17h',
    phone: '+49 30 90269-4000',
    note: 'Délivrance et renouvellement des titres de séjour (Aufenthaltstitel).',
    offlineAvailable: true
  },
  {
    id: 'berlin-hbf',
    name: 'Berlin Hauptbahnhof (Gare Centrale)',
    germanName: 'Berlin Hauptbahnhof',
    category: 'station',
    city: 'Berlin',
    lat: 52.5251,
    lng: 13.3694,
    address: 'Europaplatz 1, 10557 Berlin',
    openingHours: 'Ouvert 24h/24',
    phone: '+49 30 2970',
    note: 'Centre névralgique de transport (S-Bahn, U-Bahn, trains régionaux RE/RB valables avec Deutschlandticket).',
    offlineAvailable: true
  },
  {
    id: 'berlin-charite-hospital',
    name: 'Hôpital Universitaire Charité (Notaufnahme)',
    germanName: 'Charité – Universitätsmedizin Berlin',
    category: 'hospital',
    city: 'Berlin',
    lat: 52.5256,
    lng: 13.3783,
    address: 'Charitéplatz 1, 10117 Berlin',
    openingHours: 'Urgences médicales 24h/24 (Notaufnahme)',
    phone: '+49 30 450-50',
    note: 'Grand pôle hospitalier avec service d’urgence permanent.',
    offlineAvailable: true
  },
  {
    id: 'berlin-apotheke-hbf',
    name: 'Apotheke im Hauptbahnhof (Pharmacie 24/7)',
    germanName: 'Hauptbahnhof Apotheke',
    category: 'pharmacy',
    city: 'Berlin',
    lat: 52.5255,
    lng: 13.3698,
    address: 'Europaplatz 1 (1er sous-sol), 10557 Berlin',
    openingHours: 'Ouvert 365j/an de 06h à 22h (garde de nuit affichée)',
    phone: '+49 30 20614190',
    note: 'Pratique en cas de besoin médicamenteux le dimanche et les jours fériés.',
    offlineAvailable: true
  },
  {
    id: 'berlin-supermarket-rewe',
    name: 'REWE & DM Drogerie Alexanderplatz',
    germanName: 'REWE Markt & dm-drogerie markt',
    category: 'supermarket',
    city: 'Berlin',
    lat: 52.5219,
    lng: 13.4132,
    address: 'Alexanderplatz 2, 10178 Berlin',
    openingHours: 'Lun-Sam 07h-22h (Fermé Dimanche)',
    note: 'Courses alimentaires abordables et produits d’hygiène à prix bas chez DM.',
    offlineAvailable: true
  },
  {
    id: 'berlin-madagascar-embassy',
    name: 'Ambassade de la République de Madagascar en Allemagne',
    germanName: 'Botschaft der Republik Madagaskar',
    category: 'embassy',
    city: 'Berlin',
    lat: 52.5606,
    lng: 13.0872,
    address: 'Seepromenade 92, 14612 Falkensee (près de Berlin)',
    openingHours: 'Lun-Ven 09h-12h30 et 13h30-16h',
    phone: '+49 3322 23140',
    note: 'Services consulaires pour les ressortissants malagasy (passeports, légalisations, assistance d’urgence).',
    offlineAvailable: true
  },
  {
    id: 'berlin-afro-shop',
    name: 'Afro-Continental Food Store & Spices',
    germanName: 'Afro Continental Food Store',
    category: 'afro_shop',
    city: 'Berlin',
    lat: 52.5480,
    lng: 13.3550,
    address: 'Müllerstraße 42, 13353 Berlin (Wedding)',
    openingHours: 'Lun-Sam 10h-20h',
    note: 'Pour trouver du riz parfumé, du manioc, des brèdes, du pili-pili et des épices de l’océan Indien.',
    offlineAvailable: true
  },

  // MUNICH
  {
    id: 'munich-kvr-buergeramt',
    name: 'Kreisverwaltungsreferat (KVR Bürgerbüro)',
    germanName: 'Kreisverwaltungsreferat (KVR) München',
    category: 'administration',
    city: 'München (Munich)',
    lat: 48.1257,
    lng: 11.5540,
    address: 'Ruppertstraße 19, 80337 München',
    openingHours: 'Lun-Ven 07h30-12h (sur rdv)',
    phone: '+49 89 233-96000',
    note: 'Bürgeramt principal et service de l’immigration de Munich (Anmeldung + Ausländerbehörde).',
    offlineAvailable: true
  },
  {
    id: 'munich-hbf',
    name: 'München Hauptbahnhof (Gare Centrale)',
    germanName: 'München Hauptbahnhof',
    category: 'station',
    city: 'München (Munich)',
    lat: 48.1402,
    lng: 11.5583,
    address: 'Bayerstraße 10A, 80335 München',
    openingHours: 'Ouvert 24h/24',
    phone: '+49 89 1308-0',
    note: 'Gare centrale bavaroise, connexions S-Bahn et U-Bahn rapides.',
    offlineAvailable: true
  },
  {
    id: 'munich-klinikum-hospital',
    name: 'Klinikum der Universität München (Innenstadt)',
    germanName: 'LMU Klinikum Notaufnahme',
    category: 'hospital',
    city: 'München (Munich)',
    lat: 48.1345,
    lng: 11.5620,
    address: 'Pettenkoferstraße 8a, 80336 München',
    openingHours: 'Urgences médicales 24h/24',
    phone: '+49 89 4400-0',
    note: 'Urgences médicales en plein centre de Munich.',
    offlineAvailable: true
  },
  {
    id: 'munich-apotheke-notdienst',
    name: 'Internationale Ludwig-Apotheke (Service de garde)',
    germanName: 'Ludwig-Apotheke München',
    category: 'pharmacy',
    city: 'München (Munich)',
    lat: 48.1420,
    lng: 11.5700,
    address: 'Neuhauser Str. 11, 80331 München',
    openingHours: 'Lun-Sam 08h-20h + Urgences',
    phone: '+49 89 2603021',
    note: 'Personnel parlant plusieurs langues.',
    offlineAvailable: true
  },

  // FRANKFURT
  {
    id: 'frankfurt-buergeramt-zentral',
    name: 'Bürgeramt Zentral Frankfurt',
    germanName: 'Bürgeramt Zentral',
    category: 'administration',
    city: 'Frankfurt am Main',
    lat: 50.1130,
    lng: 8.6820,
    address: 'Zeil 3, 60313 Frankfurt am Main',
    openingHours: 'Lun 09h-17h, Mer-Ven 07h30-13h',
    phone: '+49 69 115',
    note: 'Mairie de quartier centrale de Francfort pour la déclaration de domicile.',
    offlineAvailable: true
  },
  {
    id: 'frankfurt-auslaenderbehorde',
    name: 'Ausländerbehörde Frankfurt (Ordnungsamt)',
    germanName: 'Ausländerbehörde Frankfurt am Main',
    category: 'administration',
    city: 'Frankfurt am Main',
    lat: 50.1022,
    lng: 8.6305,
    address: 'Kleyerstraße 86, 60326 Frankfurt am Main',
    openingHours: 'Lun-Ven sur rendez-vous en ligne',
    phone: '+49 69 212-42485',
    note: 'Service des titres de séjour.',
    offlineAvailable: true
  },
  {
    id: 'frankfurt-hbf',
    name: 'Frankfurt (Main) Hauptbahnhof',
    germanName: 'Frankfurt (Main) Hbf',
    category: 'station',
    city: 'Frankfurt am Main',
    lat: 50.1071,
    lng: 8.6638,
    address: 'Am Hauptbahnhof, 60329 Frankfurt am Main',
    openingHours: '24h/24',
    phone: '+49 69 2650',
    note: 'La plus grande gare de correspondance d’Allemagne.',
    offlineAvailable: true
  },

  // COLOGNE
  {
    id: 'cologne-kundenzentrum-innenstadt',
    name: 'Bürgeramt Innenstadt Köln',
    germanName: 'Kundenzentrum Innenstadt',
    category: 'administration',
    city: 'Köln (Cologne)',
    lat: 50.9380,
    lng: 6.9560,
    address: 'Ludwigstraße 8, 50667 Köln',
    openingHours: 'Lun-Ven 07h30-12h (sur rdv)',
    phone: '+49 221 221-0',
    note: 'Enregistrement de domicile à Cologne.',
    offlineAvailable: true
  },
  {
    id: 'cologne-hbf',
    name: 'Köln Hauptbahnhof (Près de la Cathédrale)',
    germanName: 'Köln Hauptbahnhof',
    category: 'station',
    city: 'Köln (Cologne)',
    lat: 50.9432,
    lng: 6.9586,
    address: 'Trankgasse 11, 50667 Köln',
    openingHours: '24h/24',
    phone: '+49 221 141-0',
    note: 'Situé au pied de la célèbre cathédrale de Cologne (Kölner Dom).',
    offlineAvailable: true
  }
];

export const EMERGENCY_NUMBERS = [
  { label: 'Urgences Vitales & Pompiers (Notruf / Feuerwehr)', number: '112', free: true, description: 'Pour détresse vitale, malaise grave, accident de la route ou incendie' },
  { label: 'Police Secours (Polizei)', number: '110', free: true, description: 'Pour agression, vol ou danger immédiat' },
  { label: 'Médecin de garde non-urgent (Ärztlicher Bereitschaftsdienst)', number: '116 117', free: true, description: 'Quand le cabinet médical est fermé (soir, nuit, week-end) mais que ce n’est pas mortel' },
  { label: 'Centre Antipoison (Giftnotruf)', number: '+49 30 19240', free: true, description: 'Ingestion de produit toxique, piqûre ou médicament suspect' },
  { label: 'Opposition Carte Bancaire & Mobile (Sperr-Notruf)', number: '116 116', free: true, description: 'Bloquer immédiatement une carte bancaire perdue ou volée' }
];
