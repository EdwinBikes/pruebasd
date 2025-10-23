document.addEventListener('DOMContentLoaded', () => {
  // Datos de ejemplo: ahora incluyen los tres enlaces que pediste (YouTube / Shorts / Instagram).
  // Para YouTube/Instagram se usa embedding (iframe) en el modal; en la galería mostramos miniaturas.
  const mediaItems = [
    { id: 1, type: 'image', src: 'https://picsum.photos/seed/filmmaker1/800/600', title: 'Amanecer en las montañas', description: 'Una toma matutina capturando la niebla y los primeros rayos.' },
    { id: 2, type: 'video', src: 'https://youtu.be/mTlmzbWW0fI?si=ab5J25dSjL8XEHCo', title: 'YouTube Video 1', description: 'YouTube link que abriremos en modal embebido.' },
    { id: 3, type: 'image', src: 'https://picsum.photos/seed/filmmaker3/800/600', title: 'Jungla Urbana', description: 'Larga exposición del tráfico nocturno en la ciudad.' },
    { id: 4, type: 'image', src: 'https://picsum.photos/seed/filmmaker4/800/600', title: 'Quietud del Bosque', description: 'Rayos de sol atravesando el dosel.' },
    { id: 5, type: 'video', src: 'https://youtube.com/shorts/3Mfa8JX42lc?si=04T0EwaAUVMtiQll', title: 'YouTube Shorts', description: 'Shorts de YouTube embebido en modal.' },
    { id: 6, type: 'video', src: 'https://www.instagram.com/p/DPXVYDMkSYA/', title: 'Instagram Post', description: 'Publicación de Instagram embebida en modal.' },
    { id: 7, type: 'image', src: 'https://picsum.photos/seed/filmmaker6/800/600', title: 'Retrato de un Desconocido', description: 'Retrato espontáneo con luz natural.' },
  ];

  // Helpers para detectar tipo de URL y construir embed / miniatura
  const isYouTubeUrl = (url) => /(?:youtube\.com|youtu\.be)/i.test(url);
  const isInstagramUrl = (url) => /instagram\.com\/p\//i.test(url);
  const getYouTubeId = (url) => {
    try {
      // Manejar varios formatos: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID
      const u = new URL(url.startsWith('http') ? url : 'https://' + url);
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
      if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2] || u.pathname.split('/')[1];
      return u.searchParams.get('v');
    } catch (e) {
      // fallback con regex
      const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      return m ? m[1] : null;
    }
  };
  const getYouTubeEmbedUrl = (url) => {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?rel=0&showinfo=0` : null;
  };
  const getYouTubeThumbnail = (url) => {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  };
  const getInstagramEmbedUrl = (url) => {
    try {
      const u = new URL(url.startsWith('http') ? url : 'https://' + url);
      // extraer el path /p/SHORTCODE/
      const parts = u.pathname.split('/').filter(Boolean);
      const idx = parts.indexOf('p');
      if (idx !== -1 && parts[idx + 1]) {
        const shortcode = parts[idx + 1];
        return `https://www.instagram.com/p/${shortcode}/embed`;
      }
      // fallback: devolver la url misma
      return url;
    } catch (e) {
      return url;
    }
  };

  // --- Crear el efecto cinematográfico (modal para video / embebidos) ---
  const createVideoModal = (videoSrc) => {
    // Añadimos estilos temporales para animaciones del modal
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      .modal-fade-in { animation: fadeIn 0.18s ease-out forwards; }
      .modal-iframe { width: 100%; height: 85vh; border: 0; background: #000; }
      .modal-center { display:flex;align-items:center;justify-content:center;height:100%;width:100%; }
    `;
    document.head.appendChild(style);

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    Object.assign(modalOverlay.style, {
      position: 'fixed',
      inset: '0',
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

    // botón de cierre
    const closeButton = document.createElement('button');
    closeButton.setAttribute('aria-label', 'Cerrar');
    closeButton.title = 'Cerrar';
    closeButton.innerHTML = '&times;';
    Object.assign(closeButton.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      zIndex: '20',
      height: '40px',
      width: '40px',
      borderRadius: '9999px',
      background: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      cursor: 'pointer',
    });

    // Área central donde colocamos iframe o <video>
    const center = document.createElement('div');
    center.className = 'modal-center';
    Object.assign(center.style, {
      width: '100%',
      background: '#000',
    });

    // Determinar si es YouTube / Instagram / mp4
    let embedded = false;
    if (isYouTubeUrl(videoSrc)) {
      const embed = getYouTubeEmbedUrl(videoSrc);
      if (embed) {
        const iframe = document.createElement('iframe');
        iframe.src = embed + '&autoplay=1';
        iframe.className = 'modal-iframe';
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        center.appendChild(iframe);
        embedded = true;
      }
    } else if (isInstagramUrl(videoSrc)) {
      const embed = getInstagramEmbedUrl(videoSrc);
      // Instagram embed often works inside an iframe (and may inject scripts). We attempt to embed.
      const iframe = document.createElement('iframe');
      iframe.src = embed;
      iframe.className = 'modal-iframe';
      iframe.allow = 'encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      center.appendChild(iframe);
      embedded = true;
    }

    if (!embedded) {
      // intentar usar etiqueta video para mp4 u otros formatos directos
      const video = document.createElement('video');
      video.src = videoSrc;
      video.controls = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.maxHeight = '85vh';
      video.style.background = '#000';
      video.autoplay = true;
      center.appendChild(video);
    }

    modalContent.appendChild(closeButton);
    modalContent.appendChild(center);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // evitar scroll en el fondo
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const close = () => {
      try {
        // detener video si existe
        const v = modalContent.querySelector('video');
        if (v && !v.paused) {
          try { v.pause(); } catch (e) {}
        }
        modalOverlay.remove();
        style.remove();
        document.body.style.overflow = prevOverflow || '';
        document.removeEventListener('keydown', onKeyDown);
      } catch (err) {
        document.body.style.overflow = prevOverflow || '';
        try { modalOverlay.remove(); } catch (e) {}
        try { style.remove(); } catch (e) {}
        document.removeEventListener('keydown', onKeyDown);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };

    closeButton.addEventListener('click', close);
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
    div.className = "media-card group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300";
    Object.assign(div.style, {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '8px',
      cursor: 'pointer',
      height: '16rem',
      transition: 'transform 0.25s',
      background: '#111',
    });

    // Para videos que no sean mp4 mostramos una miniatura (thumbnail) y un overlay de play
    let mediaHTML = '';
    if (item.type === 'video') {
      if (isYouTubeUrl(item.src)) {
        const thumb = getYouTubeThumbnail(item.src) || 'https://via.placeholder.com/800x600.png?text=Video';
        mediaHTML = `
          <img class="media-thumb" src="${thumb}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s;">
          <div class="play-overlay" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="white" style="opacity:0.95;">
              <path d="M3 22v-20l18 10-18 10z"></path>
            </svg>
          </div>
        `;
      } else if (isInstagramUrl(item.src)) {
        const thumb = 'https://via.placeholder.com/800x600.png?text=Instagram+Video';
        mediaHTML = `
          <img class="media-thumb" src="${thumb}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s;">
          <div class="play-overlay" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="white" style="opacity:0.95;">
              <path d="M3 22v-20l18 10-18 10z"></path>
            </svg>
          </div>
        `;
      } else {
        // Asumimos MP4 u otro formato compatible con <video>
        mediaHTML = `
          <video class="media-video" src="${item.src}" muted loop playsinline style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s;"></video>
        `;
      }
    } else {
      mediaHTML = `
        <img class="media-image" src="${item.src}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s;">
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

    // Comportamientos
    if (item.type === 'video') {
      // Si es MP4 reproducir en hover, si es Youtube/Instagram solo mostrar miniatura y abrir modal al click
      const videoEl = div.querySelector('video.media-video');
      if (videoEl) {
        const p = div.querySelector('.media-desc');
        div.addEventListener('mouseenter', () => {
          try {
            videoEl.muted = true;
            videoEl.loop = true;
            const playPromise = videoEl.play();
            if (playPromise && typeof playPromise.then === 'function') playPromise.catch(()=>{});
          } catch (e) {}
          if (p) p.style.opacity = '1';
        });
        div.addEventListener('mouseleave', () => {
          try { videoEl.pause(); videoEl.currentTime = 0; } catch (e) {}
          if (p) p.style.opacity = '0';
        });
        div.addEventListener('click', () => createVideoModal(item.src));
      } else {
        // thumbnail (YouTube / Instagram)
        div.addEventListener('mouseenter', () => {
          const img = div.querySelector('img');
          if (img) img.style.transform = 'scale(1.05)';
          const p = div.querySelector('.media-desc'); if (p) p.style.opacity = '1';
        });
        div.addEventListener('mouseleave', () => {
          const img = div.querySelector('img');
          if (img) img.style.transform = 'scale(1)';
          const p = div.querySelector('.media-desc'); if (p) p.style.opacity = '0';
        });
        div.addEventListener('click', () => createVideoModal(item.src));
      }
    } else {
      // imagen
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
    }

    portfolioGrid.appendChild(div);
  });
});
