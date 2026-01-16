# BuSolid 🚌

App web progresiva (PWA) para consultar horarios en tiempo real de los autobuses urbanos de Valladolid.

## 🌟 Características

- ✅ Mapa interactivo con todas las paradas de autobús
- ✅ Tiempos de llegada en tiempo real
- ✅ Búsqueda de paradas cercanas con geolocalización
- ✅ Sistema de favoritos
- ✅ Funciona offline (PWA)
- ✅ Diseño responsive y moderno
- ✅ Modo oscuro

## 🚀 Despliegue en Netlify

### Opción 1: Desde el repositorio Git

1. Haz fork o clona este repositorio
2. Ve a [Netlify](https://app.netlify.com/)
3. Click en "Add new site" > "Import an existing project"
4. Conecta tu repositorio de GitHub/GitLab/Bitbucket
5. Netlify detectará automáticamente la configuración en `netlify.toml`
6. Click en "Deploy site"

### Opción 2: Deploy manual (drag & drop)

1. Ve a [Netlify Drop](https://app.netlify.com/drop)
2. Arrastra la carpeta completa del proyecto
3. ¡Listo! Tu app estará disponible en unos segundos

## 🛠️ Tecnologías

- HTML5 + CSS3 + JavaScript vanilla
- Leaflet.js para mapas interactivos
- API GTFS de VallaBus
- Service Worker para funcionalidad offline
- TailwindCSS para estilos

## 📱 Instalación como PWA

Una vez desplegado en Netlify:

1. Abre la app en Chrome/Edge/Safari en tu móvil
2. Verás una opción "Añadir a pantalla de inicio"
3. Acepta y tendrás la app como icono en tu móvil

## 🔧 Desarrollo local

Para probar localmente, necesitas servir los archivos con un servidor HTTP (no abrirlos directamente):

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx serve

# Con PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

## 📄 Licencia

MIT

## 🙏 Créditos

- Datos de autobuses: [VallaBus GTFS API](https://gtfs.vallabus.com/)
- Mapas: OpenStreetMap
