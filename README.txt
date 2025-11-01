RAICESAPP - Instrucciones rápidas

1) Requisitos:
   - Node.js (16+ recomendado) y npm
   - Tener proyecto Firebase configurado (ya incluído en src/firebase.js)

2) Instalar dependencias:
   npm install

3) Ejecutar en local:
   npm run dev
   Abrir http://localhost:5173

4) Firebase:
   - Usa Firebase Auth y Firestore.
   - El admin se crea automáticamente la primera vez que arranque la app (admin@raicesdejaen.com / Sergiochulo).
   - Ver usuarios y Firestore en la consola Firebase.

5) Desplegar en Netlify:
   - Build: npm run build
   - Subir la carpeta 'dist' a Netlify o conectar GitHub (build command: npm run build, publish: dist)

6) Seguridad:
   - Revisa reglas de Firestore en la consola para proteger los datos.
