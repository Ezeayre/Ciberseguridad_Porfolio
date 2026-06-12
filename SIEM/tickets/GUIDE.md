# Guía de Tickets en SOC

## ¿QUÉ ES UN TICKET?

Un ticket es un **registro documentado** de un problema, solicitud o tarea que necesita ser resuelta. Es como un "expediente" digital que rastrea todo lo que pasó desde el inicio hasta la resolución.

**Analogía simple:** Si llamas al soporte de tu banco y te atienden, ellos crean un "número de caso" (eso es un ticket). Con ese número, vos y ellos pueden seguir tu problema en cualquier momento.

### En un SOC específicamente

Un ticket documenta una alerta de seguridad. Rastrea:
- Cuándo se detectó
- Quién lo está investigando
- Qué pasos se tomaron
- Cuál fue la resolución

Todo queda registrado y es auditable.

---

## ESTRUCTURA DE UN TICKET

Un ticket típicamente tiene estos campos:

| Campo | Qué es | Ejemplo |
|-------|--------|---------|
| **ID** | Número único del ticket | TICKET-12345 |
| **Título** | Resumen corto del problema | Alerta de phishing detectada |
| **Descripción** | Detalles completos | Email sospechoso de paypa1.com enviado a 150 usuarios... |
| **Prioridad** | Urgencia (Baja, Media, Alta, Crítica) | Alta |
| **Estado** | Dónde está (Abierto, En Progreso, Resuelto, Cerrado) | En Progreso |
| **Asignado a** | Quién lo está resolviendo | juan.garcia@empresa.com |
| **Reportado por** | Quién lo creó | Sistema SIEM automático |
| **Fecha de creación** | Cuándo se abrió | 2026-06-11 14:35 |
| **Fecha de actualización** | Última vez que se modificó | 2026-06-11 15:22 |
| **Categoría/Tipo** | Qué tipo de problema | Incident, Request, Change, Bug |
| **Etiquetas** | Palabras clave | phishing, email, security |
| **Comentarios** | Historial de acciones | "Bloqueado dominio en firewall", "Usuario educado" |
| **Archivos adjuntos** | Evidencia | Captura del email, logs |

---

## ¿DÓNDE SE USAN LOS TICKETS?

### SOC (Security Operations Center)
- Alertas de seguridad
- Incidentes de ciberseguridad
- Investigaciones forenses

### IT / Help Desk
- Solicitudes de acceso
- Problemas técnicos de equipos
- Restablecimiento de contraseñas

### Operaciones
- Tareas de mantenimiento
- Cambios en sistemas
- Provisioning de usuarios

### Desarrollo
- Bugs reportados
- Nuevas funcionalidades
- Mejoras

---

## CICLO DE VIDA DE UN TICKET

Un ticket pasa por estos estados:

### 1. **ABIERTO** (Open)
- Se acaba de crear
- Espera asignación
- Ejemplo: Alerta de phishing acaba de llegar al SIEM

### 2. **ASIGNADO** (Assigned)
- Alguien fue asignado para resolverlo
- Ejemplo: Juan fue asignado para investigar

### 3. **EN PROGRESO** (In Progress)
- Se está investigando/resolviendo
- Se toman acciones
- Ejemplo: Juan está bloqueando el dominio malicioso

### 4. **RESUELTO** (Resolved)
- Se completaron las acciones
- El problema se solucionó
- Ejemplo: Dominio bloqueado, usuarios educados

### 5. **CERRADO** (Closed)
- Se confirmó que todo está OK
- Se documenta la resolución final
- Ejemplo: Ticket cerrado, problema resuelto

---

## CÓMO LLENAR UN TICKET (PASO A PASO)

### Paso 1: Crear el ticket
En tu sistema (Jira, ServiceNow, etc.), haz clic en "Crear ticket"

### Paso 2: Llenar el título
**Título:** Algo corto y descriptivo
- ✅ "Alerta de phishing: email paypa1.com a 150 usuarios"
- ❌ "Email raro" (muy vago)

### Paso 3: Descripción
**Qué escribir:**
- ¿Qué pasó exactamente?
- ¿Cuándo?
- ¿Quién/Qué está afectado?
- ¿Por qué es importante?

**Ejemplo:**
"Se detectó email de phishing originado en paypa1.com (falso, dominio real es paypal.com) enviado a 150 usuarios a las 14:35. El email pide 'verificar cuenta o será cerrada'. 3 usuarios hicieron clic. 1 usuario ingresó credenciales. Riesgo: compromiso de cuenta."

### Paso 4: Prioridad
**Cómo decidir:**
- **Baja:** Problema pequeño, no urgente
- **Media:** Problema moderado, puede esperar horas
- **Alta:** Problema importante, necesita atención pronto
- **Crítica:** Emergencia, impacta múltiples usuarios/datos sensibles

