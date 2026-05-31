# Linux Commands Guide - Cheat Sheet Práctico

Guía completa de comandos Linux esenciales para principiantes. Cada comando incluye explicación, sintaxis y ejemplos prácticos.

---

## 📚 NIVEL BÁSICO

### 1. pwd - Print Working Directory
**¿Qué hace?** Muestra la carpeta actual donde estás

**Sintaxis:**
```bash
pwd
```

**Ejemplos:**
```bash
$ pwd
/home/usuario/Documentos
```

**¿Cuándo lo usas?** Siempre que quieras saber dónde estás en el sistema

---

### 2. ls - List Directory Contents
**¿Qué hace?** Lista archivos y carpetas en la carpeta actual

**Sintaxis:**
```bash
ls [opciones] [ruta]
```

**Ejemplos:**
```bash
ls                    # Lista simple
ls -l                 # Lista con detalles (permisos, owner, tamaño)
ls -la                # Incluye archivos ocultos (que empiezan con .)
ls -h                 # Tamaños legibles (KB, MB, GB)
ls -lh                # Combina: detalles + tamaños legibles
```

**Opciones principales:**
- `-l` = Formato largo (detalles)
- `-a` = Mostrar archivos ocultos
- `-h` = Tamaños legibles
- `-r` = Orden inverso
- `-S` = Ordenar por tamaño

**¿Cuándo lo usas?** Constantemente, para ver qué hay en carpetas

---

### 3. cd - Change Directory
**¿Qué hace?** Cambia a otra carpeta

**Sintaxis:**
```bash
cd [ruta]
```

**Ejemplos:**
```bash
cd /home/usuario/Documentos      # Ir a carpeta específica
cd ..                             # Ir a carpeta padre
cd ~                              # Ir a home del usuario
cd -                              # Volver a carpeta anterior
cd /                              # Ir a raíz del sistema
```

**¿Cuándo lo usas?** Cuando quieres navegar entre carpetas

---

### 4. mkdir - Make Directory
**¿Qué hace?** Crea una nueva carpeta

**Sintaxis:**
```bash
mkdir [nombre]
```

**Ejemplos:**
```bash
mkdir proyecto                    # Crea carpeta "proyecto"
mkdir -p carpeta/subcarpeta      # Crea carpeta y subcarpetas (-p)
mkdir folder1 folder2 folder3    # Crea múltiples carpetas
```

**¿Cuándo lo usas?** Cuando necesitas crear nuevas carpetas

---

### 5. cat - Concatenate Files
**¿Qué hace?** Muestra el contenido de un archivo en pantalla

**Sintaxis:**
```bash
cat [archivo]
```

**Ejemplos:**
```bash
cat archivo.txt                   # Muestra contenido
cat archivo1.txt archivo2.txt    # Muestra múltiples archivos
cat archivo.txt | grep "palabra" # Busca palabra en archivo
```

**¿Cuándo lo usas?** Para ver rápidamente qué hay dentro de un archivo

---

### 6. cp - Copy Files
**¿Qué hace?** Copia archivos o carpetas

**Sintaxis:**
```bash
cp [opciones] origen destino
```

**Ejemplos:**
```bash
cp archivo.txt copia.txt          # Copia archivo
cp archivo.txt /home/usuario/     # Copia archivo a otra carpeta
cp -r carpeta/ copia_carpeta/    # Copia carpeta completa (-r recursivo)
```

**¿Cuándo lo usas?** Cuando necesitas duplicar archivos o carpetas

---

### 7. mv - Move Files
**¿Qué hace?** Mueve o renombra archivos y carpetas

**Sintaxis:**
```bash
mv [origen] [destino]
```

**Ejemplos:**
```bash
mv archivo.txt nuevo_nombre.txt   # Renombra archivo
mv archivo.txt /home/usuario/     # Mueve archivo a otra carpeta
mv carpeta/ /home/usuario/        # Mueve carpeta
```

**¿Cuándo lo usas?** Para mover o renombrar archivos

---

### 8. rm - Remove Files
**¿Qué hace?** Elimina archivos o carpetas (CUIDADO: sin recuperación)

