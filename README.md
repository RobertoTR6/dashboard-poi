# POI 2026 - Guía de Uso

## 📁 Estructura del Proyecto

```
POI 2026/
├── poi_processor.py          # Script unificado de procesamiento
├── dashboard_poi.html        # Dashboard principal
├── data.js                   # Datos generados (auto-generado)
├── poi_data.json            # Datos en JSON (auto-generado)
├── POI20206.xlsx            # Archivo Excel fuente
├── css/
│   └── styles.css           # Estilos del dashboard
└── js/
    ├── config.js            # Configuración y constantes
    ├── dataProcessor.js     # Procesamiento de datos
    ├── charts.js            # Renderizado de gráficos
    ├── ui.js                # Utilidades de interfaz
    └── main.js              # Aplicación principal
```

## 🚀 Uso del Procesador

### 1. Convertir Excel a JSON

```bash
# Generar JSON y data.js para el dashboard
python poi_processor.py convert POI20206.xlsx --js

# Solo generar JSON
python poi_processor.py convert POI20206.xlsx -o mi_archivo.json
```

### 2. Analizar Estructura del Excel

```bash
# Ver primeras 10 filas
python poi_processor.py analyze POI20206.xlsx

# Ver primeras 5 filas
python poi_processor.py analyze POI20206.xlsx --rows 5
```

### 3. Validar Calidad de Datos

```bash
python poi_processor.py validate poi_data.json
```

## 📊 Usar el Dashboard

1. **Generar datos:**
   ```bash
   python poi_processor.py convert POI20206.xlsx --js
   ```

2. **Abrir el dashboard:**
   - Abre `dashboard_poi.html` en tu navegador
   - O usa un servidor local:
     ```bash
     python -m http.server 8000
     ```
     Luego visita: http://localhost:8000/dashboard_poi.html

## 🔧 Características del Nuevo Sistema

### Mejoras Implementadas

✅ **Manejo Robusto de Errores**
- Validación de archivos de entrada
- Logging detallado de operaciones
- Mensajes de error claros

✅ **Código Modular**
- JavaScript separado en módulos lógicos
- CSS en archivo independiente
- Fácil mantenimiento y testing

✅ **Validación de Datos**
- Verificación de campos requeridos
- Detección de valores vacíos
- Advertencias en el dashboard

✅ **Mejor UX**
- Estados de carga
- Mensajes de error informativos
- Búsqueda optimizada con debounce

## 📝 Notas

- Los archivos `data.js` y `poi_data.json` se generan automáticamente
- No es necesario editar manualmente los archivos generados
- El dashboard requiere que `data.js` exista para funcionar
