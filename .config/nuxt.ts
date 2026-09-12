import { SITE } from "../shared/utils/helpers";

export default defineNuxtConfig({

  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@scalar/nuxt"
  ],
  $production: {
    nitro: {
      preset: "cloudflare-module"
    }
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "es"
      },
      meta: [
        { name: "robots", content: "index, follow" },
        { name: "description", content: SITE.description },
        { property: "og:title", content: SITE.title },
        { property: "og:description", content: SITE.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: SITE.host },
        { name: "twitter:title", content: SITE.title },
        { name: "twitter:image:alt", content: SITE.title },
        { property: "og:site_name", content: SITE.title }
      ],
      link: [
        { rel: "shortcut icon", href: "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlMb//2ux//9or///ZKz//wlv5f8JcOf/CnXv/why7/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2vi/wZo3/9ytf//b7P//2uw//+BvP//DHbp/w568P8Md+//CnXv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApv4/8HbOH/lMf//3W3//9ytf//brL//w946v8SfvH/EHzw/w558P8AAAAAAAAAAAAAAAAAAAAAAAAAABF56f8Ndef/C3Dj/whs4f98u///eLn//3W3//+Evv//FoPx/xSA8f8SfvD/EHvw/wAAAAAAAAAAAAAAAA1EeF0WgOz/EXrp/w515v8LceT/lsn//3+9//97u///eLj//xaB7f8YhfL/FoLx/xSA8f8JP/deAAAAAAAAAAAgjfH/HIjw/xeB7P8Te+n/AAAAAAAAAACGwf//gr///369//+Iwf//HIny/xqH8v8YhfL/FYLx/wAAAAAnlfPlJJLy/yGO8v8cifD/GILt/wAAAAAAAAAAmMz//4nD//+Fwf//gb///xyJ8P8ejPP/HIny/xmH8v8XhPLnK5r0/yiW8/8lk/P/IpDy/wAAAAAAAAAAAAAAAAAAAACPx///jMX//4jD//+MxP//IpD0/yCO8/8di/P/G4ny/y6e9f8sm/T/KZj0/yaV8/8AAAAAAAAAAAAAAAAAAAAAlsz//5LJ//+Px///lMn//yaV9P8kkvT/IZD0/x+O8/8yo/blMKD1/y2d9f8qmfT/KJbz/wAAAAAAAAAAqdb//53Q//+Zzv//lsv//yiY8/8qmvX/KJf1/yWV9P8jkvTQAAAAADSl9v8xofX/Lp71/yyb9P8AAAAAAAAAAKfW//+k1P//oNL//6rW//8wofb/Lp72/yuc9f8pmfX/AAAAAAAAAAAcVHtcNab2/zKj9v8voPX/LZz0/7vh//+u2///qtj//6fW//8wofT/NKX3/zKj9/8voPb/F8/6XgAAAAAAAAAAAAAAADmr9/82qPf/M6T2/zCg9f+44f//td///7Hd//++4v//Oqz4/ziq+P81p/f/M6X3/wAAAAAAAAAAAAAAAAAAAAAAAAAAOqz4/zep9//M6///v+X//7vj//+44f//OKn1/z6x+f88rvn/Oaz4/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6x+f8qmfP/yOv//8bq///C5///z+z//0O3+v9Ctfr/QLP5/z2x+f8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0u///8jr///I6///yOv//zmq9f9Dt/r/Q7f6/0O3+v8AAAAAAAAAAAAAAAAAAAAA8A8AAOAHAADgBwAAwAMAAMADAACGAQAABgAAAA8AAAAPAAAABgAAAIYBAADAAwAAwAMAAOAHAADgBwAA8A8AAA==" }
      ]
    }
  },
  css: [
    "~/assets/css/main.css"
  ],
  runtimeConfig: {
    openapi: {
      info: {
        title: SITE.title,
        description: SITE.description,
        version: SITE.version
      }
    }
  },
  routeRules: {
    "/": { prerender: true },
    "/openapi.json": { prerender: true },
    "/api/*/**": { headers: { "Access-Control-Allow-Origin": "*" } },
    "/api": { redirect: { to: "/", statusCode: 301 } },
    "/docs": { redirect: { to: "/", statusCode: 301 } }
  },
  features: {
    inlineStyles: false
  },
  experimental: {
    typedPages: true
  },
  compatibilityDate: "2026-09-12",
  nitro: {
    prerender: {
      crawlLinks: true
    },
    experimental: {
      openAPI: true
    }
  },
  hub: {
    cache: true
  },
  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },
  scalar: {
    agent: {
      disabled: true
    }
  }
});