**Sintaxis:**
```bash
rm [opciones] archivo
```

**Ejemplos:**
```bash
rm archivo.txt                    # Elimina archivo
rm -r carpeta/                    # Elimina carpeta y contenido (-r)
rm -f archivo.txt                 # Fuerza eliminación sin preguntar (-f)
```

**⚠️ CUIDADO:** No hay papelera de reciclaje. Una vez eliminado, es difícil recuperarlo.

**¿Cuándo lo usas?** Cuando necesitas eliminar archivos

---

### 9. touch - Create Empty File
**¿Qué hace?** Crea un archivo vacío

**Sintaxis:**
```bash
touch [nombre_archivo]
```

**Ejemplos:**
```bash
touch archivo.txt                 # Crea archivo vacío
touch archivo1.txt archivo2.txt  # Crea múltiples archivos
```

**¿Cuándo lo usas?** Para crear archivos rápidamente

---

### 10. echo - Print Text
**¿Qué hace?** Imprime texto en pantalla

**Sintaxis:**
```bash
echo "texto"
```

**Ejemplos:**
```bash
echo "Hola Mundo"                 # Imprime texto
echo $USER                        # Imprime variable de usuario
echo "texto" > archivo.txt       # Guarda texto en archivo (sobrescribe)
echo "texto" >> archivo.txt      # Agrega texto al archivo
```

**¿Cuándo lo usas?** Para imprimir texto o guardar información en archivos

---

## 🔍 NIVEL INTERMEDIO

### 11. grep - Search Text
**¿Qué hace?** Busca patrones de texto en archivos

**Sintaxis:**
```bash
grep [opciones] "patrón" archivo
```

**Ejemplos:**
```bash
grep "error" log.txt              # Busca "error" en archivo
grep -i "error" log.txt           # Busca ignorando mayúsculas (-i)
grep -n "error" log.txt           # Muestra número de línea (-n)
grep -c "error" log.txt           # Cuenta ocurrencias (-c)
```

**¿Cuándo lo usas?** Constantemente para buscar en logs y archivos

---

### 12. find - Find Files
**¿Qué hace?** Busca archivos en el sistema

**Sintaxis:**
```bash
find [ruta] [opciones]
```

**Ejemplos:**
```bash
find . -name "archivo.txt"        # Busca por nombre
find / -type f -name "*.log"      # Busca logs en todo el sistema
find . -size +10M                 # Busca archivos mayores a 10MB
find . -mtime -7                  # Busca archivos modificados últimos 7 días
```

**¿Cuándo lo usas?** Para encontrar archivos específicos en el sistema

---

### 13. chmod - Change Permissions
**¿Qué hace?** Cambia permisos de archivos y carpetas

**Sintaxis:**
```bash
chmod [permisos] archivo
```

**Ejemplos:**
```bash
chmod 755 script.sh               # rwxr-xr-x (ejecutable)
chmod 644 archivo.txt             # rw-r--r-- (lectura)
chmod +x script.sh                # Agrega permiso ejecutable
chmod -r archivo.txt              # Quita permiso lectura
```

**Permisos:**
- `7` = rwx (lectura, escritura, ejecución)
- `5` = r-x (lectura, ejecución)
- `4` = r-- (solo lectura)

**¿Cuándo lo usas?** Para controlar quién puede ver/modificar/ejecutar

---

### 14. chown - Change Owner
**¿Qué hace?** Cambia el dueño de un archivo

**Sintaxis:**
```bash
chown usuario:grupo archivo
```

**Ejemplos:**
```bash
chown usuario archivo.txt         # Cambia dueño
chown usuario:grupo archivo.txt   # Cambia dueño y grupo
chown -R usuario carpeta/         # Cambia recursivo (-R)
```

**¿Cuándo lo usas?** Para asignar propiedad de archivos

---

### 15. sudo - Super User Do
**¿Qué hace?** Ejecuta comando con permisos de administrador

**Sintaxis:**
```bash
sudo comando
```

**Ejemplos:**
```bash
sudo apt update                   # Actualiza paquetes (requiere admin)
sudo rm archivo.txt               # Elimina con permisos admin
sudo useradd usuario              # Crea usuario nuevo
```

