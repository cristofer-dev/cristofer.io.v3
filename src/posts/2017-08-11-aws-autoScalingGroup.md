---
path: "/aws-autoscaling"
date: "2017-08-11"
title: "AWS Auto Scaling Group"
image: aws.svg
---

Aumentar o reducir dinámicamente la capacidad de tus EC2


Auto Scaling Group : **ASG**
=======================================

Un **ASG** nos permite básicamente controlar de forma dinámica la cantidad de instancias EC2 que contendran nuestra aplicación, de esta forma podemos incrementar nuestra capacidad frente al aumento de la demanda y poder garantizar la disponibilidad de nuestra aplicación y disminuir nuestra capacidad cuando el número de peticiones baje, controlando de mejor manera el pago de tiempos de CPU ociosos.

Para crear un **ASG** necesitamos unos pasos previos:

- Definir una **AMI**
- Crear un **Launch Configuration** (LC)
- Crear un **ASG**



Definir una **AMI Base**
---------------------------------------
Es tan simple como crear una **EC2**, instalando el SO y todo lo necesario para que tu aplicación funcione. Como sugerencia, siempre es bueno tener un check list (o un .sh) con todo lo que se debe instalar, por lo general las AMI se hacen una vez cada 300 años y cuando tenemos que crear una nueva ya ni recordamos esos "detallitos" para hacer correr el driver de mongo con php5 o que nuestra app necesitaba una lib especifica de python.

Cuando ya tengas la EC2 con todo lo necesario para que tu aplicación funcione sin problemas (sólo entorno el SourceCode aún no se pone en la EC2) vamos a Generar una AMI y en lo posible con un nombre semantico, con el pasar de los meses el número de AMI aumentara y se podria volcer un lio reconocer tal o cual si no le pones un nombre lógico y una descripción adecuada.



Crear un Launch Configuration : **LC**
---------------------------------------

- **Elegir AMI**: Selecciona la AMI Base que ya creamos en el paso anterior.

- **Elegir tipo de instancia**: Tu ASG agregara nuevas EC2 de forma autonoma usando la AMI que le indicaste como imagen, pero debes indicarle tambien que tipo de instancia debe utilizar para las EC2 que se crearan.

- **Configurar Detalles**: cosas simples como
	- **Nombre de la LC** : Igual que para las AMI, utiliza nombres semantico algo como `LC.ASG.Proyecto1`
	- **Purchasing option** : Lo dejaremos en blanco por ahora.
	- **IAM Role** : Recuerda que tenemos pensado integrar todo esto a un CodeDeploy, por lo cual sera necesario asignarle un ROL que permita comunicar con CodeDeploy, utilizaremos el mismo que ya creamos en los post anteriores.
	- **Monitoring** : Lo dejaremos en blanco por ahora.

- **Add Storage**: Tan simple como indicarle cuanto disco tendra cada una de las nuevas EC2 que se agregen al grupo.

- **SG**: El grupo de seguridad que se le aplicara a cada una de las nuevas EC2 que se agregen al grupo.

- **Review**: El clasico review de la configuración antes de crearla.

Al dar click en `Create launch configuration` nos pedira ( igual que en todas las EC2 ) seleccionar el par de llaves que usaremos para acceder a las maquinas, recuerda no olvidarte de la llave que se le asigne.

Si todo sale ok, deberiamos tener un mensaje como `Successfully created launch configuration: LC.ASG.ProtectoEjemploDia2`



Crear un **ASG**
---------------------------------------

- **Configure Auto Scaling group details**:

	- **Group Name**: `ASG.ProtectoEjemploDia2`

	- **Group size**: start with `1` instance

	- **Network**: Selecciona una de tus VPC

	- **Subnet**: Selecciona una o todas las Subnets de la VPC

	- **Advanced Details**: Lo veremos luego, dejalo en blanco por ahora.

- **Configure scaling policies**: Las configuraremos Luego, lo saltamos por ahora.

- **Configure Notifications**: Las configuraremos Luego, lo saltamos por ahora.

- **Configure Tags**: Cuando tengas 99 instancias operando sera mas facil agruparlas por nombre, por tanto sugiero poner:  

| Key        | Value                    |
|:----------:|:------------------------:|
| `Name`     |`ASG.ProtectoEjemploDia2` |

- **Review**: El clasico review de la configuración antes de crearla.

Luego le damos al boton para crear el ASG y como le indicamos `Group size: start with 1 instance` deberia automaticamente crear una EC2 basandose en la **LC** que le indicamos, la que a su ves sera creada en base a la **AMI** que definimos en nuestra **LC**.

Para Verificar eso, podemos ir al dashboard de las **EC"** y en el menu lateral izquierdo, dar click en la sección **Auto Scaling Groups** seleccionar nuestro `ASG.ProtectoEjemploDia2` y dar click en la pestaña **Instances** y deberiamos tener nuestra EC2. 

Recordemos que Esta EC2 simplemente esta basada en una **AMI** base limpia, que tiene todas las configuraciones necesarias , pero aún no tiene el código fuente de nuestra aplicación, ahora nos queda por decirle a **CodeDeploy** que en lugar de desplegar el código en una EC2 aislada, lo haga a todas las instancias de un **ASG**.

Desplegando Código en el **ASG** con CodeDeploy
---------------------------------------
Recordemos que ya tenemos un **CodeDeploy** Configurado que esta desplegando Código a una unica EC2, bastara con editar el **CodeDeploy** en la seccion **Environment configuration** en la pestaña de **Auto Scaling groups** y seleccionar nuestro ASG. Puedes (y es lo recomendable) sacar la EC2 que tenia originalmente ese CodeDeploy para evitarnos lios y confusiones.
