# 🍃 Colección de Aldeanos de Animal Crossing: New Horizons (CRUD Web)

Aplicación Web de Una Sola Página (SPA) desarrollada para administrar una colección interactiva de aldeanos de *Animal Crossing: New Horizons*, con persistencia de datos local, búsqueda responsiva y gestión de personajes de creación propia (OCs).

---

## 👤 Información del Alumno

* **Nombre:** Sora Pak Ramirez  
* **Materia:** LAD319 - Desarrollo de Aplicaciones Web  
* **Carrera:** Ingeniería en Animación Digital  
* **Institución:** Universidad La Salle Bajío (Campus Campestre)  
* **URL de la Aplicación (GitHub Pages):** 
---

## 📖 Descripción del Proyecto

Esta aplicación permite visualizar, agregar, editar, consultar el detalle y eliminar personajes del universo de *Animal Crossing*, así como filtrar elementos en tiempo real por nombre o personalidad. 

Toda la información gestionada persiste en el navegador mediante el uso de **`localStorage`**, garantizando que la colección se conserve al recargar la página o cerrar el navegador sin necesidad de bases de datos o servicios backend externos.

---

## ✨ Funcionalidades Implementadas

* **Cuadrícula Responsiva (Read):** Muestra todos los personajes registrados mediante tarjetas responsivas construidas con Flexbox y el framework Bulma CSS.
* **Detalle Completo (Read):** Ventana modal que despliega la información extendida del aldeano (especie/origen, fecha de registro, rol y descripción completa).
* **Alta de Personajes (Create):** Formulario con validación de campos obligatorios en tiempo real y detección de entradas vacías.
* **Edición de Información (Update):** Actualización de datos de cualquier personaje existente con notificaciones visuales de confirmación al guardar los cambios.
* **Eliminación Segura (Delete):** Remoción de registros de la cuadrícula y de `localStorage` previa confirmación del usuario.
* **Búsqueda Adaptativa (Read):** Filtrado insensible a mayúsculas y acentos que implementa un algoritmo de coincidencia dinámica para sugerir resultados ante búsquedas parciales.
* **Manejo de Casos Límite y Resguardo Visual:**
  * Detección y restauración automática ante datos corruptos o inválidos en `localStorage`.
  * Generación dinámica de avatares con iniciales (`avatar-placeholder`) en caso de imágenes rotas o URLs ausentes.
* **Personajes de Creación Propia (+5 Pts Extra):** La colección inicial incluye 3 personajes originales (Aiko, Kuro y Milo) con biografías y atributos completos.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructuración semántica de la aplicación web de una sola página.
* **CSS3:** Estilos personalizados, diseño adaptativo y control de dimensiones de imágenes.
* **Bulma CSS Framework (CDN):** Sistema de maquetación, cuadrículas, modales y componentes de interfaz.
* **FontAwesome 6 (CDN):** Iconografía vectorial.
* **JavaScript (ES6+ Vanilla):** Manipulación del DOM, manejo de eventos y lógica CRUD sin frameworks JS.
* **`localStorage` API:** Persistencia de datos en la sesión del navegador.
* **GitHub Pages:** Despliegue y alojamiento público de la aplicación.

---

## 🚀 Instrucciones de Uso y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone 