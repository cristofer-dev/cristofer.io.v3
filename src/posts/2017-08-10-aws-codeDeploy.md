---
path: "/aws-codedeploy"
date: "2017-08-10"
title: "AWS CodeDeploy"
image: aws.svg
---

Automatiza las implementaciones de código

**`Disclaimer:`** POST en redacción!

### Primero los permisos : **IAM Roles**


Como ya sabemos, ~casi~ todo en AWS estan controlados por permisos o los **IAM** (Identity and Access Management) y **CodeDeploy** necesita contar con su **ROL** asi como las **EC2** involucradas en las operaciones tambien necesitaran un **IAM ROLE**


### Service ROLE para **CodeDeploy**


Vamos a Crear un Rol llamado **`AWSCodeDeployRole`** para eso debemos ir a **IAM > Roles > Create new role**

en **Step 1 : Select role type** Selecciona **`Amazon EC2`**  
en **Step 3 : Attach policy**  

- busca **`AWSCodeDeployRole`** marcala

Con ambas **Policy** seleccionadas, da click en **`Next Step`**

en **Step 4 : Set role name and review**  

- en Role Name pon : **`AWSCodeDeployRole`**  
- en Role description pon : **`Permite a CodeDeploy Acceso y gestion de EC2`**


### IAM ROLE para las **EC2**


Vamos a Crear un Rol llamado **`AWSCodeDeployRole`** para eso debemos ir a **IAM > Roles > Create new role**

en **Step 1 : Select role type** Selecciona **`Amazon EC2`**  
en **Step 3 : Attach policy**  

- busca **`AmazonS3ReadOnlyAccess`** marcala

Con ambas **Policy** seleccionadas, da click en **`Next Step`**

en **Step 4 : Set role name and review**  

- en Role Name pon : **`AWSCodeDeployRoleForEC2`**  
- en Role description pon : **`Permite a EC2 Acceso de Lectura S3 para descargar los SourceCodes`**


### Las Instancias 

Necesitaremos las EC2 donde se desplegara el código fuente y estas pueden ser varias alternativas, mencionaremos dos de ellas:

**Un grupo de auto escalamiento** (ASG) : Necesitaremos tener configurado previamente el ASG y sus EC2


**Instancias EC2** : Necesitaras tener al menos una EC2 corriendo para poder desplegar el el código en ella.


Cualquiera sea el caso, tanto para el **ASG** como para una **EC2** las instancias deben tener instalado **`Code Deploy Agent`** el servicio que permitira a CodeDeploy poder comunicarse con las EC2 y poder ejecutar las operaciones necesarias para poder desplegar el código fuente de las aplicaciones.



### Instalando **Code Deploy Agent**

Instalamos las dependencias necesarias:
```bash
apt-get update
apt-get install python-pip
apt-get install ruby
apt-get install wget
```

Nos movemos a la ruta del user admin y descargamos el Agente
```bash
cd /home/admin
wget https://xxx.s3.amazonaws.com/latest/install
```


reemplazar **`xxx`** por una de las siguientes zonas

```bash
aws-codedeploy-us-east-1 for instances in the US East (N. Virginia) region
aws-codedeploy-us-west-1 for instances in the US West (N. California) region
aws-codedeploy-us-west-2 for instances in the US West (Oregon) region
aws-codedeploy-ap-south-1 for instances in the Asia Pacific (Mumbai) region
aws-codedeploy-ap-northeast-2 for instances in the Asia Pacific (Seoul) region
aws-codedeploy-ap-southeast-1 for instances in the Asia Pacific (Singapore) region
aws-codedeploy-ap-southeast-2 for instances in the Asia Pacific (Sydney) region
aws-codedeploy-ap-northeast-1 for instances in the Asia Pacific (Tokyo) region
aws-codedeploy-eu-central-1 for instances in the EU (Frankfurt) region
aws-codedeploy-eu-west-1 for instances in the EU (Ireland) region
aws-codedeploy-sa-east-1 for instances in the South America (São Paulo) region
```


Por ejemplo, si nuestras instancias estan en **oregon** debemos descargar desde:

```bash
wget https://aws-codedeploy-us-west-2.s3.amazonaws.com/latest/install
```

Luego aplicamos permisos de ejecución e instalamos.

```bash
chmod +x ./install
./install auto
```


Verificamos la instalación

```bash
service codedeploy-agent status
service codedeploy-agent start
```

Con el servicio ya instalado y funcionando nuestra **EC2** ya esta preparada para recibir las instruicciones desde CodeDeploy

Si se va a Generar un ASG y su respectiva Launch Configurations basa en una AMI, esta AMI debe haber sido creada en base a una EC2 que tenga CodeDeploy Agent instalado y corriendo.

**`IMPORTANTE`** : Todas las EC2 que se creen para interactuar con **Codedeploy** deberan tener asignado el **`IAM Role`** que creamos para tal proposito (`AWSCodeDeployRoleForEC2`) de lo contrario las EC2 no tendran acceso a S3 para obtener el SourceCode.

**`CodeDdeployAgent`** genera logs de sus operaciones en `/var/log/aws/codedeploy-agent/`  para revisar si algo no funciona, puedes monitorear usando `tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log` para verlos en tiempo real mientras se ejecuta un despliegue.


## Creando CodeDeploy en una **EC2**


### Create application

Application name: **Aplicacion1**   
Deployment group name: **Quality Assurance**  



### Deployment type

Seleccionaremos **`In-place deployment`**



### Environment configuration

Seleccionamos la pestaña **`Amazon EC2 instances`**
en `Key` seleccionamos `Name`
en `Value` seleccionamos `ElNombreDeLaEC2`

en **`Matching instances`** se mostrarán todas las instancias que hagan match con el tag indicado y sera sobre ellas que se desplegara el SourceCode.


### Deployment configuration

Seleccionamos **`AllAtOnce`**

#TODO: Detallar cada uno de ellos


Service role
---------------------------------------
Seleccionamos el rol que creamos para Codedeploy : **`AWSCodeDeployRole`**  
Se selecciona por ARN, el ARN del ROL puede ser consultado directamente en IAM

