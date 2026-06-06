import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Base de firmas de eventos organizada por categorías
const eventSignatures = {
  authentication: [
    {
      id: 'auth_failed_login',
      name: 'Intento de inicio de sesión fallido',
      keywords: ['failed', 'login', 'authentication', 'invalid', 'password', 'credential', 'denied', 'unsuccessful'],
      patterns: [/failed login/i, /authentication failed/i, /invalid password/i, /login failed/i, /auth failed/i, /credential invalid/i, /access denied/i],
      riskLevel: 'medium',
      confidence: 'high',
      explanation: 'Se detectó un intento de inicio de sesión fallido. Esto podría indicar un ataque de fuerza bruta o credenciales incorrectas.',
      recommendedAction: 'Monitorear intentos adicionales desde la misma IP. Si hay múltiples fallos, considerar bloquear la dirección IP temporalmente.',
      impact: 'Posible compromiso de credenciales si el ataque continúa. Riesgo de acceso no autorizado.',
      nextChecks: ['Revisar la IP origen', 'Buscar más eventos relacionados', 'Verificar si hubo autenticación exitosa posterior', 'Comprobar privilegios de la cuenta afectada'],
      details: ['Verificar si hay múltiples intentos desde la misma IP', 'Revisar políticas de bloqueo de cuentas', 'Considerar autenticación de dos factores'],
      responseProcedure: [
        'PASO 1: Identificar la dirección IP origen del intento fallido',
        'PASO 2: Verificar si hay más de 3 intentos fallidos desde la misma IP en los últimos 10 minutos',
        'PASO 3: Si hay múltiples intentos, BLOQUEAR temporalmente la IP en el firewall (30 minutos)',
        'PASO 4: Revisar si la cuenta objetivo tiene privilegios elevados',
        'PASO 5: Si la cuenta es administrativa, ELEVAR el incidente al equipo de seguridad inmediatamente',
        'PASO 6: Documentar el incidente en el sistema de tickets',
        'PASO 7: Monitorear actividad de la IP durante las siguientes 24 horas',
        'PASO 8: Si los intentos continúan después del bloqueo, considerar bloqueo permanente'
      ]
    },
    {
      id: 'auth_successful_login',
      name: 'Inicio de sesión exitoso',
      keywords: ['successful', 'login', 'authenticated', 'logged in', 'granted'],
      patterns: [/login successful/i, /authentication successful/i, /user logged in/i, /auth successful/i, /access granted/i],
      riskLevel: 'low',
      confidence: 'high',
      explanation: 'Inicio de sesión exitoso. Usuario autenticado correctamente.',
      recommendedAction: 'Registrar el evento para auditoría. No se requiere acción inmediata.',
      impact: 'Acceso legítimo otorgado. Actividad normal del usuario.',
      nextChecks: ['Verificar que el acceso sea esperado', 'Monitorear actividad posterior del usuario', 'Confirmar ubicación geográfica si es inusual'],
      details: ['Verificar que el acceso sea esperado', 'Monitorear actividad posterior del usuario', 'Confirmar ubicación geográfica si es inusual'],
      responseProcedure: [
        'PASO 1: Verificar que el usuario y la ubicación son esperados',
        'PASO 2: Confirmar que el horario de acceso es normal para el usuario',
        'PASO 3: Si el acceso es inusual, CONTACTAR al usuario para confirmar',
        'PASO 4: Documentar el acceso en el registro de auditoría',
        'PASO 5: Monitorear actividad del usuario durante los próximos 30 minutos',
        'PASO 6: Si hay actividad sospechosa, REVISAR logs adicionales'
      ]
    },
    {
      id: 'auth_account_locked',
      name: 'Cuenta bloqueada',
      keywords: ['locked', 'account', 'disabled', 'suspended', 'blocked'],
      patterns: [/account locked/i, /account disabled/i, /account suspended/i, /user blocked/i],
      riskLevel: 'medium',
      confidence: 'high',
      explanation: 'La cuenta de usuario fue bloqueada o deshabilitada. Puede ser por políticas de seguridad o actividad sospechosa.',
      recommendedAction: 'Investigar la razón del bloqueo. Verificar si fue por actividad sospechosa o política de seguridad.',
      impact: 'Usuario no puede acceder al sistema. Puede indicar compromiso de cuenta o medida de seguridad.',
      nextChecks: ['Revisar logs de la cuenta afectada', 'Verificar intentos de acceso fallidos', 'Contactar al usuario si es legítimo', 'Revisar políticas de bloqueo'],
      details: ['Identificar causa del bloqueo', 'Verificar si hay actividad sospechosa', 'Proceder según política de seguridad'],
      responseProcedure: [
        'PASO 1: Identificar la causa exacta del bloqueo de la cuenta',
        'PASO 2: Revisar logs de intentos de acceso fallidos recientes',
        'PASO 3: Si hay múltiples intentos fallidos, INVESTIGAR posible ataque',
        'PASO 4: CONTACTAR al usuario titular de la cuenta',
        'PASO 5: Si el usuario confirma que no solicitó el bloqueo, ELEVAR a seguridad',
        'PASO 6: Si es por política de seguridad, explicar al usuario el procedimiento',
        'PASO 7: Documentar el incidente y la resolución',
        'PASO 8: Monitorear actividad posterior del desbloqueo'
      ]
    },
    {
      id: 'auth_password_reset',
      name: 'Restablecimiento de contraseña',
      keywords: ['password', 'reset', 'change', 'recovery'],
      patterns: [/password reset/i, /password changed/i, /password recovery/i, /reset password/i],
      riskLevel: 'low',
      confidence: 'medium',
      explanation: 'Se solicitó o realizó un restablecimiento de contraseña.',
      recommendedAction: 'Verificar que la solicitud sea legítima. Monitorear actividad posterior de la cuenta.',
      impact: 'Cambio de credenciales. Puede ser legítimo o indicar compromiso.',
      nextChecks: ['Verificar origen de la solicitud', 'Confirmar con el usuario', 'Monitorear accesos posteriores', 'Revisar historial de cambios'],
      details: ['Validar solicitud con usuario', 'Revisar IP de origen', 'Documentar el cambio'],
      responseProcedure: [
        'PASO 1: Verificar la dirección IP desde donde se originó la solicitud',
        'PASO 2: CONTACTAR al usuario por un canal seguro para confirmar la solicitud',
        'PASO 3: Si el usuario no solicitó el cambio, BLOQUEAR la cuenta inmediatamente',
        'PASO 4: Si el usuario confirma, documentar la autorización',
        'PASO 5: Monitorear actividad de la cuenta después del cambio',
        'PASO 6: Revisar si hay otros cambios de credenciales recientes',
        'PASO 7: Si hay sospecha de compromiso, ELEVAR a equipo de seguridad'
      ]
    }
  ],
  malware: [
    {
      id: 'malware_detected',
      name: 'Malware detectado',
      keywords: ['malware', 'virus', 'trojan', 'ransomware', 'malicious', 'threat'],
      patterns: [/malware detected/i, /virus detected/i, /trojan detected/i, /ransomware/i, /malicious file/i, /threat detected/i],
      riskLevel: 'critical',
      confidence: 'high',
      explanation: 'Se detectó malware o código malicioso. Esto representa una amenaza grave para la seguridad.',
      recommendedAction: 'ISOLAR el sistema afectado. Escalar urgentemente a equipo de seguridad. Realizar escaneo completo.',
      impact: 'Compromiso total del sistema, posible propagación a otros sistemas, pérdida de datos.',
      nextChecks: ['Desconectar de la red inmediatamente', 'Realizar escaneo antivirus completo', 'Investigar fuente de infección', 'Revisar otros sistemas de la red'],
      details: ['Desconectar de la red inmediatamente', 'Realizar escaneo antivirus completo', 'Investigar fuente de infección', 'Revisar otros sistemas de la red'],
      responseProcedure: [
        'PASO 1: DESCONECTAR inmediatamente el sistema afectado de la red',
        'PASO 2: No apagar el sistema (preservar evidencia forense)',
        'PASO 3: ELEVAR urgentemente al equipo de seguridad (CRÍTICO)',
        'PASO 4: Aislar el sistema físicamente si es posible',
        'PASO 5: Realizar escaneo antivirus completo en el sistema aislado',
        'PASO 6: Investigar fuente de infección (email, USB, descarga)',
        'PASO 7: Escanear todos los demás sistemas de la red',
        'PASO 8: Documentar todo el proceso y hallazgos',
        'PASO 9: Solo después de autorización, limpiar o reinstalar el sistema'
      ]
    },
    {
      id: 'malware_suspicious_file',
      name: 'Archivo sospechoso',
      keywords: ['suspicious', 'file', 'executable', 'unknown'],
      patterns: [/suspicious file/i, /unknown executable/i, /suspicious executable/i, /unrecognized file/i],
      riskLevel: 'high',
      confidence: 'medium',
      explanation: 'Se detectó un archivo sospechoso o no reconocido que podría ser malware.',
      recommendedAction: 'Cuarentenar el archivo. Analizar en ambiente aislado. Escalar si se confirma malware.',
      impact: 'Posible infección de malware si el archivo es ejecutado.',
      nextChecks: ['Analizar el archivo en sandbox', 'Verificar origen del archivo', 'Escanear con múltiples antivirus', 'Investigar usuario que descargó'],
      details: ['Cuarentenar archivo', 'Analizar firmas', 'Verificar comportamiento'],
      responseProcedure: [
        'PASO 1: CUARENTENAR inmediatamente el archivo sospechoso',
        'PASO 2: NO ejecutar el archivo bajo ninguna circunstancia',
        'PASO 3: Analizar el archivo en un ambiente sandbox aislado',
        'PASO 4: Escanear con múltiples motores antivirus',
        'PASO 5: Investigar quién descargó el archivo y desde dónde',
        'PASO 6: Si se confirma malware, ELEVAR a equipo de seguridad',
        'PASO 7: Revisar otros sistemas del usuario por archivos similares',
        'PASO 8: Documentar el incidente y las acciones tomadas'
      ]
    }
  ],
  network: [
    {
      id: 'net_port_scan',
      name: 'Escaneo de puertos',
      keywords: ['port scan', 'network scan', 'nmap', 'sweep', 'reconnaissance'],
      patterns: [/port scan/i, /network scan/i, /nmap/i, /port sweep/i, /reconnaissance/i],
      riskLevel: 'medium',
      confidence: 'high',
      explanation: 'Se detectó un escaneo de puertos. Alguien está explorando la red buscando vulnerabilidades.',
      recommendedAction: 'Monitorear la IP. Considerar bloqueo si continúa el escaneo. Revisar firewall.',
      impact: 'Reconocimiento de la red, posible preparación para ataque más sofisticado.',
      nextChecks: ['Identificar puertos escaneados', 'Monitorear actividad posterior', 'Revisar configuración de firewall', 'Documentar el incidente'],
      details: ['Identificar puertos escaneados', 'Monitorear actividad posterior', 'Revisar configuración de firewall', 'Documentar el incidente'],
      responseProcedure: [
        'PASO 1: Identificar la dirección IP origen del escaneo',
        'PASO 2: Determinar qué puertos fueron escaneados',
        'PASO 3: Verificar si hay intentos de explotación posteriores',
        'PASO 4: Si el escaneo continúa, BLOQUEAR la IP en el firewall',
        'PASO 5: Revisar configuración del firewall para cerrar puertos innecesarios',
        'PASO 6: Documentar el incidente en el sistema de tickets',
        'PASO 7: Monitorear actividad de la IP durante 24 horas',
        'PASO 8: Si hay patrones de escaneo recurrentes, ELEVAR a seguridad'
      ]
    },
    {
      id: 'net_firewall_block',
      name: 'Bloqueo de firewall',
      keywords: ['firewall', 'blocked', 'denied', 'dropped'],
      patterns: [/firewall block/i, /blocked by firewall/i, /connection blocked/i, /ip blocked/i, /packet dropped/i],
      riskLevel: 'low',
      confidence: 'high',
      explanation: 'El firewall bloqueó una conexión. Esto es una medida de seguridad funcionando correctamente.',
      recommendedAction: 'Verificar si el bloqueo es legítimo. Monitorear patrones. No requiere acción inmediata.',
      impact: 'Conexión maliciosa bloqueada. Protección activa del sistema.',
      nextChecks: ['Revisar reglas de firewall', 'Verificar si es falso positivo', 'Documentar el bloqueo', 'Ajustar reglas si es necesario'],
      details: ['Revisar reglas de firewall', 'Verificar si es falso positivo', 'Documentar el bloqueo', 'Ajustar reglas si es necesario'],
      responseProcedure: [
        'PASO 1: Verificar que el bloqueo corresponde a una regla legítima',
        'PASO 2: Confirmar que no es un falso positivo',
        'PASO 3: Documentar el bloqueo en el registro de incidentes',
        'PASO 4: Si hay muchos bloqueos similares, REVISAR reglas del firewall',
        'PASO 5: Ajustar reglas si están siendo demasiado restrictivas',
        'PASO 6: Monitorear patrones de bloqueo para identificar tendencias',
        'PASO 7: No requiere acción inmediata si el bloqueo es legítimo'
      ]
    },
    {
      id: 'net_suspicious_traffic',
      name: 'Tráfico sospechoso',
      keywords: ['suspicious', 'traffic', 'unusual', 'anomaly', 'flood'],
      patterns: [/suspicious traffic/i, /unusual traffic/i, /traffic anomaly/i, /network flood/i],
      riskLevel: 'high',
      confidence: 'medium',
      explanation: 'Se detectó tráfico de red sospechoso o anómalo.',
      recommendedAction: 'Investigar origen del tráfico. Verificar si es DDoS o exfiltración. Monitorear continuamente.',
      impact: 'Posible ataque DDoS, exfiltración de datos o actividad maliciosa.',
      nextChecks: ['Analizar patrones de tráfico', 'Verificar origen y destino', 'Monitorear ancho de banda', 'Investigar protocolos utilizados'],
      details: ['Capturar paquetes para análisis', 'Verificar IPs involucradas', 'Revisar volumen de datos'],
      responseProcedure: [
        'PASO 1: Identificar las direcciones IP origen y destino del tráfico',
        'PASO 2: Analizar el volumen y patrones del tráfico',
        'PASO 3: Determinar si es un ataque DDoS o exfiltración de datos',
        'PASO 4: Si es DDoS, ACTIVAR mitigación DDoS o contactar ISP',
        'PASO 5: Si es exfiltración, BLOQUEAR inmediatamente las conexiones',
        'PASO 6: Capturar paquetes para análisis forense',
        'PASO 7: ELEVAR a equipo de seguridad si el tráfico es malicioso',
        'PASO 8: Implementar reglas de firewall para prevenir recurrencia'
      ]
    }
  ],
  system: [
    {
      id: 'sys_privilege_escalation',
      name: 'Escalación de privilegios',
      keywords: ['privilege', 'escalation', 'sudo', 'admin', 'root', 'elevated'],
      patterns: [/privilege escalation/i, /sudo attempt/i, /elevated privileges/i, /admin access/i, /root access/i],
      riskLevel: 'high',
      confidence: 'high',
      explanation: 'Se detectó un intento de escalación de privilegios. Usuario intentando obtener mayores permisos.',
      recommendedAction: 'Investigar el usuario y el contexto. Bloquear si es sospechoso. Revisar logs de auditoría.',
      impact: 'Posible acceso no autorizado a recursos sensibles, compromiso del sistema.',
      nextChecks: ['Revisar logs de auditoría', 'Verificar permisos del usuario', 'Investigar comandos ejecutados', 'Revisar accesos posteriores'],
      details: ['Revisar logs de auditoría', 'Verificar permisos del usuario', 'Investigar comandos ejecutados', 'Implementar monitoreo continuo'],
      responseProcedure: [
        'PASO 1: REVOCAR inmediatamente los privilegios elevados del usuario',
        'PASO 2: Investigar el contexto y motivo de la escalación',
        'PASO 3: Revisar logs de auditoría para ver comandos ejecutados',
        'PASO 4: Si la escalación no fue autorizada, BLOQUEAR la cuenta',
        'PASO 5: ELEVAR el incidente al equipo de seguridad',
        'PASO 6: Revisar si hubo cambios en archivos o configuraciones',
        'PASO 7: Implementar monitoreo continuo del usuario',
        'PASO 8: Documentar el incidente y las acciones tomadas'
      ]
    },
    {
      id: 'sys_unauthorized_access',
      name: 'Acceso no autorizado',
      keywords: ['unauthorized', 'forbidden', 'permission', 'denied'],
      patterns: [/unauthorized access/i, /permission denied/i, /access denied/i, /forbidden/i, /unauthorized attempt/i],
      riskLevel: 'high',
      confidence: 'high',
      explanation: 'Se detectó un intento de acceso no autorizado a recursos del sistema.',
      recommendedAction: 'Bloquear la IP. Investigar el usuario/cuenta afectada. Revisar permisos de acceso.',
      impact: 'Posible acceso no autorizado a recursos sensibles, escalación de privilegios.',
      nextChecks: ['Revisar logs de auditoría', 'Verificar permisos del usuario', 'Investigar si hubo acceso exitoso', 'Revisar intentos de escalación de privilegios'],
      details: ['Revisar logs de auditoría', 'Verificar permisos del usuario', 'Investigar si hubo acceso exitoso', 'Implementar monitoreo continuo'],
      responseProcedure: [
        'PASO 1: BLOQUEAR inmediatamente la dirección IP origen',
        'PASO 2: Investigar la cuenta o usuario que intentó el acceso',
        'PASO 3: Revisar logs para verificar si hubo accesos exitosos previos',
        'PASO 4: Si hubo acceso exitoso, REVOCAR credenciales de la cuenta',
        'PASO 5: ELEVAR el incidente al equipo de seguridad',
        'PASO 6: Revisar permisos de acceso y ajustar si es necesario',
        'PASO 7: Implementar monitoreo continuo de la cuenta afectada',
        'PASO 8: Documentar el incidente y las acciones tomadas'
      ]
    },
    {
      id: 'sys_service_stopped',
      name: 'Servicio detenido',
      keywords: ['service', 'stopped', 'crashed', 'terminated', 'shutdown'],
      patterns: [/service stopped/i, /service crashed/i, /process terminated/i, /daemon stopped/i],
      riskLevel: 'medium',
      confidence: 'medium',
      explanation: 'Un servicio o proceso del sistema fue detenido inesperadamente.',
      recommendedAction: 'Investigar causa de la detención. Reiniciar servicio si es necesario. Revisar logs del sistema.',
      impact: 'Interrupción del servicio, posible indicador de ataque o problema técnico.',
      nextChecks: ['Revisar logs del servicio', 'Verificar recursos del sistema', 'Investigar causa de la detención', 'Monitorear servicios relacionados'],
      details: ['Revisar logs del servicio', 'Verificar recursos del sistema', 'Investigar causa de la detención', 'Documentar el incidente'],
      responseProcedure: [
        'PASO 1: Revisar logs del servicio para identificar causa de la detención',
        'PASO 2: Verificar recursos del sistema (CPU, memoria, disco)',
        'PASO 3: Si es por falta de recursos, optimizar o aumentar capacidad',
        'PASO 4: Si es por error, reiniciar el servicio',
        'PASO 5: Si es sospechoso, INVESTIGAR posible ataque o manipulación',
        'PASO 6: Monitorear servicios relacionados por detenciones similares',
        'PASO 7: Documentar el incidente y la resolución',
        'PASO 8: Implementar alertas para detenciones futuras'
      ]
    },
    {
      id: 'sys_config_change',
      name: 'Cambio de configuración',
      keywords: ['configuration', 'changed', 'modified', 'registry', 'settings'],
      patterns: [/configuration changed/i, /config modified/i, /registry changed/i, /settings modified/i],
      riskLevel: 'medium',
      confidence: 'medium',
      explanation: 'Se detectó un cambio en la configuración del sistema.',
      recommendedAction: 'Verificar si el cambio es autorizado. Revisar quién realizó el cambio. Documentar.',
      impact: 'Posible compromiso de seguridad si el cambio no es autorizado.',
      nextChecks: ['Verificar autorización del cambio', 'Revisar quién realizó el cambio', 'Validar impacto del cambio', 'Revertir si es sospechoso'],
      details: ['Validar autorización', 'Revisar historial de cambios', 'Documentar modificación'],
      responseProcedure: [
        'PASO 1: Verificar quién realizó el cambio de configuración',
        'PASO 2: Confirmar que el cambio fue autorizado mediante ticket o aprobación',
        'PASO 3: Si no fue autorizado, REVERTIR inmediatamente el cambio',
        'PASO 4: Investigar cómo se realizó el cambio no autorizado',
        'PASO 5: ELEVAR a equipo de seguridad si hay sospecha de compromiso',
        'PASO 6: Revisar historial de cambios recientes en el sistema',
        'PASO 7: Implementar controles más estrictos para cambios de configuración',
        'PASO 8: Documentar el incidente y las acciones tomadas'
      ]
    }
  ],
  execution: [
    {
      id: 'exec_suspicious_powershell',
      name: 'PowerShell sospechoso',
      keywords: ['powershell', 'encodedcommand', 'bypass', 'executionpolicy', 'downloadstring'],
      patterns: [/powershell.*encodedcommand/i, /powershell.*bypass/i, /powershell.*executionpolicy/i, /downloadstring/i],
      riskLevel: 'high',
      confidence: 'high',
      explanation: 'Se detectó un comando PowerShell sospechoso, posiblemente ofuscado o con intento de evasión.',
      recommendedAction: 'Investigar el comando y el contexto. Bloquear ejecución si es malicioso. Escalar a equipo de seguridad.',
      impact: 'Posible ejecución de código malicioso, movimiento lateral, persistencia.',
      nextChecks: ['Decodificar comando si está ofuscado', 'Investigar usuario que ejecutó', 'Revisar archivos creados/modificados', 'Buscar indicadores de compromiso'],
      details: ['Analizar comando PowerShell', 'Verificar parámetros sospechosos', 'Investigar origen de ejecución'],
      responseProcedure: [
        'PASO 1: DETENER inmediatamente la ejecución del comando si está en curso',
        'PASO 2: Decodificar el comando si está ofuscado',
        'PASO 3: Investigar el usuario que ejecutó el comando',
        'PASO 4: Revisar archivos creados o modificados por el comando',
        'PASO 5: Si el comando es malicioso, BLOQUEAR la cuenta del usuario',
        'PASO 6: ELEVAR urgentemente al equipo de seguridad',
        'PASO 7: Escanear el sistema en busca de indicadores de compromiso',
        'PASO 8: Implementar restricciones de ejecución de PowerShell'
      ]
    },
    {
      id: 'exec_command',
      name: 'Ejecución de comando',
      keywords: ['command', 'exec', 'execute', 'run', 'cmd'],
      patterns: [/command executed/i, /executed command/i, /cmd\.exe/i, /shell command/i],
      riskLevel: 'medium',
      confidence: 'medium',
      explanation: 'Se detectó la ejecución de un comando en el sistema.',
      recommendedAction: 'Verificar si el comando es legítimo. Monitorear actividad posterior del usuario.',
      impact: 'Dependiendo del comando, puede ser actividad normal o sospechosa.',
      nextChecks: ['Verificar comando ejecutado', 'Investigar usuario', 'Revisar contexto de ejecución', 'Monitorear resultados'],
      details: ['Analizar comando ejecutado', 'Verificar permisos del usuario', 'Revisar contexto'],
      responseProcedure: [
        'PASO 1: Analizar el comando ejecutado para determinar su naturaleza',
        'PASO 2: Verificar si el usuario tiene permisos para ejecutar ese comando',
        'PASO 3: Investigar el contexto y motivo de la ejecución',
        'PASO 4: Si el comando es sospechoso, CONTACTAR al usuario',
        'PASO 5: Si no hay justificación, REVISAR actividad del usuario',
        'PASO 6: Monitorear comandos posteriores del usuario',
        'PASO 7: Documentar el incidente si es necesario',
        'PASO 8: Implementar alertas para comandos sospechosos'
      ]
    },
    {
      id: 'exec_script',
      name: 'Ejecución de script',
      keywords: ['script', 'batch', 'bash', 'python', 'perl'],
      patterns: [/script executed/i, /\.bat/i, /\.sh/i, /\.py/i, /\.pl/i],
      riskLevel: 'medium',
      confidence: 'medium',
      explanation: 'Se detectó la ejecución de un script.',
      recommendedAction: 'Verificar si el script es autorizado. Analizar contenido si es sospechoso.',
      impact: 'Dependiendo del script, puede ser actividad normal o maliciosa.',
      nextChecks: ['Analizar contenido del script', 'Verificar origen del script', 'Investigar usuario que ejecutó', 'Monitorear efectos'],
      details: ['Analizar script', 'Verificar firma digital', 'Revisar permisos'],
      responseProcedure: [
        'PASO 1: DETENER inmediatamente la ejecución del script si está en curso',
        'PASO 2: Analizar el contenido del script para determinar su propósito',
        'PASO 3: Verificar el origen del script (descarga, repositorio, local)',
        'PASO 4: Investigar el usuario que ejecutó el script',
        'PASO 5: Si el script es malicioso, BLOQUEAR la cuenta del usuario',
        'PASO 6: ELEVAR al equipo de seguridad si hay sospecha de compromiso',
        'PASO 7: Escanear el sistema en busca de cambios realizados por el script',
        'PASO 8: Implementar políticas de ejecución de scripts más restrictivas'
      ]
    },
    {
      id: 'exec_process_injection',
      name: 'Inyección de proceso',
      keywords: ['injection', 'inject', 'process', 'memory', 'dll'],
      patterns: [/process injection/i, /dll injection/i, /code injection/i, /memory injection/i],
      riskLevel: 'critical',
      confidence: 'high',
      explanation: 'Se detectó una inyección de proceso, técnica común de malware para evadir detección.',
      recommendedAction: 'ISOLAR el sistema afectado. Escalar urgentemente. Realizar análisis forense.',
      impact: 'Compromiso del sistema, posible malware activo, evasión de seguridad.',
      nextChecks: ['Analizar procesos inyectados', 'Investigar proceso inyector', 'Buscar malware asociado', 'Revisar memoria del sistema'],
      details: ['Analizar procesos', 'Investigar DLLs cargadas', 'Revisar comportamiento del proceso'],
      responseProcedure: [
        'PASO 1: DESCONECTAR inmediatamente el sistema afectado de la red',
        'PASO 2: No apagar el sistema (preservar evidencia forense)',
        'PASO 3: ELEVAR urgentemente al equipo de seguridad (CRÍTICO)',
        'PASO 4: Capturar imagen de memoria del sistema para análisis forense',
        'PASO 5: Analizar procesos inyectados y proceso inyector',
        'PASO 6: Buscar malware asociado y DLLs maliciosas',
        'PASO 7: Escanear todos los demás sistemas de la red',
        'PASO 8: Documentar todo el proceso y hallazgos',
        'PASO 9: Solo después de autorización, limpiar o reinstalar el sistema'
      ]
    }
  ]
}

