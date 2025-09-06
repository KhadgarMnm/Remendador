# 🧩 Meneame Thread Fixer

Un script en **JavaScript** para **corregir el anidado de comentarios en Menéame** cuando los usuarios citan con el formato no oficial `#_N` en lugar del estándar `#N`.

---

## ✨ Funcionalidades

- 🔄 **Carga automática de comentarios**  
  Descarga todas las páginas de comentarios de una noticia y las añade al contenedor principal.  

- 🔍 **Detección de citas no estándar**  
  Encuentra comentarios que incluyen referencias del tipo `#_N`.  

- 🪄 **Corrección de anidado**  
  - Identifica el comentario con ID `N`.  
  - Reanida la respuesta bajo el comentario correspondiente.  
  - Crea la estructura `.threader` y `.threader-childs` cuando sea necesario.  

- 🧹 **Limpieza del DOM**  
  - Elimina los `<div class="pages">` innecesarios.  
  - Elimina duplicados de `threader zero`.  

---

## 🎯 Objetivo

El script restaura la estructura correcta de los hilos en Menéame:  
- Facilita seguir las conversaciones largas.  
- Mantiene el contexto de las respuestas.  
- Mejora la experiencia de lectura, incluso cuando los usuarios citan con `#_N`.  

---