**⚠️ CUIDADO:** Solo usa cuando realmente lo necesites

**¿Cuándo lo usas?** Cuando necesitas permisos de administrador

---

### 16. ps - Process Status
**¿Qué hace?** Muestra procesos en ejecución

**Sintaxis:**
```bash
ps [opciones]
```

**Ejemplos:**
```bash
ps                                # Procesos básicos
ps aux                            # Todos los procesos con detalles
ps aux | grep firefox             # Busca proceso específico
ps -ef --forest                   # Muestra árbol de procesos
```

**¿Cuándo lo usas?** Para ver qué está corriendo en el sistema

---

### 17. kill - Kill Process
**¿Qué hace?** Detiene un proceso en ejecución

**Sintaxis:**
```bash
kill [PID]
```

**Ejemplos:**
```bash
kill 1234                         # Detiene proceso con ID 1234
kill -9 1234                      # Fuerza eliminación (-9)
killall firefox                   # Detiene todos los procesos firefox
```

**¿Cuándo lo usas?** Cuando necesitas detener un programa

---

### 18. top - System Monitor
**¿Qué hace?** Muestra procesos y uso de CPU/memoria en tiempo real

**Sintaxis:**
```bash
top
```

**Ejemplos:**
```bash
top                               # Abre monitor
top -u usuario                    # Muestra procesos de usuario específico
```

**Controles en top:**
- `q` = Salir
- `k` = Matar proceso
- `M` = Ordenar por memoria

**¿Cuándo lo usas?** Para ver qué está consumiendo recursos

---

### 19. df - Disk Free
**¿Qué hace?** Muestra espacio en disco disponible

**Sintaxis:**
```bash
df [opciones]
```

**Ejemplos:**
```bash
df                                # Espacio en disco
df -h                             # Formato legible (GB, MB)
df -i                             # Inodos disponibles
```

**¿Cuándo lo usas?** Para verificar espacio en disco

---

### 20. du - Disk Usage
**¿Qué hace?** Muestra espacio usado por archivos/carpetas

**Sintaxis:**
```bash
du [opciones] [ruta]
```

**Ejemplos:**
```bash
du -h carpeta/                    # Tamaño de carpeta
du -sh carpeta/                   # Total de carpeta (-s)
du -sh *                          # Tamaño de cada item
```

**¿Cuándo lo usas?** Para saber qué ocupa espacio

---

## 🔐 NIVEL AVANZADO

### 21. ifconfig / ip - Network Configuration
**¿Qué hace?** Muestra configuración de red

**Sintaxis:**
```bash
ifconfig
ip a
```

**Ejemplos:**
```bash
ifconfig                          # Muestra interfaces (viejo)
ip a                              # Muestra interfaces (nuevo)
ip route                          # Muestra rutas
```

**¿Cuándo lo usas?** Para verificar IP, gateway, DNS

---

### 22. netstat - Network Statistics
**¿Qué hace?** Muestra conexiones de red y puertos abiertos

**Sintaxis:**
```bash
netstat [opciones]
```

**Ejemplos:**
```bash
netstat -an                       # Puertos abiertos
netstat -tulpn                    # Puertos con programas asociados
netstat -i                        # Estadísticas de interfaces
```

**¿Cuándo lo usas?** Para verificar puertos abiertos y conexiones

---

### 23. ssh - Secure Shell
**¿Qué hace?** Conexión remota segura a otra máquina

**Sintaxis:**
```bash
ssh usuario@host
```

**Ejemplos:**
```bash
ssh usuario@192.168.1.100         # Conecta a máquina remota
ssh -i clave.pem usuario@host    # Usa clave privada
ssh -p 2222 usuario@host         # Usa puerto diferente
```

**¿Cuándo lo usas?** Para administrar servidores remotos

---

### 24. scp - Secure Copy
**¿Qué hace?** Copia archivos entre máquinas remotas (seguro)

**Sintaxis:**
```bash
scp archivo usuario@host:/ruta
```

