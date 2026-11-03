# ShipNow API

API de ShipNow con arquitectura por capas (Controller → Service → Repository), hecha con Node.js, Express y MongoDB (Mongoose).

## Instalar e Iniciar localmente la API
1. Clonamos el repositorio, desde la página, para luego abrir una terminal en la carpeta donde quede el archivo.
2. Lo instalamos, lo hacemos con las siguiente línea:
```bash
npm install
```
3. Una vez que ya esté todo instalado copiamos el archivo `.env.example` a `.env`, y completarlo con las variables solicitadas.

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shipnow
NODE_ENV=development
```

4. Una vez que el `.env` esté completo nos podremos poner a iniciar el servidor, usando la siguiente línea:
```bash
npm run dev
```
O
```bash
npm start
```
- Si hay algún fallo de la API a la hora de iniciar se debe corroborar que todos las variables estén completas y sean auténticas y utilizables.

Necesita un MongoDB en `mongodb://localhost:27017` la cual se ingresa en el `.env`.

## Estructura de la API

```
src/
├── config/           # carpeta donde se guardan las configuraciones de la conexión a la DB y las variables de entorno validadas
├── constants/        # aquí se guardan esas constantes que pueden ser usadas en toda la API, roles de usuarios o estados de productos
├── controllers/      # manejo de las req y las res
├── middlewares/      # manejo de errores de forma centralizada
├── models/           # los modelos de mongoose, acá no se recibe ni debe escribirse lógica del negocio
├── repositories/     # conecta la base de datos con el sistema, es el único que debe conectarse entre ambos
├── routes/           # conectan cada endpoint con su controlador
└── services/         # se encarga de contener toda la lógica del negocio
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/products | Crear producto |
| GET | /api/products | Listar productos disponibles |
| GET | /api/products/:id | Obtener un producto |
| PATCH | /api/products/:id | Actualizar parcialmente |
| DELETE | /api/products/:id | Eliminar |
| POST / GET / PATCH / DELETE | /api/users | Mismo esquema para usuarios |

## Separación y reestructuración de la API.
Antes de comenzar con este proyecto nos encontrábamos con una API con pocos archivos y cada uno tenía miles tareas para ejecutar. Por lo que se decidió realizarle una limpieza y una reestructuración.
- **Repository**, este es el que se encarga de conectar y conocer a Mongoose, se ocupa de buscar y guardar en la misma. Es muy útil si se quiere cambiar de base de datos, ya que no precisa configuración extra.
- **Service**, es el que se ocupa de poseer y exportar las reglas del negocio, calcula el status de los productos, los stocks, rechaza mails duplicados, y no sabe nada de la base de datos.
- **Controller**, este se encarga de contener el manejo de las request y de las response de toda la API.

### Porque se realiza la separacion de la API.

- **Calcular el `status` según el `stock`** va en el Service: es una regla del negocio y no depende de cómo se guardan los datos.
- **Excluir el campo `__v` y ordenar por fecha** va en el Repository: es una decisión de acceso a datos.
- **Rechazar un email duplicado** va en el Service, que decide qué hacer. El Repository solo ofrece `getByEmail` para buscarlo.
- **Responder `404` o `409`** lo decide el middleware de errores; el Service solo lanza el error.
- **El Controller no importa Mongoose**: solo recibe la request, llama al Service y devuelve la response.

Si cambia la base de datos, se modifica el Repository. Si cambia una regla del negocio, se modifica el Service.

