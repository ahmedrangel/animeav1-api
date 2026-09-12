import { getLatest } from "animeav1-scraper";

export default defineEventHandler(async () => {
  const latest = await getLatest();
  if (!latest) {
    throw createError({
      statusCode: 404,
      message: "No se han encontrado resultados",
      data: { success: false, error: "No se han encontrado resultados" }
    });
  }
  return {
    success: true,
    data: latest
  };
});

defineRouteMeta({
  openAPI: {
    tags: ["List"],
    summary: "Lista de últimos episodios lanzados",
    description: "Obtiene una lista de últimos episodios lanzados.",
    responses: {
      200: {
        description: "Retorna un arreglo de objetos que contienen información como el título, el capítulo, la portada, el slug y la url del episodio. Estos objetos están ordenados de manera cronológica, los últimos episodios estarán en la parte superior del arreglo.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      number: { type: "number" },
                      cover: { type: "string" },
                      slug: { type: "string" },
                      url: { type: "string" }
                    },
                    required: ["title", "number", "cover", "slug", "url"]
                  }
                }
              },
              required: ["success", "data"]
            }
          }
        }
      },
      404: {
        description: "No se han encontrado resultados.",
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
