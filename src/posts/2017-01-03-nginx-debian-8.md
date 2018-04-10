---
path: "/nginx"
date: "2017-01-03"
title: "Nginx on Debian 8"
image: nginx.svg
---

Instalar Nginx en Debian 8 junto a apache


```bash
# stop apache
service apache2 stop

# Update y upgrade
apt-get update
apt-get upgrade

# Install FPM
apt-get install php5-fpm

# Install Nginx
apt-get install nginx-full
```



#### Configure php.ini for work MongoDB

en la ruta <code>/etc/php5/fpm/php.ini</code> agregar

```bash
[mongo]
extension=mongo.so
```

Al hacer cambios en `php.ini` debemos reiniciar el servicio `php5-fpm`

```bash
service php5-fpm restart
```


#### Configurar el HOST 

El archivo de configuración se encuentra en `/etc/nginx/sites-available/`, en este directorio viene por defecto un archivo `default` el cual contiene la configuración basica.

Le cambiaremos en nombre, por que no lo utilizaremos, pero no lo eliminaremos, por si lo necesitamos mas adelante.

```bash
mv default default.backup
```

luego creamos un nuevo archivo `default` haciendo 


```bash
nano /etc/nginx/site-available/default
```

se abrira nano, y pondremos la siguiente configuración:

Dominio: **default**


```nginx

server {
  listen 80 default_server;
  listen [::]:80 default_server;

  root /var/www/;
  index index.php index.html index.htm index.nginx-debian.html;

  server_name _;

  location / {
    try_files $uri $uri/ /index.php;
  }

  location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_buffers 16 16k;
    fastcgi_buffer_size 32k;
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    fastcgi_pass unix:/var/run/php5-fpm.sock;
    fastcgi_param ENVIRONMENT production;
  }
  location ~ /\.ht {
    deny all;
  }
}

```


luego, copiamos el archivo 

```bash
cp default blog.cristofer.io
```

esto hara que se cree una copia del archivo pero con el nomre `blog.cristofer.io`

lo abrimos y lo editamos con `nano blog.cristofer.io`


Dominio: **blog.cristofer.io**

```nginx

server {
  listen 80;
  listen [::]:80;

  root /var/www/blog.cristofer.io;
  index index.php index.html index.htm index.nginx-debian.html;

  server_name blog.cristofer.io;

  location / {
    try_files $uri $uri/ /index.php;
  }

  location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_buffers 16 16k;
    fastcgi_buffer_size 32k;
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    fastcgi_pass unix:/var/run/php5-fpm.sock;
    fastcgi_param ENVIRONMENT production;
  }
  location ~ /\.ht {
    deny all;
  }
}

```


### Seteando variables de entorno para PHP

LINEA 21: `fastcgi_param APP_ENV production;`  
donde:  
`APP_ENV` es el nombre de la variable  
`production` es el valor de la variable  

```nginx
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	root /var/www/api.cristofer.com;

	index index.php index.html index.htm index.nginx-debian.html;	

	server_name api.cristofer.com;

	location / {
		try_files $uri $uri/ /index.php;
	}

	location ~ \.php$ {
		include snippets/fastcgi-php.conf;
		fastcgi_buffers 16 16k;
		fastcgi_buffer_size 32k;
		fastcgi_split_path_info ^(.+\.php)(/.+)$;
		fastcgi_pass unix:/var/run/php5-fpm.sock;
		fastcgi_param APP_ENV production;
	}
	location ~ /\.ht {
		deny all;
	}
}
```


### Habilitando Puertos

```bash

#Habilitando el HOST en el puerto '8080'

server {
	listen 8080 default_server;
	listen [::]:8080 default_server;
...
...
}
```

Comandos Utiles |
---- | ----
Iniciar | `service nginx start`
Detener | `service nginx stop`
Recargar configuración | `service nginx reload`
Reinicia el servicio | `service nginx restart`
Estado del servicio | `service nginx status`
