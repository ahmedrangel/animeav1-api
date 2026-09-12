import { searchAnimesByURL } from "animeav1-scraper";

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event) as { url: string };
  const search = await searchAnimesByURL(url);
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
    summary: "Busca con URL de búsqueda",
    description: "Ejecuta una búsqueda de animes utilizando una URL de búsqueda.",
    parameters: [
      {
        name: "url",
        in: "query",
        summary: "La URL de consulta.",
        example: "https://animeav1.com/catalogo?genre=shounen&category=tv-anime&order=default&page=2",
        required: true,
        schema: {
          type: "string",
          format: "uri"
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
      }
    }
  }
});
