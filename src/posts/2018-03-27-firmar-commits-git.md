---
path: "/firmar-commits"
date: "2018-04-05"
title: "Firmar commits en git"
image: git.svg
---

> Git es criptográficamente seguro, pero no es a prueba de tontos. Si estás tomando trabajo de otros de internet y quieres verificar que los commits son realmente de fuentes seguras, Git tiene unas cuantas maneras de firmar y verificar utilizando GPG. [git](https://git-scm.com/book/es/v2/Herramientas-de-Git-Firmando-tu-trabajo)


```bash
# Listar keys gpg disponibles
gpg --list-keys


# Nos mostrara las llaves disponibles para firmar
/Users/schacon/.gnupg/pubring.gpg
---------------------------------
pub   2048R/0A46826A 2014-06-04
uid                  Scott Chacon (Git signing key) <schacon@gmail.com>
sub   2048R/874529A9 2014-06-04

# Le decimos a git que llave usar para firmar los commits
git config --global user.signingkey 0A46826A

```

Ahora ya podemos firmar un commit agregando el flag `-S`
```bash
git commit -S -m your commit message
```

Si queremos que todos los commit se firmen
```bash
git config --global commit.gpgsign true

```

Para exportar la llave publica, por ejemplo para ponerla en github.
 ```bash
gpg --armor --export 0A46826A
``` 

#### Referencias
- [gnupg.org](https://www.gnupg.org/gph/es/manual/c16.html)