// Función para calcular score basado en palabras clave
function calculateKeywordScore(log, signature) {
  const logLower = log.toLowerCase()
  let score = 0
  
  for (const keyword of signature.keywords) {
    if (logLower.includes(keyword.toLowerCase())) {
      score += 1
    }
  }
  
  return score
}

// Función para detectar evento usando palabras clave y patrones
function detectEvent(log) {
  const logLower = log.toLowerCase()
  let bestMatch = null
  let bestScore = 0
  
  // Buscar en todas las categorías
  for (const category of Object.values(eventSignatures)) {
    for (const signature of category) {
      // Calcular score de palabras clave
      const keywordScore = calculateKeywordScore(log, signature)
      
      // Verificar patrones regex
      let patternMatch = false
      for (const pattern of signature.patterns) {
        if (pattern.test(log)) {
          patternMatch = true
          break
        }
      }
      
      // Score total: palabras clave + coincidencia de patrón
      const totalScore = keywordScore + (patternMatch ? 3 : 0)
      
      if (totalScore > bestScore && totalScore > 0) {
        bestScore = totalScore
        bestMatch = signature
      }
    }
  }
  
  return bestMatch
}

function extractEvidences(log, signature) {
  const evidences = []
  
  // Extraer IPs
  const ipMatches = log.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g)
  if (ipMatches) {
    evidences.push(`IP detectada: ${ipMatches.join(', ')}`)
  }
  
  // Extraer usuarios
  const userMatches = log.match(/user[:\s]+([^\s,]+)/gi)
  if (userMatches) {
    evidences.push(`Usuario: ${userMatches.map(m => m.split(/[:\s]+/)[1]).join(', ')}`)
  }
  
  // Extraer fechas/horas
  const dateMatches = log.match(/\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}/g)
  if (dateMatches) {
    evidences.push(`Fecha/Hora: ${dateMatches[0]}`)
  }
  
  // Extraer códigos de error
  const errorMatches = log.match(/error[:\s]+(\d+)/gi)
  if (errorMatches) {
    evidences.push(`Código de error: ${errorMatches.map(m => m.split(/[:\s]+/)[1]).join(', ')}`)
  }
  
  // Extraer puertos
  const portMatches = log.match(/port[:\s]+(\d+)/gi)
  if (portMatches) {
    evidences.push(`Puerto: ${portMatches.map(m => m.split(/[:\s]+/)[1]).join(', ')}`)
  }
  
  // Extraer intentos fallidos
  const attemptMatches = log.match(/(\d+)\s+(attempt|intent)/gi)
  if (attemptMatches) {
    evidences.push(`${attemptMatches[0]}`)
  }
  
  // Extraer patrones específicos del evento
  if (signature && signature.patterns) {
    for (const pattern of signature.patterns) {
      const match = log.match(pattern)
      if (match) {
        evidences.push(`Patrón detectado: "${match[0]}"`)
      }
    }
  }
  
  // Si no se encontraron evidencias específicas
  if (evidences.length === 0) {
    evidences.push('Log analizado sin datos específicos extraíbles')
  }
  
  return evidences
}

