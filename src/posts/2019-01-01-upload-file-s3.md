---
path: '/upload-file-to-s3'
date: '2019-01-01'
title: 'Subir un archivo a S3 desde un formulario HTML'
image: aws.svg
---

Subiendo archivos a s3 directamente desde un input file

## Problema

Subir archivos a s3 desde un formulario HTML

## Que vamos a usar

- **Lambda**: Para crear una función (con node) que generará una URL firmada por aws a la cual enviaremos el formulario.
- **Apigateway**: Para disponibilizar nuestra lambda como un recurso Rest.
- **Navegador**: Desde donde cargaremos el archivo que necesitamos subir.

## Requisitos

- AWS Lambda
- api gateway
- un Bucket de s3

## Caso de uso

- Usuario abre ventana con formulario que incluye un campo "upload file" para ser cargado al sistema.
- El navegador obtendrá una URL firmada por AWS con un TTL y con permisos para un bucket especifico.
- El navegador usara parte de esta información para firmar el form que llevara el file.

## Configuraciones

#### El Bucket

El bucket no necesita ninguna configuración extra, de momento solo necesitaremos el nombre del bucket. Supondremos que se llama `cdn.cristofer.io`

#### La lambda

La siguiente función se encarga de generar una URL firmada que sera devuelta al frontend.

**Cosas a tener en cuenta (que no son obligatorias pero en ejemplo de usan):**

- Necesitas `AccessKeyId` y `SecretAccessKey`, en este caso manejadas como variables de entornos inyectadas en un file `vars.json` por el build lo importante es que no esten incluidas en modo hardcode.
- Para el ejemplo usaremos la librería `uuid` para generar el nombre del file que vamos a subir.

```javascript
const AWS = require('aws-sdk')
const uuidv4 = require('uuid/v4')
const ENV = require('./env/vars.json')

const s3 = new AWS.S3({
  region: 'us-west-2',
  accessKeyId: ENV.dev.keys.lambda_uploads_get.AWSAccessKeyId,
  secretAccessKey: ENV.dev.keys.lambda_uploads_get.AWSSecretAccessKey,
})

const bucket = 'cristofer.io' // Nombre del bucket donde subirás el fichero.
const expirationTimeSeonds = 600 // TTL antes que caduque la autorización.

function generateUrlSigned() {
  const uuid = uuidv4()
  const bucketKey = `sub_folder/${uuid}.jpg` // Path final del archivo y extensión.

  const params = {
    Bucket: bucket,
    Expires: expirationTimeSeonds,
    Fields: {
      key: bucketKey,
      acl: 'public-read', // Permisos con los cuales va a quedar el archivo.
      'Content-Type': 'image/jpeg', // Tipo (mime) de archivo.
    },
  }
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (error, result) => {
      if (error) reject(error)
      else resolve(result) // Retornamos al handler el objeto con las firmas.
    })
  })
}

exports.handler = async (event, context, callback) => {
  const done = (err, code, res) =>
    callback(null, {
      statusCode: code,
      body: err ? JSON.stringify(err) : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  const urlSigned = await generateUrlSigned()

  done(null, '200', {
    status: 'success',
    data: urlSigned, // Devolvemos al cliente el objeto con las firmas.
  })
}
```

El retorno sera algo como esto:

```json
{
  "status": "success",
  "data": {
    "url": "https://s3.us-west-2.amazonaws.com/cdn.cristofer.io",
    "fields": {
      "key": "sub_carpeta/0f22e6a6-1dea-435f-86f4-1e6e139f85c9.jpg",
      "acl": "public-read",
      "Content-Type": "image/jpeg",
      "bucket": "cdn.cristofer.io",
      "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
      "X-Amz-Credential": "ASIAVQHNEZBDP3QHWFRT/20190101/us-west-2/s3/aws4_request",
      "X-Amz-Date": "20190101T174511Z",
      "X-Amz-Security-Token": "FQoGZXIvYXdzEHsaDDG0EsZorpYrgOwN/CLrAdV2Xixh01qzoM3QOb+NA+re0KScPdTievXg6b60889p2IFluAqmHQDxI8fqM/emOclWnI4A+MYYIZxxFAOHlxC9WMwCoVQOIeiZMXFx3XaZYFPbGvMk5XmvkM53ZyUmeH2+P2BG383yDwAsMCASOUeOHvadF35/Wh0ty2ypIXIk6PYmjoAlhKyeH1jxhJQBDCe417CtykjT5yvVsERk0Pkg5d6Hqk8Y3gp5evudS8KUAoeLLTXweQ4/1jlyARRZWMo9Mqu4QU=",
      "Policy": "eyJleHBpcmF0aW9uIjoiMjAxOS0wMS0wMVQxNzo1NToxMVoiLCJjb25kaXRpb25zIjpbeyJrZXkiOiJjdmNlbnRyYWwvMGYyMmU2YTYtMWRlYS00MzVmLTg2ZjQtMWU2ZTEzOWY4NWM5LmpwZyJ9LHsiYWNsIjoicHVibGljLXJQifSx7IkltYWdlL2pwZWcifSx7ImJ1Y2tldCI6ImNkbi5zaXN0ZW1hcyasdaCJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbC1MTFaIn0seyJYLUFtei1TZWN1cml0eS1Ub2tlbiI6IkZRb0daWEl2WVhkekVIc2FEREcwRXNab3JwWXJnT3dOL0NMckFkVjJYaXhoMDFxem9NM1FPYitOQStyZTBLU2NQZFRpZXZYZzZiNjA4ODlwMklGbHVBcW1IUUR4SThmcU0vZW1PY2xXbkk0QfqbFRhNTVFTTczWTZhNmtQblY2bDF2UXpXZlcydFN6T24ybzVCcllnRG00WG4zOUZxUllaVpNWEZ4M1hhWllGUGJHdk1rNVhtdmtNNTNaeVVtZUgyK1AyQkczODN5RHdBc01DQVNPVWVPSHZhZEYzNS9XaDB0eTJ5cElYSWs2UFltam9BbGhLeWVIMWp4aEpRQkRDZTQxN0N0eWtqVDV5dlZzRVJrMFBrZzVkNkhxazhZM2dwNWV2dWRTOEtVQW9lTExUWHdlUTQvMWpseUFSUlpXTW85TXF1NFFVPSJ9XX0=",
      "X-Amz-Signature": "9f329d827300cdf61baf73b5dbf6cbb96d0101a9e409982205ba00020065668e"
    }
  }
}
```

Con estos datos podemos enviar nuestro formulario `POST` directamente a s3 y subir nuestro archivo.

#### Apigateway

Bastara con configurar un endpoint que actúe como proxy entre el cliente y la lambda retornando el json generado por la lambda.

#### El Formulario

El `action` del formulario debe incluir el nombre del bucket `http://nombre_bucker.s3.amazonaws.com/`, en nuestro caso sera `http://cdn.cristofer.io.s3.amazonaws.com/`

No olvidar el `enctype="multipart/form-data"`

```html
<form action="http://cdn.cristofer.io.s3.amazonaws.com/" method="post" enctype="multipart/form-data">
</form>
```

El formulario debe contener los siguientes campos ( ocultos ) :

`Key`  
`acl`  
`Content-Type`  
`X-Amz-Credential`  
`X-Amz-Algorithm`  
`X-Amz-Date`  
`X-Amz-Signature`  
`Policy`

Con ayuda de JS asignaremos los valores devueltos por la función lambda y finalmente ponemos el `<input type="file" name="file">` y nuestro botón `submit`.

```html
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Example</title>
  </head>
  <body>
    <form action="http://cdn.cristofer.io.s3.amazonaws.com/" method="post" enctype="multipart/form-data">

      <input type="text" name="key"><br>
      <input type="text" name="acl" value="public-read"><br>
      <input type="text" name="Content-Type" value="image/jpeg"><br>
      <input type="text" name="X-Amz-Credential"><br>
      <input type="text" name="X-Amz-Algorithm" value="AWS4-HMAC-SHA256"><br>
      <input type="text" name="X-Amz-Date"><br>
      <input type="text" name="X-Amz-Signature"><br>
      <input type="text" name="Policy"><br>

      <input type="file" name="file" id="">

      <button type="submit">Subir</button>
    </form>
</body>
```

De esta forma lo que ocurrirá es que al enviar el formulario a `http://cdn.cristofer.io.s3.amazonaws.com`, s3 validará los campos procederá a cargar el file en el bucket y la key que le indicamos, con las respectivas ACL que le fueron asignadas al momento de generar las firmas.

La URL del file esta dada por la unión de `url` + `key` del JSON que genera la lambda. De igual forma si ese bucket en particular esta disponibilizado con cloudfront, bastará con agregar el `key` al DNS del Cloudfront y ya está.
