// returnerer fargekode basert på smertenivå (0-10), grønn for lav, gul for middels, og rød for høy smerte
export const getPainLevelColor = (level: number): string => {
  if (level <= 3) return "#4ADE80"; // lav smerte
  if (level <= 7) return "#FACC15"; // moderat smerte
  return "#F87171"; //høy smerte
};

// mapper skadestatus til farger som brukes i UI-elementer og status-piller
export const getStatusThemeColor = (status: string): string => {
  const s = status?.toLowerCase();
  switch (s) {
    case "forbedres":
    case "bedring":
      return "#4ADE80"; // positiv utvikling
    case "stabil":
      return "#60A5FA"; // ingen endring
    case "verre":
      return "#F87171"; // negativ utvikling
    default:
      return "#9CA3AF"; // ukjent status
  }
};

// gir fargeindikasjon på temperatur i skadeområdet. Hjelper brukeren å skille mellom inflammasjon (varm) og normal tilstand
export const getTemperatureColor = (temp: string): string => {
  const t = temp?.toLowerCase();
  if (t === "varm" || t === "hissig") return "#EF4444"; //potensiell betennelse
  if (t === "normal") return "#10B981"; // ideel tilstand
  if (t === "kald") return "#3B82F6"; // nedsatt sirkulasjon
  return "#6B7280";
};
