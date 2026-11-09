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
| GET | /api/mocks/users?qty=N | Simulacion de creacion de usuarios |
| POST | /api/mocks/seed?qty=N | Inserccion de Usuarios, Pedidos y envios a la BBDD (todos son datos no reales) |

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

## Mocks.
Los Mocks que usaremos en esta API nos dan detalle de la generacion de usuarios, tanto clientes como repartidores, cantidad de pedidos y repartos. En forma de simulacion para poder verificar que todos los controladroes esten realizando de la mejor manera su trabajo. 

### Endpoints.
Los endPoints que se usaran son:
- GET /api/mocks/users?qty=N : El cual devuelve los usuarios simulados sin que estos queden guardados en nuestra Base de Datos. Cabe aclarar que N, es un numero entero, y es la cantidad de usuarios simulados que vayamos a crear. En el caso que no se agrege algun numero queda de manera predeterminada el numero 10, ademas tiene un limite de hasta 100 usuarios, por cada simulacion.
- POST /api/mocks/seed?qty=N : El cual genera e inserta usuarios, pedidos y envios a nuestra Base de Datos, todos son datos simulados, lo que significa que estos si son guardados de manera permanente en ella, por lo que cada vez que se ejecute la simulacion no se borraran las anteriores. Cabe aclarar que N, es un numero entero, y es la cantidad de datos que se generaran, ademas este numero hara que se generen esa misma cantidad de usuarios, pedidos y envios. En el caso que no se agrege algun numero queda de manera predeterminada el numero 10, ademas tiene un limite de hasta 100 usuarios, por cada simulacion.

### Relaciones.
Para comprender mejor la union de cada cosa hay que relacionar que cada pedido ingresado corresponde a un solo usuario, y cada uno de estos pedidos le corresponde un envio que queda a cargo de un solo repartidor, el cual es un usuario con otra responsabilidad (courier). En el caso que no salga ninguno de estos ultimos el envio quedara sin un repartidor asignado.

## Evidencias de Uso.
### A continuacios se veran, en formato de imagenes, las evidencias de como se verian el uso de las RUTAS mediante el uso del programa de POSTMAN.

#### Endpoints GET

- GET /api/users
![GET /api/users](images/GET%20api-users.png)

- GET /api/products
![GET /api/products](images/GET%20api-products.png)

- GET /api/products/id
![GET /api/products/id](images/GET%20api-products-id.png)

- GET /api/mocks/users
![GET /api/mocks/users?qty=N](images/GET%20-api-mocks.png)

#### Endpoints POST

- POST /api/users
![POST /api/users](images/POST%20-api-users.png)

- POST /api/products
![POST /api/products](images/POST%20-api-products.png)

- POST /api/mocks/seed
![POST /api/mocks](images/POST%20api-mocks.png)

#### Endpoints PATCH

- PATCH /api/products/:id
![PATCH /api/products/:id](images/PATCH%20api-products-id.png)

- PATCH /api/users/:id
![PATCH /api/users/:id](images/PATCH%20-api-users-id.png)

#### Endpoints DELETE

- DELETE /api/users/:id
![DELETE /api/users/:id](images/DELETE%20-api-users-id.png)

- DELETE /api/products/:id
![DELETE /api/products/:id](images/DELETE%20-api-products-id.png)
