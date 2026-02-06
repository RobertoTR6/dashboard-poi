# 🐛 Solución de Problemas - Dashboard POI 2026

## Problema Reportado: Filtro no funciona

### Pasos para Diagnosticar

1. **Abre el dashboard en tu navegador:**
   - Navega a: `dashboard_poi.html`
   - Abre la Consola del Desarrollador (F12)

2. **Verifica los mensajes en consola:**
   - Deberías ver: `"Data loaded: 1702 rows"`
   - Deberías ver: `"Setting up CC filter event listener"`

3. **Prueba el filtro:**
   - Cambia el dropdown a "Actividades Operativas"
   - En la consola deberías ver:
     ```
     Filter changed to: operativa
     aggregateCCData called with filterType: operativa
     Input data length: 1702
     After base filter: XXXX
     After operativa filter: XXXX
     Final ccCounts: [...]
     ```

4. **Si no ves los mensajes:**
   - Verifica que `data.js` existe
   - Verifica que no hay errores de carga de scripts
   - Asegúrate de haber ejecutado: `python poi_processor.py convert POI20206.xlsx --js`

### Posibles Causas

#### Causa 1: data.js no generado
**Solución:**
```bash
python poi_processor.py convert POI20206.xlsx --js
```

#### Causa 2: Archivos JS no cargados
**Verificar en consola:**
- Busca errores tipo "Failed to load resource"
- Verifica que todos los archivos existan en las carpetas `js/` y `css/`

#### Causa 3: Error de JavaScript
**Verificar en consola:**
- Busca errores en rojo
- Verifica que D3.js se haya cargado correctamente

### Archivos Modificados para Debugging

He agregado logging extensivo en:
- `js/main.js` - Event listener setup
- `js/dataProcessor.js` - Función aggregateCCData

### Prueba Manual

Si el filtro sigue sin funcionar después de revisar la consola, por favor:

1. Toma una captura de pantalla de la consola (F12)
2. Comparte el mensaje de error exacto
3. Verifica que los archivos estén en la ubicación correcta:
   ```
   POI 2026/
   ├── dashboard_poi.html
   ├── data.js ← ¿Existe?
   ├── css/
   │   └── styles.css
   └── js/
       ├── config.js
       ├── dataProcessor.js
       ├── charts.js
       ├── ui.js
       └── main.js
   ```

### Contacto

Si el problema persiste, proporciona:
- Captura de la consola del navegador
- Mensaje de error específico
- Navegador que estás usando (Chrome, Firefox, Edge, etc.)
