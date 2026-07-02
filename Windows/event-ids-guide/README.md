# 🎯 Guía de Event IDs Windows para SOC

**Herramienta de referencia rápida para analistas de SOC | Windows Event IDs & Response Playbooks**

---

## 📋 Descripción

Esta es una guía interactiva de **Event IDs de Windows** diseñada específicamente para analistas de SOC (Security Operations Center). Contiene más de **130 Event IDs** organizados por severidad, con **Response Playbooks** para eventos críticos y de alta severidad.

### ✨ Características Principales

- **🔍 Buscador con autocompletado** - Encuentra cualquier Event ID rápidamente mientras escribes
- **📋 Response Playbooks** - Pasos de investigación y respuesta para eventos críticos
- **🎨 Clasificación por severidad** - CRITICAL, HIGH, MEDIUM, LOW con colores distintivos
- **📌 Event IDs más comunes** - Los 10 Event IDs que más aparecen en logs de seguridad
- **📋 Listas expandibles** - Acceso rápido a eventos por categoría de severidad
- **📋 Botones de copiar** - Copia cualquier Event ID al buscador con un clic
- **🎯 Todo en un archivo** - HTML autocontenido, fácil de desplegar

---

## 🎯 ¿Por qué es útil?

En un SOC, los analistas necesitan **identificar rápidamente** qué significa un Event ID y **cómo responder** ante incidentes de seguridad. Esta guía:

- **Ahorra tiempo** - No necesitas buscar en documentación oficial de Microsoft cada vez
- **Proporciona contexto** - Cada Event ID tiene descripción clara y severidad
- **Guía la respuesta** - Response Playbooks con pasos específicos para incidentes
- **Es práctica** - Diseñada para uso diario en operaciones de seguridad

---

## 🚀 Cómo usar

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- No requiere instalación ni dependencias

### Instalación

Clona el repositorio:
```bash
git clone https://github.com/Ezeayre/windows-event-ids-guide.git
cd windows-event-ids-guide
```

### Ejecución

Simplemente abre el archivo HTML en tu navegador:
```bash
# En Windows
start event-ids-soc.html

# En Linux/Mac
open event-ids-soc.html

# O simplemente haz doble clic en el archivo
```

---

## 🎨 Cómo funciona

### 🔍 Buscador Rápido
1. Escribe un número de Event ID en el buscador
2. El autocompletado te mostrará sugerencias mientras escribes
3. Selecciona una sugerencia o presiona Enter
4. Verás la información completa del evento

### � Response Playbooks
Los eventos **CRITICAL** y **HIGH** incluyen Response Playbooks con:
- Pasos de investigación
- Qué verificar
- Cómo responder
- Cuándo escalar

### 📌 Event IDs Principales
La sección superior muestra los **10 Event IDs más comunes** en logs de seguridad, perfectos para referencia rápida.

### 📋 Listas Expandibles
Organizadas por severidad:
- 🔴 **CRÍTICO** - Eventos que requieren acción inmediata
- 🟠 **ALTO** - Eventos importantes que necesitan investigación
- 🟡 **MEDIO** - Eventos a monitorear

---

## � Ejemplo de Uso

### Escenario: Fuerza Bruta Detectada

1. **Buscador:** Escribe "4625" (Logon Fallido)
2. **Resultado:** Verás que es un evento CRITICAL
3. **Response Playbook:**
   - Buscar múltiples intentos del mismo usuario/IP
   - Verificar Status Code (0xC000006A=password incorrecto)
   - Verificar origen geográfico
   - Si es fuerza bruta: bloquear IP y notificar

### Escenario: Privilege Escalation

1. **Buscador:** Escribe "4728" (Miembro Agregado a Grupo Global)
2. **Resultado:** Verás que es un evento CRITICAL
3. **Response Playbook:**
   - Verificar quién agregó al usuario
   - Validar autorización
   - Investigar si es privilege escalation
   - Revisar permisos del grupo

---

## 📚 Event IDs Incluidos

### Categorías Principales

- **🔐 Logon/Logoff** - 4624, 4625, 4634, 4647, 4648, 4649
- **👤 Account Management** - 4720, 4722, 4723, 4724, 4725, 4726, 4728
- **🎫 Kerberos** - 4768, 4769, 4770, 4771, 4772, 4776
- **💻 Process Creation** - 4688, 4689, 4690
- **📅 Scheduled Tasks** - 4698, 4699, 4700, 4701, 4702
- **🔧 Object Access** - 4656, 4657, 4658, 4660, 4661, 4662, 4663
- **📝 Audit Policy** - 4703, 4704, 4705, 4713, 4715
- **🗑️ Log Clearing** - 1102, 1104
- **⚡ System Events** - 6005, 6006, 6008, 41
- **🐧 PowerShell** - 4104, 4105, 4106

**Total:** 130+ Event IDs con descripciones y Response Playbooks

---

## 🔧 Tecnologías

- **HTML5** - Estructura de la página
- **CSS3** - Diseño moderno y responsivo
- **JavaScript** - Funcionalidad de búsqueda, autocompletado y copiado
- **Single File** - Todo en un archivo HTML para fácil despliegue

---

## 💡 Mejoras Futuras

- [ ] Agregar más Event IDs específicos de Exchange/SharePoint
- [ ] Filtros avanzados por tipo de evento
- [ ] Exportar resultados a CSV/JSON
- [ ] Modo oscuro/claro
- [ ] Integración con APIs de threat intelligence
- [ ] Agregar ejemplos de consultas PowerShell/LogParser

---

## 📖 Lo que Aprendí

Con este proyecto practiqué:

✅ HTML5 y CSS3  
✅ JavaScript (DOM manipulation, eventos)  
✅ Diseño de interfaces interactivas  
✅ Organización de información técnica  
✅ Response Playbooks para incidentes  
✅ Windows Event Logs y seguridad  
✅ Versionado con Git y GitHub  

---

## 🔐 Notas de Seguridad

⚠️ Esta guía es **educativa** y de referencia. En un entorno real de SOC:
- Siempre valida la información con documentación oficial de Microsoft
- Los Response Playbooks son guías generales, adapta a tu entorno
- Integra con tu SIEM/SOAR para automatización
- Mantén actualizada la guía con nuevos Event IDs
- Considera tu contexto específico (AD, Azure AD, etc.)

---

## 📞 Contacto

- **GitHub:** [@Ezeayre](https://github.com/Ezeayre)
- **Interés:** Ciberseguridad, SOC, Windows Security, Incident Response

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo licencia MIT.

---

## 🙏 Recursos Adicionales

- [Microsoft Windows Event ID Documentation](https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/plan/appendix-l--events-to-monitor)
- [MITRE ATT&CK Matrix](https://attack.mitre.org/matrices/enterprise/)
- [Splunk Windows Event ID Reference](https://www.splunk.com/en_us/blog/tips-and-tricks/windows-event-id-mapping.html)

---

**Última actualización:** Julio 2026  
**Versión:** 1.0  
**Autor:** Ezequiel Ayre
