/**
 * Configuration de l'URL de base pour l'API ARIA.
 * 
 * En développement local web et preview, VITE_API_URL est vide (''),
 * ce qui utilise les chemins relatifs (/api/...) pris en charge par Express.
 * 
 * Dans une application Android Capacitor (WebView locale capacitor://localhost),
 * VITE_API_URL permet de cibler l'URL du serveur distant sans impacter le mode local.
 */
export const API_BASE_URL: string = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
