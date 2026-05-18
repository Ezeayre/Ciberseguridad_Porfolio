#!/bin/bash

echo "=========================================="
echo "INFORMACIÓN DE USUARIOS DEL SISTEMA"
echo "=========================================="
echo ""

echo "1. LISTADO DE USUARIOS CON ACCESO A SHELL:"
echo "---"
cat /etc/passwd | cut -d: -f1,3,6,7 | grep -v "/nologin\|/false" | column -t -s:

echo ""
echo "2. USUARIOS CON PRIVILEGIOS DE SUDO:"
echo "---"
getent group sudo | cut -d: -f4

echo ""
echo "3. USUARIOS ACTIVOS AHORA MISMO:"
echo "---"
who

echo ""
echo "=========================================="
