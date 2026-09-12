import { getAnimeInfo } from "animeav1-scraper";

export default defineCachedEventHandler(async (event) => {
  const { slug } = getRouterParams(event) as { slug: string };
  const info = await getAnimeInfo(slug).catch(() => null);
  if (!info) {
    throw createError({
      statusCode: 404,
      message: "No se ha encontrado el anime",
      data: { success: false, error: "No se ha encontrado el anime" }
    });
  }
  return {
    success: true,
    data: info
  };
}, {
  swr: false,
  maxAge: 86400,
  name: "info",
  group: "anime",
  getKey: event => getRouterParams(event).slug!
});

defineRouteMeta({
  openAPI: {
    tags: ["Anime"],
    parameters: [
      {
        name: "slug",
        in: "path",
        summary: "Slug que identifica el anime.",
        example: "boruto-naruto-next-generations",
        required: true,
        schema: {
          type: "string"
        }
      }
    ],
    summary: "Anime por Slug",
    description: "Obtiene un anime especificado por \"slug\".",
    responses: {
      200: {
        description: "Retorna información como el título, títulos alternativos, estado, rating, tipo, portada, sinopsis, géneros, fecha del siguiente episodio, episodios, url y relacionados.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                data: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    alternative_titles: { type: "array", items: { type: "string" } },
                    status: { type: "string" },
                    rating: { type: "string" },
                    type: { type: "string" },
                    cover: { type: "string" },
                    synopsis: { type: "string" },
                    genres: { type: "array", items: { type: "string" } },
                    next_airing_episode: { type: "string" },
                    episodes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          number: { type: "number" },
                          slug: { type: "string" },
                          url: { type: "string" }
                        },
                        required: ["number", "slug", "url"]
                      }
                    },
                    url: { type: "string" },
                    related: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          relation: { type: "string" },
                          slug: { type: "string" },
                          url: { type: "string" }
                        },
                        required: ["title", "slug", "url"]
                      }
                    }
                  },
                  required: [
                    "title",
                    "alternative_titles",
                    "status",
                    "rating",
                    "type",
                    "cover",
                    "synopsis",
                    "genres",
                    "episodes",
                    "url"
                  ]
                }
              }
            }
          }
        }
      },
      404: {
        description: "No se ha encontrado el anime.",
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
      }
    }
  }
});