function analyzeSingleLog(log) {
  const signature = detectEvent(log)
  
  if (signature) {
    const evidences = extractEvidences(log, signature)
    
    return {
      eventId: signature.id,
      eventName: signature.name,
      summary: signature.explanation,
      riskLevel: signature.riskLevel,
      confidence: signature.confidence,
      impact: signature.impact,
      recommendedActions: signature.details,
      nextChecks: signature.nextChecks,
      evidences: evidences,
      responseProcedure: signature.responseProcedure || [],
      timestamp: new Date().toISOString()
    }
  }
  
  // Si no hay coincidencia, análisis genérico
  const evidences = extractEvidences(log, null)
  
  return {
    eventId: 'unknown',
    eventName: 'Evento desconocido',
    summary: 'No se pudo identificar el tipo de evento específico en este log. Requiere revisión manual.',
    riskLevel: 'low',
    confidence: 'low',
    impact: 'Incierto. Requiere análisis manual para determinar impacto potencial.',
    recommendedActions: [
      'Revisar el log manualmente',
      'Si es un patrón recurrente, considerar agregar regla de análisis',
      'Escalar a analista senior si es necesario'
    ],
    nextChecks: [
      'Revisar formato del log',
      'Comparar con logs similares',
      'Consultar documentación del sistema',
      'Verificar si es error esperado'
    ],
    evidences: evidences,
    timestamp: new Date().toISOString()
  }
}

