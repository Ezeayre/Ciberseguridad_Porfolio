import socket

ip = input("Ingresa la IP a escanear: ")
print(f"\nEscaneando {ip}...\n")

puertos_abiertos = []

for puerto in range(1, 1001):
    try:
        conexion = socket.socket()
        conexion.settimeout(1)
        resultado = conexion.connect_ex((ip, puerto))
        
        if resultado == 0:
            print(f"Puerto {puerto}: ABIERTO ✓")
            puertos_abiertos.append(puerto)
        
        conexion.close()
    except:
        pass

print(f"\nPuertos abiertos encontrados: {puertos_abiertos}")
