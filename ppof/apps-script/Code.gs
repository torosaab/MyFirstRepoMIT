/**
 * Test PPOF — envío del resultado por correo y registro en Google Sheets.
 *
 * Instalación: ver ppof/README.md. Este script debe crearse desde una
 * Hoja de cálculo de Google (Extensiones → Apps Script) para que cada
 * respuesta quede registrada en ella.
 */

// Los textos (preguntas, resultados, contacto) están en Contenido.gs, generado por ppof/build.py.

// Correo que recibe un aviso con los datos y el resultado de cada persona. Déjalo vacío ('') para no recibirlo.
// PRUEBAS: torosaab@gmail.com. En producción: contacto@engagepeak.com.
const COPIA_A = 'torosaab@gmail.com';

// Nombre del remitente y dirección a la que llegan las respuestas del destinatario.
const REMITENTE = 'PEAK LATAM';
const RESPONDER_A = 'torosaab@gmail.com';

const HOJA = 'Respuestas';

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const nombre = limpiar(d.nombre, 120);
    const empresa = limpiar(d.empresa, 160);
    const email = limpiar(d.email, 200);
    const respuestas = Array.isArray(d.respuestas) ? d.respuestas.map((v) => (v ? 1 : 0)) : [];

    const C = contenido();
    if (!nombre || !empresa) throw new Error('Faltan datos');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Error('Correo inválido');
    if (respuestas.length !== C.preguntas.length) throw new Error('Respuestas incompletas');

    // El puntaje se recalcula aquí; no se confía en el que manda el navegador.
    const puntos = respuestas.reduce((a, b) => a + b, 0);
    const r = C.resultados.find((x) => puntos >= x.min && puntos <= x.max);

    registrar(nombre, empresa, email, puntos, r, respuestas);

    const html = correoHtml(C, r, puntos, nombre, empresa, respuestas);

    // 1) Correo para la persona que hizo el test.
    MailApp.sendEmail(email, 'Tu resultado del Test PPOF: ' + r.titulo, textoPlano(C, r, puntos, nombre), {
      name: REMITENTE,
      replyTo: RESPONDER_A,
      htmlBody: html,
    });

    // 2) Copia interna con los datos de contacto y el mismo resultado.
    if (COPIA_A) {
      const datos = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;background:#EAF3FF;border:1px solid #BBD6F7;border-radius:8px;padding:14px 16px;margin:12px;">' +
        '<b>Nuevo Test PPOF completado</b><br>' +
        'Nombre: ' + esc(nombre) + '<br>Empresa: ' + esc(empresa) + '<br>Correo: <a href="mailto:' + esc(email) + '">' + esc(email) + '</a><br>' +
        'Resultado: ' + puntos + '/10 · ' + esc(r.titulo) + '</div>';
      MailApp.sendEmail(COPIA_A, 'Test PPOF: ' + nombre + ' (' + empresa + ') · ' + puntos + '/10 ' + r.titulo,
        'Nuevo Test PPOF completado\nNombre: ' + nombre + '\nEmpresa: ' + empresa + '\nCorreo: ' + email +
        '\nResultado: ' + puntos + '/10 · ' + r.titulo + '\n\n' + textoPlano(C, r, puntos, nombre), {
        name: 'Test PPOF',
        replyTo: email,
        htmlBody: datos + html,
      });
    }

    return json({ ok: true, puntos: puntos, nivel: r.id });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err.message || err) });
  }
}

function doGet() {
  return json({ ok: true, servicio: 'Test PPOF' });
}

function contenido() {
  return CONTENIDO;
}

function registrar(nombre, empresa, email, puntos, r, respuestas) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;
  let hoja = ss.getSheetByName(HOJA);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA);
    const enc = ['Fecha', 'Nombre', 'Empresa', 'Correo', 'Puntos', 'Clasificación'];
    for (let i = 1; i <= respuestas.length; i++) enc.push('P' + i);
    hoja.appendRow(enc);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, enc.length).setFontWeight('bold');
  }
  hoja.appendRow([new Date(), nombre, empresa, email, puntos, r.titulo].concat(respuestas.map((v) => (v ? 'Sí' : 'No'))));
}