// Función para detectar correlaciones entre eventos
function detectEventCorrelations(analyses) {
  const correlations = []
  const correlationGroups = []
  
  // Agrupar eventos por IP
  const ipGroups = {}
  // Agrupar eventos por usuario
  const userGroups = {}
  // Agrupar eventos por tipo
  const typeGroups = {}
  
  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i]
    
    // Extraer IP del log
    const ipMatch = analysis.logLine.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)
    if (ipMatch) {
      const ip = ipMatch[0]
      if (!ipGroups[ip]) ipGroups[ip] = []
      ipGroups[ip].push({ index: i, analysis })
    }
    
    // Extraer usuario del log
    const userMatch = analysis.logLine.match(/user[:\s]+([^\s,]+)/gi)
    if (userMatch) {
      const user = userMatch[0].split(/[:\s]+/)[1]
      if (!userGroups[user]) userGroups[user] = []
      userGroups[user].push({ index: i, analysis })
    }
    
    // Agrupar por tipo de evento
    if (analysis.eventId && analysis.eventId !== 'unknown') {
      if (!typeGroups[analysis.eventId]) typeGroups[analysis.eventId] = []
      typeGroups[analysis.eventId].push({ index: i, analysis })
    }
  }
  
  // Detectar correlaciones por IP (múltiples eventos desde la misma IP)
  for (const [ip, events] of Object.entries(ipGroups)) {
    if (events.length > 1) {
      const correlationId = `ip-${ip}`
      correlationGroups.push({
        id: correlationId,
        type: 'same_ip',
        description: `Múltiples eventos desde la misma IP: ${ip}`,
        eventIndices: events.map(e => e.index),
        severity: events.some(e => e.analysis.riskLevel === 'critical' || e.analysis.riskLevel === 'high') ? 'high' : 'medium'
      })
    }
  }
  
  // Detectar correlaciones por usuario (múltiples eventos del mismo usuario)
  for (const [user, events] of Object.entries(userGroups)) {
    if (events.length > 1) {
      const correlationId = `user-${user}`
      correlationGroups.push({
        id: correlationId,
        type: 'same_user',
        description: `Múltiples eventos del mismo usuario: ${user}`,
        eventIndices: events.map(e => e.index),
        severity: events.some(e => e.analysis.riskLevel === 'critical' || e.analysis.riskLevel === 'high') ? 'high' : 'medium'
      })
    }
  }
  
  // Detectar correlaciones por tipo (múltiples eventos del mismo tipo)
  for (const [type, events] of Object.entries(typeGroups)) {
    if (events.length > 1) {
      const correlationId = `type-${type}`
      correlationGroups.push({
        id: correlationId,
        type: 'same_type',
        description: `Múltiples eventos del mismo tipo: ${events[0].analysis.eventName}`,
        eventIndices: events.map(e => e.index),
        severity: events.some(e => e.analysis.riskLevel === 'critical' || e.analysis.riskLevel === 'high') ? 'high' : 'medium'
      })
    }
  }
  
  // Detectar patrones de ataque específicos
  // Patrón: Intentos de login fallido seguidos de login exitoso (posible compromiso)
  for (let i = 0; i < analyses.length - 1; i++) {
    if (analyses[i].eventId === 'auth_failed_login' && analyses[i + 1].eventId === 'auth_successful_login') {
      const ipMatch1 = analyses[i].logLine.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)
      const ipMatch2 = analyses[i + 1].logLine.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)
      if (ipMatch1 && ipMatch2 && ipMatch1[0] === ipMatch2[0]) {
        correlationGroups.push({
          id: `attack-compromise-${i}`,
          type: 'attack_pattern',
          description: `Posible compromiso: intentos fallidos seguidos de login exitoso desde IP ${ipMatch1[0]}`,
          eventIndices: [i, i + 1],
          severity: 'critical'
        })
      }
    }
  }
  
  // Patrón: Escaneo de puertos seguido de intento de conexión
  for (let i = 0; i < analyses.length - 1; i++) {
    if (analyses[i].eventId === 'net_port_scan' && (analyses[i + 1].eventId === 'net_suspicious_traffic' || analyses[i + 1].eventId === 'sys_unauthorized_access')) {
      correlationGroups.push({
        id: `attack-recon-${i}`,
        type: 'attack_pattern',
        description: `Posible ataque: reconocimiento seguido de actividad sospechosa`,
        eventIndices: [i, i + 1],
        severity: 'high'
      })
    }
  }
  
  return correlationGroups
}

