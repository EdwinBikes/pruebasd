document.addEventListener('DOMContentLoaded', () => {
  // Datos de ejemplo: asegúrate de que src sean URLs válidas
  const mediaItems = [
    { id: 1, type: 'image', src: 'https://picsum.photos/seed/filmmaker1/800/600', title: 'Amanecer en las montañas', description: 'Una toma matutina capturando la niebla y los primeros rayos.' },
    // Nota: algunas URLs (como Instagram) no sirven como src de <video>. Reemplaza por MP4 si quieres reproducir.
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
    modalOverlay.className = 'modal-overlay modal-blur-bg';
    // estilos inline mínimos por si no usas Tailwind en el proyecto
    Object.assign(modalOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: '10000',
      backgroundColor: 'rgba(0,0,0,0.9)',
    });

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content modal-fade-in';
    Object.assign(modalContent.style, {
      maxWidth: '64rem',
      width: '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
      background: '#000',
      position: 'relative',
    });

    // botón de cierre y video
    modalContent.innerHTML = `
      <button class="modal-close" aria-label="Cerrar" title="Cerrar" style="
        position:absolute;top:8px;right:8px;z-index:10;height:40px;width:40px;border-radius:9999px;
        background:rgba(0,0,0,0.5);color:white;border:none;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;"
      >&times;</button>
      <div style="width:100%;height:100%;display:block;">
        <video src="${videoSrc}" controls playsinline style="width:100%;height:auto;max-height:85vh;display:block;background:#000;" ></video>
      </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // evitar scroll en el fondo
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const close = () => {
      try {
        const v = modalContent.querySelector('video');
        if (v && !v.paused) {
          try { v.pause(); } catch (e) { /* ignore */ }
        }
        modalOverlay.remove();
        style.remove();
        document.body.style.overflow = prevOverflow || '';
        document.removeEventListener('keydown', onKeyDown);
      } catch (err) {
        // En caso de error (ej. ya eliminado), restauramos overflow de todos modos
        document.body.style.overflow = prevOverflow || '';
        try { modalOverlay.remove(); } catch (e) {}
        try { style.remove(); } catch (e) {}
        document.removeEventListener('keydown', onKeyDown);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };

    const closeButton = modalContent.querySelector('.modal-close');
    if (closeButton) closeButton.addEventListener('click', close);

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
    div.className = "media-card group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 h-64";
    Object.assign(div.style, {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '8px',
      cursor: 'pointer',
      height: '16rem', // equivalente a h-64
      transition: 'transform 0.25s',
      background: '#111',
    });

    // Generar HTML según tipo
    let mediaHTML = `
      <img class="media-image" src="${item.src}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s;">
    `;

    if (item.type === 'video') {
      const posterAttr = item.poster ? `poster="${item.poster}"` : '';
      mediaHTML = `
        <video class="media-video" src="${item.src}" ${posterAttr} muted loop playsinline style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s;"></video>
        <div class="media-overlay" style="position:absolute;inset:0;background:rgba(0,0,0,0.20);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 20 20" fill="white" style="opacity:.95;">
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
        <p class="media-desc" style="margin:0;margin-top:0.25rem;color:#d1d5db;opacity:0;transition:opacity .25s;">${item.description}</p>
      </div>
    `;

    // Comportamiento hover para video preview
    if (item.type === 'video') {
      const video = div.querySelector('.media-video');
      const overlay = div.querySelector('.media-overlay');
      // play on hover (silenciado), stop on leave
      div.addEventListener('mouseenter', () => {
        if (video) {
          try {
            video.muted = true;
            video.loop = true;
            const playPromise = video.play();
            if (playPromise && typeof playPromise.then === 'function') {
              playPromise.catch(() => { /* autoplay puede bloquearse */ });
            }
          } catch (e) { /* ignore */ }
        }
        if (overlay) overlay.style.opacity = '1';
        const p = div.querySelector('.media-desc'); if (p) p.style.opacity = '1';
      });
      div.addEventListener('mouseleave', () => {
        if (video) {
          try { video.pause(); video.currentTime = 0; } catch (e) {}
        }
        if (overlay) overlay.style.opacity = '0';
        const p = div.querySelector('.media-desc'); if (p) p.style.opacity = '0';
      });
      div.addEventListener('click', () => createVideoModal(item.src));
    } else {
      // imagen: efectos simples de hover
      div.addEventListener('mouseenter', () => {
        const img = div.querySelector('.media-image');
        if (img) img.style.transform = 'scale(1.05)';
        const p = div.querySelector('.media-desc'); if (p) p.style.opacity = '1';
      });
      div.addEventListener('mouseleave', () => {
        const img = div.querySelector('.media-image');
        if (img) img.style.transform = 'scale(1)';
        const p = div.querySelector('.media-desc'); if (p) p.style.opacity = '0';
      });
      // si quieres abrir imagen en modal, puedes descomentar la siguiente línea y crear un modal de imagen
      // div.addEventListener('click', () => openImageModal(item.src));
    }

    portfolioGrid.appendChild(div);
  });
});
