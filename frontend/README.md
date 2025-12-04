# WalkAware Frontend

A WalkAware frontend alkalmazása, amely **React**, **TypeScript** és **Vite** technológiákkal készült. Ez biztosítja a felhasználói felületet mind a gyalogosok, mind a sofőrök számára.

## Futtatás Dockerrel (Ajánlott)

A legegyszerűbb módja a futtatásnak a gyökérkönyvtárból indított Docker Compose:

```bash
docker-compose up --build
```

A Docker Compose automatikusan átadja a megfelelő build argumentumokat (`VITE_API_URL`, `VITE_SHOW_DEBUG`), így a frontend a lokális backendhez csatlakozik és megjeleníti a debug eszközöket.

## Lokális Fejlesztői Környezet (Docker nélkül)

Ha közvetlenül a gépeden szeretnéd futtatni a frontendet (pl. gyorsabb fejlesztéshez), létre kell hoznod egy `.env` fájlt a megfelelő beállításokkal, hogy a Docker környezethez hasonlóan működjön.

### Előfeltételek

- Node.js (v18+)
- npm

### Telepítés

1.  Lépj be a frontend könyvtárba:
    ```bash
    cd frontend
    ```

2.  Telepítsd a függőségeket:
    ```bash
    npm install
    ```

### Konfiguráció (.env)

Hozz létre egy `.env` fájlt a `frontend` könyvtárban, és másold bele az alábbiakat. Ezek a beállítások megegyeznek a `docker-compose.yml`-ben definiáltakkal:

```dotenv
# A backend API URL-je (lokális fejlesztéshez a localhost-ot kell használni)
# Dockerben ez: http://localhost:8000
VITE_API_URL="http://localhost:8000"

# Debug UI elemek (pl. manuális pozíció, szenzor debug) engedélyezése
# Dockerben ez: true
VITE_SHOW_DEBUG="true"
```

### Alkalmazás Futtatása

A fejlesztői szerver indítása:

```bash
npm run dev
```

Az alkalmazás elérhető lesz a `http://localhost:5173` címen.
