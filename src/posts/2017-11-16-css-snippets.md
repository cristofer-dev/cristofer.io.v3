---
path: "/css-snippets"
date: "2017-11-16"
title: "CSS Snippet"
image: css.svg
---

Las cosas básicas de **CSS** que siempre usamos y que siempre olvidamos...


Selectores por elemento
=======================================

```css
/* Universal  */
* {}

/* tag (elemento)*/
div {}

/* Clase*/
.menu {}

/* ID*/
#miId {}

/* Hijos*/
p > span {}
.menu > div {}
#menu > span > i {}

/* Adyacentes*/
elemento1 + elemento2 { }
#menu + #menu2 {}
```


Selectores por atributos
=======================================

```css
/*odos los elementos que tengan el atributo indicado (independiente de su valor)*/*/
selector[atributo] { }

/* Todos los elementos que tengan el atributo indicado y cuyo valor sea = valor*/
selector[atributo="valor"] { }

/* Todos los elementos que tengan el atributo indicado  en el que al menos uno de sus valores sea "valor1" */
selector[atributo~="valor1"] { }

/* Todos los elementos que tengan el atributo indicado y cuyo valor empiece por “es”*/
selector[atributo|=”es”] { }

/* selecciona todos los elementos que disponen de ese atributo y cuyo valor comienza exactamente por la cadena de texto indicada. */
elemento[atributo^="valor"] { }

/* selecciona todos los elementos que disponen de ese atributo y cuyo valor termina exactamente por la cadena de texto indicada. */
elemento[atributo$="valor"] { }

/* selecciona todos los elementos que disponen de ese atributo y cuyo valor contiene la cadena de texto indicada. */
elemento[atributo*="valor"] { }


```
