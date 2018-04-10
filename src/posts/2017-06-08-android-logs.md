---
path: "/android-logs"
date: "2017-06-08"
title: "Android Logs"
image: android.svg
---

Ver logs de un dispositivo ANDROID en Debian 8.


#### Actualizamos

```bash
apt-get update
apt-get upgrade
```


#### Instalamos
```bash
apt-get install android-tools-adb
```


#### Para ver la version instalada
```bash
adb version

# deberia retornar algo como:
Android Debug Bridge version 1.0.31
```

#### Ver dispositivos conectados
```bash
adb devices

# Retornara algo como:

* daemon not running. starting it now on port 5037 *
* daemon started successfully *
List of devices attached 
ZY223RJ27V  offline
```


#### Ver logs
Para ello usaremos logcat y filtraremos con `grep` la salida, siendo `'palabra'` (entre comillas simple) el filtro que aplicaremos a la salida
```bash
adb logcat | grep 'palabra'
```
