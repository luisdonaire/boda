// Todos los textos y datos de la invitación. Cambia aquí lo que haga falta; no hay que tocar nada más.
// Lo que pone «Próximamente» o está vacío ("") se rellena cuando lo tengáis.
window.BODA = {
  novia: "Edimar",
  novio: "Luis",
  frase: "Te elijo hoy y por el resto de mi vida",

  // Fecha y hora para la cuenta atrás (hora de Mallorca).
  fechaISO: "2026-12-12T13:00:00+01:00",
  fecha: { diaSemana: "Sábado", dia: "12", mes: "Diciembre", anio: "2026" },

  ceremonia: {
    hora: "A partir de las 13 horas",
    lugar: "Palma de Mallorca",
    mapa: "", // el botón «¿Cómo llegar?» está en el apartado del restaurante
    nota: "La ceremonia civil, con la firma del matrimonio, tendrá lugar el viernes 11 de diciembre."
  },

  restaurante: {
    nombre: "Groenk Bistro & Grill",
    direccion: "Carrer Arxiduc Lluís Salvador, 11, 07179 Deià",
    mapa: "https://maps.app.goo.gl/YtxWWhQHTgZ9X9Xv7",
    llegada: "13:00",
    comida: "13:30",
    coche: "Unos 35-40 minutos desde Palma (30 km).",
    aparcar: "En Deià es difícil aparcar, así que organizaos para ir en el menor número de coches posible."
  },

  fotos: [
    "img/fotos/pedida-rodilla.jpg",
    "img/fotos/foto-2.jpg",
    "img/fotos/foto-3.jpg",
    "img/fotos/foto-4.jpg",
    "img/fotos/anillo-1.jpg",
    "img/fotos/foto-6.jpg"
  ],
  fotosSubtitulo: "La clave es disfrutar cada momento",

  dressCode: {
    etiqueta: "Elegante casual",
    texto: "Os invitamos a vestir elegantes y cómodos para celebrar juntos.",
    aviso: "el blanco y los tonos marfil quedan reservados para la novia.", // sale detrás de «Aviso:» en negrita

    paleta: [] // colores sugeridos, p. ej. ["#E3EFF7", "#9FB8AD", "#1B2B44"]
  },


  regalos: {
    intro: "Vuestra presencia es nuestro mejor regalo. Si además queréis tener un detalle con nosotros, podéis hacerlo aquí:",
    iban: "ES18 2100 5942 6313 0022 6014",
    titular: "",
    bizum: ""
  },

  subirFotos: "https://drive.google.com/drive/folders/14cOTmRm3s46Kv6_oeyQPDdyf9YwNGs0w", // enlace a la carpeta de Drive o al álbum de Google Fotos (también genera el QR)

  // Sale con los pingüinos armados cuando alguien marca «No puedo»
  noPuedo: "¿Cómo que no puedes? Piénsatelo mejor…",

  musica: "audio/cancion.mp3", // ruta de la canción, p. ej. "audio/cancion.mp3"

  // URL de la aplicación web de Apps Script (Google Sheets). Vacía = los formularios funcionan en modo prueba.
  formURL: "https://script.google.com/macros/s/AKfycbzVbuHENcKAKFYbpZhblXSiN8dqxzltxWuO7cBa74irt8lAUBSDsdgFtmqwjodDhuRsKA/exec"
};
