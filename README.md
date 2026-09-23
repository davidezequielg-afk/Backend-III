# ShipNow v1 (versión "sucia" para la clase 1)

Proyecto mínimo construido a partir de los fragmentos que aparecen en el material
de lectura del Módulo 1 de Backend III. Sirve para el semáforo de calidad y para
la demo de refactor en vivo. No es el repo oficial de Coderhouse.

## Correr

```bash
npm install
npm run dev
```

Necesita un MongoDB en `mongodb://localhost:27017` (o cambiá la URI en `app.js`,
que es justamente uno de los problemas a mostrar).

## Datos de prueba para la demo (Postman)

1. `POST /api/users` con `{ "name": "Ana", "email": "ana@mail.com" }` y copiá el `_id`.
2. `POST /api/users/stores` con `{ "name": "Pizzería Don Luis" }` y copiá el `_id`.
3. `POST /api/orders`:

```json
{
  "userId": "<id de Ana>",
  "storeId": "<id del comercio>",
  "address": "Av. Corrientes 1234",
  "items": [{ "name": "Muzza", "price": 9000, "quantity": 2 }]
}
```

4. `GET /api/orders/000000000000000000000000` devuelve 200 con `{ "status": "error", "data": null }` (bloque de contratos).

## Qué tiene de malo (a propósito)

- `app.js`: puerto, secreto y URI de Mongo hardcodeados; `.gitignore` sin `.env`.
- `routes/orders.js`: la ruta POST valida, consulta, calcula, persiste y responde.
- `routes/orders.js`, `PATCH /:id/deliver`: string mágico `'Delivered'` con mayúscula.
- `GET /:id`: devuelve 200 en todos los casos, incluso cuando falla.
