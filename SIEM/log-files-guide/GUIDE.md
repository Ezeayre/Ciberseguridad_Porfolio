# Guía de Logs - Entender Qué Están Pasando

## ¿QUÉ ES UN LOG?

Un log es un registro de todo lo que sucede en tu computadora o en un programa. Imagina que tu sistema tiene un "diario" donde anota cada evento: cuándo alguien intentó conectarse, qué errores ocurrieron, qué servicios se iniciaron o pararon, qué archivos se accedieron. Ese "diario" es un log. En ciberseguridad, los logs son fundamentales. Te dicen exactamente qué pasó, cuándo pasó, quién lo hizo y desde dónde. Si algo anormal ocurre, los logs tienen la respuesta.

## ESTRUCTURA DE UN LOG - LÍNEA POR LÍNEA

Veamos cómo se ve un log real y qué significa cada parte:

```
May 23 14:35:22 servidor sshd[2847]: Failed password for invalid user admin from 192.168.1.100 port 54321 ssh2
```

Desglosamos cada parte: 

**May 23** → Fecha: 23 de mayo. 
**14:35:22** → Hora exacta: 2:35 PM y 22 segundos. 
**servidor** → En qué máquina pasó. 
**sshd** → Qué servicio/programa lo registró (en este caso, SSH - conexión remota). 
**[2847]** → ID del proceso (número interno del sistema). 
**Failed password** → Qué pasó: contraseña incorrecta. 
**invalid user admin** → Se intentó usar usuario "admin" que no existe. 
**from 192.168.1.100** → Desde qué dirección IP vino el intento.
**port 54321** → Desde qué puerto. 
**ssh2** → Versión del protocolo.

¿QUÉ CUENTA ESTA LÍNEA? 

Alguien desde la IP 192.168.1.100 intentó conectarse por SSH usando usuario "admin", pero la contraseña fue rechazada. 
En ciberseguridad: Esto es una bandera roja. Alguien está intentando acceder sin autorización.

## OTRO EJEMPLO

```
May 23 10:15:33 laptop kernel: [1234.567890] CPU0: Package temperature above threshold
```

**May 23 10:15:33** → Fecha y hora. 
**laptop** → La máquina (tu laptop). 
**kernel** → El sistema operativo mismo lo registró. 
**Package temperature above threshold** → La temperatura de la CPU está peligrosamente alta.

¿QUÉ CUENTA? 

Tu hardware está sobrecalentado. Algo no está bien.

## TIPOS DE LOGS Y DÓNDE ENCONTRARLOS

### Logs de Autenticación (Auth)

¿Qué registran? Intentos de login, cambios de contraseña, permisos.

¿Dónde están? En Linux: `/var/log/auth.log`. En macOS: `/var/log/system.log`.

Ejemplos:

```
May 23 14:35:22 servidor sshd[2847]: Failed password for invalid user admin from 192.168.1.100
May 23 14:36:45 servidor sshd[2849]: Accepted password for user eze from 192.168.1.50
May 23 14:37:10 servidor sudo: eze : TTY=pts/0 ; PWD=/home/eze ; USER=root ; COMMAND=/bin/ls
```

¿Qué cuentan? 

La primera línea es un intento fallido de login. 
La segunda es un login exitoso. 
La tercera es un usuario que ejecutó comando con permisos de administrador.

### Logs del Sistema (Syslog)

¿Qué registran? Eventos generales del sistema, servicios que inician o paran, errores.

¿Dónde están? En Linux: `/var/log/syslog` o `/var/log/messages`. En macOS: `/var/log/system.log`.

Ejemplos:

```
May 23 10:15:33 servidor kernel: [1234.567890] Out of memory: Kill process 3456 (apache2)
May 23 10:20:45 servidor systemd: Started Session c1 of user root.
May 23 10:25:10 servidor ntpd[1234]: time reset +0.157420 s
```

¿Qué cuentan? 

La primera línea dice que el sistema se quedó sin memoria y tuvo que matar un proceso. 
La segunda dice que un nuevo usuario inició sesión. 
La tercera dice que el reloj del sistema se sincronizó.

### Logs de Servidor Web (Apache/Nginx)

¿Qué registran? Todas las peticiones HTTP, quién accedió a qué página, si tuvo éxito o no.

¿Dónde están? Apache: `/var/log/apache2/access.log`. Nginx: `/var/log/nginx/access.log`.

Ejemplos:

```
192.168.1.50 - - [23/May/2026:14:35:22 +0000] "GET /admin.php HTTP/1.1" 200 1234
192.168.1.100 - - [23/May/2026:14:35:25 +0000] "POST /login.php HTTP/1.1" 403 0
192.168.1.75 - - [23/May/2026:14:36:10 +0000] "GET /../../etc/passwd HTTP/1.1" 404 0
```

