# Firebase Realtime Database vs Cloud Firestore

Firebase ofrece dos bases de datos NoSQL principales:

- **Realtime Database** (la más antigua)
- **Cloud Firestore** (la más moderna y recomendada para nuevos proyectos)

Aunque ambas almacenan datos en la nube y sincronizan información en tiempo real, tienen diferencias importantes.

---

# 1. Realtime Database

## ¿Qué es?

Realtime Database es una base de datos NoSQL que almacena toda la información en un único árbol JSON.

Su principal característica es que todos los clientes conectados reciben los cambios inmediatamente.

---

## Estructura

Todo se guarda como un gran objeto JSON.

```json
{
  "users": {
    "uid1": {
      "name": "Frank",
      "age": 37
    },
    "uid2": {
      "name": "Juan",
      "age": 25
    }
  }
}
```

Visualmente:

```
Root
│
├── users
│     ├── uid1
│     │      ├── name
│     │      └── age
│     │
│     └── uid2
│            ├── name
│            └── age
```

---

## Cómo funciona

Cuando un cliente modifica un dato:

```
Cliente A
     │
     ▼
Realtime Database
     │
     ├────────► Cliente B
     ├────────► Cliente C
     └────────► Cliente D
```

Todos reciben el cambio inmediatamente.

---

## Ventajas

- Muy rápida.
- Baja latencia.
- Excelente para sincronización en tiempo real.
- API sencilla.

---

## Desventajas

- Consultas limitadas.
- Escala peor para proyectos grandes.
- Toda la base es un árbol JSON.
- Puede ser difícil organizar mucha información.

---

## Casos de uso

- Chats.
- Juegos multijugador.
- Estado en tiempo real.
- Sensores IoT.
- Presencia de usuarios.

---

# 2. Cloud Firestore

## ¿Qué es?

Cloud Firestore es la evolución de Realtime Database.

También es una base de datos NoSQL, pero utiliza documentos y colecciones en lugar de un único árbol JSON.

Es mucho más escalable.

---

## Estructura

```
users (Collection)
│
├── uid1 (Document)
│      ├── name
│      ├── age
│      └── city
│
└── uid2 (Document)
       ├── name
       ├── age
       └── city
```

Cada documento puede contener:

- campos
- mapas
- arreglos
- subcolecciones

Ejemplo:

```
users
│
└── uid1
      │
      ├── name
      ├── age
      │
      └── orders
             │
             ├── order1
             ├── order2
             └── order3
```

---

## Ejemplo de documento

```json
{
  "name": "Frank",
  "age": 37,
  "country": "Peru"
}
```

---

## Cómo funciona

```
Cliente A
      │
      ▼
Cloud Firestore
      │
      ├────────► Cliente B
      ├────────► Cliente C
      └────────► Cliente D
```

También sincroniza en tiempo real, pero usando documentos.

---

## Ventajas

- Mucho más escalable.
- Consultas avanzadas.
- Índices automáticos.
- Mejor organización.
- Subcolecciones.
- Mejor integración con Firebase.
- Recomendado por Google.

---

## Desventajas

- Puede ser ligeramente más costoso según el patrón de acceso.
- Modelo de datos diferente al de Realtime Database.

---

## Casos de uso

- Aplicaciones móviles.
- Aplicaciones web.
- Redes sociales.
- E-commerce.
- Sistemas empresariales.
- Dashboards.
- Inventarios.

---

# Comparación

| Característica                    | Realtime Database | Cloud Firestore          |
| --------------------------------- | ----------------- | ------------------------ |
| Modelo                            | Árbol JSON        | Colecciones y documentos |
| Tiempo real                       | Sí                | Sí                       |
| Escalabilidad                     | Media             | Alta                     |
| Consultas                         | Básicas           | Avanzadas                |
| Índices                           | Limitados         | Automáticos              |
| Subcolecciones                    | No                | Sí                       |
| Organización                      | Más difícil       | Más sencilla             |
| Recomendado para nuevos proyectos | No                | Sí                       |

---

# Ejemplo práctico

## Realtime Database

```
root
│
├── users
│     ├── uid1
│     └── uid2
│
├── products
│     ├── p1
│     └── p2
│
└── orders
      ├── o1
      └── o2
```

Todo pertenece al mismo árbol JSON.

---

## Firestore

```
users
│
├── uid1
└── uid2

products
│
├── p1
└── p2

orders
│
├── o1
└── o2
```

Cada colección es independiente.

---

# Seguridad

Ambas utilizan Firebase Security Rules.

Realtime Database:

```javascript
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Firestore:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write:
          if request.auth != null &&
             request.auth.uid == userId;
    }

  }
}
```

---

# Costos

## Realtime Database

Principalmente cobra por:

- almacenamiento
- ancho de banda (datos transferidos)
- conexiones simultáneas

---

## Firestore

Principalmente cobra por:

- número de lecturas (reads)
- número de escrituras (writes)
- número de eliminaciones (deletes)
- almacenamiento

Por ello, el diseño de las consultas en Firestore influye directamente en el costo.

---

# ¿Cuál elegir?

Usa **Realtime Database** cuando:

- necesites sincronización extremadamente rápida;
- desarrolles chats simples;
- trabajes con presencia de usuarios;
- construyas aplicaciones IoT.

Usa **Cloud Firestore** cuando:

- desarrolles una aplicación nueva;
- necesites consultas complejas;
- el proyecto deba crecer;
- requieras una mejor organización de los datos;
- busques una solución escalable y mantenible.

En la mayoría de los proyectos nuevos, **Cloud Firestore es la opción recomendada por Google**.