// Función para agrupar eventos idénticos
function groupIdenticalEvents(analyses) {
  const groups = []
  const seen = new Set()
  
  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i]
    
    // Crear una clave única basada en el tipo de evento y el contenido del log (sin hora)
    const logWithoutTime = analysis.logLine.replace(/\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}/g, '[TIMESTAMP]')
    const key = `${analysis.eventId}-${logWithoutTime}`
    
    if (seen.has(key)) {
      // Si ya existe, agregar al grupo existente
      const existingGroup = groups.find(g => g.key === key)
      if (existingGroup) {
        existingGroup.count++
        existingGroup.indices.push(i)
        existingGroup.logLines.push(analysis.logLine)
      }
    } else {
      // Si no existe, crear un nuevo grupo
      seen.add(key)
      groups.push({
        key: key,
        eventId: analysis.eventId,
        eventName: analysis.eventName,
        riskLevel: analysis.riskLevel,
        confidence: analysis.confidence,
        summary: analysis.summary,
        impact: analysis.impact,
        recommendedActions: analysis.recommendedActions,
        nextChecks: analysis.nextChecks,
        evidences: analysis.evidences,
        responseProcedure: analysis.responseProcedure,
        correlations: analysis.correlations,
        count: 1,
        indices: [i],
        logLines: [analysis.logLine],
        firstLogLine: analysis.logLine
      })
    }
  }
  
  return groups
}

