# 📊 Log Analyzer - SOC Dashboard

Un dashboard para análisis de logs diseñado para analistas de ciberseguridad. Carga logs, detecta eventos de seguridad, clasifica riesgos y genera reportes PDF profesionales automáticamente.

## ✨ Características

- 🖥️ **Interfaz moderna** - Dashboard web con React + TailwindCSS
- 📋 **Análisis múltiple** - Procesa uno o varios logs simultáneamente
- 🔗 **Correlaciones** - Detecta eventos relacionados automáticamente
- 📊 **Estadísticas** - Métricas de eventos, distribución de riesgos
- 📄 **Reportes PDF** - Genera reportes profesionales con estándares SOC
- ⚡ **100% local** - Funciona sin internet, sin API keys externas

## 🎯 Para Quién Es

- Analistas SOC junior sin experiencia en análisis de logs
- Cualquiera que necesite interpretar logs rápidamente
- Equipos de seguridad que necesitan reportes profesionales
- Estudiantes de ciberseguridad aprendiendo análisis de incidentes

## 📋 Requisitos

- Node.js 18+

## 🚀 Instalación Rápida

```bash
# Backend
cd backend
npm install
npm start

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

Backend en `http://localhost:5000`
Frontend en `http://localhost:3002`

## 💡 Cómo Funciona el Análisis

1. **Carga** - Sube archivo .log, .txt o pega texto directamente
2. **Análisis** - El sistema identifica patrones de seguridad conocidos
3. **Clasificación** - Asigna nivel de riesgo (Bajo/Medio/Alto/Crítico)
4. **Correlación** - Agrupa eventos similares y detecta relaciones
5. **Reporte** - Genera PDF con evidencias y recomendaciones

## 📖 Uso

### Análisis Individual

1. Carga un log (archivo o texto)
2. Haz clic en "Analizar Log"
3. Revisa: Nivel de riesgo, evento detectado, resumen, acciones recomendadas, pasos a seguir
4. Exporta a PDF

### Análisis Múltiple

1. Carga múltiples logs
2. El sistema agrupa eventos similares automáticamente
3. Selecciona eventos específicos para exportar (o todos)
4. Genera reporte PDF con los seleccionados

## 📝 Ejemplos de Logs

```
[ERROR] 2024-01-15 10:30:45 Failed login attempt from IP 192.168.1.100 for user admin
```

```
[CRITICAL] 2024-01-15 18:45:33 SQL injection attempt detected: SELECT * FROM users WHERE id='1' OR '1'='1'
```

```
[WARNING] 2024-01-15 14:22:11 Unusual traffic pattern from 10.0.0.50 - 5000 requests in 1 minute
```

## 🎓 Eventos Detectados

El sistema reconoce automáticamente:
- Failed/Successful Login
- SQL Injection, XSS, Brute Force
- DDoS, Malware, Data Exfiltration
- Unauthorized Access, Port Scan
- Configuration/System/Certificate Errors
- Firewall Blocks, Suspicious File Access

## 📄 Reportes PDF

Los reportes incluyen:
- Información General (fecha, evento, confianza)
- Resumen Ejecutivo
- Descripción completa del evento
- Evidencias y indicadores
- Clasificación y Severidad
- Impacto y Recomendaciones
- Pasos de respuesta detallados
- Múltiples páginas automáticas (sin cortes)

## 🏗️ Estructura del Proyecto

```
log-analyzer/
├── frontend/          # React + TailwindCSS
│   └── src/
│       └── components/LogAnalyzer.tsx
├── backend/           # Node.js + Express
│   └── server.js
└── README.md
```

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express
- **PDF**: jsPDF
- **Iconos**: Lucide React

## 🌐 Características Técnicas

- ✅ Sin dependencias externas
- ✅ CORS habilitado
- ✅ LocalStorage para persistencia
- ✅ Análisis en tiempo real
- ✅ Patrones predefinidos extensibles
- ✅ Eventos correlacionados con borde ámbar
- ✅ Grupos expandibles/colapsables

## 📌 Notas

- Funciona 100% local, sin conexión a internet requerida
- Los logs no se almacenan en el servidor
- Los análisis se guardan en el navegador (LocalStorage)
- Puedes agregar nuevos patrones editando `backend/server.js`

---

**Para consultas o problemas**: Revisa la consola del navegador y del servidor para mensajes de error.


Autor: Ezequiel Ayre
LinkedIn: www.linkedin.com/in/ezequiel-ayre-6b753715b
GitHub: github.com/Ezeayre
