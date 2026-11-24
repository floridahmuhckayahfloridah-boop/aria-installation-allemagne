import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Navigation, 
  MapPin, 
  Compass, 
  Phone, 
  Clock, 
  Layers, 
  Building2, 
  Train, 
  Pill, 
  Cross, 
  ShoppingCart, 
  Globe2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import L from 'leaflet';
import { MapPlace, PlaceCategory } from '../../types';
import { GERMAN_CITIES, MAP_PLACES, CityCenter } from '../../data/germanCitiesPlaces';

interface InteractiveMapProps {
  isOnline: boolean;
  selectedCityName?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ isOnline, selectedCityName = 'Berlin' }) => {
  const [selectedCity, setSelectedCity] = useState<CityCenter>(
    GERMAN_CITIES.find(c => c.name.toLowerCase().includes(selectedCityName.toLowerCase())) || GERMAN_CITIES[0]
  );
  const [categoryFilter, setCategoryFilter] = useState<PlaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlace, setActivePlace] = useState<MapPlace | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [navigationTarget, setNavigationTarget] = useState<MapPlace | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCity.lat, selectedCity.lng],
        zoom: selectedCity.zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([selectedCity.lat, selectedCity.lng], selectedCity.zoom);
    }

    return () => {
      // Keep map alive or cleanup on unmount
    };
  }, [selectedCity]);

  // Update map markers when filter, search, or activePlace changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    const filtered = MAP_PLACES.filter(place => {
      const matchesCity = place.city.toLowerCase().includes(selectedCity.name.toLowerCase().split(' ')[0]);
      const matchesCategory = categoryFilter === 'all' || place.category === categoryFilter;
      const matchesSearch = searchQuery === '' || 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (place.note && place.note.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCity && matchesCategory && matchesSearch;
    });

    filtered.forEach(place => {
      // Color icon based on category
      const getMarkerColor = (cat: PlaceCategory) => {
        switch (cat) {
          case 'administration': return '#1b4332';
          case 'hospital': return '#dc2626';
          case 'pharmacy': return '#059669';
          case 'station': return '#2563eb';
          case 'embassy': return '#d97706';
          case 'supermarket': return '#0891b2';
          default: return '#4b5563';
        }
      };

      const markerHtml = `
        <div style="background-color: ${getMarkerColor(place.category)}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      const popupContent = `
        <div style="padding: 12px; font-family: inherit; max-width: 240px;">
          <h4 style="font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: #0f172a;">${place.name}</h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">${place.address}</p>
          <div style="font-size: 10px; font-weight: 600; color: #166534; margin-bottom: 4px;">🕒 ${place.openingHours}</div>
          ${place.phone ? `<div style="font-size: 11px; color: #0284c7;">📞 ${place.phone}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setActivePlace(place);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [selectedCity, categoryFilter, searchQuery]);

  // Request user GPS
  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coords.lat, coords.lng], 15);
            L.circleMarker([coords.lat, coords.lng], {
              radius: 8,
              fillColor: '#0284c7',
              color: '#ffffff',
              weight: 2,
              fillOpacity: 0.9,
            }).addTo(mapInstanceRef.current).bindPopup('Votre position actuelle').openPopup();
          }
        },
        (err) => {
          alert('Impossible d’accéder à la géolocalisation. Vérifiez les autorisations de votre téléphone.');
        }
      );
    }
  };

  // Calculate distance in KM
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Compute bearing / cardinal direction for offline compass orientation
  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
    const brng = ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
    
    if (brng >= 337.5 || brng < 22.5) return 'Nord ↑';
    if (brng >= 22.5 && brng < 67.5) return 'Nord-Est ↗';
    if (brng >= 67.5 && brng < 112.5) return 'Est →';
    if (brng >= 112.5 && brng < 157.5) return 'Sud-Est ↘';
    if (brng >= 157.5 && brng < 202.5) return 'Sud ↓';
    if (brng >= 202.5 && brng < 247.5) return 'Sud-Ouest ↙';
    if (brng >= 247.5 && brng < 292.5) return 'Ouest ←';
    return 'Nord-Ouest ↖';
  };

  const filteredPlaces = MAP_PLACES.filter(place => {
    const matchesCity = place.city.toLowerCase().includes(selectedCity.name.toLowerCase().split(' ')[0]);
    const matchesCategory = categoryFilter === 'all' || place.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-3 pb-24">
      {/* Top City Bar & Offline Pack Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          {/* City Selector */}
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
              Ville d'Allemagne
            </label>
            <select
              value={selectedCity.id}
              onChange={(e) => {
                const found = GERMAN_CITIES.find(c => c.id === e.target.value);
                if (found) setSelectedCity(found);
              }}
              className="w-full text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {GERMAN_CITIES.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.state})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 px-3 py-2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 shrink-0">
            Lieux intégrés à l’application
          </div>
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-amber-700 dark:text-amber-300">
          Les fiches de lieux intégrées restent consultables hors ligne. Le fond de carte et le calcul d’itinéraire nécessitent une connexion ; les tuiles déjà affichées ne sont pas garanties hors ligne.
        </p>

        {/* Search Bar */}
        <div className="mt-2.5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Rechercher mairie, pharmacie, gare à ${selectedCity.name}...`}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills (Interactive Filter Controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: 'Tous les lieux', icon: Layers },
          { id: 'administration', label: 'Mairies & Séjour', icon: Building2 },
          { id: 'station', label: 'Gares & S-Bahn', icon: Train },
          { id: 'pharmacy', label: 'Pharmacies', icon: Pill },
          { id: 'hospital', label: 'Hôpitaux 24/7', icon: Cross },
          { id: 'supermarket', label: 'Supermarchés', icon: ShoppingCart },
          { id: 'embassy', label: 'Ambassade Mada', icon: Globe2 },
        ].map(cat => {
          const Icon = cat.icon;
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold shrink-0 transition active:scale-95 ${
                isSelected
                  ? 'bg-[#143627] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Map Viewport Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md h-72 sm:h-80 bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Controls */}
        <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-2">
          <button
            onClick={handleLocateMe}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-95 border border-slate-200 dark:border-slate-700"
            title="Me géolocaliser (GPS)"
          >
            <Navigation className="w-4 h-4 text-emerald-600" />
          </button>
        </div>

        {/* Offline Map Status Overlay */}
        {!isOnline && (
          <div className="absolute top-2 left-2 z-[1000] bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Hors ligne : fond cartographique non disponible</span>
          </div>
        )}
      </div>

      {/* Navigation / Orientation Active Guidance Drawer */}
      {navigationTarget && (
        <div className="bg-gradient-to-br from-[#143627] to-[#1b4332] text-white p-4 rounded-2xl shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-300 animate-spin-slow" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Aide à l'orientation {isOnline ? 'en ligne' : 'hors-ligne'}
                </span>
                <h4 className="text-sm font-bold text-white leading-tight">
                  Destination : {navigationTarget.name}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setNavigationTarget(null)}
              className="text-xs text-emerald-300 hover:text-white"
            >
              Fermer
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-200 block">Distance estimée</span>
              <span className="text-base font-bold tabular-nums">
                {calculateDistance(
                  userLocation?.lat || selectedCity.lat,
                  userLocation?.lng || selectedCity.lng,
                  navigationTarget.lat,
                  navigationTarget.lng
                )} km
              </span>
            </div>
            <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-200 block">Direction / Cap</span>
              <span className="text-base font-bold">
                {calculateBearing(
                  userLocation?.lat || selectedCity.lat,
                  userLocation?.lng || selectedCity.lng,
                  navigationTarget.lat,
                  navigationTarget.lng
                )}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <p className="text-[11px] text-emerald-100 truncate max-w-[220px]">
              {navigationTarget.address}
            </p>
            {isOnline ? (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${navigationTarget.lat},${navigationTarget.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:underline"
              >
                <span>Itinéraire Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-[10px] text-amber-200">
                Coordonnées GPS mémorisées hors-ligne
              </span>
            )}
          </div>
        </div>
      )}

      {/* Places List Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Lieux utiles à {selectedCity.name} ({filteredPlaces.length})
          </h3>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
            Fiches locales intégrées
          </span>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            Aucun lieu trouvé correspondant à votre recherche dans cette catégorie.
          </div>
        ) : (
          filteredPlaces.map(place => (
            <div
              key={place.id}
              className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border transition shadow-sm ${
                activePlace?.id === place.id
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {place.category === 'administration'
                        ? 'Administration'
                        : place.category === 'hospital'
                        ? 'Hôpital'
                        : place.category === 'pharmacy'
                        ? 'Pharmacie'
                        : place.category === 'station'
                        ? 'Gare'
                        : place.category === 'embassy'
                        ? 'Ambassade'
                        : place.category === 'supermarket'
                        ? 'Supermarché'
                        : 'Commerce'}
                    </span>
                    <span className="text-[11px] text-slate-400">·</span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {calculateDistance(
                        userLocation?.lat || selectedCity.lat,
                        userLocation?.lng || selectedCity.lng,
                        place.lat,
                        place.lng
                      )} km
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {place.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{place.address}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNavigationTarget(place);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([place.lat, place.lng], 16);
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 font-semibold text-xs shrink-0 active:scale-95 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Guider</span>
                </button>
              </div>

              {place.note && (
                <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl leading-relaxed">
                  💡 {place.note}
                </p>
              )}

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>{place.openingHours}</span>
                </span>
                {place.phone && (
                  <a
                    href={`tel:${place.phone}`}
                    className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Appeler</span>
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
