# Análisis Forense del Archivo Swap en Linux

Proyecto de análisis forense digital que demuestra cómo recuperar información sensible volcada en el archivo swap de un sistema Linux.

## 🎯 ¿Qué hicimos?

1. Abrimos un archivo (`/etc/passwd`) en Emacs
2. Limitamos la memoria RAM disponible (1 MB)
3. Forzamos que los datos se volcaran al swapfile
4. Extrajimos el swapfile del sistema
5. Analizamos el swapfile con Autopsy (herramienta forense)
6. **Recuperamos información de `/etc/passwd` del swapfile**

---

## 📋 Paso a Paso

### Paso 1: Verificar ubicación del swapfile
```bash
ls -la / | grep swapfile
```
**Resultado:** Swapfile encontrado en `/swapfile` con 2.2 GB

![Swapfile verificado](./screenshots/2026-05-18%2020-09-54.png)

### Paso 2: Cargar archivo en memoria con Emacs
```bash
emacs /etc/passwd
```
Esto carga el contenido de `/etc/passwd` en memoria RAM.

![Emacs con passwd](./screenshots/2026-05-18%2020-14-54.png)

### Paso 3: Obtener el PID del proceso
```bash
ps
```
**Resultado:** PID de emacs = 4366

![PID de Emacs](./screenshots/2026-05-18%2020-17-29.png)

### Paso 4: Limitar memoria para forzar swapping
```bash
prlimit --as=1000000 -p 4366
```
**Explicación:** Limitamos a 1 MB la memoria disponible. Cuando Emacs intente usar más, volcará datos al swapfile.

![Comando prlimit](./screenshots/2026-05-18%2020-18-53.png)

### Paso 5: Traer Emacs al primer plano e intentar abrir otro archivo
```bash
fg
```
Luego presionar `Ctrl+X Ctrl+F` en Emacs.

**Resultado:** Emacs crashea con "Fatal error 11" y "Segmentation fault".
**¿Por qué?** Los datos de `/etc/passwd` fueron volcados al swapfile para liberar RAM.

![Emacs bloqueado](./screenshots/2026-05-18%2020-20-16.png)

### Paso 6: Copiar el swapfile
```bash
sudo cp /swapfile ~/Desktop/swapfile
sudo chmod 644 ~/Desktop/swapfile
```

![Copia del swapfile](./screenshots/2026-05-18%2020-22-18.png)

### Paso 7: Analizar con Autopsy
- Abrir Autopsy: `autopsy`
- Crear nuevo caso: "swapfile_forense"
- Agregar host: "linux-vm"
- Agregar imagen: `/home/eze2/Desktop/swapfile`
- Extraer strings ASCII y Unicode
- Realizar búsqueda de palabras clave

![Autopsy New Case](./screenshots/2026-05-18%2020-23-28.png)

![Autopsy Add Host](./screenshots/2026-05-18%2020-26-11.png)

![Autopsy análisis en progreso](./screenshots/2026-05-18%2020-29-03.png)

### Paso 8: Búsqueda y recuperación
Buscar en Autopsy: `root:x:`

**Resultado encontrado:**
```
2 occurrences of root:x: were found
Unit 960 (Hex - Ascii): root:x:0:0:r
Unit 968 (Hex - Ascii): root:x:0:
```

![Resultados búsqueda root:x:](./screenshots/2026-05-18%2020-29-42.png)

También encontramos: `daemon:x:`
```
2 occurrences of daemon:x: were found
Unit 960 (Hex - Ascii): daemon:x:1:1:d
Unit 968 (Hex - Ascii): daemon:x:1:
```

![Resultados búsqueda daemon:x:](./screenshots/2026-05-19%2000-58-45.png)

---

## 🔑 Conceptos Clave

| Término | Significado |
|---------|------------|
| **Swapfile** | Espacio en disco que actúa como extensión de memoria RAM |
| **Swapping** | Proceso de volcar datos de RAM a disco |
| **prlimit** | Comando que limita recursos de un proceso |
| **Autopsy** | Herramienta forense para análisis de datos |
| **Keyword Search** | Búsqueda de patrones de texto en datos |
| **Memory Forensics** | Análisis de memoria para recuperar evidencia |

---

## 📊 Lo Que Demuestra

✅ Comprensión de gestión de memoria en Linux
✅ Conocimiento del archivo swap y su importancia forense
✅ Uso de herramientas forenses profesionales (Autopsy)
✅ Capacidad de extraer y analizar evidencia digital
✅ Entendimiento de por qué el swap es una fuente de evidencia
✅ Habilidades de investigación y debugging
✅ Conocimiento práctico de memory forensics

---

## 🛡️ Implicaciones de Seguridad

**¿Por qué esto es importante?**

Información sensible que creemos está solo en memoria RAM puede persistir en el swapfile:
- Contraseñas
- Documentos confidenciales
- Datos personales
- Secretos de aplicaciones

**Recomendaciones:**
- Cifrar el swapfile en sistemas productivos
- Realizar borrado seguro del swap al desechar equipos
- En análisis forense, siempre revisar el swapfile como fuente de evidencia
- En ambientes críticos, deshabilitar el swapfile si es posible

---

## 🎓 Lo Que Aprendí

Con este proyecto practiqué:

✅ Análisis forense digital real
✅ Uso de herramientas profesionales (Autopsy, prlimit)
✅ Comprensión profunda del kernel de Linux
✅ Gestión de memoria y swapping
✅ Recuperación de evidencia digital
✅ Investigación de sistemas comprometidos
✅ Documentación de procedimientos forenses

---

**"¿Qué es un swapfile y por qué es importante en forense?"**

"El swapfile es un área de disco que el kernel usa como extensión de RAM. Cuando un proceso se queda sin memoria, el kernel vuelca datos menos usados al swapfile. En forense, es crucial porque información que el usuario creía volátil (solo en memoria) persiste en disco. Con Autopsy pude recuperar contenido de `/etc/passwd` del swapfile, demostrando que es una fuente valiosa de evidencia."

**"¿Cómo forzaste el swapping?"**

"Usé `prlimit` para limitar la memoria disponible de un proceso a 1 MB. Cuando intentó hacer una operación que requería más memoria, el kernel volcó automáticamente datos al swapfile. Esto simuló un escenario real donde un sistema bajo presión de memoria. El resultado fue un crash de Emacs, pero los datos ya estaban en el swapfile."

**"¿Por qué elegiste Autopsy?"**

"Autopsy es una herramienta forense estándar en la industria. Tiene búsqueda de keywords, análisis automático y extrae strings de diferentes codificaciones (ASCII y Unicode). Es exactamente lo que usan investigadores forenses profesionales en casos reales."

**"¿Qué encontraste?"**

"Encontré 2 ocurrencias de 'root:x:' y 2 de 'daemon:x:' en el swapfile. Esto prueba que el contenido del archivo `/etc/passwd` se volcó completamente al swapfile cuando limitamos la memoria. Es un ejemplo perfecto de cómo datos sensibles pueden quedar expuestos en el disco."

---

## 📚 Autor

Ezequiel Ayre

LinkedIn: [www.linkedin.com/in/ezequiel-ayre-6b753715b](https://www.linkedin.com/in/ezequiel-ayre-6b753715b)
