import { version } from "../../package.json" with { type: "json" };

export const SITE = {
  title: "Unofficial AnimeAV1 API",
  description: "API para interactuar con el sitio de AnimeAV1 y obtener información útil",
  host: import.meta.dev ? "http://localhost:5173" : "https://animeav1.ahmedrangel.com",
  version
};
