/* Carga y filtrado del listado + página de detalle */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const money = (n) => new Intl.NumberFormat('es-VE',{style:'currency',currency:'REF',maximumFractionDigits:0}).format(n);
const text = (s='') => (s ?? '').toString();

async function loadData(){
  const res = await fetch('data/listings.json');
  if(!res.ok) throw new Error('No se pudo cargar data/listings.json');
  return res.json();
}

function applyFilters(list){
  const tipo = document.getElementById('tipo')?.value || '';
  const zona = (document.getElementById('zona')?.value || '').toLowerCase().trim();
  const habsMin = parseInt(document.getElementById('habitaciones')?.value || '0',10);
  const pmin = parseInt(document.getElementById('precio-min')?.value || '0',10);
  const pmaxIn = document.getElementById('precio-max')?.value || '';
  const pmax = pmaxIn === '' ? Infinity : parseInt(pmaxIn,10);

  return list.filter(p=>{
    const okTipo = !tipo || p.tipo === tipo;
    const okZona = !zona || (p.ubicacion?.urbanizacion || '').toLowerCase().includes(zona) || (p.ubicacion?.ciudad || '').toLowerCase().includes(zona);
    const okHabs = !habsMin || (p.habitaciones || 0) >= habsMin;
    const precio = p.precioREF;
    const okPrecio = (pmin===0 && pmax===Infinity) ? true : (typeof precio === 'number' && precio >= pmin && precio <= pmax);
    return okTipo && okZona && okHabs && okPrecio;
  });
}

function renderCards(list){
  const grid = document.getElementById('grid');
  const count = document.getElementById('contador');
  if(!grid) return;
  grid.innerHTML = '';

  if(count){
    count.textContent = `${list.length} inmueble${list.length===1?'':'s'} encontrado${list.length===1?'':'s'}`;
  }

  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    const img = (p.imagenes && p.imagenes[0]) || 'images/placeholder.png';
    const price = (typeof p.precioREF === 'number') ? money(p.precioREF) : 'Consultar';
    const badge = p.tipo === 'venta' ? 'En venta' : 'En alquiler';
    card.innerHTML = `
      <img class="cover" src="${img}" alt="${p.titulo || 'Inmueble'}" loading="lazy">
      <div class="content">
        <div class="chips"><span class="badge">${badge}</span></div>
        <h3>${text(p.titulo)}</h3>
        <div class="price">${price}</div>
        <div class="meta">
          ${text(p.ubicacion?.urbanizacion)}, ${text(p.ubicacion?.ciudad)} • ${p.metros} m² • ${p.habitaciones} Hab • ${p.banos} Baños
        </div>
      </div>
      <div class="actions">
        <a class="btn" href="property.html?slug=${encodeURIComponent(p.slug)}">Ver detalle</a>
        <a class="btn secondary" target="_blank" rel="noopener" href="https://wa.me/584241289672?text=${encodeURIComponent('Hola, me interesa: ' + p.titulo + ' (' + location.origin + location.pathname.replace(/[^/]+$/, '') + 'property.html?slug=' + p.slug + ')')}">WhatsApp</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setupFilters(list){
  const ids = ['tipo','zona','habitaciones','precio-min','precio-max'];
  const refresh = ()=>{
    const filtered = applyFilters(list);
    renderCards(filtered);
  };
  ids.forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', refresh);
  });
  const clear = document.getElementById('btn-limpiar');
  if(clear) clear.addEventListener('click', ()=>{
    ids.forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      if(el.tagName==='SELECT') el.value='';
      else el.value='';
    });
    refresh();
  });
  renderCards(list);
}

function initListPage(){
  const grid = document.getElementById('grid');
  if(!grid) return;
  loadData().then(list=>{
    list.sort((a,b)=> (b.createdAt||0) - (a.createdAt||0));
    setupFilters(list);
  }).catch(err=>{
    grid.innerHTML = '<p>Ocurrió un error cargando los inmuebles.</p>';
    console.error(err);
  });
}

function qsParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function initDetailPage(){
  const prop = document.getElementById('prop');
  if(!prop) return;
  loadData().then(list=>{
    const slug = qsParam('slug');
    const p = list.find(x=> x.slug === slug);
    if(!p){
      prop.innerHTML = '<p>No se encontró este inmueble. Regresa al listado.</p>';
      return;
    }
    document.title = p.titulo + ' | Inmueble en Caracas';
    document.getElementById('propTitle').textContent = p.titulo;
    document.getElementById('badge').textContent = p.tipo === 'venta' ? 'En venta' : 'En alquiler';
    document.getElementById('ubicacion').textContent = `${text(p.ubicacion?.urbanizacion)}, ${text(p.ubicacion?.ciudad)}`;
    document.getElementById('metros').textContent = `${p.metros} m²`;
    document.getElementById('habs').textContent = `${p.habitaciones} Hab`;
    document.getElementById('banos').textContent = `${p.banos} Baños`;
    document.getElementById('puestos').textContent = `${p.estacionamientos} Puestos`;

    const priceEl = document.getElementById('price');
    if(typeof p.precioREF === 'number'){ priceEl.textContent = money(p.precioREF); }
    else { priceEl.textContent = 'Precio a consultar'; }

    const desc = document.getElementById('descripcion');
    desc.textContent = p.descripcion || '';

    const am = document.getElementById('amenities');
    am.innerHTML = '';
    (p.amenities || []).forEach(t=>{
      const li = document.createElement('li'); li.textContent = t; am.appendChild(li);
    });

    const main = document.getElementById('mainImg');
    const thumbs = document.getElementById('thumbs');
    const imgs = (p.imagenes && p.imagenes.length ? p.imagenes : ['images/placeholder.png']);
    main.src = imgs[0];
    thumbs.innerHTML = '';
    imgs.forEach((src,i)=>{
      const im = document.createElement('img');
      im.src = src; im.alt = p.titulo + ' foto ' + (i+1);
      if(i===0) im.classList.add('active');
      im.addEventListener('click', ()=>{
        document.querySelectorAll('.thumbs img').forEach(x=>x.classList.remove('active'));
        im.classList.add('active');
        main.src = src;
      });
      thumbs.appendChild(im);
    });

    const msg = `Hola, me interesa: ${p.titulo} (${window.location.href})`;
    const ws = document.getElementById('cta-ws');
    ws.href = 'https://wa.me/584241289672?text=' + encodeURIComponent(msg);
  })
  .catch(err=>{
    prop.innerHTML = '<p>No se pudo cargar la información.</p>';
    console.error(err);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initListPage();
  initDetailPage();
});