function analyzeMultipleLogs(logText) {
  // Separar líneas de log
  const lines = logText.split('\n').filter(line => line.trim())
  
  const analyses = []
  const eventCounts = {}
  const riskCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  }
  
  // Analizar cada línea
  for (const line of lines) {
    const analysis = analyzeSingleLog(line)
    analyses.push({
      ...analysis,
      logLine: line
    })
    
    // Contar eventos por tipo
    if (!eventCounts[analysis.eventId]) {
      eventCounts[analysis.eventId] = {
        eventId: analysis.eventId,
        eventName: analysis.eventName,
        count: 0,
        riskLevel: analysis.riskLevel
      }
    }
    eventCounts[analysis.eventId].count++
    
    // Contar por nivel de riesgo
    riskCounts[analysis.riskLevel]++
  }
  
  // Detectar eventos repetidos (más de 3 veces)
  const repeatedEvents = Object.values(eventCounts)
    .filter(event => event.count > 3)
    .map(event => ({
      eventId: event.eventId,
      eventName: event.eventName,
      count: event.count,
      riskLevel: event.riskLevel
    }))
  
  // Detectar correlaciones entre eventos
  const correlations = detectEventCorrelations(analyses)
  
  // Agregar información de correlaciones a cada análisis
  for (let i = 0; i < analyses.length; i++) {
    const analysisCorrelations = []
    for (const correlation of correlations) {
      if (correlation.eventIndices.includes(i)) {
        analysisCorrelations.push(correlation)
      }
    }
    analyses[i].correlations = analysisCorrelations
  }
  
  // Agrupar eventos idénticos
  const groupedEvents = groupIdenticalEvents(analyses)
  
  // Calcular estadísticas
  const statistics = {
    totalEvents: lines.length,
    riskDistribution: riskCounts,
    repeatedEvents: repeatedEvents,
    uniqueEvents: Object.keys(eventCounts).length,
    correlations: correlations.length,
    groupedEvents: groupedEvents.length
  }
  
  // Generar resumen general
  const summary = generateSummary(statistics, analyses, correlations, groupedEvents)
  
  return {
    summary,
    statistics,
    individualAnalyses: analyses,
    groupedEvents,
    repeatedEvents,
    correlations,
    timestamp: new Date().toISOString()
  }
}

