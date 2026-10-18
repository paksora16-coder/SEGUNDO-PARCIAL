const STORAGE_KEY = 'personajes';


let personajes = [];

const gridContainer = document.getElementById('villagers-grid');
const searchInput = document.getElementById('search-input');
const searchCount = document.getElementById('search-count');
const clearSearchBtn = document.getElementById('clear-search-btn');
const emptyState = document.getElementById('empty-state');
const resetSearchBtn = document.getElementById('reset-search-btn');


const villagerModal = document.getElementById('villager-modal');
const villagerForm = document.getElementById('villager-form');
const modalTitle = document.getElementById('modal-title');
const detailModal = document.getElementById('detail-modal');



const defaultVillagers = [
  {
    id: "ac-001",
    nombre: "Canela",
    rol: "Especial",
    origen: "Perro",
    imagen: "assets/canela.png",
    descripcion: "La atenta y amable secretaria del ayuntamiento, lista para ayudarte con todos los trámites y la vida en la isla.",
    fechaCreacion: new Date().toISOString()
  },
  {
    id: "ac-002",
    nombre: "Tom Nook",
    rol: "Especial",
    origen: "Tanuki",
    imagen: "assets/tom nook.png",
    descripcion: "El visionario presidente de Nook Inc. y gestor del Plan de Asentamiento en Islas Desiertas.",
    fechaCreacion: new Date().toISOString()
  },
  {
    id: "ac-003",
    nombre: "Raymond",
    rol: "Esnob",
    origen: "Gato",
    imagen: "assets/raymond.jpg",
    descripcion: "Un popular gato con heterocromía amante de los trajes elegantes, el buen café y la organización impecable.",
    fechaCreacion: new Date().toISOString()
  },
  {
    id: "ac-004",
    nombre: "Lili",
    rol: "Dulce",
    origen: "Rana",
    imagen: "assets/lily.jpg",
    descripcion: "Una ranita afable y educada a la que le apasiona la lectura, la jardinería y disfrutar de una taza de té.",
    fechaCreacion: new Date().toISOString()
  },
  {
    id: "ac-005",
    nombre: "Parches",
    rol: "Perezoso",
    origen: "Oso Peluche",
    imagen: "assets/parches.jpg",
    descripcion: "Un tierno osito de colores a quien le encantan los dulces, las siestas y hablar con los insectos de su casa.",
    fechaCreacion: new Date().toISOString()
  },
  {
    id: "ac-006",
    nombre: "Fustino",
    rol: "Atlántico / Atleta",
    origen: "Paloma",
    imagen: "assets/fustino.jpg",
    descripcion: "Un aficionado al café refinado y dueño de 'El Alpiste', apasionado por la buena atención y las conversaciones tranquilas.",
    fechaCreacion: new Date().toISOString()
  },
]

document.addEventListener('DOMContentLoaded', () => {
  cargarPersonajes();
  configurarEventos();
  renderizarGrid(personajes);
});


function cargarPersonajes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      personajes = defaultVillagers;
      guardarPersonajes();
      return;
    }
   
    personajes = JSON.parse(data);
    if (!Array.isArray(personajes)) throw new Error("Estructura de datos inválida");
  } catch (error) {
    console.warn("localStorage corrupto o inválido. Restableciendo datos por defecto.", error);
    personajes = defaultVillagers;
    guardarPersonajes();
  }
}

function guardarPersonajes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(personajes));
  } catch (e) {
    alert("Error al guardar en localStorage. Es posible que el almacenamiento esté lleno.");
  }
}


