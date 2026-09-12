import { searchAnimesByFilter, GenreEnum, StatusEnum, TypeEnum, OrderEnum } from "animeav1-scraper";

const genres = Object.values(GenreEnum);
const statuses = Object.values(StatusEnum);
const types = Object.values(TypeEnum);
const orders = Object.values(OrderEnum);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { order, page } = getQuery(event) as { order: string, page: number };

  const invalid_order = !orders?.includes(order);
  if (order && invalid_order) {
    throw createError({
      statusCode: 400,
      message: `Orden no válido: ${order}`,
      data: { success: false, error: `Orden no válido: ${order}`, hint: orders }
    });
  }

  const invalid_types = body?.types?.filter((t: string) => !types?.includes(t));
  if (invalid_types?.length) {
    throw createError({
      statusCode: 400,
      message: `Tipos no válidos: ${invalid_types?.join(", ")}`,
      data: { success: false, error: `Tipos no válidos: ${invalid_types?.join(", ")}`, hint: types }
    });
  }

  const invalid_genres = body?.genres?.filter((g: string) => !genres?.includes(g));
  if (invalid_genres?.length) {
    throw createError({
      statusCode: 400,
      message: `Géneros no válidos: ${invalid_genres?.join(", ")}`,
      data: { success: false, error: `Géneros no válidos: ${invalid_genres?.join(", ")}`, hint: genres }
    });
  }

  const invalid_statuses = body?.statuses?.filter((s: string) => !statuses?.includes(s));
  if (invalid_statuses?.length) {
    throw createError({
      statusCode: 400,
      message: `Estados no válidos: ${invalid_statuses?.join(", ")}`,
      data: { success: false, error: `Estados no válidos: ${invalid_statuses?.join(", ")}`, hint: StatusEnum }
    });
  }

  if (body?.genres?.length > 4) {
    throw createError({
      statusCode: 400,
      message: "Solo se permite un máximo de 4 géneros",
      data: { success: false, error: "Solo se permite un máximo de 4 géneros" }
    });
  }

  const orderKeyMap: Record<string, string> = {
    default: "Predeterminado",
    score: "Puntuación",
    popular: "Populares",
    title: "Título",
    latest_added: "Últimos Agregados",
    latest_released: "Últimos Estrenos"
  };

  const mappedOrder = orderKeyMap[order || "default"];

  console.log(`Mapped order: ${mappedOrder}`);

  const search = await searchAnimesByFilter({ ...body, order: mappedOrder, page });
  if (!search || !search?.media?.length) {
    throw createError({
      statusCode: 404,
      message: "No se han encontrado resultados en la búsqueda",
      data: { success: false, error: "No se han encontrado resultados en la búsqueda" }
    });
  }
  return {
    success: true,
    data: search
  };
});

defineRouteMeta({
  openAPI: {
    tags: ["Search"],
    summary: "Busca usando filtros",
    description: "Ejecuta una búsqueda de animes utilizando filtros como tipo, géneros y estados.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              types: {
                type: "array",
                description: "Tipos de anime.",
                example: ["tv-anime"],
                items: {
                  type: "string",
                  enum: ["tv-anime", "pelicula", "especial", "ova", "ona"]
                }
              },
              genres: {
                type: "array",
                description: "Géneros de anime.",
                example: ["accion", "aventura", "ciencia-ficcion"],
                items: {
                  type: "string",
                  enum: [
                    "accion", "aventura", "ciencia-ficcion",
                    "comedia", "deportes", "drama",
                    "fantasia", "misterio", "recuentos-de-la-vida",
                    "romance", "seinen", "shoujo",
                    "shounen", "sobrenatural", "suspenso",
                    "terror", "antropomorfico", "artes-marciales",
                    "carreras", "detectives", "ecchi",
                    "elenco-adulto", "escolares", "espacial",
                    "gore", "gourmet", "harem",
                    "historico", "idols-hombre", "idols-mujer",
                    "infantil", "isekai", "josei",
                    "juegos-estrategia", "mahou-shoujo", "mecha",
                    "militar", "mitologia", "musica",
                    "parodia", "psicologico", "samurai",
                    "shoujo-ai", "shounen-ai", "superpoderes",
                    "vampiros"
                  ]
                }
              },
              statuses: {
                type: "array",
                description: "Estados de anime.",
                example: ["emision", "finalizado", "proximamente"],
                items: {
                  type: "string",
                  enum: ["emision", "finalizado", "proximamente"]
                }
              }
            }
          }
        }
      }
    },
    parameters: [
      {
        name: "order",
        in: "query",
        summary: "Especificar el orden de los resultados.",
        required: false,
        example: "default",
        schema: {
          type: "string",
          enum: ["default", "score", "popular", "title", "latest_added", "latest_released"],
          default: "default"
        }
      },
      {
        name: "page",
        in: "query",
        summary: "Especificar el número de página.",
        example: 1,
        required: false,
        schema: {
          type: "number",
          default: 1
        }
      }
    ],
    responses: {
      200: {
        description: "Retorna un objeto con varios atributos, incluyendo \"previousPage\" y \"nextPage\", que indican si hay más páginas de resultados disponibles antes o después de la página actual. El atributo \"foundPages\" indica cuántas páginas de resultados se encontraron en total. El atributo \"data\" es un arreglo que contiene objetos con información detallada sobre cada anime encontrado. Cada objeto contiene información como el título, la portada, el sinopsis, el slug, el tipo y la url del anime.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                data: {
                  type: "object",
                  properties: {
                    currentPage: { type: "number", example: 1 },
                    hasNextPage: { type: "boolean" },
                    previousPage: { type: "string", nullable: true },
                    nextPage: { type: "string", nullable: true },
                    foundPages: { type: "number", example: 10 },
                    media: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          cover: { type: "string" },
                          synopsis: { type: "string" },
                          slug: { type: "string" },
                          type: { type: "string" },
                          url: { type: "string" }
                        },
                        required: ["title", "cover", "synopsis", "slug", "type", "url"]
                      }
                    }
                  },
                  required: ["currentPage", "hasNextPage", "previousPage", "nextPage", "foundPages", "media"]
                }
              },
              required: ["success", "data"]
            }
          }
        }
      },
      404: {
        description: "No se han encontrado resultados en la búsqueda.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "boolean", example: true },
                url: { type: "string" },
                statusCode: { type: "number", example: 404 },
                message: { type: "string" },
                data: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    error: { type: "string" }
                  },
                  required: ["success", "error"]
                }
              },
              required: ["error", "url", "statusCode", "message", "data"]
            }
          }
        }
      },
      400: {
        description: "Bad Request.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "boolean", example: true },
                url: { type: "string" },
                statusCode: { type: "number", example: 400 },
                message: { type: "string" },
                data: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    error: { type: "string" }
                  },
                  required: ["success", "error"]
                }
              },
              required: ["error", "url", "statusCode", "message", "data"]
            }
          }
        }
      }
    }
  }
});
