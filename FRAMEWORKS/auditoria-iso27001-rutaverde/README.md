# Auditoría Interna ISO 27001 — Caso RutaVerde Logística

Dashboard interactivo que simula una auditoría interna de un Sistema de Gestión de Seguridad de la Información (SGSI) bajo ISO/IEC 27001, siguiendo el proceso real de auditoría: plan → checklist → hallazgo → no conformidad → acción correctiva → cierre e informe.

## 📋 De qué trata

El proyecto recorre las 6 etapas de una auditoría interna:

1. **Plan de Auditoría** — objetivo, alcance y criterios definidos antes de auditar
2. **Checklist aplicado** — verificación de controles del Anexo A contra evidencia real
3. **Hallazgo** — generado automáticamente a partir de los controles que no cumplen
4. **No Conformidad** — redactada en sus 4 partes: requisito incumplido, evidencia objetiva, descripción de la desviación y clasificación
5. **Acción Correctiva** — corrección inmediata, análisis de causa raíz con los 5 Porqués, y plan de acción con responsable y fecha
6. **Cierre e Informe** — informe final generado automáticamente, descargable en HTML

## 🧩 El caso

**RutaVerde Logística**, una empresa ficticia de logística. Durante la auditoría se detecta que el acceso de un ex empleado del depósito (usuario del sistema de gestión de almacén y tarjeta de acceso físico) **no fue revocado** al momento de su desvinculación, permaneciendo activo 21 días. Es un hallazgo simple y frecuente en auditorías reales de control de acceso — control **A.5.18** del Anexo A.

## ⚙️ Cómo funciona

Es una herramienta 100% interactiva: todos los campos son editables (podés cambiar el caso por completo si querés practicar con otro escenario), el checklist genera hallazgos automáticamente según lo que marques como "No cumple", y el informe final se arma solo con lo que hayas completado en cada paso, listo para descargar.

Las respuestas se guardan en el navegador (localStorage) mientras navegás — nada se sube a ningún servidor.

## 🔗 Proyecto relacionado

- [Marcos de Seguridad](https://ezeayre.github.io/Ciberseguridad_Porfolio/FRAMEWORKS/marcos-de-seguridad/index.html) — para más contexto sobre ISO 27001 y otros marcos de seguridad

## 📚 Autor

Ezequiel Ayre

LinkedIn: [www.linkedin.com/in/ezequiel-ayre-6b753715b](https://www.linkedin.com/in/ezequiel-ayre-6b753715b)

GitHub: [github.com/Ezeayre](https://github.com/Ezeayre)