function renderizarGrid(lista) {
  gridContainer.innerHTML = '';

  if (lista.length === 0) {
    gridContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  gridContainer.style.display = 'flex';
  emptyState.style.display = 'none';

  lista.forEach(p => {
    const col = document.createElement('div');
    // Agregamos 'is-flex' para que todas las columnas de la fila compartan la misma altura
    col.className = 'column is-12-mobile is-6-tablet is-4-desktop is-flex';

    const card = document.createElement('div');
    card.className = 'card';

    const imgHTML = p.imagen 
      ? `<img src="${p.imagen}" alt="${p.nombre}" onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'avatar-placeholder\\'>${obtenerIniciales(p.nombre)}</div>';">`
      : `<div class="avatar-placeholder">${obtenerIniciales(p.nombre)}</div>`;

    card.innerHTML = `
      <div class="card-image-wrapper">
        ${imgHTML}
      </div>
      <div class="card-content">
        <p class="title is-5 mb-1">${escaparHTML(p.nombre)}</p>
        <span class="tag is-primary mb-2">${escaparHTML(p.rol || 'Sin rol')}</span>
        <p class="subtitle is-6 has-text-grey mb-2">${escaparHTML(p.origen || 'Desconocido')}</p>
        <p class="is-size-7 ellipsis">${escaparHTML(p.descripcion || 'Sin descripción.')}</p>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item has-text-info" onclick="verDetalle('${p.id}')">
          <i class="fas fa-eye mr-1"></i> Detalle
        </a>
        <a href="#" class="card-footer-item has-text-warning" onclick="abrirModalEditar('${p.id}')">
          <i class="fas fa-edit mr-1"></i> Editar
        </a>
        <a href="#" class="card-footer-item has-text-danger" onclick="eliminarPersonaje('${p.id}')">
          <i class="fas fa-trash mr-1"></i> Borrar
        </a>
      </footer>
    `;
    col.appendChild(card);
    gridContainer.appendChild(col);
  });
}


function filtrarPersonajes() {
  let query = normalizarTexto(searchInput.value.trim());

  if (query === '') {
    clearSearchBtn.style.display = 'none';
    resetSearchBtn.style.display = 'none';
    searchCount.textContent = '';
    renderizarGrid(personajes);
    return;
  }

  clearSearchBtn.style.display = 'block';

  let resultados = [];
  let terminoPrueba = query;


  while (terminoPrueba.length > 0) {
    resultados = personajes.filter(p => {
      const nombreMatch = normalizarTexto(p.nombre).includes(terminoPrueba);
      const rolMatch = normalizarTexto(p.rol || '').includes(terminoPrueba);
      return nombreMatch || rolMatch;
    });

    if (resultados.length > 0) {
      break; 
    }

    terminoPrueba = terminoPrueba.slice(0, -1); 
  }

  if (resultados.length > 0 && terminoPrueba !== query) {
    searchCount.textContent = `Sin resultados exactos. Mostrando ${resultados.length} sugerencia(s) para "${terminoPrueba}"`;
  } else {
    searchCount.textContent = `${resultados.length} coincidencia(s) encontrada(s)`;
  }

  if (resultados.length === 0) {
    document.getElementById('empty-state-title').textContent = "Sin resultados";
    document.getElementById('empty-state-subtitle').textContent = `No se encontraron coincidencias para "${searchInput.value}"`;
    resetSearchBtn.style.display = 'inline-block';
  } else {
    resetSearchBtn.style.display = 'none';
  }

  renderizarGrid(resultados);
}


function mostrarNotificacion(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'notification is-success is-light';
  toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
  toast.innerHTML = `<button class="delete"></button><i class="fas fa-check-circle mr-2"></i>${mensaje}`;
  
  toast.querySelector('.delete').onclick = () => toast.remove();
  document.body.appendChild(toast);

  setTimeout(() => {
    if (document.body.contains(toast)) toast.remove();
  }, 3500);
}


function guardarFormulario(e) {
  e.preventDefault();

  const id = document.getElementById('villager-id').value;
  const nombre = document.getElementById('input-nombre').value.trim();
  const rol = document.getElementById('input-rol').value;
  const origen = document.getElementById('input-origen').value.trim();
  const imagen = document.getElementById('input-imagen').value.trim();
  const descripcion = document.getElementById('input-descripcion').value.trim();

  let esValido = true;
  if (!nombre) {
    document.getElementById('error-nombre').style.display = 'block';
    esValido = false;
  } else {
    document.getElementById('error-nombre').style.display = 'none';
  }

  if (!rol) {
    document.getElementById('error-rol').style.display = 'block';
    esValido = false;
  } else {
    document.getElementById('error-rol').style.display = 'none';
  }

  if (!esValido) return;

  if (id) {

    const idx = personajes.findIndex(p => p.id === id);
    if (idx !== -1) {
      personajes[idx] = { ...personajes[idx], nombre, rol, origen, imagen, descripcion };
      mostrarNotificacion(`¡Información de "${nombre}" actualizada correctamente!`);
    }
  } else {

    const nuevoPersonaje = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now(),
      nombre,
      rol,
      origen,
      imagen,
      descripcion,
      fechaCreacion: new Date().toISOString()
    };
    personajes.unshift(nuevoPersonaje);
    mostrarNotificacion(`¡Aldeano "${nombre}" agregado a la isla!`);
  }

  guardarPersonajes();
  cerrarModales();
  filtrarPersonajes();
}