¿Qué cuentan? 

La primera línea muestra que alguien accedió a /admin.php exitosamente (código 200 = OK). 
La segunda muestra que alguien intentó POST a /login.php pero fue rechazado (código 403 = Acceso denegado). 
La tercera muestra que alguien intentó un ataque de traversal de directorios, pero no encontró nada (404 = No encontrado).

### Logs de Fail2ban (Seguridad)

¿Qué registran? Intentos fallidos repetidos y bloqueos automáticos de IPs sospechosas.

¿Dónde están? En Linux: `/var/log/fail2ban.log`.

Ejemplos:

```
2026-05-23 14:35:22,123 fail2ban.filter [2345]: Found 192.168.1.100 - 192.168.1.100
2026-05-23 14:36:45,567 fail2ban.actions [2345]: Banning 192.168.1.100
2026-05-23 14:37:20,890 fail2ban.actions [2345]: Unbanning 192.168.1.100
```

¿Qué cuentan? 

La primera línea detectó actividad sospechosa desde esa IP. 
La segunda bloqueó automáticamente esa IP. 
La tercera desbloqueó esa IP después de que pasó el tiempo.

## EJERCICIO: LEE ESTE LOG

Aquí hay un registro de eventos de un servidor. ¿Qué está pasando?

```
May 23 10:15:33 servidor sshd[1234]: Connection closed by authenticating user eze 192.168.1.50 port 54321
May 23 10:16:45 servidor sshd[1235]: Failed password for invalid user admin from 192.168.1.100 port 54322 ssh2
May 23 10:17:22 servidor sshd[1236]: Failed password for invalid user admin from 192.168.1.100 port 54323 ssh2
May 23 10:18:05 servidor sshd[1237]: Failed password for invalid user admin from 192.168.1.100 port 54324 ssh2
May 23 10:19:30 servidor sshd[1238]: Failed password for invalid user root from 192.168.1.100 port 54325 ssh2
May 23 10:20:15 servidor sshd[1239]: Invalid user test from 192.168.1.100 port 54326
May 23 10:21:00 servidor sshd[1240]: Failed password for invalid user postgres from 192.168.1.100 port 54327 ssh2
May 23 10:22:45 servidor sshd[1241]: Accepted password for user eze from 192.168.1.50 port 54328
```

¿VES EL PATRÓN? La IP `192.168.1.100` está intentando múltiples usuarios: admin (intentos fallidos), root (intento fallido), test (intento fallido), postgres (intento fallido).

¿QUÉ ESTÁ PASANDO? Esto es un ataque de fuerza bruta. Alguien está probando contraseñas automáticamente, intentando diferentes nombres de usuario.

¿QUÉ HARÍAS EN UN SOC? 

Bloquearías la IP 192.168.1.100. 
Alertarías a tu equipo. 
Investigarías si esa IP logró entrar en algún momento. 
Verificarías los logs más antiguos para ver cuándo comenzó el ataque.

## CÓMO VER TUS PROPIOS LOGS

Si quieres explorar los logs de tu sistema para entender mejor, en Linux o macOS los logs están en lugares específicos. 

Los logs de autenticación/login están en `/var/log/auth.log`. 
Los eventos del sistema están en `/var/log/syslog`. 
Si tienes Apache, los logs web están en `/var/log/apache2/access.log`. 
Si tienes Fail2ban, está en `/var/log/fail2ban.log`. 

Puedes abrir estos archivos con cualquier editor de texto y leer qué está pasando en tu máquina. Si alguna línea no entiendes, busca la palabra clave en Google. Probablemente encuentres la respuesta.

## EN WINDOWS

Los logs se encuentran en Event Viewer (Visor de Eventos). 
Puedes acceder escribiendo `eventvwr.msc` en el menú ejecutar (Windows + R) o buscando "Event Viewer" en el menú inicio. 
Los logs se organizan en Security, System y Application.
Un evento típico sería: "Event ID 4625 - An account failed to log on. Subject: User: SYSTEM. Failure Reason: User name either not found or this was an attempt to use a locally defined user account over the network connection." Esto significa alguien intentó conectarse pero falló.

## RESUMEN

Un log es un registro de eventos en tu sistema. 
Cada línea dice QUÉ pasó, CUÁNDO, DÓNDE y QUIÉN lo hizo. 
Existen diferentes tipos de logs: autenticación, sistema, web, seguridad. 
En ciberseguridad, los logs son tu mejor evidencia de un incidente. 
Si aprendes a leerlos, puedes detectar ataques, errores y problemas antes de que se conviertan en desastres.

Autor: Ezequiel Ayre
LinkedIn: www.linkedin.com/in/ezequiel-ayre-6b753715b
