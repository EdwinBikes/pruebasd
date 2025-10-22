document.addEventListener('DOMContentLoaded', () => {
  // Datos de ejemplo: asegurarse de que src sean URLs válidas (sin sintaxis markdown)
  const mediaItems = [
    { id: 1, type: 'image', src: 'https://picsum.photos/seed/filmmaker1/800/600', title: 'Amanecer en las montañas', description: 'Una toma matutina capturando la niebla y los primeros rayos.' },
    // Para videos uso un mp4 público de ejemplo (Big Buck Bunny). Reemplaza por tus URLs reales si las tienes.
    { id: 2, type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'El Aliento del Océano', description: 'Captura en cámara lenta de olas rompiendo en la costa.' },
    { id: 3, type: 'image', src: 'https://picsum.photos/seed/filmmaker3/800/600', title: 'Jungla Urbana', description: 'Larga exposición del tráfico nocturno en la ciudad.' },
    { id: 4, type: 'image', src: 'https://picsum.photos/seed/filmmaker4/800/600', title: 'Quietud del Bosque', description: 'Rayos de sol atravesando el dosel.' },
    { id: 5, type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Espejismo del Desierto', description: 'Planos amplios que muestran la inmensidad y calor.' },
    { id: 6, type: 'image', src: 'https://picsum.photos/seed/filmmaker6/800/600', title: 'Retrato de un Desconocido', description: 'Retrato espontáneo con luz natural.' },
  ];

  // --- Crear el efecto cinematográfico (modal para video) ---
  const createVideoModal = (videoSrc) => {
    // Añadimos estilos temporales para animaciones del modal
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      @keyframes blurBg { from { backdrop-filter: blur(0px); } to { backdrop-filter: blur(6px); } }
      .modal-fade-in { animation: fadeIn 0.28s ease-out forwards; }
      .modal-blur-bg { animation: blurBg 0.28s ease-out forwards; }
    `;
    document.head.appendChild(style);

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4 modal-blur-bg';
    // estilos inline mínimos por si no usas Tailwind en el proyecto
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.right = '0';
    modalOverlay.style.bottom = '0';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.padding = '1rem';
    modalOverlay.style.zIndex = '1000';
    modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.9)';

    const modalContent = document.createElement('div');
    modalContent.className = 'relative w-full max-w-4xl transform scale-95 modal-fade-in';
    modalContent.style.maxWidth = '64rem';
    modalContent.style.width = '100%';
    modalContent.style.borderRadius = '12px';
    modalContent.style.overflow = 'hidden';
    modalContent.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
    modalContent.style.background = '#000';

    // botón de cierre y video
    modalContent.innerHTML = `
      <button aria-label="Cerrar" title="Cerrar" style="position:absolute;top:8px;right:8px;z-index:10;height:40px;width:40px;border-radius:9999px;background:rgba(0,0,0,0.5);color:white;border:none;font-size:24px;cursor:pointer;">×</button>
      <video src="${videoSrc}" controls playsinline style="width:100%;height:auto;max-height:85vh;display:block;background:#000;" ></video>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // evitar scroll en el fondo
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const close = () => {
      // detiene el video si está reproduciéndose
      const v = modalContent.querySelector('video');
      if (v && !v.paused) {
        try { v.pause(); } catch (e) {}
      }
      modalOverlay.remove();
      style.remove();
      document.body.style.overflow = prevOverflow || '';
      document.removeEventListener('keydown', onKeyDown);
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };

    modalContent.querySelector('button').addEventListener('click', close);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) close();
    });
    document.addEventListener('keydown', onKeyDown);
  };

  // Renderizar la cuadrícula
  const portfolioGrid = document.querySelector('#portfolio-section .grid');
  if (!portfolioGrid) {
    console.warn('No se encontró el selector "#portfolio-section .grid". Comprueba que el HTML tenga esa estructura.');
    return;
  }

  mediaItems.forEach(item => {
    const div = document.createElement('div');
    div.className = "group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 h-64";
    div.style.position = 'relative';
    div.style.overflow = 'hidden';
    div.style.borderRadius = '8px';
    div.style.cursor = 'pointer';
    div.style.height = '16rem'; // equivalente a h-64
    div.style.transition = 'transform 0.25s';

    let mediaHTML = `
      <img src="${item.src}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s;">
    `;

    if (item.type === 'video') {
      // Si es video, usamos una miniatura (poster) si existe o el mismo src como fallback
      mediaHTML = `
        <video src="${item.src}" poster="${item.poster || ''}" muted loop playsinline style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s;"></video>
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.20);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 20 20" fill="white" style="opacity:.85;">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </div>
      `;
    }

    div.innerHTML = `
      ${mediaHTML}
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent,rgba(0,0,0,0.7));pointer-events:none;"></div>
      <div style="position:absolute;bottom:0;left:0;padding:1rem;width:100%;box-sizing:border-box;">
        <h3 style="margin:0;font-size:1.125rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.title}</h3>
        <p style="margin:0;margin-top:0.25rem;color:#d1d5db;opacity:0;transition:opacity .25s;">${item.description}</p>
      </div>
    `;

    // Comportamiento hover para video preview
    if (item.type === 'video') {
      const video = div.querySelector('video');
      const overlay = div.querySelector('div > div'); // the svg overlay we inserted (second div directly under div)
      // play on hover (silenciado), stop on leave
      div.addEventListener('mouseenter', () => {
        if (video) {
          video.play().catch(() => { /* autoplay puede bloquearse */ });
        }
        if (overlay) overlay.style.opacity = '1';
        const p = div.querySelector('p'); if (p) p.style.opacity = '1';
      });
      div.addEventListener('mouseleave', () => {
        if (video) {
          try { video.pause(); video.currentTime = 0; } catch (e) {}
        }
        if (overlay) overlay.style.opacity = '0';
        const p = div.querySelector('p'); if (p) p.style.opacity = '0';
      });
      div.addEventListener('click', () => createVideoModal(item.src));
    } else {
      // imagen: efectos simples de hover
      div.addEventListener('mouseenter', () => {
        const img = div.querySelector('img');
        if (img) img.style.transform = 'scale(1.05)';
        const p = div.querySelector('p'); if (p) p.style.opacity = '1';
      });
      div.addEventListener('mouseleave', () => {
        const img = div.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
        const p = div.querySelector('p'); if (p) p.style.opacity = '0';
      });
      // si quieres abrir imagen en modal, puedes descomentar la siguiente línea y crear un modal de imagen
      // div.addEventListener('click', () => openImageModal(item.src));
    }

    portfolioGrid.appendChild(div);
  });
});
