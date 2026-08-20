# Herramienta de Auditoría ISO 27001

Dashboard interactivo para planificar, ejecutar y documentar una auditoría interna de un Sistema de Gestión de Seguridad de la Información (SGSI) bajo ISO/IEC 27001, aplicable a cualquier empresa y a cualquier combinación de controles del Anexo A.

## 🎯 Qué hace

Guía el proceso completo de una auditoría interna en 6 etapas:

1. **Plan de Auditoría** — objetivo, alcance y criterios
2. **Checklist aplicado** — controles del Anexo A verificados contra evidencia real
3. **Hallazgo** — generado automáticamente a partir de los controles marcados como "No cumple"
4. **No Conformidad** — redactada en sus 4 partes: requisito incumplido, evidencia objetiva, descripción de la desviación y clasificación
5. **Acción Correctiva** — corrección inmediata, análisis de causa raíz (5 Porqués) y plan de acción
6. **Cierre e Informe** — informe final generado automáticamente, descargable en HTML

## 🏢 Gestión de empresas

A diferencia de un caso fijo, esta herramienta permite crear y guardar distintas empresas a auditar (nombre y sector), y llevar el registro de auditorías realizadas a cada una por separado.

## 📋 Selección de dominios del Anexo A

Antes de armar el checklist, se eligen los dominios del Anexo A a auditar (por ejemplo: Políticas de seguridad, Roles y responsabilidades, Seguridad en RR.HH., Gestión de activos). Al seleccionarlos, sus preguntas de auditoría precargadas se cargan automáticamente al checklist — sin necesidad de escribirlas desde cero.

## 🖱️ Cómo usarlo

1. Creá o seleccioná una **empresa** desde el botón correspondiente
2. Elegí los **dominios del Anexo A** que querés auditar
3. Completá el **Plan de Auditoría** (objetivo, alcance, criterios)
4. En el **Checklist**, marcá cada control como "Sí cumple" o "No cumple" según la evidencia encontrada
5. Los controles marcados como "No cumple" generan automáticamente el **Hallazgo**
6. Redactá la **No Conformidad** y definí la **Acción Correctiva** con el análisis de los 5 Porqués
7. Revisá el **Informe final** y descargalo en HTML

## 💾 Sobre los datos

Todo se guarda en el navegador (localStorage) — empresas, auditorías y sus respuestas. No se envía nada a ningún servidor. Podés retomar una auditoría guardada en cualquier momento desde **"📁 Auditorías Guardadas"**.

## 🧩 Un caso de uso real

Para ver esta herramienta aplicada a un caso concreto, con un hallazgo real documentado de principio a fin, ver:

- [Auditoría ISO 27001 — Caso RutaVerde Logística](https://ezeayre.github.io/Ciberseguridad_Porfolio/FRAMEWORKS/auditoria-iso27001-rutaverde/index.html)

## 🔗 Proyecto relacionado

- [Marcos de Seguridad](https://ezeayre.github.io/Ciberseguridad_Porfolio/FRAMEWORKS/marcos-de-seguridad/index.html) — más contexto sobre ISO 27001 y otros marcos de seguridad

## 📚 Autor

Ezequiel Ayre

LinkedIn: [www.linkedin.com/in/ezequiel-ayre-6b753715b](https://www.linkedin.com/in/ezequiel-ayre-6b753715b)

GitHub: [github.com/Ezeayre](https://github.com/Ezeayre)
