# Script de Auditoría de Usuarios en Linux

**Proyecto de aprendizaje en ciberseguridad | Scripting en Bash**

---

## 📋 Descripción

Este es un script bash que realiza una auditoría básica de usuarios en un sistema Linux. Extrae información de seguridad fundamental como:

- **Usuarios con acceso a shell:** Identifica qué usuarios pueden realmente usar la terminal
- **Usuarios con privilegios sudo:** Detecta quiénes tienen acceso privilegiado (superpoderes)
- **Usuarios activos en el sistema:** Muestra quién está conectado en este momento

El propósito de este script es demostrar conocimiento fundamental en **gestión de permisos, usuarios del sistema y herramientas de auditoría en Linux**.

---

## 🎯 ¿Por qué es importante?

En ciberseguridad, conocer **quién accede a tu sistema y qué permisos tiene** es crítico para:
- Detectar accesos no autorizados
- Auditar la configuración de seguridad
- Monitorear cambios en usuarios privilegiados
- Cumplir con políticas de seguridad

Este script es un primer paso para automatizar estas verificaciones.

---

## 🚀 Cómo usar

### Requisitos
- Sistema Linux (Ubuntu, Debian, Fedora, etc.)
- Acceso a terminal
- Bash instalado (viene por defecto)

### Instalación

Clona el repositorio:
```bash
git clone https://github.com/Ezeayre/script-usuarios-linux.git
cd script-usuarios-linux
```

Dale permisos de ejecución:
```bash
chmod 755 scrips_usuarios.sh
```

### Ejecución

Ejecuta el script:
```bash
./scrips_usuarios.sh
```

O sin darle permisos previos:
```bash
bash scrips_usuarios.sh
```

---

## 📊 Ejemplo de Salida

```
==========================================
INFORMACIÓN DE USUARIOS DEL SISTEMA
==========================================

1. LISTADO DE USUARIOS CON ACCESO A SHELL:
---
root      0  /root           /bin/bash
usuario   1000  /home/usuario   /bin/bash
maria     1001  /home/maria     /bin/bash

2. USUARIOS CON PRIVILEGIOS DE SUDO:
---
usuario,maria

3. USUARIOS ACTIVOS AHORA MISMO:
---
usuario   tty7        2024-05-16 16:30

==========================================
```

---

## 🔧 ¿Cómo funciona?

El script utiliza comandos fundamentales de Linux:

### 1. `cat /etc/passwd`
Lee el archivo de usuarios del sistema

### 2. `cut -d: -f1,3,6,7`
Extrae solo las columnas necesarias (nombre, ID, home, shell)

### 3. `grep -v "/nologin\|/false"`
Elimina usuarios "falsos" que no pueden acceder de verdad

### 4. `getent group sudo`
Busca el grupo sudo para identificar usuarios privilegiados

### 5. `who`
Muestra sesiones activas en el sistema

---

## 📚 Conceptos de Seguridad Aplicados

- **Principio de menor privilegio:** Entender quién tiene qué permisos
- **Auditoría de usuarios:** Inspeccionar quiénes acceden al sistema
- **Identificación de riesgos:** Detectar usuarios innecesarios con sudo
- **Automatización:** Usar scripts para tareas repetitivas

---

## 📖 Lo que Aprendí

Con este proyecto practiqué:

✅ Scripting en Bash  
✅ Comandos de auditoría de usuarios (cat, cut, grep, getent, who)  
✅ Permisos en Linux (chmod, rwx)  
✅ Pipes (|) para encadenar comandos  
✅ Versionado con Git y GitHub  
✅ Documentación de código  

---

## 🔐 Notas de Seguridad

⚠️ Este script es **educativo**. En un entorno real de producción:
- Ejecuta con privilegios adecuados
- Integra con herramientas de monitoreo como auditd
- Usa scripts de auditoría más robustos (bastille, Lynis)
- Mantén logs de cambios

---

## 📞 Contacto

- **GitHub:** [@Ezeayre](https://github.com/Ezeayre)
- **Interés:** Ciberseguridad, Linux, Scripting
- **Linkedin:**[www.linkedin.com/in/ezequiel-ayre-6b753715b](https://www.linkedin.com/in/ezequiel-ayre-6b753715b) 
---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo licencia MIT.

---

**Última actualización:** Mayo 2024  
**Versión:** 1.0