**Ejemplos:**
```bash
scp archivo.txt usuario@192.168.1.100:/home/usuario/
scp usuario@host:/archivo.txt .   # Descarga desde remoto
```

**¿Cuándo lo usas?** Para transferir archivos de forma segura

---

### 25. tar - Archive Files
**¿Qué hace?** Comprime/descomprime archivos

**Sintaxis:**
```bash
tar [opciones] archivo.tar.gz
```

**Ejemplos:**
```bash
tar -czf archivo.tar.gz carpeta/  # Comprime (-c crear, -z gzip, -f archivo)
tar -xzf archivo.tar.gz           # Descomprime (-x extraer)
tar -tzf archivo.tar.gz           # Lista contenido (-t)
```

**¿Cuándo lo usas?** Para comprimir/descomprimir archivos

---

### 26. apt - Package Manager
**¿Qué hace?** Instala/actualiza/elimina programas (en Debian/Ubuntu)

**Sintaxis:**
```bash
apt [comando] [paquete]
```

**Ejemplos:**
```bash
sudo apt update                   # Actualiza lista de paquetes
sudo apt upgrade                  # Actualiza programas
sudo apt install nombre_programa  # Instala programa
sudo apt remove nombre_programa   # Desinstala programa
```

**¿Cuándo lo usas?** Para gestionar software

---

### 27. nano - Text Editor
**¿Qué hace?** Editor de texto simple

**Sintaxis:**
```bash
nano archivo.txt
```

**Ejemplos:**
```bash
nano archivo.txt                  # Abre/crea archivo
# Dentro de nano:
# Ctrl+O = Guardar
# Ctrl+X = Salir
# Ctrl+W = Buscar
```

**¿Cuándo lo usas?** Para editar archivos de configuración

---

### 28. vim - Advanced Text Editor
**¿Qué hace?** Editor de texto avanzado (más complejo que nano)

**Sintaxis:**
```bash
vim archivo.txt
```

**Ejemplos:**
```bash
vim archivo.txt                   # Abre archivo
# Dentro de vim:
# i = Insertar
# Esc = Salir modo inserción
# :w = Guardar
# :q = Salir
# :wq = Guardar y salir
```

**¿Cuándo lo usas?** Para edición avanzada

---

### 29. grep + pipes - Combinaciones Poderosas
**¿Qué hace?** Combina comandos para operaciones complejas

**Sintaxis:**
```bash
comando1 | comando2 | comando3
```

**Ejemplos:**
```bash
ps aux | grep firefox             # Busca proceso firefox
cat log.txt | grep "error" | wc -l  # Cuenta errores
ls -lh | grep "^-" | awk '{print $5}' # Lista tamaños
```

**¿Cuándo lo usas?** Para operaciones complejas encadenando comandos

---

### 30. man - Manual Pages
**¿Qué hace?** Muestra documentación de comandos

**Sintaxis:**
```bash
man comando
```

**Ejemplos:**
```bash
man ls                            # Documentación de ls
man grep                          # Documentación de grep
# Dentro de man: presiona 'q' para salir
```

**¿Cuándo lo usas?** Cuando no sabes cómo usar un comando

---

## 💡 TIPS IMPORTANTES

✅ **Usa Tab** - Autocomplete de comandos y rutas
✅ **Usa Ctrl+C** - Detiene comando en ejecución
✅ **Usa Ctrl+Z** - Pausa comando (fg para reanudar)
✅ **Usa Arrow Up** - Historial de comandos anteriores
✅ **Combina comandos** - Usa pipes (|) y redirecciones (>, >>)
✅ **Lee documentación** - Usa `man comando` para aprender

---

## 📖 PRÓXIMOS PASOS

Ahora que conoces los comandos básicos:

1. Practica en terminal
2. Experimenta combinando comandos
3. Lee los manuales (`man`)
4. Busca soluciones usando `grep` en logs
5. Administra archivos y carpetas

¡La práctica es la clave!

---

**Autor:** Ezequiel Ayre  
**LinkedIn:** www.linkedin.com/in/ezequiel-ayre-6b753715b  
**GitHub:** github.com/Ezeayre
