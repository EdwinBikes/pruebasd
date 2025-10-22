document.addEventListener('DOMContentLoaded', () => {

const mediaItems = [
{ id: 1, type: 'image', src: '[https://picsum.photos/seed/filmmaker1/800/600](https://picsum.photos/seed/filmmaker1/800/600)', title: 'Amanecer en las montañas', description: 'Una toma matutina capturando la primera luz.' },
{ id: 2, type: 'video', src: '[https://picsum.photos/seed/filmmaker2/800/600](https://picsum.photos/seed/filmmaker2/800/600)', title: 'El Aliento del Océano', description: 'Captura en cámara lenta de las olas rompiendo en la orilla.' },
{ id: 3, type: 'image', src: '[https://picsum.photos/seed/filmmaker3/800/600](https://picsum.photos/seed/filmmaker3/800/600)', title: 'Jungla Urbana', description: 'Una larga exposición del tráfico de la ciudad por la noche.' },
{ id: 4, type: 'image', src: '[https://picsum.photos/seed/filmmaker4/800/600](https://picsum.photos/seed/filmmaker4/800/600)', title: 'Quietud del Bosque', description: 'Rayos de sol atravesando el denso dosel del bosque.' },
{ id: 5, type: 'video', src: '[https://picsum.photos/seed/filmmaker5/800/600](https://picsum.photos/seed/filmmaker5/800/600)', title: 'Espejismo del Desierto', description: 'Ondas de calor que se elevan desde el suelo del desierto.' },
{ id: 6, type: 'image', src: '[https://picsum.photos/seed/filmmaker6/800/600](https://picsum.photos/seed/filmmaker6/800/600)', title: 'Retrato de un Desconocido', description: 'Una foto espontánea de fotografía callejera.' },
];

// --- Crear el efecto cinematográfico ---
const createVideoModal = (videoSrc) => {
const style = document.createElement('style');
style.innerHTML = `       @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      @keyframes blurBg { from { backdrop-filter: blur(0px); } to { backdrop-filter: blur(10px); } }
      .modal-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      .modal-blur-bg { animation: blurBg 0.4s ease-out forwards; }
    `;
document.head.appendChild(style);

```
const modalOverlay = document.createElement('div');
modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4 modal-blur-bg';

const modalContent = document.createElement('div');
modalContent.className = 'relative w-full max-w-4xl transform scale-95 modal-fade-in';
modalContent.innerHTML = `
  <button class="absolute -top-2 -right-2 h-10 w-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white text-2xl z-10 hover:bg-opacity-75 transition-colors" aria-label="Cerrar video">&times;</button>
  <video src="${videoSrc}" class="w-full h-auto max-h-[85vh] rounded-2xl shadow-2xl" controls autoplay></video>
`;

modalOverlay.appendChild(modalContent);
document.body.appendChild(modalOverlay);
document.body.style.overflow = 'hidden';

const close = () => {
  modalOverlay.remove();
  style.remove();
  document.body.style.overflow = '';
};

modalContent.querySelector('button').addEventListener('click', close);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) close();
});
document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
```

};

const portfolioGrid = document.querySelector('#portfolio-section .grid');
if (!portfolioGrid) return;

mediaItems.forEach(item => {
const div = document.createElement('div');
div.className = "group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 h-64";

```
let mediaHTML = `
  <img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
`;

if (item.type === 'video') {
  mediaHTML = `
    <video src="${item.src}" poster="${item.src}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" muted loop playsinline></video>
    <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white opacity-70" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
      </svg>
    </div>
  `;
}

div.innerHTML = `
  ${mediaHTML}
  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
  <div class="absolute bottom-0 left-0 p-4 w-full">
    <h3 class="text-xl font-bold text-white truncate">${item.title}</h3>
    <p class="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">${item.description}</p>
  </div>
`;

if (item.type === 'video') {
  const video = div.querySelector('video');
  div.addEventListener('mouseenter', () => video.play().catch(() => {}));
  div.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  div.addEventListener('click', () => createVideoModal(item.src));
}

portfolioGrid.appendChild(div);
```

});
});
