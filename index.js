// --- LÓGICA DE LA APLICACIÓN ---

document.addEventListener('DOMContentLoaded', () => {

  // --- PORTAFOLIO ---
  const mediaItems = [
    { id: 1, type: 'image', src: 'https://picsum.photos/seed/filmmaker1/800/600', title: 'Amanecer en las montañas', description: 'Una toma matutina capturando la primera luz.' },
    { id: 2, type: 'video', src: 'https://picsum.photos/seed/filmmaker2/800/600', title: 'El Aliento del Océano', description: 'Captura en cámara lenta de las olas rompiendo en la orilla.' },
    { id: 3, type: 'image', src: 'https://picsum.photos/seed/filmmaker3/800/600', title: 'Jungla Urbana', description: 'Una larga exposición del tráfico de la ciudad por la noche.' },
    { id: 4, type: 'image', src: 'https://picsum.photos/seed/filmmaker4/800/600', title: 'Quietud del Bosque', description: 'Rayos de sol atravesando el denso dosel del bosque.' },
    { id: 5, type: 'video', src: 'https://picsum.photos/seed/filmmaker5/800/600', title: 'Espejismo del Desierto', description: 'Ondas de calor que se elevan desde el suelo del desierto.' },
    { id: 6, type: 'image', src: 'https://picsum.photos/seed/filmmaker6/800/600', title: 'Retrato de un Desconocido', description: 'Una foto espontánea de fotografía callejera.' },
    { id: 7, type: 'image', src: 'https://picsum.photos/seed/filmmaker7/800/600', title: 'Líneas Arquitectónicas', description: 'Vista abstracta de un edificio moderno.' },
    { id: 8, type: 'video', src: 'https://picsum.photos/seed/filmmaker8/800/600', title: 'Noche Estrellada', description: 'Un timelapse de la vía láctea.' },
    { id: 9, type: 'image', src: 'https://picsum.photos/seed/filmmaker9/800/600', title: 'Reflejos de Neón', description: 'Luces de la ciudad reflejadas en un charco después de la lluvia.' },
    { id: 10, type: 'video', src: 'https://picsum.photos/seed/filmmaker10/800/600', title: 'Vuelo del Águila', description: 'Toma aérea siguiendo a un águila en su vuelo majestuoso.' },
    { id: 11, type: 'image', src: 'https://picsum.photos/seed/filmmaker11/800/600', title: 'Mercado Vibrante', description: 'Escena colorida de un bullicioso mercado local.' },
    { id: 12, type: 'image', src: 'https://picsum.photos/seed/filmmaker12/800/600', title: 'Caminos Helados', description: 'Un paisaje invernal con un río congelado.' }
  ];
  
  const portfolioGrid = document.querySelector('#portfolio-section .grid');
  mediaItems.forEach(item => {
    const div = document.createElement('div');
    div.className = "group relative overflow-hidden rounded-lg shadow-lg bg-gray-800";
    div.innerHTML = `
        <img src="${item.src}" alt="${item.title}" class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
        ${item.type === 'video' ? `
          <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <svg class="w-16 h-16 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </div>` : ''}
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div class="absolute bottom-0 left-0 p-4">
            <h3 class="text-xl font-bold text-white">${item.title}</h3>
            <p class="text-sm text-gray-300">${item.description}</p>
          </div>
        </div>
    `;
    portfolioGrid.appendChild(div);
  });

});