function generateSummary(statistics, analyses, correlations, groupedEvents) {
  const { totalEvents, riskDistribution, repeatedEvents } = statistics
  
  let summary = `Se analizaron ${totalEvents} eventos. `
  
  if (riskDistribution.critical > 0) {
    summary += `Se detectaron ${riskDistribution.critical} eventos críticos. `
  }
  if (riskDistribution.high > 0) {
    summary += `${riskDistribution.high} eventos de alto riesgo. `
  }
  
  if (groupedEvents && groupedEvents.length > 0) {
    const uniqueGroups = groupedEvents.length
    summary += `Se agruparon ${totalEvents} eventos en ${uniqueGroups} grupos de eventos idénticos. `
  }
  
  if (correlations && correlations.length > 0) {
    const criticalCorrelations = correlations.filter(c => c.severity === 'critical').length
    const highCorrelations = correlations.filter(c => c.severity === 'high').length
    
    if (criticalCorrelations > 0) {
      summary += `Se detectaron ${criticalCorrelations} correlaciones críticas entre eventos. `
    } else if (highCorrelations > 0) {
      summary += `Se detectaron ${highCorrelations} correlaciones de alto riesgo entre eventos. `
    } else {
      summary += `Se detectaron ${correlations.length} correlaciones entre eventos. `
    }
  }
  
  if (repeatedEvents.length > 0) {
    summary += `Se detectaron ${repeatedEvents.length} tipos de eventos repetidos que requieren atención. `
  }
  
  if (riskDistribution.critical === 0 && riskDistribution.high === 0) {
    summary += 'No se detectaron eventos de alto riesgo. '
  }
  
  return summary.trim()
}

app.post('/api/analyze', (req, res) => {
  try {
    const { log } = req.body

    if (!log) {
      return res.status(400).json({ error: 'Log is required' })
    }

    // Detectar si es un solo log o múltiples líneas
    const lines = log.split('\n').filter(line => line.trim())
    
    if (lines.length === 1) {
      // Análisis de un solo log (compatibilidad con versión anterior)
      const analysis = analyzeSingleLog(log)
      res.json({
        ...analysis,
        isMultiple: false
      })
    } else {
      // Análisis de múltiples logs
      const analysis = analyzeMultipleLogs(log)
      res.json({
        ...analysis,
        isMultiple: true
      })
    }
  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze log' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