**Para phishing:** Generalmente **Alta** o **Crítica** (si alguien ingresó datos)

### Paso 5: Categoría/Tipo
- **Incident:** Problema de seguridad (phishing, malware, hack)
- **Request:** Solicitud (acceso, cambio, información)
- **Change:** Cambio planificado (actualización, parche)
- **Bug:** Error técnico

**Para phishing:** Incident

### Paso 6: Asignar
- Si sabes quién debe resolverlo: asígnatelo
- Si no: déjalo sin asignar (alguien lo tomará)

### Paso 7: Etiquetas/Tags
Palabras clave que faciliten búsquedas:
- phishing, email, seguridad, urgente, etc.

### Paso 8: Attachments
- Email original
- Captura de pantalla
- Logs relevantes
- Análisis de VirusTotal

---

## EJEMPLO REAL: TICKET DE PHISHING

**Aquí cómo quedaría un ticket completo de phishing:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 TICKET-5847
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TÍTULO:
Alerta de phishing: Email paypa1.com a 150 usuarios

DESCRIPCIÓN:
Se detectó email de phishing a través del SIEM a las 14:35 del 11/06/2026.

Detalles:
- Remitente: no-reply@paypa1.com (falso, dominio real es paypal.com)
- Asunto: "Verifica tu cuenta o será cerrada"
- Destinatarios: 150 usuarios de la empresa
- Usuarios que hicieron clic: 3
- Usuarios que ingresaron credenciales: 1 (maria@empresa.com)

Acciones tomadas:
- Bloqueado dominio paypa1.com en email gateway
- Fuerza reset de contraseña para maria@empresa.com
- Monitoreo 24/7 de cuenta de maria

Impacto: Alto (alguien ingresó credenciales)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIORIDAD: Alta

ESTADO: En Progreso

CATEGORÍA: Incident

ASIGNADO A: juan.garcia@empresa.com

REPORTADO POR: SIEM (automático)

FECHA DE CREACIÓN: 2026-06-11 14:35

FECHA DE ACTUALIZACIÓN: 2026-06-11 15:22

ETIQUETAS: phishing, email, seguridad, urgente, credenciales

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMENTARIOS:

[14:40] juan.garcia: "Iniciando investigación. Confirmado: paypa1.com es dominio falso."

[14:50] juan.garcia: "Bloqueado dominio en firewall y email gateway. Contactando maria para reset de contraseña."

[15:00] maria: "Confirmado. Cambié mi contraseña. Vi que el email era raro pero pensé que era oficial."

[15:15] juan.garcia: "Monitoreo 24/7 establecido en cuenta de maria. Buscaré más emails similares de esa IP."

[15:22] juan.garcia: "Email identificado en 150 usuarios. 3 hicieron clic, 1 ingresó datos. Acción completada. A la espera de cambio de contraseña de maria para confirmar resolución."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ARCHIVOS ADJUNTOS:
- email_phishing.eml (archivo del email original)
- screenshot_email.png (captura)
- logs_firewall.txt (eventos de bloqueo)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## BUENAS PRÁCTICAS AL LLENAR TICKETS

### ✅ HACER:
- **Sé claro y específico** - "Email desde paypa1.com" no "Email raro"
- **Documenta todo** - Cada acción que tomes, anótala
- **Adjunta evidencia** - Capturas, logs, archivos
- **Actualiza regularmente** - No dejes el ticket sin comentarios
- **Usa comentarios para historial** - Las personas que lean después necesitan saber qué pasó
- **Asigna a la persona correcta** - Si no sabes quién, déjalo sin asignar

### ❌ NO HACER:
- No escribas tickets vagos - "Problema de seguridad" (¿cuál?)
- No dejes tickets abiertos sin actualizar - Actualiza al menos diariamente
- No olvides adjuntar evidencia
- No cambies de asignado sin avisar
- No cierres el ticket sin resolver el problema

---

## DIFERENCIA: TICKET vs ALERTA

| Aspecto | Alerta | Ticket |
|--------|--------|--------|
| **Origen** | Sistema automático (SIEM) | Manual o automático |
| **Propósito** | Notificar que algo pasó | Documentar y rastrear resolución |
| **Duración** | Instantánea | Días, semanas, meses |
| **Documentación** | Mínima | Completa y detallada |
| **Auditoría** | No siempre | Sí, siempre |

**Flujo:** Una **alerta** genera un **ticket** para investigar y resolver.

---

## CONCLUSIÓN

Los tickets son tu **evidencia documentada** de que:
- Detectaste el problema
- Lo investigaste correctamente
- Lo resolviste
- Quedó registrado para futuro análisis

En auditorías y cumplimiento normativo, los tickets son lo que piden. Sin tickets = no hay prueba de que hiciste tu trabajo.

---

Autor: Ezequiel Ayre
LinkedIn: www.linkedin.com/in/ezequiel-ayre-6b753715b
