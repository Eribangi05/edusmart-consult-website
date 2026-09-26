/* Amategeko y'Umuhanda icon set: full colour illustrated pictograms (64x64), used in the menu, the home tiles, buttons and messages.
   Each emoji the app draws is swapped for a matching illustration. If this file fails to load the app still works with its emoji. */
(function () {
  'use strict';
  function grad(id, a, b) { return '<linearGradient id="amg-' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    grad('red', '#ff8080', '#e0303f') + grad('blue', '#5b8dff', '#1f47c9') + grad('green', '#4fdc8b', '#17904f') + grad('gold', '#ffe066', '#f5a300') +
    grad('purple', '#a98bff', '#5e3ed6') + grad('pink', '#ff9fcf', '#e0489a') + grad('teal', '#4fe0cf', '#0f9d8f') + grad('orange', '#ffb454', '#f07a00') +
    grad('gray', '#c5d1e4', '#8496b5') + grad('navy', '#33477a', '#0f1c40') + grad('sky', '#8fdcff', '#3aa6f0') + '</defs></svg>';

  var ART = {
    home: '<rect x="43" y="10" width="7" height="14" rx="1.5" fill="url(#amg-red)"/><path d="M9 31 32 11l23 20v22a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z" fill="#ffe7bf"/><path d="M4 32 32 7l28 25-3.6 4L32 14 7.6 36z" fill="url(#amg-red)"/><rect x="26" y="38" width="12" height="18" rx="2.5" fill="url(#amg-blue)"/><circle cx="35" cy="48" r="1.3" fill="#ffd23f"/><rect x="13" y="36" width="9" height="9" rx="2" fill="#9fdcff"/><rect x="42" y="36" width="9" height="9" rx="2" fill="#9fdcff"/>',
    books: '<rect x="6" y="42" width="46" height="13" rx="3" fill="url(#amg-blue)"/><rect x="11" y="46" width="34" height="2.4" rx="1.2" fill="#fff" opacity=".75"/><rect x="11" y="50.5" width="18" height="2.4" rx="1.2" fill="#fff" opacity=".5"/><rect x="12" y="28.5" width="46" height="13" rx="3" fill="url(#amg-green)"/><rect x="17" y="32.5" width="34" height="2.4" rx="1.2" fill="#fff" opacity=".75"/><rect x="17" y="37" width="18" height="2.4" rx="1.2" fill="#fff" opacity=".5"/><rect x="8" y="15" width="46" height="13" rx="3" fill="url(#amg-orange)"/><rect x="13" y="19" width="34" height="2.4" rx="1.2" fill="#fff" opacity=".75"/><rect x="13" y="23.5" width="18" height="2.4" rx="1.2" fill="#fff" opacity=".5"/>',
    target: '<circle cx="29" cy="35" r="24" fill="#ff5a5f"/><circle cx="29" cy="35" r="18" fill="#fff"/><circle cx="29" cy="35" r="12" fill="#ff5a5f"/><circle cx="29" cy="35" r="6" fill="#fff"/><path d="M30 34 52 12" stroke="#f5a300" stroke-width="4.5" stroke-linecap="round"/><path d="M50 8l10-2-2 10-5.5-1z" fill="url(#amg-gold)"/><circle cx="29" cy="35" r="3" fill="#f5a300"/>',
    search: '<path d="M40 40 56 56" stroke="#8b5a2b" stroke-width="9" stroke-linecap="round"/><circle cx="26" cy="26" r="19" fill="#dff3ff" stroke="url(#amg-gold)" stroke-width="7"/><path d="M20 20a6.4 6.4 0 1 1 8.6 6c-2 .9-2.6 2.2-2.6 4" fill="none" stroke="#2f6bff" stroke-width="4" stroke-linecap="round"/><circle cx="26" cy="37" r="2.6" fill="#2f6bff"/><path d="M13 22a14 14 0 0 1 8-9" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".8"/>',
    doc: '<rect x="11" y="9" width="42" height="50" rx="6" fill="url(#amg-orange)"/><rect x="24" y="4" width="16" height="10" rx="3.5" fill="#8b5a2b"/><rect x="16" y="15" width="32" height="39" rx="3" fill="#fff"/><path d="M20 24l3 3 5-6" fill="none" stroke="#2ecc71" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 24h12" stroke="#b6c3dc" stroke-width="3" stroke-linecap="round"/><path d="M20 34l3 3 5-6" fill="none" stroke="#2ecc71" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 34h12" stroke="#b6c3dc" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="46" r="3.6" fill="none" stroke="#b6c3dc" stroke-width="2.4"/><path d="M32 46h9" stroke="#b6c3dc" stroke-width="3" stroke-linecap="round"/>',
    signs: '<rect x="30" y="46" width="4" height="15" rx="1" fill="#8496b5"/><path d="M32 6 59 51H5z" fill="#e0303f" stroke="#e0303f" stroke-width="5" stroke-linejoin="round"/><path d="M32 16 50 45H14z" fill="#fff"/><circle cx="32" cy="26" r="3.2" fill="#1b2340"/><path d="M32 30v8M32 32l-4.5 5M32 32l4.5 5M32 38l-3.5 6M32 38l3.5 6" fill="none" stroke="#1b2340" stroke-width="2.8" stroke-linecap="round"/>',
    light: '<rect x="17" y="3" width="30" height="58" rx="11" fill="url(#amg-navy)"/><circle cx="32" cy="18" r="8.5" fill="#ff4d55"/><circle cx="32" cy="18" r="12" fill="#ff4d55" opacity=".22"/><circle cx="32" cy="33" r="8.5" fill="#ffd23f"/><circle cx="32" cy="48" r="8.5" fill="#2ecc71"/><circle cx="29" cy="15" r="2.4" fill="#fff" opacity=".7"/><circle cx="29" cy="30" r="2.4" fill="#fff" opacity=".7"/><circle cx="29" cy="45" r="2.4" fill="#fff" opacity=".7"/>',
    car: '<rect x="3" y="27" width="8" height="5" rx="2.5" fill="#1b3fbf"/><rect x="53" y="27" width="8" height="5" rx="2.5" fill="#1b3fbf"/><path d="M11 30 16 15a5 5 0 0 1 4.8-3.5h22.4A5 5 0 0 1 48 15l5 15z" fill="url(#amg-blue)"/><path d="M18 29l3.6-12.5h20.8L46 29z" fill="#bfe6ff"/><rect x="6" y="29" width="52" height="20" rx="7" fill="#1b3fbf"/><rect x="6" y="29" width="52" height="8" rx="4" fill="#3a6bff" opacity=".7"/><circle cx="16" cy="39" r="4.6" fill="#ffe066"/><circle cx="48" cy="39" r="4.6" fill="#ffe066"/><rect x="25" y="38" width="14" height="6" rx="2.5" fill="#0d1b3e"/><rect x="9" y="47" width="11" height="9" rx="3.5" fill="#1b2340"/><rect x="44" y="47" width="11" height="9" rx="3.5" fill="#1b2340"/>',
    cards: '<rect x="12" y="9" width="34" height="44" rx="6" fill="#ffb6dc" transform="rotate(-11 29 31)"/><rect x="19" y="12" width="35" height="45" rx="6" fill="url(#amg-pink)"/><rect x="23" y="16" width="27" height="37" rx="3.5" fill="#fff"/><path d="M36.5 22l3.2 6.6 7.2 1-5.2 5.1 1.2 7.2-6.4-3.4-6.4 3.4 1.2-7.2-5.2-5.1 7.2-1z" fill="url(#amg-gold)"/>',
    openbook: '<path d="M32 14C25 9 15 9 5 11v41c10-2 20-2 27 3 7-5 17-5 27-3V11c-10-2-20-2-27 3z" fill="url(#amg-blue)"/><path d="M32 17C25 13 16 13 8.5 14.5v34C17 47 25 47 32 51z" fill="#fff"/><path d="M32 17c7-4 16-4 23.5-2.5v34C47 47 39 47 32 51z" fill="#e6efff"/><path d="M13 22h13M13 29h13M13 36h9" stroke="#8fa7d6" stroke-width="3" stroke-linecap="round"/><path d="M38 22h13M38 29h13M38 36h9" stroke="#a9bde3" stroke-width="3" stroke-linecap="round"/>',
    scale: '<rect x="29" y="12" width="6" height="42" rx="3" fill="#c98b1e"/><rect x="17" y="53" width="30" height="7" rx="3.5" fill="#8b5a2b"/><rect x="7" y="16" width="50" height="5" rx="2.5" fill="url(#amg-gold)"/><circle cx="32" cy="10" r="5" fill="url(#amg-gold)"/><path d="M12 21 5 38M12 21l13 17M52 21 39 38M52 21l7 17" stroke="#c98b1e" stroke-width="2.2" fill="none"/><path d="M3 38h24a12 12 0 0 1-24 0z" fill="url(#amg-gold)"/><path d="M37 38h24a12 12 0 0 1-24 0z" fill="url(#amg-gold)"/>',
    chart: '<rect x="5" y="57" width="54" height="4" rx="2" fill="#8496b5"/><rect x="8" y="38" width="11" height="19" rx="3.5" fill="url(#amg-teal)"/><rect x="24" y="28" width="11" height="29" rx="3.5" fill="url(#amg-green)"/><rect x="40" y="18" width="11" height="39" rx="3.5" fill="url(#amg-gold)"/><path d="M8 28 25 14l10 8 18-16" fill="none" stroke="#e0303f" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M45 5h11v11" fill="none" stroke="#e0303f" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>',
    clock: '<circle cx="34" cy="34" r="23" fill="#fff" stroke="url(#amg-purple)" stroke-width="6"/><path d="M34 19v16l10 6" fill="none" stroke="#5e3ed6" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="35" r="3.4" fill="#5e3ed6"/><path d="M8 34A26 26 0 0 1 17 15" fill="none" stroke="#f07a00" stroke-width="4.4" stroke-linecap="round"/><path d="M11 8l8 2-3 8z" fill="#f07a00"/>',
    printer: '<rect x="17" y="5" width="30" height="20" rx="2.5" fill="#fff" stroke="#c7d3ea" stroke-width="2"/><rect x="5" y="22" width="54" height="24" rx="7" fill="url(#amg-pink)"/><rect x="10" y="26" width="44" height="4" rx="2" fill="#ffc0e2"/><rect x="15" y="38" width="34" height="21" rx="2.5" fill="#fff" stroke="#c7d3ea" stroke-width="2"/><path d="M21 45h22M21 51h14" stroke="#9fb0c8" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="33" r="2.6" fill="#ffe066"/>',
    medal: '<path d="M18 3h11l5 20-9.5 4z" fill="url(#amg-blue)"/><path d="M46 3H35l-5 20 9.5 4z" fill="url(#amg-red)"/><circle cx="32" cy="39" r="20" fill="url(#amg-gold)"/><circle cx="32" cy="39" r="14.5" fill="#f5a300"/><circle cx="32" cy="39" r="14.5" fill="none" stroke="#fff2b3" stroke-width="1.6"/><path d="M32 27.5l3.5 7.2 7.9 1.2-5.7 5.6 1.3 7.9-7-3.7-7 3.7 1.3-7.9-5.7-5.6 7.9-1.2z" fill="#fff8d6"/>',
    gear: '<g fill="url(#amg-gray)"><rect x="27.5" y="4" width="9" height="56" rx="3.5"/><rect x="27.5" y="4" width="9" height="56" rx="3.5" transform="rotate(45 32 32)"/><rect x="27.5" y="4" width="9" height="56" rx="3.5" transform="rotate(90 32 32)"/><rect x="27.5" y="4" width="9" height="56" rx="3.5" transform="rotate(135 32 32)"/><circle cx="32" cy="32" r="19"/></g><circle cx="32" cy="32" r="19" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/><circle cx="32" cy="32" r="8.5" fill="#fff"/><circle cx="32" cy="32" r="4.6" fill="url(#amg-blue)"/>',
    school: '<path d="M32 4l5 3.4H32v9h9v6H32v2" fill="none"/><path d="M6 28 32 10l26 18v4H6z" fill="url(#amg-blue)"/><rect x="9" y="32" width="46" height="22" rx="2" fill="#ffe7bf"/><rect x="13" y="35" width="6" height="16" rx="1.5" fill="#fff"/><rect x="24" y="35" width="6" height="16" rx="1.5" fill="#fff"/><rect x="34" y="35" width="6" height="16" rx="1.5" fill="#fff"/><rect x="45" y="35" width="6" height="16" rx="1.5" fill="#fff"/><rect x="4" y="54" width="56" height="6" rx="3" fill="#8496b5"/><circle cx="32" cy="22" r="4" fill="#fff"/><rect x="31" y="0" width="2" height="9" fill="#8b5a2b"/><path d="M33 1h11l-3 3.5 3 3.5H33z" fill="url(#amg-red)"/>',
    check: '<circle cx="32" cy="32" r="28" fill="url(#amg-green)"/><path d="M19 33l9 9 17-19" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
    cross: '<circle cx="32" cy="32" r="28" fill="url(#amg-red)"/><path d="M22 22l20 20M42 22 22 42" stroke="#fff" stroke-width="7" stroke-linecap="round"/>',
    warn: '<path d="M32 5 60 54a3.2 3.2 0 0 1-2.8 4.8H6.8A3.2 3.2 0 0 1 4 54z" fill="url(#amg-gold)"/><path d="M32 22v17" stroke="#3a2600" stroke-width="6" stroke-linecap="round"/><circle cx="32" cy="48" r="3.6" fill="#3a2600"/>',
    volume: '<path d="M6 24h11l15-12v40L17 40H6z" fill="url(#amg-blue)"/><path d="M41 22a14 14 0 0 1 0 20M47 15a23 23 0 0 1 0 34" fill="none" stroke="#5cc8ff" stroke-width="5" stroke-linecap="round"/>',
    mute: '<path d="M6 24h11l15-12v40L17 40H6z" fill="url(#amg-gray)"/><path d="M41 24l16 16M57 24 41 40" stroke="#e0303f" stroke-width="5" stroke-linecap="round"/>',
    key: '<circle cx="19" cy="41" r="14" fill="url(#amg-gold)"/><circle cx="19" cy="41" r="5" fill="#fff" opacity=".85"/><path d="M29 31 54 6" stroke="#e6a100" stroke-width="7" stroke-linecap="round"/><path d="M44 16l7 7M50 10l6 6" stroke="#e6a100" stroke-width="6" stroke-linecap="round"/>',
    lock: '<path d="M20 28v-7a12 12 0 0 1 24 0v7" fill="none" stroke="#8496b5" stroke-width="7"/><rect x="10" y="27" width="44" height="32" rx="7" fill="url(#amg-orange)"/><circle cx="32" cy="41" r="4.6" fill="#fff"/><rect x="30" y="43" width="4" height="9" rx="2" fill="#fff"/>',
    unlock: '<path d="M20 28v-8a12 12 0 0 1 23.6-3" fill="none" stroke="#8496b5" stroke-width="7" stroke-linecap="round"/><rect x="10" y="27" width="44" height="32" rx="7" fill="url(#amg-orange)"/><circle cx="32" cy="41" r="4.6" fill="#fff"/><rect x="30" y="43" width="4" height="9" rx="2" fill="#fff"/>',
    user: '<circle cx="32" cy="20" r="12.5" fill="#ffcf9f"/><path d="M7 59c0-14 11-23 25-23s25 9 25 23z" fill="url(#amg-blue)"/><path d="M20 18c0-8 5-11 12-11s12 3 12 11c-5-3-9-4.5-12-4.5S25 15 20 18z" fill="#3a2a1a"/>',
    calendar: '<rect x="6" y="10" width="52" height="49" rx="7" fill="#fff" stroke="#d3ddf0" stroke-width="2"/><path d="M6 17a7 7 0 0 1 7-7h38a7 7 0 0 1 7 7v11H6z" fill="url(#amg-red)"/><rect x="16" y="4" width="5" height="12" rx="2.5" fill="#8a1c2b"/><rect x="43" y="4" width="5" height="12" rx="2.5" fill="#8a1c2b"/><g fill="#2f6bff"><rect x="14" y="34" width="8" height="7" rx="2"/><rect x="28" y="34" width="8" height="7" rx="2"/><rect x="42" y="34" width="8" height="7" rx="2"/><rect x="14" y="46" width="8" height="7" rx="2"/><rect x="28" y="46" width="8" height="7" rx="2" fill="#2ecc71"/></g>',
    trash: '<path d="M12 19h40l-3 37a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4z" fill="url(#amg-gray)"/><rect x="8" y="12" width="48" height="7" rx="3.5" fill="#7d8fae"/><rect x="24" y="5" width="16" height="8" rx="3" fill="#7d8fae"/><path d="M25 27v26M32 27v26M39 27v26" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/>',
    camera: '<path d="M8 20h11l4-7h18l4 7h11a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z" fill="url(#amg-gray)"/><circle cx="32" cy="38" r="13" fill="#fff"/><circle cx="32" cy="38" r="9" fill="url(#amg-blue)"/><circle cx="29" cy="35" r="2.6" fill="#fff" opacity=".85"/><circle cx="50" cy="26" r="2.4" fill="#ffe066"/>',
    sun: '<g stroke="#f5a300" stroke-width="5" stroke-linecap="round"><path d="M32 3v8M32 53v8M3 32h8M53 32h8M11 11l6 6M47 47l6 6M53 11l-6 6M17 47l-6 6"/></g><circle cx="32" cy="32" r="15" fill="url(#amg-gold)"/>',
    moon: '<path d="M50 41A24 24 0 0 1 24 7a24 24 0 1 0 26 34z" fill="url(#amg-purple)"/><circle cx="47" cy="15" r="2.6" fill="#ffe066"/><circle cx="55" cy="27" r="1.9" fill="#ffe066"/><circle cx="40" cy="8" r="1.6" fill="#ffe066"/>',
    headphones: '<path d="M11 40V32a21 21 0 0 1 42 0v8" fill="none" stroke="url(#amg-purple)" stroke-width="7" stroke-linecap="round"/><rect x="5" y="36" width="15" height="23" rx="6.5" fill="url(#amg-purple)"/><rect x="44" y="36" width="15" height="23" rx="6.5" fill="url(#amg-purple)"/><rect x="9" y="41" width="5" height="13" rx="2.5" fill="#fff" opacity=".6"/><rect x="50" y="41" width="5" height="13" rx="2.5" fill="#fff" opacity=".6"/>',
    flag: '<rect x="10" y="5" width="5" height="56" rx="2.5" fill="#8b5a2b"/><path d="M15 8h40l-9 13 9 13H15z" fill="url(#amg-red)"/>',
    image: '<rect x="5" y="9" width="54" height="46" rx="7" fill="#dff1ff" stroke="#8fc9f5" stroke-width="2"/><circle cx="21" cy="24" r="6.5" fill="url(#amg-gold)"/><path d="M5 48l17-16 12 11 9-8 16 14v4a7 7 0 0 1-7 7H12a7 7 0 0 1-7-7z" fill="url(#amg-green)"/>',
    save: '<path d="M9 7h39l9 9v41a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3z" fill="url(#amg-blue)"/><rect x="16" y="7" width="26" height="17" rx="2.5" fill="#fff"/><rect x="34" y="10" width="5" height="10" rx="1.5" fill="#2f6bff"/><rect x="14" y="34" width="36" height="26" rx="3" fill="#dbe7ff"/><path d="M20 42h24M20 49h16" stroke="#8fa7d6" stroke-width="3" stroke-linecap="round"/>',
    refresh: '<path d="M52 26A22 22 0 0 0 13 22" fill="none" stroke="url(#amg-green)" stroke-width="7" stroke-linecap="round"/><path d="M6 8l4 16 15-6z" fill="#2ecc71"/><path d="M12 38a22 22 0 0 0 39 4" fill="none" stroke="#17904f" stroke-width="7" stroke-linecap="round"/><path d="M58 56l-4-16-15 6z" fill="#17904f"/>',
    upload: '<path d="M32 6 10 30h14v18h16V30h14z" fill="url(#amg-blue)"/><rect x="9" y="52" width="46" height="7" rx="3.5" fill="#8496b5"/>',
    pencil: '<path d="M7 57l4-14L41 13l10 10L21 53z" fill="url(#amg-gold)"/><path d="M41 13l6-6a4.2 4.2 0 0 1 6 0l4 4a4.2 4.2 0 0 1 0 6l-6 6z" fill="url(#amg-pink)"/><path d="M7 57l4-14 10 10z" fill="#ffe7bf"/><path d="M7 57l2.4-8 5.6 5.6z" fill="#3a2600"/>',
    party: '<path d="M5 59 19 20l25 25z" fill="url(#amg-gold)"/><path d="M5 59 13 38l13 13z" fill="#f07a00"/><circle cx="42" cy="14" r="3.4" fill="#ff5a5f"/><rect x="49" y="22" width="7" height="7" rx="1.8" fill="#2f6bff" transform="rotate(20 52 25)"/><circle cx="29" cy="8" r="2.8" fill="#2ecc71"/><path d="M34 27l7-7M47 41l9-4M22 10l4-4" stroke="#ff6fb1" stroke-width="3.4" stroke-linecap="round"/>',
    star: '<path d="M32 3l8.6 17.5 19.4 2.8-14 13.6 3.3 19.2L32 47l-17.3 9.1 3.3-19.2L4 23.3l19.4-2.8z" fill="url(#amg-gold)"/><path d="M32 12l5.3 10.8 11.8 1.7-8.6 8.4 2 11.8L32 39l-10.6 5.7 2-11.8-8.6-8.4 11.8-1.7z" fill="#fff2b3" opacity=".55"/>',
    hand: '<rect x="8" y="32" width="10" height="24" rx="5" fill="#ffcf9f" transform="rotate(-32 13 44)"/><rect x="20" y="9" width="10" height="34" rx="5" fill="#ffcf9f"/><rect x="30" y="5" width="10" height="36" rx="5" fill="#ffcf9f"/><rect x="40" y="9" width="10" height="34" rx="5" fill="#ffcf9f"/><rect x="49" y="17" width="9" height="28" rx="4.5" fill="#ffcf9f"/><path d="M18 36h40v9c0 12-8 17-20 17-9 0-15-5-19-12z" fill="#ffcf9f"/><path d="M30 8v16M40 8v16M20 14v14" stroke="#e8b078" stroke-width="1.4" opacity=".6" stroke-linecap="round"/>'
  };

  // emoji -> [art, tint of the tile it sits on in the home screen]
  var M = {
    '🏠': ['home', '#ffe9dd'], '📚': ['books', '#e8f0ff'], '🎯': ['target', '#ffe3e3'], '🔎': ['search', '#fff2cf'], '📝': ['doc', '#ffeed6'],
    '🚸': ['signs', '#ffe3e3'], '🚦': ['light', '#e4f7ec'], '🚙': ['car', '#e3ecff'], '🚗': ['car', '#e3ecff'], '🃏': ['cards', '#ffe4f1'],
    '📖': ['openbook', '#e6eeff'], '⚖': ['scale', '#fff1d0'], '📈': ['chart', '#e2f8ee'], '🕘': ['clock', '#efe9ff'], '🖨': ['printer', '#ffe6f2'],
    '🏅': ['medal', '#fff2cc'], '⚙': ['gear', '#e9eef7'], '🏫': ['school', '#e3f0ff'],
    '✓': ['check'], '✔': ['check'], '✅': ['check'], '✕': ['cross'], '✗': ['cross'], '❌': ['cross'], '⚠': ['warn'], '🔊': ['volume'], '🔇': ['mute'],
    '🔑': ['key'], '🔐': ['lock'], '🔓': ['unlock'], '👤': ['user'], '👩': ['user'], '📅': ['calendar'], '🗑': ['trash'], '📷': ['camera'], '☀': ['sun'],
    '🌙': ['moon'], '🎧': ['headphones'], '🚩': ['flag'], '⚐': ['flag'], '📊': ['chart'], '🖼': ['image'], '📄': ['doc'], '💾': ['save'], '🔄': ['refresh'],
    '⬆': ['upload'], '✎': ['pencil'], '📋': ['doc'], '⏱': ['clock'], '🎉': ['party'], '💪': ['star'], '👋': ['hand']
  };
  var keys = Object.keys(M).sort(function (a, b) { return b.length - a.length; });
  var RE = new RegExp('(' + keys.join('|') + ')\\uFE0F?', 'g');
  var TEST = new RegExp('(' + keys.join('|') + ')');

  function svg(name) { return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' + ART[name] + '</svg>'; }
  function art(name, cls) { return '<span class="amg-art' + (cls ? ' ' + cls : '') + '">' + svg(name) + '</span>'; }
  function lookup(ch) { return M[ch.replace(/️/g, '')]; }

  function ensureDefs() {
    if (document.getElementById('amgIconDefs')) return;
    var d = document.createElement('div'); d.id = 'amgIconDefs'; d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'; d.innerHTML = DEFS;
    (document.body || document.documentElement).appendChild(d);
  }

  function upgrade(root) {
    if (!document.body) return;
    ensureDefs();
    root = root || document.body;
    // icons that stand alone: menu, home tiles, the big banner picture
    var big = root.querySelectorAll('.ni-ico, .t-ico, .hero-emoji');
    for (var i = 0; i < big.length; i++) {
      var el = big[i]; if (el.getAttribute('data-amg') || el.children.length) continue;
      var m = lookup(el.textContent.trim()); if (!m || !ART[m[0]]) continue;
      el.setAttribute('data-amg', '1');
      if (m[1]) el.style.setProperty('--tint', m[1]);
      el.innerHTML = art(m[0]);
    }
    // emoji inside text (buttons, headings, messages)
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|TITLE)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
      return TEST.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
    var nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    nodes.forEach(function (n) {
      var text = n.nodeValue, html = '', last = 0, mt; RE.lastIndex = 0;
      while ((mt = RE.exec(text))) {
        var m = lookup(mt[1]); if (!m || !ART[m[0]]) continue;
        html += esc(text.slice(last, mt.index)) + art(m[0], 'inl'); last = mt.index + mt[0].length;
      }
      if (!last) return;
      html += esc(text.slice(last));
      var s = document.createElement('span'); s.className = 'amg-run'; s.innerHTML = html; n.parentNode.replaceChild(s, n);
    });
  }

  // keep the icons in step with the screens as the app redraws itself (one pass per batch, never watching its own edits).
  // Uses setTimeout rather than requestAnimationFrame: rAF is tied to painting and can stop firing while the tab or
  // window is in the background, which would leave a mutation "pending" forever and silently stop all future upgrades.
  function start() {
    if (start.done || !document.body) return; start.done = true;
    var busy = false, pending = false;
    var obs = new MutationObserver(function () {
      if (busy || pending) return; pending = true;
      setTimeout(function () {
        pending = false; busy = true; obs.disconnect();
        try { upgrade(document.body); } catch (e) { /* cosmetic only */ }
        obs.observe(document.body, { childList: true, subtree: true, characterData: true }); busy = false;
      }, 0);
    });
    try { upgrade(document.body); } catch (e) { /* cosmetic only */ }
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  window.__amgIcons = { upgrade: upgrade, start: start, art: art, list: ART };
})();
