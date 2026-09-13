import { getEpisode } from "animeav1-scraper";

export default defineCachedEventHandler(async (event) => {
  const { slug, episode } = getRouterParams(event) as { slug: string, episode: string };
  const data = await getEpisode(slug, Number(episode));
  if (!data) {
    throw createError({
      statusCode: 404,
      message: "No se ha encontrado el episodio",
      data: { success: false, error: "No se ha encontrado el episodio" }
    });
  }
  return {
    success: true,
    data: data
  };
}, {
  swr: false,
  maxAge: 86400,
  name: "episode",
  group: "anime",
  getKey: (event) => {
    const { slug, episode } = getRouterParams(event) as { slug: string, episode: string };
    return `${slug}-${episode}`;
  }
});

defineRouteMeta({
  openAPI: {
    tags: ["Anime"],
    summary: "Episodio por Slug y Número",
    description: "Obtiene un episodio especificado por \"slug\" y \"episode\".",
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
      },
      {
        name: "episode",
        in: "path",
        summary: "Número de episodio.",
        example: 65,
        required: true,
        schema: {
          type: "number"
        }
      }
    ],
    responses: {
      200: {
        description: "Retorna un contiene información como el título, número y un arreglo de servers con nombres, url de descarga y url de embed.",
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
                    number: { type: "number" },
                    embeds: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          url: { type: "string" },
                          type: { type: "string" },
                        },
                        required: ["name", "url", "type"]
                      }
                    },
                    downloads: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          url: { type: "string" },
                          type: { type: "string" }
                        },
                        required: ["name", "url", "type"]
                      }
                    }
                  },
                  required: ["title", "number", "embeds", "downloads"]
                }
              },
              required: ["success", "data"]
            }
          }
        }
      },
      404: {
        description: "No se ha encontrado el episodio.",
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
