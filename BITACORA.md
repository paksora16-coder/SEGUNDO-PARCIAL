# Bitácora de Decisiones de Diseño y Análisis Técnico
**Alumno:** Sora Pak Ramirez  
**Materia:** LAD319 - Desarrollo de Aplicaciones Web  
**Proyecto:** CRUD de Personajes con `localStorage` (Animal Crossing: New Horizons Edition)

---

## Preguntas de Análisis y Decisiones de Diseño

### 1. Decisiones de diseño: ¿Por qué usar un `id` único en lugar de identificar al personaje por su nombre? ¿Qué pasaría si dos personajes se llaman igual?
**Argumentación:**  
El uso de un identificador único (UUID / String único) garantiza la integridad referencial de las operaciones CRUD. Identificar entidades por su nombre es una mala práctica porque los nombres no son claves primarias garantizadas:
* **Duplicidad:** En un catálogo extendido o un juego, dos personajes pueden compartir el mismo nombre (ej. variantes de eventos, crossovers o creaciones de usuarios).
* **Mutabilidad:** Si un usuario edita el nombre de un personaje y este actuaba como ID, la búsqueda o actualización basada en la clave vieja fallaría o corrompería los índices del arreglo.
* **Procesamiento:** Operaciones como `findIndex`, `filter` o eliminación directa sufren de ambigüedad si dependen de un atributo mutable.

### 2. Decisiones de diseño: ¿Conviene guardar todo el arreglo en una sola clave de `localStorage` o un personaje por clave? Compara ventajas y desventajas.
**Argumentación:**  
Para esta aplicación tipo Single Page Application (SPA), guardar todo el arreglo en una sola clave (`personajes`) es la opción óptima:
* **Ventajas de clave única:** Carga masiva eficiente (`JSON.parse` en una sola llamada I/O al iniciar) y simplicidad al aplicar filtros, ordenamiento o serialización completa.
* **Desventajas de clave única:** Si el volumen de datos crece a miles de registros, serializar/deserializar el JSON completo en cada escritura puede generar una ligera penalización de rendimiento.
* **Comparativa con clave por personaje:** Guardar un elemento por clave (`personaje_1`, `personaje_2`) obligaría a iterar sobre todas las llaves de `localStorage` usando `localStorage.key(i)`, filtrando prefijos manualmente, lo cual ensucia el namespace del dominio y complica la inicialización de estados vacíos.

### 3. Casos límite: ¿Qué ocurre si alguien modifica manualmente `localStorage` desde la consola y deja un JSON inválido?
**Argumentación:**  
Un software robusto no debe colapsar (*crash*) ante datos externos manipulados o corruptos.  
* **Solución e Implementación:** En la función `cargarPersonajes()`, la lectura del recurso está envuelta en un bloque `try/catch`. Si la invocación a `JSON.parse()` falla o la estructura parseada no es un arreglo (`!Array.isArray(personajes)`), el bloque `catch` intercepta la excepción, emite un aviso en la consola de desarrollador y restaura limpiamente la aplicación cargando el conjunto de datos por defecto (`defaultVillagers`).

### 4. Casos límite: ¿Qué pasa si la URL de la imagen no existe? Propón un comportamiento de respaldo.
**Argumentación:**  
Las imágenes alojadas externamente son propensas a errores HTTP 404, enlaces rotos o bloqueo por CORS.
* **Comportamiento de respaldo:** La interfaz implementa un doble mecanismo de resguardo:
  1. Si el usuario no proporciona URL, la tarjeta renderiza automáticamente un contenedor circular (`avatar-placeholder`) que calcula las iniciales en mayúsculas del personaje a partir de su nombre.
  2. Si el usuario proporciona una URL pero la imagen falla al cargar, el evento en línea `onerror` limpia el atributo y reemplaza de forma fluida el nodo de la imagen por el mismo elemento de iniciales, evitando un ícono de imagen rota en la UI.

### 5. Reflexión crítica sobre la tecnología: `localStorage` tiene un límite aproximado de 5 MB por dominio. ¿Qué pasaría si guardaras las imágenes en base64? Calcula cuántos personajes cabrían.
**Análisis y Cálculo:**  
* **Capacidad de `localStorage`:** 5 MB equivalen a aproximadamente 5,242,880 caracteres UTF-16/ASCII.
* **Peso de una imagen Base64:** Una imagen optimizada de 128x128 px suele pesar entre 30 KB y 50 KB. Al codificarla en Base64, el tamaño se incrementa un ~33%, resultando en ~50 KB a 65 KB por string Base64.
* **Cálculo estimado:**
  $$\frac{5,000 \text{ KB}}{60 \text{ KB/personaje}} \approx 83 \text{ personajes}$$
* **Conclusión:** Guardar imágenes en Base64 dentro de `localStorage` agotaría la cuota de almacenamiento muy rápidamente (con menos de 100 personajes). Es infinitamente más escalable guardar únicamente cadenas de texto con URLs de imágenes o rutas locales.

---

## Sección Especial: Pensamiento Crítico sobre el Planteamiento del Proyecto (+10 Puntos Extra)

### Evaluación de la restricción del ciclo `while` para filtrado en tiempo real
* **Inconsistencia detectada en el enunciado:** La Sección 7 del requerimiento solicita: *"implementa el filtrado con un ciclo while que repita la búsqueda mientras el resultado tenga 0 coincidencias, hasta encontrar al menos un personaje"*.
* **Riesgo / Falla de Experiencia de Usuario (UX):** En un filtrado de datos convencional, si el usuario escribe un término inexistente (ej. *"Zzzzz"*), la respuesta correcta de UI es un estado claro de "Sin resultados" (Criterio CA-08). Obligar a un ciclo `while` infinto a retornar al menos un personaje cuando no hay coincidencias obligaría a devolver datos irrelevantes o a generar bucles infinitos en memoria si no se acorta el término de búsqueda.
* **Propuesta y Solución Implementada:** Se diseñó un algoritmo de búsqueda adaptativa usando un ciclo `while` controlado que recorta de derecha a izquierda el texto buscado (`query.slice(0, -1)`) cuando no hay coincidencias exactas. De este modo, si la búsqueda devuelve 0 resultados, el `while` busca la coincidencia parcial más cercana (sugerencia) sin bloquear el hilo principal de JavaScript ni romper el criterio de "Sin resultados" si la cadena queda vacía.