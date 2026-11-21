(function () {
  "use strict";
  var C = window.BODA || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var calma = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var vacio = function (v) { return !v || v === "Próximamente"; };

  /* ---------- Textos desde config.js ---------- */
  function dato(ruta) { return ruta.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, C); }
  $$("[data-c]").forEach(function (el) { var v = dato(el.dataset.c); if (v != null) el.textContent = v; });

  /* ---------- Eucalipto y gypsophila (SVG generado) ---------- */
  function azar(semilla) {
    return function () {
      semilla |= 0; semilla = (semilla + 0x6D2B79F5) | 0;
      var t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var ESC = 2; // se pinta al doble de resolución para que se vea nítido en pantallas retina

  function sombra(ctx, on) {
    ctx.shadowColor = on ? "rgba(30,42,34,.25)" : "transparent";
    ctx.shadowBlur = on ? 3 * ESC : 0; ctx.shadowOffsetY = on ? 1.4 * ESC : 0;
  }
  // Punto de una curva cuadrática y su dirección
  function curva(x0, y0, cx, cy, x1, y1, t) {
    var u = 1 - t;
    return {
      x: u * u * x0 + 2 * u * t * cx + t * t * x1, y: u * u * y0 + 2 * u * t * cy + t * t * y1,
      a: Math.atan2(2 * u * (cy - y0) + 2 * t * (y1 - cy), 2 * u * (cx - x0) + 2 * t * (x1 - cx))
    };
  }
  function tallo(ctx, x0, y0, x1, y1, doblez, color, grosor) {
    var dx = x1 - x0, dy = y1 - y0, D = Math.hypot(dx, dy) || 1;
    var cx = (x0 + x1) / 2 - dy / D * doblez, cy = (y0 + y1) / 2 + dx / D * doblez;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1);
    ctx.strokeStyle = color; ctx.lineWidth = grosor * ESC; ctx.lineCap = "round"; ctx.stroke();
    return [cx, cy];
  }

  // Eucalipto «silver dollar»: hoja casi redonda, gris azulada y mate
  function hojaEuca(ctx, x, y, ang, tam, r) {
    var H = 158 + r() * 18, S = 9 + r() * 8, L = 52 + r() * 13;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(1, 0.62 + r() * 0.38);
    var g = ctx.createRadialGradient(tam * 0.8, -tam * 0.3, tam * 0.2, tam, 0, tam * 1.15);
    g.addColorStop(0, "hsl(" + H + "," + S + "%," + (L + 8) + "%)");
    g.addColorStop(1, "hsl(" + (H + 4) + "," + (S + 3) + "%," + (L - 9) + "%)");
    ctx.beginPath(); ctx.ellipse(tam, 0, tam, tam * 0.94, 0, 0, Math.PI * 2);
    sombra(ctx, true); ctx.fillStyle = g; ctx.fill(); sombra(ctx, false);
    ctx.lineWidth = 0.45 * ESC; ctx.strokeStyle = "rgba(70,92,84,.35)"; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(tam * 1.6, 0);
    ctx.lineWidth = 0.5 * ESC; ctx.strokeStyle = "rgba(225,235,230,.35)"; ctx.stroke();
    ctx.restore();
  }
  function ramaEuca(ctx, x0, y0, ang, largo, doblez, r) {
    var x1 = x0 + Math.cos(ang) * largo, y1 = y0 + Math.sin(ang) * largo;
    var c = tallo(ctx, x0, y0, x1, y1, doblez, "#7F7468", 1.1), lado = r() < 0.5 ? 1 : -1;
    for (var t = 0.2; t <= 1.0; t += 0.16 + r() * 0.05) {
      var p = curva(x0, y0, c[0], c[1], x1, y1, t);
      hojaEuca(ctx, p.x, p.y, p.a + lado * (0.9 + r() * 0.5), (10.5 - t * 4 + r() * 2) * ESC, r);
      lado = -lado;
    }
  }

  // Ruscus: hojas alargadas y puntiagudas, verde oscuro y brillante
  function hojaRuscus(ctx, x, y, ang, largo, r) {
    var ancho = largo * (0.24 + r() * 0.06);
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    var g = ctx.createLinearGradient(0, -ancho, 0, ancho);
    g.addColorStop(0, "#4E7E4E"); g.addColorStop(0.5, "#3B6A41"); g.addColorStop(1, "#244A2E");
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(largo * 0.45, -ancho * 1.3, largo, 0);
    ctx.quadraticCurveTo(largo * 0.45, ancho * 1.3, 0, 0);
    sombra(ctx, true); ctx.fillStyle = g; ctx.fill(); sombra(ctx, false);
    ctx.beginPath(); ctx.moveTo(largo * 0.08, 0); ctx.quadraticCurveTo(largo * 0.5, -ancho * 0.15, largo * 0.92, 0);
    ctx.lineWidth = 0.6 * ESC; ctx.strokeStyle = "rgba(210,235,200,.35)"; ctx.stroke();
    ctx.restore();
  }
  function ramaRuscus(ctx, x0, y0, ang, largo, doblez, r) {
    var x1 = x0 + Math.cos(ang) * largo, y1 = y0 + Math.sin(ang) * largo;
    var c = tallo(ctx, x0, y0, x1, y1, doblez, "#47683F", 0.9), lado = 1;
    for (var t = 0.18; t < 0.95; t += 0.13 + r() * 0.04) {
      var p = curva(x0, y0, c[0], c[1], x1, y1, t);
      hojaRuscus(ctx, p.x, p.y, p.a + lado * (0.55 + r() * 0.25), (22 - t * 8 + r() * 4) * ESC, r);
      lado = -lado;
    }
    var f = curva(x0, y0, c[0], c[1], x1, y1, 1);
    hojaRuscus(ctx, f.x, f.y, f.a, 15 * ESC, r);
  }

  // Gypsophila: nube densa de florecitas blancas sobre tallitos finísimos
  function nube(ctx, x, y, rx, ry, n, r) {
    for (var s = 0; s < 7; s++) {
      var a = r() * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(x + (r() - 0.5) * rx * 0.4, y + (r() - 0.5) * ry * 0.4);
      ctx.lineTo(x + Math.cos(a) * rx * 1.05, y + Math.sin(a) * ry * 1.05);
      ctx.strokeStyle = "rgba(104,128,98,.55)"; ctx.lineWidth = 0.5 * ESC; ctx.stroke();
    }
    for (var i = 0; i < n; i++) {
      var ang = r() * Math.PI * 2, d = Math.sqrt(r()), fx = x + Math.cos(ang) * rx * d, fy = y + Math.sin(ang) * ry * d;
      var fr = (1.05 + r() * 1.05) * ESC;
      ctx.beginPath(); ctx.arc(fx + 0.5 * ESC, fy + 0.7 * ESC, fr, 0, 7); ctx.fillStyle = "rgba(86,98,86,.28)"; ctx.fill();
      ctx.beginPath(); ctx.arc(fx, fy, fr, 0, 7); ctx.fillStyle = r() < 0.06 ? "#C9D3BD" : "#F4F4EE"; ctx.fill();
      ctx.beginPath(); ctx.arc(fx - fr * 0.25, fy - fr * 0.25, fr * 0.6, 0, 7); ctx.fillStyle = "#FFFFFF"; ctx.fill();
      if (r() < 0.15) { ctx.beginPath(); ctx.arc(fx, fy, fr * 0.28, 0, 7); ctx.fillStyle = "#CFC6A4"; ctx.fill(); }
    }
  }

  // Dibuja en un canvas y lo devuelve como imagen para usarlo de fondo
  function pintar(W, H, dibujo, cb) {
    var cv = document.createElement("canvas"); cv.width = W * ESC; cv.height = H * ESC;
    dibujo(cv.getContext("2d"), W * ESC, H * ESC);
    if (cv.toBlob) cv.toBlob(function (b) { cb('url("' + URL.createObjectURL(b) + '")'); });
    else cb('url("' + cv.toDataURL() + '")');
  }

  // Guirnalda de mesa como la de la foto: base de ruscus y eucalipto, nubes de gypsophila encima
  // y alguna rama suelta por delante. Se repite en horizontal sin cortes (cada pieza se pinta también a ±W).
  function guirnalda(ctx, W, H) {
    var r = azar(21), cy = H / 2, piezas = [], E = ESC;
    function lado() { return r() < 0.5 ? 0 : Math.PI; }
    for (var i = 0; i < 14; i++) piezas.push({ t: "ru", capa: 0, x: i * W / 14 + r() * 30 * E, y: cy + (r() - 0.5) * 12 * E, a: lado() + (r() - 0.5) * 1.7, L: (55 + r() * 30) * E });
    for (var j = 0; j < 12; j++) piezas.push({ t: "eu", capa: 1, x: j * W / 12 + r() * 30 * E, y: cy + (r() - 0.5) * 12 * E, a: lado() + (r() - 0.5) * 1.6, L: (60 + r() * 40) * E });
    for (var k = 0; k < 18; k++) piezas.push({ t: "gy", capa: 2, x: k * W / 18 + r() * 18 * E, y: cy + (r() - 0.5) * 16 * E, rx: (20 + r() * 14) * E, ry: (12 + r() * 8) * E });
    for (var m = 0; m < 8; m++) piezas.push({ t: m % 2 ? "eu" : "ru", capa: 3, x: r() * W, y: cy + (r() - 0.5) * 20 * E, a: lado() + (r() - 0.5) * 1.4, L: (35 + r() * 20) * E });
    piezas.forEach(function (p, i) { p.s = 500 + i; });
    piezas.sort(function (a, b) { return a.capa - b.capa; });
    piezas.forEach(function (p) {
      [-W, 0, W].forEach(function (o) {
        var rr = azar(p.s);
        if (p.t === "gy") nube(ctx, p.x + o, p.y, p.rx, p.ry, 150, rr);
        else if (p.t === "eu") ramaEuca(ctx, p.x + o, p.y, p.a, p.L, (rr() - 0.5) * 24 * ESC, rr);
        else ramaRuscus(ctx, p.x + o, p.y, p.a, p.L, (rr() - 0.5) * 20 * ESC, rr);
      });
    });
  }

  // Ramillete que asoma sobre los modales: mismas plantas, en abanico
  function ramillete(ctx, W, H) {
    var r = azar(7), ox = W / 2, oy = H + 6 * ESC, E = ESC, i;
    for (i = 0; i < 9; i++) ramaRuscus(ctx, ox + (r() - 0.5) * 40 * E, oy, (-172 + i * 20 + (r() - 0.5) * 8) * Math.PI / 180, (85 + r() * 35) * E, (r() - 0.5) * 20 * E, r);
    for (i = 0; i < 8; i++) ramaEuca(ctx, ox + (r() - 0.5) * 40 * E, oy, (-165 + i * 21 + (r() - 0.5) * 8) * Math.PI / 180, (90 + r() * 35) * E, (r() - 0.5) * 24 * E, r);
    for (i = 0; i < 9; i++) {
      var a = (-165 + i * 18.5) * Math.PI / 180, d = (40 + r() * 30) * E;
      nube(ctx, ox + Math.cos(a) * d * 1.6, oy + Math.sin(a) * d, (20 + r() * 8) * E, (14 + r() * 5) * E, 140, r);
    }
    nube(ctx, ox, oy - 14 * E, 46 * E, 20 * E, 260, r);
  }

  pintar(900, 150, guirnalda, function (url) { $$(".garland").forEach(function (el) { el.style.backgroundImage = url; }); });
  pintar(360, 150, ramillete, function (url) { $$(".spray").forEach(function (el) { el.style.backgroundImage = url; }); });

  /* ---------- Pantalla previa y música ---------- */
  var intro = $("#intro"), audio = $("#audio"), fab = $("#musica-btn"), bAbrir = $("#abrir");
  document.body.classList.add("locked");
  // No se deja abrir hasta que los círculos de rascar están pintados (evita ver la fecha antes de tiempo)
  bAbrir.disabled = true; bAbrir.textContent = "Cargando…";
  if (C.musica) { audio.src = C.musica; fab.hidden = false; }
  $("#abrir").addEventListener("click", function () {
    intro.classList.add("out");
    document.body.classList.remove("locked");
    // Solo el vídeo de portada; los demás arrancan (y se descargan) cuando se llega a ellos
    var pv = $("header video.bg").play(); if (pv) pv.catch(function () {});
    if (C.musica) audio.play().catch(function () { fab.classList.add("paused"); });
    setTimeout(function () { intro.hidden = true; }, 700);
  });
  fab.addEventListener("click", function () {
    if (audio.paused) { audio.play(); fab.classList.remove("paused"); fab.setAttribute("aria-label", "Pausar música"); }
    else { audio.pause(); fab.classList.add("paused"); fab.setAttribute("aria-label", "Poner música"); }
  });

  /* ---------- Vídeos: solo se reproducen cuando se ven ---------- */
  if ("IntersectionObserver" in window) {
    var ioV = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { var p = e.target.play(); if (p) p.catch(function () {}); } else e.target.pause();
      });
    }, { rootMargin: "100px" });
    $$("video.bg").forEach(function (v) { ioV.observe(v); });
  }

  /* ---------- Confeti ---------- */
  function confeti() {
    if (calma) return;
    var cv = $("#confetti"), ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    // Lluvia de corazones dorados: entran rápido desde arriba, frenan enseguida y caen despacio,
    // balanceándose y desvaneciéndose poco a poco (cada uno a su ritmo, unos 5-6 s en total)
    var corazon = new Path2D("M0 9 C-7 4 -10 0 -10 -3.5 C-10 -7 -7.5 -9 -5 -9 C-2.8 -9 -1 -7.8 0 -6 C1 -7.8 2.8 -9 5 -9 C7.5 -9 10 -7 10 -3.5 C10 0 7 4 0 9 Z");
    var ps = [];
    for (var i = 0; i < 55; i++) ps.push({
      x: Math.random() * cv.width, y: -(10 + Math.random() * 60) * dpr,
      vy: (14 + Math.random() * 10) * dpr,            // arranque rápido
      vt: (0.9 + Math.random() * 1.1) * dpr,          // velocidad de caída lenta, como lluvia suave
      ret: Math.random() * 700,                        // salen escalonados
      vida: 3600 + Math.random() * 2200,               // cuánto tarda en desvanecerse
      fase: Math.random() * 6, amp: (0.5 + Math.random() * 0.9) * dpr,
      s: (0.8 + Math.random() * 0.9) * dpr, rot: (Math.random() - 0.5) * 0.6,
      c: Math.random() < 0.5 ? "#D4A23A" : "#E0B85C"
    });
    var t0 = performance.now(), ant = t0, dur = 700 + 5800;
    (function paso(t) {
      var f = Math.min(2.5, (t - ant) / 16.7), e = t - t0; ant = t;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(function (p) {
        var vivo = e - p.ret; if (vivo < 0) return;
        p.vy = p.vt + (p.vy - p.vt) * Math.pow(0.92, f);   // frena con fuerza hasta su velocidad de caída
        p.fase += 0.035 * f; p.x += Math.sin(p.fase) * p.amp * f; p.y += p.vy * f;
        var a = vivo < p.vida * 0.45 ? 1 : Math.max(0, 1 - (vivo - p.vida * 0.45) / (p.vida * 0.55));
        if (a <= 0) return;
        ctx.globalAlpha = a;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot + Math.sin(p.fase) * 0.3); ctx.scale(p.s, p.s);
        ctx.fillStyle = p.c; ctx.fill(corazon); ctx.restore();
      });
      if (e < dur) requestAnimationFrame(paso); else ctx.clearRect(0, 0, cv.width, cv.height);
    })(t0);
  }

  /* ---------- Rasca la fecha ---------- */
  var rascados = 0, lienzos = $$(".scratch canvas");
  // Hasta rascar la fecha no se puede bajar más (lo de debajo está oculto). Quien ya la rascó otra vez, entra directo.
  var yaRascado = false;
  try { yaRascado = localStorage.getItem("boda-rascado") === "1"; } catch (e) {}
  if (!yaRascado) document.body.classList.add("sin-rascar");
  function desbloquear() {
    if (!document.body.classList.contains("sin-rascar")) return;
    document.body.classList.remove("sin-rascar");
    try { localStorage.setItem("boda-rascado", "1"); } catch (e) {}
    prepararAparicion();
  }
  function prepararRasca(cv) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), w = cv.clientWidth * dpr, h = cv.clientHeight * dpr, ctx = cv.getContext("2d");
    cv.width = w; cv.height = h;
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#EFE4CC"); g.addColorStop(0.5, "#D9C49A"); g.addColorStop(1, "#E9DCBF");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1B2B44"; ctx.font = "600 " + 17 * dpr + "px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = 3 * dpr + "px";
    ctx.fillText("RASCA", w / 2, h / 2);
    cv.parentNode.classList.add("listo"); // ya tapado: se puede mostrar lo de debajo

    var activo = false, ultimo = null, movs = 0, hecho = false;
    function pos(e) { var b = cv.getBoundingClientRect(); return { x: (e.clientX - b.left) * dpr, y: (e.clientY - b.top) * dpr }; }
    function trazo(p) {
      ctx.globalCompositeOperation = "destination-out"; ctx.lineCap = "round"; ctx.lineWidth = 38 * dpr;
      ctx.beginPath(); ctx.moveTo((ultimo || p).x, (ultimo || p).y); ctx.lineTo(p.x, p.y); ctx.stroke(); ultimo = p;
    }
    function comprobar() {
      var d = ctx.getImageData(0, 0, w, h).data, vacios = 0, total = 0;
      for (var i = 3; i < d.length; i += 64) { total++; if (d[i] === 0) vacios++; }
      if (!hecho && vacios / total > 0.45) {
        hecho = true; cv.classList.add("done"); rascados++;
        if (rascados === lienzos.length) { $("#fecha-txt").hidden = false; confeti(); desbloquear(); }
      }
    }
    cv.addEventListener("pointerdown", function (e) { activo = true; ultimo = null; cv.setPointerCapture(e.pointerId); trazo(pos(e)); });
    cv.addEventListener("pointermove", function (e) { if (!activo) return; trazo(pos(e)); if (++movs % 8 === 0) comprobar(); });
    ["pointerup", "pointercancel"].forEach(function (ev) { cv.addEventListener(ev, function () { activo = false; comprobar(); }); });
  }
  // Espera a la fuente del «RASCA», pero como mucho 3 s (con mala cobertura no se queda colgado)
  var fuentes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fuentes, new Promise(function (ok) { setTimeout(ok, 3000); })]).then(function () {
    lienzos.forEach(prepararRasca);
    bAbrir.disabled = false; bAbrir.textContent = "Toca para abrir";
  });

  /* ---------- Cuenta atrás ---------- */
  var meta = new Date(C.fechaISO).getTime(), cD = $("#c-d"), cH = $("#c-h"), cM = $("#c-m"), cS = $("#c-s");
  function tic() {
    var s = Math.max(0, Math.floor((meta - Date.now()) / 1000));
    cD.textContent = Math.floor(s / 86400); cH.textContent = Math.floor(s % 86400 / 3600);
    cM.textContent = Math.floor(s % 3600 / 60); cS.textContent = s % 60;
  }
  tic(); setInterval(tic, 1000);

  /* ---------- Ceremonia y recepción ---------- */
  $$(".evento").forEach(function (card) {
    var ev = C[card.dataset.ev] || {}, f = C.fecha || {};
    var cuerpo = document.createElement("div");
    cuerpo.className = "ev-body";
    cuerpo.innerHTML = '<div class="ev-row"><span></span><b></b><span></span></div><p class="ev-anio"></p><p class="ev-hora" hidden></p><p class="ev-lab">Ubicación</p><p class="ev-lugar"></p><div class="isla-wrap"><img class="isla" src="img/mallorca.png" alt="Mapa de Mallorca" width="936" height="644"><svg class="pin" viewBox="0 0 40 54" aria-hidden="true"><defs><linearGradient id="g-pin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4DFA3"/><stop offset=".35" stop-color="#D4A23A"/><stop offset=".7" stop-color="#9A7019"/><stop offset="1" stop-color="#D4A23A"/></linearGradient></defs><path d="M20 50.5 C14 41.5 4.5 31 4.5 19.5 A15.5 15.5 0 0 1 35.5 19.5 C35.5 31 26 41.5 20 50.5 Z" fill="none" stroke="url(#g-pin)" stroke-width="3.8" stroke-linejoin="round"/><circle cx="20" cy="19.5" r="6.6" fill="none" stroke="url(#g-pin)" stroke-width="3.2"/><path d="M9 14 A12 12 0 0 1 16 8.2" fill="none" stroke="#FFF6DC" stroke-width="1.1" stroke-linecap="round" opacity=".8"/></svg></div><a class="btn" target="_blank" rel="noopener">¿Cómo llegar?</a>';
    var sp = $$(".ev-row span", cuerpo); sp[0].textContent = f.diaSemana; sp[1].textContent = f.mes;
    if (!vacio(ev.hora)) { var h = $(".ev-hora", cuerpo); h.textContent = ev.hora + " h"; h.hidden = false; }
    $(".ev-row b", cuerpo).textContent = f.dia;
    $(".ev-anio", cuerpo).textContent = f.anio;
    $(".ev-lugar", cuerpo).textContent = vacio(ev.lugar) ? "Palma de Mallorca" : ev.lugar;
    var a = $("a", cuerpo);
    if (ev.mapa) a.href = ev.mapa; else a.remove(); // sin enlace de Maps no se muestra el botón
    card.appendChild(cuerpo);
  });

  /* ---------- Carrusel de fotos ---------- */
  var car = $("#carousel"), dots = $("#dots");
  (C.fotos || []).forEach(function (src, i) {
    var fig = document.createElement("figure"), img = document.createElement("img");
    img.src = src; img.alt = "Edimar y Luis, foto " + (i + 1); img.loading = i < 2 ? "eager" : "lazy"; img.decoding = "async";
    fig.appendChild(img); car.appendChild(fig);
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", "Ver foto " + (i + 1));
    b.addEventListener("click", function () { fig.scrollIntoView({ behavior: calma ? "auto" : "smooth", block: "nearest", inline: "center" }); });
    dots.appendChild(b);
  });
  function fotoActual() {
    var figs = $$("figure", car), centro = car.scrollLeft + car.clientWidth / 2, mejor = 0, dist = Infinity;
    figs.forEach(function (f, i) { var d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - centro); if (d < dist) { dist = d; mejor = i; } });
    $$("button", dots).forEach(function (b, i) { b.setAttribute("aria-current", i === mejor ? "true" : "false"); });
  }
  car.addEventListener("scroll", function () { requestAnimationFrame(fotoActual); }, { passive: true });
  fotoActual();

  /* ---------- Dress code y regalos ---------- */
  var dc = C.dressCode || {};
  if (dc.paleta && dc.paleta.length) {
    $("#paleta-wrap").hidden = false;
    dc.paleta.forEach(function (c) { var s = document.createElement("span"); s.style.background = c; $("#paleta").appendChild(s); });
  }
  var rg = C.regalos || {}, bCopiar = $("#copiar-iban");
  if (rg.bizum) $("#bizum-wrap").hidden = false;
  if (vacio(rg.iban)) bCopiar.hidden = true;
  bCopiar.addEventListener("click", function () {
    var ok = function () { bCopiar.textContent = "¡Copiado!"; setTimeout(function () { bCopiar.textContent = "Copiar IBAN"; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(rg.iban.replace(/\s/g, "")).then(ok, function () {});
  });

  /* ---------- Subir fotos y QR ---------- */
  var subir = $("#subir");
  if (C.subirFotos) {
    subir.href = C.subirFotos;
    if (window.QRCode) {
      var q = $("#qr"); q.innerHTML = "";
      new window.QRCode(q, { text: C.subirFotos, width: 344, height: 344, colorDark: "#1B2B44", colorLight: "#FFFFFF" });
    }
  } else {
    subir.removeAttribute("href"); subir.setAttribute("aria-disabled", "true"); subir.textContent = "Subir fotos (próximamente)";
  }

  /* ---------- Modales ---------- */
  var abierto = null, previo = null;
  function abrir(id) {
    var m = document.getElementById(id); if (!m) return;
    previo = document.activeElement; abierto = m; m.hidden = false; document.body.classList.add("locked");
    $(".close", m).focus({ preventScroll: true });
  }
  function cerrar() {
    if (!abierto) return;
    abierto.hidden = true; abierto = null; document.body.classList.remove("locked");
    if (previo) previo.focus({ preventScroll: true });
  }
  $$("[data-modal]").forEach(function (b) { b.addEventListener("click", function () { abrir(b.dataset.modal); }); });
  $$(".modal").forEach(function (m) {
    $(".close", m).addEventListener("click", cerrar);
    m.addEventListener("click", function (e) { if (e.target === m) cerrar(); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });

  /* ---------- Invitación según el enlace: sin nada = 1 persona, ?p=2 con acompañante, ?p=4 y ?p=5 familias ---------- */
  var plazas = { "2": 2, "4": 4, "5": 5 }[new URLSearchParams(location.search).get("p")] || 1;
  var TIPOS = { 1: "Individual", 2: "Con acompañante", 4: "Familia (hasta 4)", 5: "Familia (hasta 5)" };
  var formRs = $("form[data-form='asistencia']"), extra = $("#rs-extra");
  formRs.dataset.invitacion = TIPOS[plazas];
  if (plazas > 1) {
    var aviso = $("#rs-plazas");
    aviso.textContent = plazas === 2 ? "Invitación para ti y un acompañante" : "Invitación para hasta " + plazas + " personas";
    aviso.hidden = false;
    var ctrl = document.createElement("div");
    ctrl.className = "rs-ctrl";
    if (plazas === 2) {
      ctrl.innerHTML = '<label class="check"><input type="checkbox" id="rs-acomp"> Vengo con acompañante</label>';
    } else {
      var opts = "";
      for (var n = 1; n <= plazas; n++) opts += '<option value="' + n + '"' + (n === plazas ? " selected" : "") + ">" + n + (n === 1 ? " persona" : " personas") + "</option>";
      ctrl.innerHTML = '<label class="sel" for="rs-total">¿Cuántos venís en total?</label><select id="rs-total">' + opts + "</select>";
    }
    extra.appendChild(ctrl);
    for (var k = 2; k <= plazas; k++) {
      var fs = document.createElement("fieldset");
      fs.className = "persona"; fs.hidden = true; fs.disabled = true;
      fs.innerHTML = "<legend>" + (plazas === 2 ? "Tu acompañante" : "Persona " + k) + "</legend>" +
        '<input id="p' + k + '-nombre" name="p' + k + '_nombre" placeholder="Nombre y apellidos" required autocomplete="off">' +
        '<input id="p' + k + '-alergias" name="p' + k + '_alergias" placeholder="Alergias o comentarios (opcional)" autocomplete="off">';
      extra.appendChild(fs);
    }
  }
  // Cuántas personas vienen en total con esta respuesta (0 si no viene)
  function cuantos() {
    if (!$("#rs-si").checked) return 0;
    if (plazas === 2) return $("#rs-acomp").checked ? 2 : 1;
    if (plazas > 2) return +$("#rs-total").value;
    return 1;
  }
  // Muestra solo los bloques de las personas que vienen; los ocultos no se envían (fieldset deshabilitado)
  function actualizarPlazas() {
    var n = cuantos();
    extra.hidden = n === 0;
    $("#rs-armados").hidden = !$("#rs-no").checked;
    $$(".persona", extra).forEach(function (fs, i) { var on = i + 2 <= n; fs.hidden = !on; fs.disabled = !on; });
  }
  formRs.addEventListener("change", actualizarPlazas);
  formRs.addEventListener("reset", function () { setTimeout(actualizarPlazas, 0); });
  actualizarPlazas();

  /* ---------- Memoria de la confirmación: se guarda en el navegador del invitado ---------- */
  var CLAVE = "boda-rsvp-" + plazas, memoria = {};
  try { memoria = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) {}
  // Identificador del invitado: al reenviar, la hoja actualiza su fila en vez de añadir otra
  memoria.id = memoria.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  function guardar() {
    var campos = {};
    $$("input, select, textarea", formRs).forEach(function (el) {
      if (el.id) campos[el.id] = el.type === "radio" || el.type === "checkbox" ? el.checked : el.value;
    });
    memoria.campos = campos;
    try { localStorage.setItem(CLAVE, JSON.stringify(memoria)); } catch (e) {}
  }
  function avisoEnviado() {
    if (!memoria.enviado) return;
    $("#rs-memoria").hidden = false;
    $("button[type=submit]", formRs).textContent = "Actualizar respuesta";
  }
  if (memoria.campos) {
    Object.keys(memoria.campos).forEach(function (id) {
      var el = document.getElementById(id), v = memoria.campos[id];
      if (!el) return;
      if (el.type === "radio" || el.type === "checkbox") el.checked = v; else el.value = v;
    });
    actualizarPlazas();
  }
  avisoEnviado();
  formRs.addEventListener("input", guardar);
  formRs.addEventListener("change", guardar);

  /* ---------- Formularios → Google Sheets ---------- */
  $$("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var datos = new URLSearchParams(new FormData(form)), btn = $("button[type=submit]", form), msg = $(".ok", form);
      datos.append("tipo", form.dataset.form);
      var esRs = form === formRs, yaEnviado = esRs && memoria.enviado;
      if (esRs) { datos.append("invitacion", form.dataset.invitacion); datos.append("personas", cuantos()); datos.append("id", memoria.id); }
      btn.disabled = true;
      // La confirmación no se borra al enviar: queda guardada para poder revisarla o cambiarla
      var fin = function (texto) {
        msg.textContent = texto; msg.hidden = false; btn.disabled = false;
        if (esRs) { memoria.enviado = true; guardar(); avisoEnviado(); } else form.reset();
      };
      if (!C.formURL) { fin("Modo prueba: el formulario aún no está conectado a la hoja."); return; }
      fetch(C.formURL, { method: "POST", mode: "no-cors", body: datos })
        .then(function () { fin(yaEnviado ? "¡Gracias! Hemos actualizado tu respuesta." : "¡Gracias! Lo hemos recibido."); })
        .catch(function () { msg.textContent = "No se ha podido enviar. Revisa la conexión y vuelve a intentarlo."; msg.hidden = false; btn.disabled = false; });
    });
  });

  /* ---------- Aparición suave al hacer scroll ---------- */
  var ioR = !calma && "IntersectionObserver" in window && new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ioR.unobserve(e.target); } });
  }, { threshold: 0.15 });
  // Se llama al cargar y otra vez al desbloquear lo de debajo del rasca
  function prepararAparicion() {
    if (!ioR) return;
    $$("main section > :not(video):not(.peng), main .despedida > *").forEach(function (el) {
      if (!el.classList.contains("in") && el.getBoundingClientRect().top > innerHeight) { el.classList.add("pre"); ioR.observe(el); }
    });
  }
  prepararAparicion();
})();