window.verDetalle = function(id) {
  const p = personajes.find(item => item.id === id);
  if (!p) return;

  document.getElementById('detail-name').textContent = p.nombre;
  document.getElementById('detail-rol').textContent = p.rol;
  document.getElementById('detail-origen').textContent = `Especie / Origen: ${p.origen || 'N/A'}`;
  document.getElementById('detail-description').textContent = p.descripcion || 'Sin descripción disponible.';
  document.getElementById('detail-date').textContent = `Registrado: ${new Date(p.fechaCreacion).toLocaleDateString()}`;

  const imgContainer = document.getElementById('detail-image-container');
  if (p.imagen) {
    imgContainer.innerHTML = `<img src="${p.imagen}" alt="${p.nombre}" class="is-rounded" onerror="this.parentNode.innerHTML='<div class=\\'avatar-placeholder\\'>${obtenerIniciales(p.nombre)}</div>';">`;
  } else {
    imgContainer.innerHTML = `<div class="avatar-placeholder">${obtenerIniciales(p.nombre)}</div>`;
  }

  detailModal.classList.add('is-active');
};

window.eliminarPersonaje = function(id) {
  const p = personajes.find(item => item.id === id);
  if (!p) return;

  if (confirm(`¿Estás seguro de que deseas eliminar a "${p.nombre}" de la isla?`)) {
    personajes = personajes.filter(item => item.id !== id);
    guardarPersonajes();
    filtrarPersonajes();
    mostrarNotificacion(`Aldeano "${p.nombre}" eliminado.`);
  }
};

window.abrirModalEditar = function(id) {
  const p = personajes.find(item => item.id === id);
  if (!p) return;

  document.getElementById('villager-id').value = p.id;
  document.getElementById('input-nombre').value = p.nombre;
  document.getElementById('input-rol').value = p.rol;
  document.getElementById('input-origen').value = p.origen || '';
  document.getElementById('input-imagen').value = p.imagen || '';
  document.getElementById('input-descripcion').value = p.descripcion || '';

  modalTitle.textContent = 'Editar Aldeano';
  villagerModal.classList.add('is-active');
};

function abrirModalAlta() {
  villagerForm.reset();
  document.getElementById('villager-id').value = '';
  document.getElementById('error-nombre').style.display = 'none';
  document.getElementById('error-rol').style.display = 'none';
  modalTitle.textContent = 'Agregar Nuevo Aldeano';
  villagerModal.classList.add('is-active');
}

function cerrarModales() {
  villagerModal.classList.remove('is-active');
  detailModal.classList.remove('is-active');
}

function configurarEventos() {
  document.getElementById('open-add-modal-btn').addEventListener('click', abrirModalAlta);
  document.getElementById('save-btn').addEventListener('click', guardarFormulario);
  
  document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', cerrarModales));
  document.querySelectorAll('.close-detail-modal').forEach(btn => btn.addEventListener('click', cerrarModales));

  searchInput.addEventListener('input', filtrarPersonajes);
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    filtrarPersonajes();
  });
  resetSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    filtrarPersonajes();
  });
}

function obtenerIniciales(nombre) {
  return nombre ? nombre.substring(0, 2).toUpperCase() : 'AC';
}

function normalizarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function escaparHTML(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}