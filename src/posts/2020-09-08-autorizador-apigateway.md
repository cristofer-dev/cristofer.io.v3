---
path: '/autorizador-apigateway'
date: '2018-09-08'
title: 'Autorizando request'
image: jwt.svg
---

Autorizador de peticiones para apigateway basado en JWT y lambda como microservicio

## Problema

Implementar validación de tokens de acceso en API gateway.

## Que vamos a usar

- **Lambda**: Para crear una función (con Javascript) que verificará la validez de nuestro token.
- **Apigateway**: Nuesta API que queremos implementar las validaciones de tokens.
- **Autorizador de Apigateway**: Se encarga llamar a la función lambda y en base a al resultado, permitira o negara la petición.
- **JWT**: Estandar basado en JSON que permiten la propagación de identidad y privilegios.

## Requisitos

- node8
- llave pública del emisor del Token.

## Caso de uso

- Browser hace una peticion a la API Rest.
- Un autorizador llama a una función lambda que evalua la solicitud, sus credenciales y otros requisitos que se quieran validar y autoriza o niega la petición.
- Si la solicitud es negada, el cliente obtiene respuesta 400 a su solicitud y el request no llega a la capa logica.
- Si la solicitud es aprobada, la Api transfiere la solicitud y el payload a la capa logica.

## Configuraciones

#### JSON Web Token

> JSON Web Token o JWT es un estándar definido para la creación de tokens de acceso que permiten la propagación de identidad y privilegios. [wiki](https://es.wikipedia.org/wiki/JSON_Web_Token)

El modelo tradicional de tokens, plantea una verificación del token contra una BD en cada request, por tanto, cada petición que porta un token y este requiere ser validado, el sistema deberá ir a la capa de datos y verificar la valides de este token y en base a esa comparación determina si el request esta o no autorizado.

JWT no requiere contrastar con la capa de datos la valides del token, gracias a la integración de llaves asimétricas y firmas la validez del token puede ser verificada aplicando el algoritmo con que fue generado y utilizando en la mayoría de los casos la llave pública de la entidad emisora.

Por tanto, una (no la única) de las principales ventajas de implementar JWT es disminuir latencias para las verificaciones de tokens de acceso y disminución de request a una capa de datos.

El sitio oficial de [JWT](https://jwt.io/) se explica con mas detalle y profundidad las multiples caracteristicas, ventajas, casos de uso e implementaciones de JWT, así como también el listado de las multiples librerias para su implementación en diversos lenguajes.

En nuestro caso nos enfocaremos en la librería para nodejs que nos va a permitir verificar la validez de un token empleando la **llave pública** de su emisor.

#### Autorizador (lambda)

Necesitaremos crear una lambda que sera llamada por API Gateway para verificar la autenticidad del JWT, esta le dira a API Gateway si el token es valido o no, retornando una politica que permite el request o en caso contrario, retorna un error y API Gateway bloqueara el request.

```javascript
const jwt = require('jsonwebtoken')
const PUBLIC_KEY = require('./env/public.key')

exports.handler = async (event, context, callback) => {
  // recibiremos el JWT en el event
  var TOKEN = event.authorizationToken

  /*
  * Verificamos la firma del Token
  * TOKEN: Token a verificar
  * PUBLIC_KEY: Llave pública para verificar la firma
  */

  jwt.verify(TOKEN, PUBLIC_KEY, function(err, payload) {
    if (payload) {
      // En caso de ser un token valido, nos retornara un USER
      // llamamos al callback, pasando la funcion que generará
      // una policy que va a autorizar el request
      callback(
        null,
        generatePolicy('user', 'Allow', event.methodArn, payload.user.id)
      )
    } else {
      // En caso de ser NO valido, no retorna user, y
      // llamamos al callback pasadole un error
      callback('Unauthorized')
      // callback(null, generatePolicy('user', 'Deny', event.methodArn));
    }
  })
}

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource, user_id) {
  var authResponse = {}

  authResponse.principalId = principalId
  if (effect && resource) {
    var policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    var statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    user_id_request: user_id,
  }
  return authResponse
}
```

#### Apigateway

Con nuestra lambda creada, solamente necesitaremos ir a la sección de **Authorizers** de API Gateway y crear un nuevo **Authorizers**

- Name: El nombre que le quieras dar al autorizador.
- Type: lambda.
- Lambda function: indicar el nombre de la funcion lambda.
- Lambda Invoke Role: es opcional.
- Lambda Event Payload: Token, para recibirlo por cabecera.
- Token Source: nombre de la cabecera con la que el browser enviara el token.
- Token Validation: En caso de querer aplicar validaciones con regexp, puedes ponerlo aqui.
- Authorization Caching: Puedes evitar que cada REQUEST llame al autorizador, habilitando un caching por el tiempo que definas.

Mas detalles de esta configuración [aquí](https://docs.aws.amazon.com/es_es/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html)
