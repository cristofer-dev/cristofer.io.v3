---
path: "/apuntes-terminal"
date: "2017-03-01"
title: "Apuntes Terminal Linux"
image: bash.svg
---

Comandos utiles de uso cotidiano. Las cosas que siempre olvidas ;)



 **Moverse por el sistema de archivos** |
 ---- | ----
Directorio actual | `pwd`


**Agente SSH** |
 ---- | ----
Terminar agente             | `killall ssh-agent`
Iniciar Agente              | `eval $(ssh-agent -s)`
Agregar llave al agente | `ssh-add /ruta/llave_privada` 
Crear par de llaves SSH | `ssh-keygen`
Subir archivo a servidor | `scp -i /path/public.pem dir/file.txt user@ip:/path/destino/`
Create private Key (jwt) | `ssh-keygen -t rsa -b 4096 -f jwtRS256.key`
Create Public key (jwt) | `openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub`

**Sistema** |
 ---- | ----
ver procesos corriendo                    | `top`
matar proceso indicando el id               | `kill 9999`
Ver tamaño de carpeta ( DU = Disk Usage )   | `du -bsh /fichero_carpeta`
Uso del disco duro                          | `df -h`
Uso del disco duro (iNodos)                 | `df -i`
buscar texto recursivo en un directorio     | `grep -ri "izitdb.com" /srv/websites/`
Guardar salida en archivo                   | `[comando] > archivo.txt`
agregar salida al final del archivo         | `[comando] >> archivo.txt`
Crear usuario                               | `adduser luis`
Cambiar clave de otro usuario               | `passwd luis`
Cambiar de usuario                          | `su - user2`
Apagar Sistema                              | `sudo shutdown -h now`
Reiniciar                                   | `sudo shutdown -r now`
Saber si un paquete esta disponible en los repos | `apt-cache search paquete`
Saber si un paquete esta instalado         | `dpkg -l | grep paquete`
Filtrar logs omitiendo lineas que contengan `location` o `whispers`| `tail -f /var/log/apache2/access.log | egrep -v "location|v3/whispers"`


**Liberar Espacio** |
 ---- | ----
Elimina cache de los paquetes antiguos instalados   | `apt-get autoclean`
Elimina cache de los paquetes actuales instalados   | `apt-get clean`
Elimina paquetes huérfanos                          | `sudo apt-get autoremove`

**Systemctl** |
 ---- | ----
Consultar estado                | `systemctl status apache2.service`
Reiniciar servicio              | `systemctl restart apache2.service`
Detener el servicio             | `systemctl stop apache2.service`
Iniciar servicio                | `systemctl start apache2.service`
Recargar servicio               | `systemctl reload apache2.service`
Recargar o Reiniciar            | `systemctl reload-or-restart apache2.service`
Habilitar inicio con el SO      | `systemctl enable application.service`
Deshabilitar inicio con el SO   | `systemctl disable application.service`




### Habilitar Autocompletado en Terminal

Sera necesario tener instalado
`aptitude install bash-completion`

Estando como SU abriremos el archivo `profile` con gedit (u otro editor) 

```bash
gedit /etc/profile
```

Buscamos

```bash
# enable bash completion in interactive shells <br>
#if [ -f /etc/bash_completion ] && ! shopt -oq posix; then
#    . /etc/bash_completion
#fi

```

Reemplazamos por

```bash

if [ "$BASH" ]; then
   if [ -f /etc/bash_completion ] && ! shopt -oq posix; then
        . /etc/bash_completion
   fi
fi

```

### Habilitar usuario como SUDO

En el file `/etc/sudoers` agregar el nombre de los usuarios que que quieres que tengan privilegios como root de la siguiente forma.

```bash
# User privilege specification
root	ALL=(ALL:ALL) ALL
usuario1 ALL=(ALL:ALL) ALL
usuario2 ALL=(ALL:ALL) ALL
```
