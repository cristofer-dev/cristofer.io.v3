---
path: '/autorizador-apigateway'
date: '2018-09-08'
title: 'Autorizando request'
image: css-grid.svg
---

Autorizador de peticiones para apigateway basado en JWT y lambda como microservicio

## Quien, que y por que.

- **Lambda**: Computo como microservicio y altamente escalable.
- **Autorizador**: Se encarga de evaluar cada petición a la API y comprobar que las credenciales son autenticas y cuenta con los permisos para continuar.
- **Apigateway**: Servicio administrado que permite diseñar, crear y desplegar API rest facilmente y altamente escalable.
- **JWT**: Estandar basado en JSON que permiten la propagación de identidad y privilegios.

## Requisitos

- ?
- ?

## Caso de uso

- Cliente hace una peticion a la API Rest
- Un autorizador (función lambda) evalua la solicitud, sus credenciales y otros requisitos que se quieran validar y autoriza o niega la petición.
- Si la solicitud es negada, el cliente obtiene respuesta 400 a su solicitud y el request no llega a la capa logica.
- Si la solicitud es aprobada, la Api transfiere la solicitud y el payload a la capa logica.

## Configuraciones

#### Autorizador (lambda)

```javascript
'use strict '

exports.handler = async (event, context, callback) => {
  // recibiremos el JWT en el event
  var token = event.authorizationToken

  // Verificamos la firma del Token
  // En caso de ser OK, autoriza
  // En caso de ser NO, Niega
  jwt.verify(token, cert, function(err, user) {
    if (user && user.id) {
      callback(null, generatePolicy('user', 'Allow', event.methodArn, user.id))
    } else {
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

- Decirle a apigateway que debe utilizar el autorizador y que parametros le debe enviar.
- Definir que recursos necesitan ser autorizador y cuales estan abiertos al mundo
