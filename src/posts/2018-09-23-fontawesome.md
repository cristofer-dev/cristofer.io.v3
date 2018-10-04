---
path: '/fontawesome'
date: '2018-09-23'
title: 'Fontawesome in react'
image: fontawesome.svg
---

Implementación de FontAwesome en ReactJS APP

## Instrucciones

Instalamos las dependencias

```bash
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/react-fontawesome
```

En nuestro componente que vamos a usar el icon:

```javascript
// importamos el component FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// Importamos el icono que necesitamos
import { faUsers } from '@fortawesome/free-solid-svg-icons'
```

```javascript
// Utilizamos el componente y le pasamos como prop el ICON que queremos usar.
<FontAwesomeIcon icon={faUsers} color="#FFFF" size="4x" />
```