function correoHtml(C, r, puntos, nombre, empresa, respuestas) {
  const p = (t, extra) => '<p style="margin:0 0 14px;' + (extra || '') + '">' + esc(t) + '</p>';
  const filas = C.preguntas.map((q, i) =>
    '<tr><td style="padding:6px 0;border-bottom:1px solid #E3E8EF;">' + (i + 1) + '. ' + esc(q.tema) + '</td>' +
    '<td style="padding:6px 0;border-bottom:1px solid #E3E8EF;text-align:right;font-weight:bold;color:' +
    (respuestas[i] ? '#C62828' : '#2E7D32') + ';">' + (respuestas[i] ? 'Sí' : 'No') + '</td></tr>').join('');

  return '' +
  '<div style="background:#F4F6F9;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#1B2430;line-height:1.55;font-size:15px;">' +
  '<div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E3E8EF;">' +
    '<div style="background:#0E2A47;color:#ffffff;padding:18px 24px;font-weight:bold;letter-spacing:2px;">PEAK <span style="color:#8EC1FF;">LATAM</span></div>' +
    '<div style="padding:24px;">' +
      p('Hola ' + nombre + ',') +
      p('Gracias por completar el Test PPOF (Perfect Present Operational Focus). Este es el resultado para ' + empresa + ':') +
      '<div style="background:' + r.fondo + ';border-radius:10px;padding:20px;margin:0 0 20px;color:' + r.color + ';">' +
        '<div style="font-size:36px;font-weight:bold;line-height:1;">' + puntos + ' <span style="font-size:15px;">/ 10 puntos</span></div>' +
        '<div style="font-size:22px;font-weight:bold;margin:8px 0 6px;">' + r.emoji + ' ' + esc(r.titulo) + '</div>' +
        '<span style="display:inline-block;background:' + r.color + ';color:#fff;font-size:12px;font-weight:bold;padding:3px 10px;border-radius:99px;text-transform:uppercase;">' + esc(r.alerta) + '</span>' +
        '<p style="margin:12px 0 0;color:#1B2430;font-weight:bold;">' + esc(r.lema) + '</p>' +
      '</div>' +
      r.parrafos.map((t) => p(t)).join('') +
      '<div style="border-left:4px solid #1F7AE0;background:#F6F9FD;padding:14px 16px;margin:20px 0;">' +
        '<div style="font-weight:bold;color:#0E2A47;margin-bottom:4px;">Principal desafío</div>' +
        '<div>' + esc(r.desafio) + '</div>' +
      '</div>' +
      '<h2 style="font-size:18px;color:#0E2A47;margin:24px 0 10px;">Recomendación PEAK</h2>' +
      r.recomendacion.map((t) => p(t)).join('') +
      '<h2 style="font-size:18px;color:#0E2A47;margin:24px 0 10px;">Tus respuestas</h2>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px;">' + filas + '</table>' +
      '<div style="background:#0E2A47;color:#ffffff;border-radius:10px;padding:22px;margin-top:24px;">' +
        '<div style="font-size:18px;font-weight:bold;margin-bottom:8px;">' + esc(C.cierre.titulo) + '</div>' +
        '<p style="margin:0 0 12px;color:#D7E3F1;">' + esc(C.cierre.texto) + '</p>' +
        '<p style="margin:0 0 16px;color:#D7E3F1;">' + esc(C.cierre.cta) + '</p>' +
        '<a href="' + esc(C.whatsapp) + '" style="display:inline-block;background:#1FA855;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:8px;">' + esc(C.cierre.boton) + ' →</a>' +
      '</div>' +
    '</div>' +
    '<div style="padding:18px 24px;font-size:12px;color:#5B6675;text-align:center;border-top:1px solid #E3E8EF;">' +
      C.contacto.lineas.map(esc).join('<br>') + '<br>' +
      'Tel. ' + esc(C.contacto.telefono) + ' · <a href="mailto:' + esc(C.contacto.email) + '" style="color:#163B63;">' + esc(C.contacto.email) + '</a>' +
    '</div>' +
  '</div></div>';
}

function textoPlano(C, r, puntos, nombre) {
  return [
    'Hola ' + nombre + ',',
    '',
    'Tu resultado del Test PPOF: ' + puntos + '/10 puntos — ' + r.titulo + ' (' + r.alerta + ')',
    r.lema,
    '',
    r.parrafos.join('\n\n'),
    '',
    'Principal desafío: ' + r.desafio,
    '',
    'Recomendación PEAK:',
    r.recomendacion.join('\n\n'),
    '',
    C.cierre.titulo + '. ' + C.cierre.texto,
    C.cierre.cta + ' ' + C.whatsapp,
    '',
    C.contacto.lineas.join('\n'),
    'Tel. ' + C.contacto.telefono,
    C.contacto.email,
  ].join('\n');
}

function limpiar(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Ejecuta esta función una vez desde el editor para autorizar permisos y probar el correo.
function prueba() {
  const res = doPost({ postData: { contents: JSON.stringify({
    nombre: 'Prueba', empresa: 'Empresa de prueba', email: Session.getActiveUser().getEmail(),
    respuestas: [1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  }) } });
  console.log(res.getContent());
}
