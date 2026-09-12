# Unofficial AnimeAV1 REST API

> [!IMPORTANT]  
> Si usas Node.js, antes de utilizar esta API, considera utilizar la librería de NPM [animeav1-scraper](https://npmjs.com/package/animeav1-scraper) como opción principal. Esta proyecto hace uso de ella internamente. De lo contrario, si tu app hace solicitudes de manera abusiva podrías ser bloqueado.

### Base URL
https://animeav1.ahmedrangel.com/api

## Endpoints
### Anime
`GET` [/anime/{slug}](https://animeav1.ahmedrangel.com/#tag/anime/GET/api/anime/%7Bslug%7D)

`GET` [/anime/{slug}/{episode}](https://animeav1.ahmedrangel.com/#tag/anime/GET/api/anime/%7Bslug%7D/%7Bepisode%7D)


### Search
`GET` [/search](https://animeav1.ahmedrangel.com/#tag/search/GET/api/search)

`POST` [/search/by-filter](https://animeav1.ahmedrangel.com/#tag/search/POST/api/search/by-filter)

`GET` [/search/by-url](https://animeav1.ahmedrangel.com/#tag/search/GET/api/search/by-url)

### List
`GET` [/list/latest-episodes](https://animeav1.ahmedrangel.com/#tag/list/GET/api/list/latest-episodes)

`GET` [/list/animes-on-air](https://animeav1.ahmedrangel.com/#tag/list/GET/api/list/animes-on-air)
