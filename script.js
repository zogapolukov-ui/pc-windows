/* ============================================================
   WINDOWS 95
   Vanilla JS, no build step, no dependencies.
   ============================================================ */
'use strict';

/* ---------------- Utility ---------------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const uid = (() => { let n=0; return () => 'w' + (++n); })();
function save(key, val){ try{ localStorage.setItem('w95_'+key, JSON.stringify(val)); }catch(e){} }
function load(key, def){ try{ const v = localStorage.getItem('w95_'+key); return v===null?def:JSON.parse(v); }catch(e){ return def; } }

/* ============================================================
   ASSET CONFIGURATION
   ------------------------------------------------------------
   Single source of truth for every external texture the UI uses:
   icons, wallpapers and the system font. Nothing here is drawn —
   these are just paths. Drop matching files under assets/icons/,
   assets/wallpapers/ and assets/fonts/ and the UI will pick them
   up automatically; nothing in this file needs to change.
   No folders or images are created by this code — only referenced.
   ============================================================ */
const ASSETS = {
  icons: {
    /* ---- desktop shortcuts (each has its own dedicated file) ---- */
    recycleBin:          'assets/icons/recycle-bin.png',
    switchVirtualRouter: 'assets/icons/switch-virtual-router.png',
    barscryptor:         'assets/icons/barscryptor.png',
    googleChrome:        'assets/icons/google-chrome.png',
    userGuide:           'assets/icons/user-guide.png',
    kvitantsia:          'assets/icons/kvitantsia.png',
    torBrowser:          'assets/icons/tor-browser.png',
    torBrowserCopy:      'assets/icons/folder-tor-browser-copy.png',
    noxscan:             'assets/icons/noxscan.png',
    anydesk:             'assets/icons/anydesk.png',
    teamviewer:          'assets/icons/teamviewer.png',
    epson:               'assets/icons/epson-printer-connection.png',
    annaRakovets:        'assets/icons/anna-rakovets.png',
    na2026Rik:           'assets/icons/na-2026-rik.png',
    word:                'assets/icons/microsoft-word-document.png',
    telegram:            'assets/icons/telegram.png',
    ios:                 'assets/icons/ios.png',
    softether:           'assets/icons/softether.png',
    mods:                'assets/icons/mods.png',
    user:                'assets/icons/user.png',
    network:             'assets/icons/network.png',
    thisPc:              'assets/icons/this-pc.png',
    controlPanel:        'assets/icons/control-panel.png',

    /* ---- taskbar / quicklaunch ---- */
    folder:  'assets/icons/folder.png',
    browser: 'assets/icons/browser.png',
    discord: 'assets/icons/discord.png',

    /* ---- Start Menu / other applications ---- */
    ie:         'assets/icons/internet-explorer.png',
    notepad:    'assets/icons/notepad.png',
    todoDoc:    'assets/icons/todo-list.png',
    calculator: 'assets/icons/calculator.png',
    terminal:   'assets/icons/command-prompt.png',
    steam:      'assets/icons/steam.png',
    games:      'assets/icons/games.png',
    shutdown:   'assets/icons/shutdown.png',

    /* ---- window chrome / dialogs / system tray / control panel ---- */
    driveIcon:       'assets/icons/drive.png',
    printerIcon:     'assets/icons/printer.png',
    folderOpen:      'assets/icons/folder-open.png',
    recycleBinFull:  'assets/icons/recycle-bin-full.png',
    info:            'assets/icons/info.png',
    display:         'assets/icons/display-properties.png',
    mouse:           'assets/icons/mouse-properties.png',
    soundSettings:   'assets/icons/sound-properties.png',
    soundTray:       'assets/icons/sound-tray.png',
    soundOffTray:    'assets/icons/sound-off-tray.png',
    batteryTray:     'assets/icons/battery-tray.png',
    powerTray:       'assets/icons/power-tray.png',
    clockIcon:       'assets/icons/clock.png',
    lockIcon:        'assets/icons/lock.png',
    errorIcon:       'assets/icons/error.png',
    wallpaperSetting:'assets/icons/wallpaper-properties.png',
    doc:             'assets/icons/document.png',

    /* ---- post-finale gift ---- */
    tamagotchi: 'assets/icons/tamagotchi.png',

    /* shown whenever a requested icon has no path configured, or its
       file has not been placed on disk yet — never an inline SVG,
       never an emoji */
    placeholder: 'assets/icons/_placeholder.png',
  },

  wallpapers: {
    fantasy_night: 'assets/wallpapers/fantasy-night.png',
    aurora_dusk:   'assets/wallpapers/aurora-dusk.png',
    classic_teal:  'assets/wallpapers/classic-teal.png',
    classic_teal2: 'assets/wallpapers/classic-teal2.png',
  },

  /* Photos shown inside C:\Анна Раковец\Фотографии. Drop real files at
     these paths (assets/photos/anna-rakovets/01.jpg ... 05.jpg) and they
     will be picked up automatically; if a file is missing the viewer and
     the folder icon fall back gracefully, same as any other asset here. */
  photos: {
    annaRakovets: [
      'assets/photos/anna-rakovets/01.jpg',
      'assets/photos/anna-rakovets/02.jpg',
      'assets/photos/anna-rakovets/03.jpg',
      'assets/photos/anna-rakovets/04.jpg',
      'assets/photos/anna-rakovets/05.jpg',
    ],
    /* Used by the "Анна & Я" site inside Chrome (first-meeting story).
       Filenames are kept exactly as given — "png 1" ... "png 5" — just
       placed under their own folder; drop the real files there. */
    annaFirstMeeting: [
      'assets/photos/anna-love/png 1.png',
      'assets/photos/anna-love/png 2.png',
      'assets/photos/anna-love/png 3.png',
      'assets/photos/anna-love/png 4.png',
      'assets/photos/anna-love/png 5.png',
    ],
    /* Used by the "Наши маленькие моменты" memory tab. Filenames kept
       exactly as given — drop the real files under this folder. */
    annaLittleMoments: [
      'assets/photos/anna-love/cmpng1.jpg',
      'assets/photos/anna-love/cmpng2.jpg',
      'assets/photos/anna-love/cmpng3.jpg',
      'assets/photos/anna-love/cmpng4.jpg',
      'assets/photos/anna-love/cmpng5.jpg',
      'assets/photos/anna-love/cmpng6.jpg',
      'assets/photos/anna-love/cmpng7.jpg',
    ],
  },

  /* Used by the "Анна & Я" site inside Chrome. */
  videos: {
    annaFirstMeeting: 'assets/videos/anna-love/IMG_7012.MOV',
    /* "Наш первый день вместе" memory tab. Filename kept exactly as given. */
    annaFirstDayTogether: 'assets/videos/anna-love/doc_2026-08-28_21-53-51.mp4',
    /* "Самый счастливый день" memory tab. Filename kept exactly as given. */
    annaHappiestDay: 'assets/videos/anna-love/video.mp4',
  },

  fonts: {
    W95FA: 'assets/fonts/W95FA.woff2',
  },

  /* Used by "RADIO US" (radio-us.local). Drop the 3 real audio files at
     these exact paths (assets/music/radio-us/01.mp3 ... 03.mp3) and they
     will be picked up automatically, same as any other asset here — if
     a file is missing the player falls back gracefully. */
  songs: {
    radioUs: [
      'assets/music/radio-us/01.mp3',
      'assets/music/radio-us/02.mp3',
      'assets/music/radio-us/03.mp3',
    ],
  },
};

/* Backward-compatible alias: older code in this file refers to
   "ICONS[name]" as a lookup table. It now resolves to a file path
   instead of inline SVG markup. */
const ICONS = ASSETS.icons;

/* Returns the configured path for an icon key, falling back to a
   neutral system placeholder path if the key is unknown. */
function iconPath(name){
  return ICONS[name] || ICONS.placeholder;
}

/* Builds an <img> tag that loads an icon from disk. If the file is
   missing (404 / not yet supplied by the user), the image is hidden
   and a plain CSS placeholder box takes its place — never a
   fallback SVG, never an emoji. */
function iconTag(name, alt=''){
  const src = iconPath(name);
  return `<img class="icon-img-tag" src="${src}" alt="${alt}" draggable="false" `
       + `onerror="this.onerror=null; this.removeAttribute('src'); this.classList.add('icon-missing');">`;
}

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
(function boot(){
  const lines = [
    'Проверка памяти области................. OK',
    'Инициализация видеоадаптера.............. OK',
    'Загрузка драйверов устройств............. OK',
    'Монтирование диска C:.................... OK',
    'Запуск оболочки Windows.................. OK',
  ];
  const logEl = $('#boot-log');
  const barEl = $('#boot-bar-fill');
  let i = 0;
  let done = false;
  function step(){
    if(done) return;
    if(i < lines.length){
      const div = document.createElement('div');
      div.innerHTML = lines[i].replace('OK', '<span class="ok">OK</span>');
      logEl.appendChild(div);
      i++;
      barEl.style.width = Math.round((i/lines.length)*100) + '%';
      setTimeout(step, 260 + Math.random()*180);
    } else {
      setTimeout(finish, 400);
    }
  }
  function finish(){
    if(done) return;
    done = true;
    const bs = $('#boot-screen');
    bs.style.transition = 'opacity .35s';
    bs.style.opacity = '0';
    setTimeout(()=>{ bs.remove(); initDesktop(); }, 350);
  }
  window.addEventListener('keydown', finish, { once:true });
  window.addEventListener('mousedown', finish, { once:true });
  setTimeout(step, 300);
})();

/* ============================================================
   WALLPAPER — external image texture, no procedural drawing
   ------------------------------------------------------------
   Wallpapers are plain image files referenced from ASSETS.wallpapers.
   Nothing is drawn on a canvas any more: the desktop background is
   set with a CSS background-image, so dropping a PNG into
   assets/wallpapers/ is all that is needed to change it.
   ============================================================ */
const WALLPAPERS = Object.keys(ASSETS.wallpapers); // ['fantasy_night', 'aurora_dusk', 'classic_teal']

function wallpaperPath(kind){
  return ASSETS.wallpapers[kind] || ASSETS.wallpapers[WALLPAPERS[0]];
}

function applyWallpaper(){
  const kind = load('wallpaper', 'classic_teal');
  const el = $('#wallpaper-canvas');
  el.classList.remove('wallpaper-missing');
  el.style.backgroundImage = `url("${wallpaperPath(kind)}")`;

  // If the referenced file hasn't been supplied yet, fall back to a
  // plain neutral background colour instead of drawing anything —
  // never regenerate the old procedural artwork.
  const probe = new Image();
  probe.onload = () => el.classList.remove('wallpaper-missing');
  probe.onerror = () => el.classList.add('wallpaper-missing');
  probe.src = wallpaperPath(kind);
}

/* ============================================================
   DESKTOP ICONS
   ============================================================ */
/* Fixed Windows-95-style desktop grid, filled top-to-bottom, then
   column by column: column 1 has 9 items, column 2 has 9 items,
   column 3 has 5 items. */
const DEFAULT_ICONS = [
  // ---- column 1 (9) ----
  { id:'bin',          label:'Корзина',                     icon:'recycleBin', app:'bin',      col:0, row:0 },
  { id:'router',       label:'Switch Virtual Router',       icon:'switchVirtualRouter', app:'router',   col:0, row:1 },
  { id:'banicryptor',  label:'BarsCryptor',                 icon:'barscryptor', app:'barscryptor', col:0, row:2 },
  { id:'chrome',       label:'Google Chrome',                icon:'googleChrome', app:'chrome',   col:0, row:3 },
  { id:'userguide',    label:'Руководство пользователя',    icon:'userGuide',  app:'notepad',  col:0, row:4, opts:{filename:'Руководство пользователя.txt'} },
  { id:'doc1',         label:'квiтанцiя',                    icon:'kvitantsia', app:'notepad',  col:0, row:5, opts:{filename:'квiтанцiя.txt'} },
  { id:'tor1',         label:'Tor Browser',                  icon:'torBrowser', app:'tor',      col:0, row:6 },
  { id:'tor2',         label:'Tor Browser - копия',           icon:'torBrowserCopy', app:'explorer', col:0, row:7, opts:{path:'C:\\Tor Browser - копия'} },
  { id:'noxscan',      label:'NoxScan',                      icon:'noxscan',  app:'noxscan',  col:0, row:8 },

  // ---- column 2 (9) ----
  { id:'anydesk',      label:'AnyDesk',                      icon:'anydesk',    app:'anydesk',    col:1, row:0 },
  { id:'teamviewer',   label:'TeamViewer',                   icon:'teamviewer', app:'teamviewer', col:1, row:1 },
  { id:'epson',        label:'Epson Printer Connect..',     icon:'epson',      app:'epson',      col:1, row:2 },
  { id:'anna',         label:'Анна Раковец',                 icon:'annaRakovets', app:'explorer',   col:1, row:3, opts:{path:'C:\\Анна Раковец'} },
  { id:'year2026',     label:'На 2026 рік',                  icon:'na2026Rik',  app:'notepad',    col:1, row:4, opts:{filename:'На 2026 рік.txt'} },
  { id:'worddoc',      label:'Документ Microsoft Word',      icon:'word',       app:'word',       col:1, row:5, opts:{filename:'Документ.docx'} },
  { id:'telegram',     label:'Telegram',                     icon:'telegram',   app:'telegram',   col:1, row:6 },
  { id:'ios',          label:'IOS',                          icon:'ios',        app:'explorer',   col:1, row:7, opts:{path:'C:\\IOS'} },
  { id:'sottisfoc',    label:'SoftEther',                    icon:'softether',  app:'softether',  col:1, row:8 },

  // ---- column 3 (5) ----
  { id:'mods',         label:'mods',                         icon:'mods',     app:'explorer',   col:2, row:0, opts:{path:'C:\\mods'} },
  { id:'viber',        label:'User',                         icon:'user',     app:'explorer',   col:2, row:1, opts:{path:'C:\\User'} },
  { id:'opera',        label:'Сеть',                         icon:'network',  app:'network',    col:2, row:2 },
  { id:'mycomputer',   label:'Этот компьютер',                icon:'thisPc', app:'mycomputer', col:2, row:3 },
  { id:'control',      label:'Панель управления',            icon:'controlPanel',  app:'control',     col:2, row:4 },
];

/* bump this whenever DEFAULT_ICONS' structure changes, so that any
   old localStorage layout from a previous version of the project
   is discarded and the new fixed layout is applied instead */
const ICON_LAYOUT_VERSION = 2;
if (load('iconLayoutVersion', 0) !== ICON_LAYOUT_VERSION) {
  save('iconPositions', {});
  save('iconLayoutVersion', ICON_LAYOUT_VERSION);
}

let iconPositions = load('iconPositions', {});
let selectedIcons = new Set();

/* ---- grid system: icons snap to a fixed Windows-95-style grid ---- */
const GRID = { originX:12, originY:10, cellW:80, cellH:74 };
function gridCell(col,row){ return { x: GRID.originX+col*GRID.cellW, y: GRID.originY+row*GRID.cellH }; }
function layoutDefaultPosition(def){
  return { col: def.col, row: def.row };
}
function maxGridBounds(){
  const deskRect = $('#desktop').getBoundingClientRect();
  const maxCol = Math.max(0, Math.floor((deskRect.width - GRID.originX - 70) / GRID.cellW));
  const maxRow = Math.max(0, Math.floor((deskRect.height - GRID.originY - 68) / GRID.cellH));
  return { maxCol, maxRow };
}
function nearestCell(px, py){
  const { maxCol, maxRow } = maxGridBounds();
  let col = Math.round((px - GRID.originX) / GRID.cellW);
  let row = Math.round((py - GRID.originY) / GRID.cellH);
  col = Math.max(0, Math.min(maxCol, col));
  row = Math.max(0, Math.min(maxRow, row));
  return { col, row };
}
function findFreeCell(col, row, excludeId){
  const occupied = new Set();
  Object.entries(iconPositions).forEach(([id, pos]) => { if(id !== excludeId) occupied.add(pos.col+','+pos.row); });
  if(!occupied.has(col+','+row)) return { col, row };
  const { maxCol, maxRow } = maxGridBounds();
  for(let radius=1; radius<60; radius++){
    for(let dc=-radius; dc<=radius; dc++){
      for(let dr=-radius; dr<=radius; dr++){
        if(Math.max(Math.abs(dc), Math.abs(dr)) !== radius) continue;
        const c = Math.max(0, Math.min(maxCol, col+dc));
        const r = Math.max(0, Math.min(maxRow, row+dr));
        if(!occupied.has(c+','+r)) return { col:c, row:r };
      }
    }
  }
  return { col, row };
}

function renderIcons(){
  const layer = $('#icon-layer');
  layer.innerHTML = '';
  DEFAULT_ICONS.forEach((def) => {
    const cell = iconPositions[def.id] || layoutDefaultPosition(def);
    const pos = gridCell(cell.col, cell.row);
    const el = document.createElement('div');
    el.className = 'desktop-icon';
    el.dataset.id = def.id;
    el.style.left = pos.x + 'px';
    el.style.top = pos.y + 'px';
    el.innerHTML = `<div class="icon-img">${iconTag(def.icon, def.label)}</div><div class="icon-label">${def.label}</div>`;
    layer.appendChild(el);
    makeIconInteractive(el, def);
  });
}

function makeIconInteractive(el, def){
  let dragging = false, moved = false, offX=0, offY=0;
  let lastClick = 0;

  el.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    if(e.button !== 0) return;
    if(!selectedIcons.has(def.id) && !e.ctrlKey){
      clearIconSelection();
    }
    selectIcon(def.id);
    dragging = true; moved = false;
    const rect = el.getBoundingClientRect();
    offX = e.clientX - rect.left;
    offY = e.clientY - rect.top;
    el.style.zIndex = 20;

    function onMove(ev){
      const dx = Math.abs(ev.clientX - (rect.left+offX));
      const dy = Math.abs(ev.clientY - (rect.top+offY));
      if(dx>3 || dy>3) moved = true;
      if(!dragging) return;
      const deskRect = $('#desktop').getBoundingClientRect();
      let nx = ev.clientX - deskRect.left - offX;
      let ny = ev.clientY - deskRect.top - offY;
      nx = Math.max(0, Math.min(deskRect.width-70, nx));
      ny = Math.max(0, Math.min(deskRect.height-68, ny));
      el.style.left = nx+'px'; el.style.top = ny+'px';
    }
    function onUp(){
      dragging = false;
      el.style.zIndex = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if(moved){
        const rawCol = nearestCell(parseInt(el.style.left), parseInt(el.style.top));
        const cell = findFreeCell(rawCol.col, rawCol.row, def.id);
        const snapped = gridCell(cell.col, cell.row);
        el.style.left = snapped.x+'px'; el.style.top = snapped.y+'px';
        iconPositions[def.id] = { col: cell.col, row: cell.row };
        save('iconPositions', iconPositions);
      } else {
        const now = Date.now();
        if(now - lastClick < 400){
          openApp(def.app, def.label, def.icon, def.opts ? { opts: def.opts } : {});
        }
        lastClick = now;
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  el.addEventListener('contextmenu', (e) => {
    e.preventDefault(); e.stopPropagation();
    if(!selectedIcons.has(def.id)){ clearIconSelection(); selectIcon(def.id); }
    showContextMenu(e.clientX, e.clientY, iconContextItems(def));
  });
}

function selectIcon(id){ selectedIcons.add(id); syncIconSelectionVisual(); }
function clearIconSelection(){ selectedIcons.clear(); syncIconSelectionVisual(); }
function syncIconSelectionVisual(){
  $$('.desktop-icon').forEach(el=>{
    el.classList.toggle('selected', selectedIcons.has(el.dataset.id));
  });
}

function iconContextItems(def){
  return [
    { label: 'Открыть', action: () => openApp(def.app, def.label, def.icon, def.opts ? { opts: def.opts } : {}) },
    { sep:true },
    { label: 'Вырезать', disabled:true },
    { label: 'Копировать', disabled:true },
    { sep:true },
    { label: 'Создать ярлык', disabled:true },
    { label: 'Удалить', action: () => showErrorDialog(`Не удаётся удалить «${def.label}»: этот объект защищён системой.`) },
    { label: 'Переименовать', disabled:true },
    { sep:true },
    { label: 'Свойства', action: () => showPropertiesDialog(def.label, 'Системный объект') },
  ];
}

/* ---- rubber-band selection on empty desktop ---- */
(function setupRubberBand(){
  const desktop = $('#desktop');
  const box = $('#select-box');
  let sx=0, sy=0, active=false;
  desktop.addEventListener('mousedown', (e) => {
    if(e.target !== desktop && e.target.id !== 'icon-layer' && e.target.id !== 'wallpaper-canvas') return;
    if(e.button !== 0) return;
    hideStartMenu(); closeContextMenu();
    if(!e.ctrlKey) clearIconSelection();
    active = true;
    const r = desktop.getBoundingClientRect();
    sx = e.clientX - r.left; sy = e.clientY - r.top;
    box.style.left=sx+'px'; box.style.top=sy+'px'; box.style.width='0px'; box.style.height='0px';
    box.style.display='block';
    function onMove(ev){
      if(!active) return;
      const r2 = desktop.getBoundingClientRect();
      const cx = ev.clientX - r2.left, cy = ev.clientY - r2.top;
      const x = Math.min(sx,cx), y = Math.min(sy,cy);
      const w = Math.abs(cx-sx), h = Math.abs(cy-sy);
      box.style.left=x+'px'; box.style.top=y+'px'; box.style.width=w+'px'; box.style.height=h+'px';
      const boxRect = { left:x, top:y, right:x+w, bottom:y+h };
      $$('.desktop-icon').forEach(el=>{
        const ex = parseInt(el.style.left), ey = parseInt(el.style.top);
        const eRect = { left:ex, top:ey, right:ex+70, bottom:ey+68 };
        const overlap = !(eRect.left>boxRect.right || eRect.right<boxRect.left || eRect.top>boxRect.bottom || eRect.bottom<boxRect.top);
        if(overlap) selectedIcons.add(el.dataset.id);
      });
      syncIconSelectionVisual();
    }
    function onUp(){
      active = false; box.style.display='none';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  desktop.addEventListener('contextmenu', (e)=>{
    if(e.target !== desktop && e.target.id !== 'icon-layer' && e.target.id !== 'wallpaper-canvas') return;
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, desktopContextItems());
  });
})();

function desktopContextItems(){
  return [
    { label:'Упорядочить значки', arrow:true, submenu:[
      { label:'по имени', action:()=>arrangeIcons() },
      { label:'автоматически', action:()=>arrangeIcons() },
    ]},
    { sep:true },
    { label:'Обновить', action: () => applyWallpaper() },
    { sep:true },
    { label:'Создать', arrow:true, submenu:[
      { label:'Папку', disabled:true },
      { label:'Текстовый документ', disabled:true },
    ]},
    { label:'Вставить', disabled:true },
    { sep:true },
    { label:'Свойства', action: () => openApp('control','Панель управления','controlPanel') },
  ];
}
function arrangeIcons(){
  DEFAULT_ICONS.forEach((def)=>{ iconPositions[def.id] = layoutDefaultPosition(def); });
  save('iconPositions', iconPositions);
  renderIcons();
}

/* ============================================================
   CONTEXT MENUS
   ============================================================ */
/* Delay (ms) before a hovered-away submenu actually closes. Gives
   the cursor time to travel from the parent row into the submenu
   (even diagonally, across the small gap between them) without the
   submenu flickering shut. */
const CTX_SUBMENU_CLOSE_DELAY = 250;

function showContextMenu(x, y, items){
  closeContextMenu();
  const root = $('#context-menu-root');
  const menu = buildMenu(items);
  menu.style.left = x+'px'; menu.style.top = y+'px';
  root.appendChild(menu);
  const r = menu.getBoundingClientRect();
  if(r.right > window.innerWidth) menu.style.left = Math.max(0,x-r.width)+'px';
  if(r.bottom > window.innerHeight-34) menu.style.top = Math.max(0,y-r.height)+'px';
  setTimeout(()=>{
    document.addEventListener('mousedown', outsideCloser, { capture:true });
  },0);
}
function outsideCloser(e){
  if(!e.target.closest('.ctx-menu')){ closeContextMenu(); }
}
function closeContextMenu(){
  $('#context-menu-root').innerHTML = '';
  document.removeEventListener('mousedown', outsideCloser, { capture:true });
}
function buildMenu(items){
  const menu = document.createElement('div');
  menu.className = 'ctx-menu';

  // At most one submenu is ever open for this menu level at a time.
  let activeSub = null;      // the currently open <div class="ctx-submenu">
  let activeSubItem = null;  // the item object it belongs to
  let closeTimer = null;

  function cancelPendingClose(){
    if(closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
  }
  function closeActiveSubNow(){
    cancelPendingClose();
    if(activeSub){ activeSub.remove(); activeSub = null; activeSubItem = null; }
  }
  function scheduleClose(){
    cancelPendingClose();
    closeTimer = setTimeout(()=>{ closeTimer = null; closeActiveSubNow(); }, CTX_SUBMENU_CLOSE_DELAY);
  }
  function openSubFor(it, row){
    cancelPendingClose();
    if(activeSubItem === it) return; // already open for this row
    if(activeSub){ activeSub.remove(); activeSub = null; activeSubItem = null; }
    const sub = buildMenu(it.submenu);
    sub.classList.add('ctx-submenu');
    // Appended into the same root as the top-level menu (not
    // document.body) so a single closeContextMenu() reliably tears
    // down every open submenu at every depth in one shot.
    $('#context-menu-root').appendChild(sub);
    const r = row.getBoundingClientRect();
    sub.style.left = r.right+'px'; sub.style.top = r.top+'px';
    const sr = sub.getBoundingClientRect();
    if(sr.right > window.innerWidth) sub.style.left = Math.max(0, r.left - sr.width)+'px';
    if(sr.bottom > window.innerHeight-34) sub.style.top = Math.max(0, window.innerHeight-34-sr.height)+'px';

    // Hovering the submenu itself keeps it open; leaving it (without
    // returning to the parent row) schedules the same delayed close.
    sub.addEventListener('mouseenter', cancelPendingClose);
    sub.addEventListener('mouseleave', scheduleClose);

    activeSub = sub;
    activeSubItem = it;
  }

  items.forEach(it=>{
    if(it.sep){ const s=document.createElement('div'); s.className='ctx-sep'; menu.appendChild(s); return; }
    const row = document.createElement('div');
    row.className = 'ctx-item' + (it.disabled?' disabled':'');
    row.innerHTML = `<span>${it.label}</span>` + (it.arrow?'<span class="ctx-arrow">▶</span>':'');
    if(it.submenu && !it.disabled){
      row.addEventListener('mouseenter', ()=> openSubFor(it, row));
      row.addEventListener('mouseleave', scheduleClose);
      row.addEventListener('click', (e)=>{ e.stopPropagation(); });
    } else if(!it.disabled){
      // Hovering any sibling row (submenu or not) closes whatever
      // submenu was open — only one submenu may exist at a time, and
      // switching parents (e.g. "Упорядочить значки" -> "Создать")
      // must close the old one immediately.
      row.addEventListener('mouseenter', closeActiveSubNow);
      row.addEventListener('click', (e)=>{ e.stopPropagation(); it.action && it.action(); closeContextMenu(); });
    } else {
      row.addEventListener('mouseenter', closeActiveSubNow);
    }
    menu.appendChild(row);
  });

  return menu;
}


/* ============================================================
   START MENU
   ============================================================ */
const START_ITEMS = [
  { label:'Этот компьютер', icon:'thisPc', app:'mycomputer' },
  { label:'Проводник', icon:'folder', app:'explorer' },
  { label:'Google Chrome', icon:'googleChrome', app:'chrome' },
  { label:'Internet Explorer', icon:'ie', app:'browser' },
  { label:'Блокнот', icon:'notepad', app:'notepad' },
  { label:'Список дел', icon:'todoDoc', app:'notepad', opts:{filename:'todo.txt'} },
  { label:'Калькулятор', icon:'calculator', app:'calculator' },
  { label:'Командная строка', icon:'terminal', app:'terminal' },
  { label:'Telegram', icon:'telegram', app:'telegram' },
  { label:'Discord', icon:'discord', app:'discord' },
  { label:'Steam', icon:'steam', app:'steam' },
  { label:'Игры', icon:'games', app:'games' },
  { sep:true },
  { label:'Панель управления', icon:'controlPanel', app:'control' },
  { sep:true },
  { label:'Завершение работы...', icon:'shutdown', app:'__shutdown' },
];
function renderStartMenu(){
  const box = $('#start-items');
  box.innerHTML = '';
  START_ITEMS.forEach(it=>{
    if(it.sep){ const s=document.createElement('div'); s.className='start-sep'; box.appendChild(s); return; }
    const row = document.createElement('div');
    row.className = 'start-item';
    row.innerHTML = `<span class="si-icon">${iconTag(it.icon, it.label)}</span><span>${it.label}</span>`;
    row.addEventListener('click', ()=>{
      hideStartMenu();
      if(it.app === '__shutdown'){ showShutdownDialog(); }
      else openApp(it.app, it.label, it.icon, it.opts ? { opts: it.opts } : {});
    });
    box.appendChild(row);
  });
}
function toggleStartMenu(){
  const sm = $('#start-menu');
  const willShow = sm.classList.contains('hidden');
  sm.classList.toggle('hidden');
  $('#start-btn').classList.toggle('pressed', willShow);
  if(willShow){
    setTimeout(()=>document.addEventListener('mousedown', startOutsideCloser, {capture:true}),0);
  }
}
function hideStartMenu(){
  $('#start-menu').classList.add('hidden');
  $('#start-btn').classList.remove('pressed');
  document.removeEventListener('mousedown', startOutsideCloser, {capture:true});
}
function startOutsideCloser(e){
  if(!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) hideStartMenu();
}

/* ============================================================
   DIALOGS (message boxes, properties, shutdown)
   ============================================================ */
function showDialog({ title, icon='info', text, buttons }){
  const layer = $('#dialog-layer');
  const dlg = document.createElement('div');
  dlg.className = 'win95-dialog';
  dlg.innerHTML = `
    <div class="dlg-titlebar"><span>${title}</span><span class="wt-btn dlg-close">×</span></div>
    <div class="dlg-body">
      <div class="dlg-icon">${iconTag(icon)}</div>
      <div class="dlg-text">${text}</div>
    </div>
    <div class="dlg-buttons"></div>
  `;
  const btnBox = $('.dlg-buttons', dlg);
  (buttons||[{label:'ОК'}]).forEach(b=>{
    const btn = document.createElement('button');
    btn.textContent = b.label;
    btn.addEventListener('click', ()=>{ dlg.remove(); b.action && b.action(); });
    btnBox.appendChild(btn);
  });
  $('.dlg-close', dlg).addEventListener('click', ()=>dlg.remove());
  layer.appendChild(dlg);
  return dlg;
}
function showErrorDialog(text){
  showDialog({ title:'Ошибка', icon:'errorIcon', text: text, buttons:[{label:'ОК'}] });
}
function showPropertiesDialog(name, type){
  showDialog({
    title:'Свойства', icon:'info',
    text: `<b>Имя:</b> ${name}<br><b>Тип:</b> ${type}<br><b>Расположение:</b> Рабочий стол`,
    buttons:[{label:'ОК'},{label:'Отмена'}]
  });
}
function showShutdownDialog(){
  showDialog({
    title:'Завершение работы Windows', icon:'errorIcon',
    text:'Вы действительно хотите завершить сеанс?',
    buttons:[
      { label:'Да', action: () => doShutdown() },
      { label:'Нет' },
    ]
  });
}
function doShutdown(){
  document.body.innerHTML = '';
  document.body.style.background = '#000';
  document.body.style.display='flex'; document.body.style.alignItems='center'; document.body.style.justifyContent='center';
  document.body.style.color = '#fff'; document.body.style.fontFamily = 'var(--font-ui)'; document.body.style.fontSize='16px';
  const p = document.createElement('div');
  p.textContent = 'Теперь питание вашего компьютера можно отключить.';
  document.body.appendChild(p);
}

/* ============================================================
   WINDOW MANAGER
   ============================================================ */
const windows = {}; // id -> {el, def}
let zTop = 100;
let activeWindowId = null;

function openApp(app, title, icon, opts={}){
  // If singleton and already open, focus it
  const singleKey = opts.singleKey || (opts.opts && (opts.opts.path || opts.opts.filename)) || '';
  if(opts.singleton !== false){
    const existing = Object.values(windows).find(w=>w.app===app && w.singleKey===singleKey);
    if(existing){ focusWindow(existing.id); if(existing.minimized) restoreWindow(existing.id); return existing.id; }
  }
  const id = uid();
  const builder = APP_BUILDERS[app];
  if(!builder){ showErrorDialog(`Не удаётся найти приложение «${title}».`); return; }

  const winW = opts.width || 480, winH = opts.height || 340;
  const offset = (Object.keys(windows).length % 8) * 22;
  const left = opts.left != null ? opts.left : 90 + offset;
  const top = opts.top != null ? opts.top : 50 + offset;

  const winEl = document.createElement('div');
  winEl.className = 'win95-window';
  winEl.style.left = left+'px'; winEl.style.top = top+'px';
  winEl.style.width = winW+'px'; winEl.style.height = winH+'px';
  winEl.innerHTML = `
    <div class="win-titlebar">
      <span class="wt-icon">${iconTag(icon)}</span>
      <span class="wt-text">${title}</span>
      <span class="wt-btn wt-min">_</span>
      <span class="wt-btn wt-max">□</span>
      <span class="wt-btn wt-close">×</span>
    </div>
    <div class="win-content" style="flex:1; display:flex; flex-direction:column; min-height:0;"></div>
    <div class="win-resize-handle"></div>
  `;
  $('#window-layer').appendChild(winEl);

  const rec = { id, app, title, icon, el: winEl, minimized:false, maximized:false, singleKey,
    prevRect: null };
  windows[id] = rec;

  builder($('.win-content', winEl), rec, opts);

  makeWindowDraggable(winEl, rec);
  makeWindowResizable(winEl, rec);
  $('.wt-close', winEl).addEventListener('click', ()=>closeWindow(id));
  $('.wt-min', winEl).addEventListener('click', ()=>minimizeWindow(id));
  $('.wt-max', winEl).addEventListener('click', ()=>toggleMaximize(id));
  winEl.addEventListener('mousedown', ()=>focusWindow(id));

  addTaskbarButton(rec);
  focusWindow(id);
  return id;
}

function focusWindow(id){
  const rec = windows[id]; if(!rec) return;
  Object.values(windows).forEach(w=>w.el.classList.add('inactive'));
  rec.el.classList.remove('inactive');
  rec.el.style.zIndex = ++zTop;
  activeWindowId = id;
  $$('.win-taskbtn').forEach(b=>b.classList.toggle('pressed', b.dataset.id===id));
}
function closeWindow(id){
  const rec = windows[id]; if(!rec) return;
  rec.el.remove();
  const btn = document.querySelector(`.win-taskbtn[data-id="${id}"]`);
  if(btn) btn.remove();
  delete windows[id];
}
function minimizeWindow(id){
  const rec = windows[id]; if(!rec) return;
  rec.el.style.display = 'none';
  rec.minimized = true;
}
function restoreWindow(id){
  const rec = windows[id]; if(!rec) return;
  rec.el.style.display = 'flex';
  rec.minimized = false;
  focusWindow(id);
}
function toggleMaximize(id){
  const rec = windows[id]; if(!rec) return;
  if(!rec.maximized){
    rec.prevRect = { left:rec.el.style.left, top:rec.el.style.top, width:rec.el.style.width, height:rec.el.style.height };
    rec.el.classList.add('maximized');
    rec.maximized = true;
  } else {
    rec.el.classList.remove('maximized');
    Object.assign(rec.el.style, rec.prevRect);
    rec.maximized = false;
  }
  focusWindow(id);
}

function addTaskbarButton(rec){
  const box = $('#taskbar-windows');
  const btn = document.createElement('button');
  btn.className = 'taskbar-btn win-taskbtn';
  btn.dataset.id = rec.id;
  btn.innerHTML = `<span class="tbtn-icon">${iconTag(rec.icon)}</span><span>${rec.title}</span>`;
  btn.addEventListener('click', ()=>{
    if(rec.minimized){ restoreWindow(rec.id); return; }
    if(activeWindowId === rec.id){ minimizeWindow(rec.id); }
    else { focusWindow(rec.id); }
  });
  box.appendChild(btn);
}

function makeWindowDraggable(winEl, rec){
  const bar = $('.win-titlebar', winEl);
  bar.addEventListener('mousedown', (e)=>{
    if(e.target.classList.contains('wt-btn')) return;
    if(rec.maximized) return;
    focusWindow(rec.id);
    const startX = e.clientX, startY = e.clientY;
    const startLeft = parseInt(winEl.style.left), startTop = parseInt(winEl.style.top);
    function onMove(ev){
      let nl = startLeft + (ev.clientX-startX);
      let nt = startTop + (ev.clientY-startY);
      nt = Math.max(0, nt);
      winEl.style.left = nl+'px'; winEl.style.top = nt+'px';
    }
    function onUp(){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
  bar.addEventListener('dblclick', ()=>toggleMaximize(rec.id));
}
function makeWindowResizable(winEl, rec){
  const handle = $('.win-resize-handle', winEl);
  handle.addEventListener('mousedown', (e)=>{
    e.stopPropagation();
    focusWindow(rec.id);
    const startX = e.clientX, startY = e.clientY;
    const startW = winEl.offsetWidth, startH = winEl.offsetHeight;
    function onMove(ev){
      const nw = Math.max(260, startW + (ev.clientX-startX));
      const nh = Math.max(160, startH + (ev.clientY-startY));
      winEl.style.width = nw+'px'; winEl.style.height = nh+'px';
    }
    function onUp(){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

/* helper: build a menubar with dropdowns inside a window */
function buildMenubar(container, menus){
  const bar = document.createElement('div');
  bar.className = 'win-menubar';
  let openMenu = null;
  function closeAll(){ if(openMenu){ openMenu.el.remove(); openMenu.btn.classList.remove('open'); openMenu=null; } }
  menus.forEach(m=>{
    const btn = document.createElement('div');
    btn.className = 'win-menu-item';
    btn.textContent = m.label;
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(openMenu && openMenu.btn === btn){ closeAll(); return; }
      closeAll();
      const menuEl = buildMenu(m.items);
      menuEl.style.position='fixed';
      document.body.appendChild(menuEl);
      const r = btn.getBoundingClientRect();
      menuEl.style.left = r.left+'px'; menuEl.style.top = r.bottom+'px';
      btn.classList.add('open');
      openMenu = { el: menuEl, btn };
      setTimeout(()=>document.addEventListener('mousedown', closeAll, {once:true, capture:true}),0);
    });
    bar.appendChild(btn);
  });
  container.appendChild(bar);
  return bar;
}

/* ============================================================
   VIRTUAL FILE SYSTEM (simple, for Explorer / Мой компьютер)
   ============================================================ */
const VFS = {
  'C:': {
    type:'drive', label:'Диск (C:)',
    children:{
      'Мои документы': { type:'folder', children:{
        'Заметка.txt': { type:'file', kind:'doc' },
        'todo.txt': { type:'file', kind:'doc' },
        'Руководство пользователя.txt': { type:'file', kind:'doc' },
        'квiтанцiя.txt': { type:'file', kind:'doc' },
        'На 2026 рік.txt': { type:'file', kind:'doc' },
        'Фотографии': { type:'folder', children:{} },
      }},
      'Анна Раковец': { type:'folder', children:{
        'Фотографии': { type:'folder', children:{
          '01.jpg': { type:'file', kind:'image', src: ASSETS.photos.annaRakovets[0] },
          '02.jpg': { type:'file', kind:'image', src: ASSETS.photos.annaRakovets[1] },
          '03.jpg': { type:'file', kind:'image', src: ASSETS.photos.annaRakovets[2] },
          '04.jpg': { type:'file', kind:'image', src: ASSETS.photos.annaRakovets[3] },
          '05.jpg': { type:'file', kind:'image', src: ASSETS.photos.annaRakovets[4] },
        }},
        'Любимые моменты': { type:'folder', children:{
          'Твоя улыбка.txt': { type:'file', kind:'doc' },
          'Наши разговоры.txt': { type:'file', kind:'doc' },
          'Наши шутки.txt': { type:'file', kind:'doc' },
          'Когда мы были вместе.txt': { type:'file', kind:'doc' },
          'То за что я тебя люблю.txt': { type:'file', kind:'doc' },
        }},
        '2026': { type:'folder', children:{
          'Наш год.txt': { type:'file', kind:'doc' },
          'Планы.txt': { type:'file', kind:'doc' },
          'Что нас ждёт.txt': { type:'file', kind:'doc' },
          '2026.txt': { type:'file', kind:'doc' },
        }},
        'readme.txt': { type:'file', kind:'doc' },
        'письмо.txt': { type:'file', kind:'doc' },
      }},
      'IOS': { type:'folder', children:{
        'Резервная копия': { type:'folder', children:{} },
        'Фотопоток': { type:'folder', children:{} },
      }},
      'mods': { type:'folder', children:{
        'texture_pack': { type:'folder', children:{} },
        'scripts': { type:'folder', children:{} },
      }},
      'User': { type:'folder', children:{
        'Рабочий стол': { type:'folder', children:{} },
        'Документы': { type:'folder', children:{} },
        'Загрузки': { type:'folder', children:{} },
      }},
      'Tor Browser - копия': { type:'folder', children:{
        'Data': { type:'folder', children:{} },
        'Browser': { type:'folder', children:{} },
      }},
      'Program Files': { type:'folder', children:{
        'Windows': { type:'folder', children:{} },
      }},
      'WINDOWS': { type:'folder', children:{
        'System32': { type:'folder', children:{} },
      }},
    }
  },
  'D:': { type:'drive', label:'Диск (D:)', children:{ 'Игры': { type:'folder', children:{} } } },
};
function vfsResolve(path){
  const parts = path.split('\\').filter(Boolean);
  let node = { children: VFS };
  for(const p of parts){
    if(!node.children || !node.children[p]) return null;
    node = node.children[p];
  }
  return node;
}

/* ============================================================
   APP BUILDERS
   ============================================================ */
const APP_BUILDERS = {};

/* ---- Мой компьютер ---- */
APP_BUILDERS.mycomputer = function(root, rec){
  buildMenubar(root, [
    { label:'Файл', items:[{label:'Закрыть', action:()=>closeWindow(rec.id)}] },
    { label:'Правка', items:[{label:'Копировать', disabled:true}] },
    { label:'Вид', items:[{label:'Крупные значки'},{label:'Список'}] },
    { label:'Справка', items:[{label:'О программе', action:()=>showDialog({title:'О программе', icon:'thisPc', text:'Этот компьютер<br>Microsoft Windows 42'})}] },
  ]);
  const body = document.createElement('div');
  body.className = 'win-body';
  const grid = document.createElement('div');
  grid.className = 'icon-grid';
  const items = [
    { label:'Диск (C:)', icon:'driveIcon', action:()=>openApp('explorer','Проводник — C:\\','folder',{ opts:{path:'C:'}}) },
    { label:'Диск (D:)', icon:'driveIcon', action:()=>openApp('explorer','Проводник — D:\\','folder',{ opts:{path:'D:'}}) },
    { label:'Мои документы', icon:'folder', action:()=>openApp('explorer','Проводник — Мои документы','folder',{opts:{path:'C:\\Мои документы'}}) },
    { label:'Принтеры', icon:'printerIcon', action:()=>showDialog({title:'Принтеры', icon:'printerIcon', text:'Принтеры не установлены.'}) },
    { label:'Сетевое окружение', icon:'network', action:()=>openApp('network','Сетевое окружение','network') },
    { label:'Панель управления', icon:'controlPanel', action:()=>openApp('control','Панель управления','controlPanel') },
  ];
  items.forEach(it=>{
    const el = document.createElement('div');
    el.className = 'grid-item';
    el.innerHTML = `<div class="icon-img">${iconTag(it.icon, it.label)}</div><div class="icon-label">${it.label}</div>`;
    el.addEventListener('dblclick', ()=>it.action());
    el.addEventListener('click', (e)=>{ e.stopPropagation(); $$('.grid-item', grid).forEach(g=>g.classList.remove('selected')); el.classList.add('selected'); });
    grid.appendChild(el);
  });
  body.appendChild(grid);
  root.appendChild(body);
  const sb = document.createElement('div');
  sb.className = 'win-statusbar';
  sb.innerHTML = `<span>Объектов: ${items.length}</span>`;
  root.appendChild(sb);
};

/* ---- Сеть (Сетевое окружение) ---- */
APP_BUILDERS.network = function(root, rec){
  buildMenubar(root, [
    { label:'Файл', items:[{label:'Закрыть', action:()=>closeWindow(rec.id)}] },
    { label:'Вид', items:[{label:'Крупные значки'},{label:'Список'}] },
    { label:'Справка', items:[{label:'О программе', action:()=>showDialog({title:'О программе', icon:'network', text:'Сеть<br>Сетевое окружение Windows 42'})}] },
  ]);
  const body = document.createElement('div');
  body.className = 'win-body';
  const grid = document.createElement('div');
  grid.className = 'icon-grid';
  const items = [
    { label:'Весь сектор сети', icon:'network' },
    { label:'РАБОЧАЯ ГРУППА', icon:'thisPc' },
    { label:'SERVER-01', icon:'thisPc' },
    { label:'SERVER-02', icon:'thisPc' },
  ];
  items.forEach(it=>{
    const el = document.createElement('div');
    el.className = 'grid-item';
    el.innerHTML = `<div class="icon-img">${iconTag(it.icon, it.label)}</div><div class="icon-label">${it.label}</div>`;
    el.addEventListener('dblclick', ()=>showErrorDialog(`Сеть «${it.label}» недоступна.`));
    el.addEventListener('click', (e)=>{ e.stopPropagation(); $$('.grid-item', grid).forEach(g=>g.classList.remove('selected')); el.classList.add('selected'); });
    grid.appendChild(el);
  });
  body.appendChild(grid);
  root.appendChild(body);
  const sb = document.createElement('div');
  sb.className = 'win-statusbar';
  sb.innerHTML = `<span>Объектов: ${items.length}</span>`;
  root.appendChild(sb);
};

/* ---- Корзина ---- */
APP_BUILDERS.bin = function(root, rec){
  const body = document.createElement('div');
  body.className = 'win-body';
  body.innerHTML = `<div style="padding:20px; text-align:center; color:#555;">Корзина пуста.</div>`;
  root.appendChild(body);
};

/* ---- Проводник ---- */
APP_BUILDERS.explorer = function(root, rec, openOpts){
  let path = (openOpts && openOpts.opts && openOpts.opts.path) || 'C:';
  const history = [path]; let histIdx = 0;

  buildMenubar(root, [
    { label:'Файл', items:[{label:'Закрыть', action:()=>closeWindow(rec.id)}] },
    { label:'Правка', items:[{label:'Копировать', disabled:true},{label:'Вставить', disabled:true}] },
    { label:'Вид', items:[{label:'Крупные значки'},{label:'Таблица'}] },
    { label:'Справка', items:[{label:'О программе', action:()=>showDialog({title:'О программе', icon:'folder', text:'Проводник Windows 42'})}] },
  ]);

  const toolbar = document.createElement('div');
  toolbar.className = 'win-toolbar';
  toolbar.innerHTML = `<button class="tb-back">← Назад</button><button class="tb-fwd">Вперёд →</button><button class="tb-up">↑ Вверх</button>`;
  root.appendChild(toolbar);

  const addr = document.createElement('div');
  addr.className = 'win-addressbar';
  addr.innerHTML = `<span>Адрес:</span><input type="text" class="addr-input" readonly>`;
  root.appendChild(addr);

  const body = document.createElement('div');
  body.className = 'win-body';
  root.appendChild(body);

  const sb = document.createElement('div');
  sb.className = 'win-statusbar';
  root.appendChild(sb);

  function nav(p, pushHistory=true){
    path = p;
    if(pushHistory){
      history.splice(histIdx+1);
      history.push(p); histIdx = history.length-1;
    }
    render();
  }
  $('.tb-back', toolbar).addEventListener('click', ()=>{ if(histIdx>0){ histIdx--; nav(history[histIdx], false); } });
  $('.tb-fwd', toolbar).addEventListener('click', ()=>{ if(histIdx<history.length-1){ histIdx++; nav(history[histIdx], false); } });
  $('.tb-up', toolbar).addEventListener('click', ()=>{
    const parts = path.split('\\'); if(parts.length>1){ parts.pop(); nav(parts.join('\\')); }
  });

  function render(){
    $('.addr-input', addr).value = path;
    const node = vfsResolve(path);
    body.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'icon-grid';
    let count = 0;
    if(node && node.children){
      Object.entries(node.children).forEach(([name, child])=>{
        count++;
        const el = document.createElement('div');
        el.className = 'grid-item';
        const isFolder = child.type === 'folder' || child.type === 'drive';
        const isImage = !isFolder && child.kind === 'image';
        const thumbImg = isImage
          ? `<img class="icon-img-tag" src="${child.src}" alt="${name}" draggable="false" onerror="this.onerror=null; this.removeAttribute('src'); this.classList.add('icon-missing');">`
          : iconTag(isFolder?'folder':'doc', name);
        el.innerHTML = `<div class="icon-img">${thumbImg}</div><div class="icon-label">${name}</div>`;
        el.addEventListener('dblclick', ()=>{
          if(isFolder) nav(path + '\\' + name);
          else if(isImage) openApp('photoviewer', name, 'doc', { opts:{ filename:name, src: child.src } });
          else openApp('notepad', name, 'notepad', { opts:{ filename:name } });
        });
        el.addEventListener('click', (e)=>{ e.stopPropagation(); $$('.grid-item', grid).forEach(g=>g.classList.remove('selected')); el.classList.add('selected'); });
        grid.appendChild(el);
      });
    }
    if(count===0){
      const emp = document.createElement('div');
      emp.style.padding = '16px'; emp.style.color='#555';
      emp.textContent = 'Папка пуста.';
      body.appendChild(emp);
    } else {
      body.appendChild(grid);
    }
    sb.innerHTML = `<span>Объектов: ${count}</span>`;
  }
  render();
};

/* ---- Блокнот (Notepad) ---- */
APP_BUILDERS.notepad = function(root, rec, openOpts){
  let filename = (openOpts && openOpts.opts && openOpts.opts.filename) || 'Безымянный.txt';
  const files = load('notepadFiles', {});
  function defaultContentFor(name){

    if(name === 'todo.txt') return '- Проверить электронную почту\r\n- Разобрать Мои документы\r\n- Обновить драйверы принтера\r\n- Позвонить в сервисный центр\r\n';

    if(name === 'Заметка.txt') return 'Не забыть сохранить отчёт на дискету.\r\n';

    if(name === 'Руководство пользователя.txt') return 'РУКОВОДСТВО ПОЛЬЗОВАТЕЛЯ\r\n\r\nДобро пожаловать в Windows 42.\r\n\r\n1. Рабочий стол — дважды щёлкните значок, чтобы открыть программу или файл.\r\n2. Кнопка «Пуск» — открывает меню программ и завершение работы.\r\n3. Панель задач — показывает открытые окна.\r\n4. Правая кнопка мыши — открывает дополнительные действия.\r\n5. Панель управления — позволяет изменить настройки системы.\r\n\r\nЭтот компьютер был создан специально для тебя.\r\n\r\nИмя пользователя: АННА\r\n\r\nНазначение системы: хранить важное.\r\n\r\nЗдесь есть несколько вещей, которые стоит посмотреть.\r\n\r\nНекоторые из них могут оказаться особенно важными. ❤️\r\n\r\nПриятного исследования!\r\n';

    if(name === 'квiтанцiя.txt') return 'КВИТАНЦІЯ\r\n\r\nОплата отримана.\r\n';

    if(name === 'письмо.txt') return 'ПИСЬМО\r\n\r\nЯ долго думал, что можно подарить тебе\r\nтакое, чего ты точно не ожидаешь.\r\n\r\nИ в итоге решил сделать этот маленький компьютер.\r\n\r\nЗдесь нет ничего слишком сложного.\r\nЗдесь просто немного меня.\r\nНемного нас.\r\nНаших фотографий,\r\nнаших воспоминаний\r\nи всего того, что мне хочется сохранить.\r\n\r\nНо это письмо — только начало.\r\n\r\nДальше тебя ждёт ещё кое-что.\r\nТак что не закрывай этот компьютер слишком рано. ❤️\r\n\r\nА пока просто знай:\r\n\r\nя очень рад, что именно ты\r\nстала частью моей жизни.\r\n\r\nС днём рождения, любимая. ❤️\r\n\r\nP.S.\r\nВспомни мои любимые 5 цифр\r\nи введи их в Google Chrome. >:3\r\n';

    if(name === 'readme.txt') return 'READ ME\r\n\r\nПривет, Анна. ❤️\r\n\r\nЕсли ты открыла этот файл в самом начале —\r\nзначит, наше маленькое приключение только начинается.\r\n\r\nА если ты нашла его уже после того,\r\nкак посмотрела почти всё —\r\nзначит, ты действительно решила всё проверить.\r\n\r\nНо не спеши останавливаться.\r\n\r\nЯ специально оставил здесь несколько вещей,\r\nкоторые не лежат прямо перед глазами.\r\n\r\nГде-то спрятана маленькая подсказка,\r\nгде-то — что-то важное,\r\nа где-то просто что-то,\r\nчто я хотел оставить именно тебе.\r\n\r\nВ конце концов,\r\nинтернет любит секреты.\r\n\r\nА этот компьютер —\r\nнемного больше, чем просто компьютер.\r\n\r\nТак что продолжай смотреть,\r\nоткрывай файлы,\r\nзаглядывай в папки\r\nи не пропускай ничего интересного.\r\n\r\nВозможно, самое милое\r\nты ещё не нашла. ❤️\r\n';

    if(name === 'Наш год.txt') return 'НАШ ГОД\r\n\r\nКажется, совсем недавно мы только начинали\r\nузнавать друг друга.\r\n\r\nА теперь у нас уже столько всего,\r\nчто можно было бы заполнить целую папку.\r\n\r\nНаши встречи.\r\nНаши разговоры.\r\nНаши шутки.\r\nНаши маленькие ссоры.\r\nНаши примирения.\r\nИ просто обычные дни,\r\nкоторые почему-то становились особенными,\r\nкогда мы проводили их вместе.\r\n\r\nЭтот год стал нашим.\r\n\r\nИ я надеюсь, что это только первый\r\nиз очень многих таких годов. ❤️\r\n';

    if(name === 'Планы.txt') return 'ПЛАНЫ\r\n\r\n[ ] Любить друг друга.\r\n\r\n[ ] Поддерживать друг друга.\r\n\r\n[ ] Всегда выбирать друг друга.\r\n\r\n[ ] Заботиться друг о друге.\r\n\r\n[ ] Чаще гулять вместе.\r\n\r\n[ ] Смотреть фильмы до позднего вечера.\r\n\r\n[ ] Больше смеяться вместе.\r\n\r\n[ ] Придумывать свои тупые шутки.\r\n\r\n[ ] Делать друг другу маленькие сюрпризы.\r\n\r\n[ ] Чаще говорить «я тебя люблю».\r\n\r\n[ ] Не забывать обнимать друг друга.\r\n\r\n[ ] Помогать друг другу в трудные дни.\r\n\r\n[ ] Радоваться успехам друг друга.\r\n\r\n[ ] Учиться не обижаться по пустякам.\r\n\r\n[ ] Всегда мириться после ссор.\r\n\r\n[ ] Делать больше фотографий вместе.\r\n\r\n[ ] Создать ещё много смешных историй.\r\n\r\n[ ] Побывать вместе в новых местах.\r\n\r\n[ ] Попробовать что-нибудь новое вдвоём.\r\n\r\n[ ] Провести вместе много уютных вечеров.\r\n\r\n[ ] Исполнять маленькие мечты друг друга.\r\n\r\n[ ] Сохранять наши воспоминания.\r\n\r\n[ ] Иногда быть немножко глупыми вместе.\r\n\r\n[ ] Никогда не забывать, почему мы выбрали друг друга.\r\n\r\n[ ] И просто быть счастливыми вместе. ❤️\r\n';

    if(name === 'Что нас ждёт.txt') return 'ЧТО НАС ЖДЁТ\r\n\r\nЕсли всё будет хорошо,\r\nесли мы будем любить друг друга,\r\nподдерживать и выбирать друг друга\r\nнесмотря ни на кого вокруг —\r\n\r\nдумаю, впереди нас ждёт\r\nочень много всего хорошего.\r\n\r\nКогда-нибудь у нас будет\r\nсвоё маленькое место,\r\nгде мы будем жить вместе.\r\n\r\nИ где-нибудь рядом обязательно будет\r\nмилый кот, который будет считать,\r\nчто это вообще-то его дом.\r\n\r\nБудут смешные вечера,\r\nглупые разговоры до ночи,\r\nнаши маленькие традиции\r\nи истории, которые мы будем\r\nрассказывать друг другу снова и снова.\r\n\r\nА потом, может быть,\r\nу нас появится настоящий дом.\r\n\r\nА ещё дальше —\r\nмаленькие детишки,\r\nкоторые будут настолько кончеными,\r\nнасколько мы сами. ❤️\r\n\r\nИ самое главное —\r\nя хочу, чтобы во всех этих планах\r\nмы всё ещё были вместе.\r\n';

    if(name === '2026.txt') return '2026\r\n\r\nЕщё немного —\r\nи мы будем вместе ЦЕЛЫЙ ГОД.\r\n\r\nЦелый год.\r\n\r\nЕсли честно,\r\nэто очень круто.\r\n\r\nЗа это время мы успели\r\nстолько всего пережить,\r\nстолько всего вспомнить\r\nи столько всего создать вместе.\r\n\r\nИ я очень хочу,\r\nчтобы этот год был\r\nдалеко не последним.\r\n\r\nПусть дальше будет ещё больше\r\nвстреч, разговоров, смеха,\r\nобъятий, фотографий\r\nи наших маленьких историй.\r\n\r\nКажется, впереди нас ждёт\r\nещё очень много всего.\r\n\r\nИ это, наверное,\r\nлучшее, что с нами\r\nможет произойти. ❤️\r\n';

    if(name === 'На 2026 рік.txt') return 'Планы на 2026 год:\r\n\r\n[ ] Любить друг друга.\r\n\r\n[ ] Всегда поддерживать друг друга.\r\n\r\n[ ] Заботиться друг о друге.\r\n\r\n[ ] Чаще говорить, как сильно мы любим друг друга.\r\n\r\n[ ] Вместе радоваться даже мелочам.\r\n\r\n[ ] Помогать друг другу в трудные дни.\r\n\r\n[ ] Больше гулять и проводить время вместе.\r\n\r\n[ ] Создать много новых воспоминаний.\r\n\r\n[ ] Меньше ссориться и чаще обнимать друг друга.\r\n\r\n[ ] Всегда оставаться на одной стороне.\r\n\r\n[ ] Сделать этот год особенным.\r\n\r\n----------------------------------------\r\n\r\nГлавный план:\r\n\r\n[ ] Быть счастливыми вместе. ❤️\r\n\r\n----------------------------------------\r\n\r\nИ просто любить друг друга каждый день. ❤️\r\n';
    if(name === 'Твоя улыбка.txt') return 'ТВОЯ УЛЫБКА\r\n\r\nВот я иногда смотрю на тебя,\r\nкогда ты делаешь свою серьёзную мордочку,\r\nи думаю: ну да, очень серьёзная девушка. :)\r\n\r\nНо потом ты улыбаешься —\r\nи всё, я уже сам начинаю улыбаться.\r\n\r\nУ тебя очень приятная улыбка.\r\nКакая-то особенная.\r\nОна почему-то сразу делает мне радостно\r\nи становится так тепло на душе.\r\n\r\nТак что улыбайся почаще.\r\nТебе это очень идёт.\r\n\r\nТы очень мило смотришься, когда улыбаешься. ❤️\r\n';

    if(name === 'Наши разговоры.txt') return 'НАШИ РАЗГОВОРЫ\r\n\r\nМне очень нравится с тобой долго\r\nчто-нибудь обсуждать.\r\n\r\nКогда мы друг другу подкидываем идеи,\r\nпредложения и внезапно уходим\r\nот одной темы к совершенно другой.\r\n\r\nМы можем говорить часами.\r\nИногда о чём-то важном,\r\nа иногда вообще о какой-нибудь ерунде.\r\n\r\nИ мне нравится именно это.\r\nМне нравится, что с тобой не нужно\r\nпридумывать тему для разговора.\r\nМы просто можем говорить.\r\n\r\nНаверное, именно через наши разговоры\r\nя понял, что ты действительно мой человек.\r\nТот, с кем мне хочется делиться мыслями,\r\nидеями и просто своим днём.\r\n\r\nИ я очень хочу,\r\nчтобы таких разговоров у нас было\r\nещё очень-очень много. ❤️\r\n';

    if(name === 'Наши шутки.txt') return 'НАШИ ШУТКИ\r\n\r\n«Раз на раз выйдем? Сношаться будем.»\r\n\r\nНу и как тут вообще объяснить наши шутки? :)\r\n\r\nМне нравится, как мы постоянно\r\nподкалываем друг друга,\r\nа вместо обиды просто придумываем\r\nчто-нибудь ещё смешнее.\r\n\r\nИногда можем вообще устроить\r\nмаленькую сценку из двух персонажей\r\nи настолько в неё вжиться,\r\nчто уже сами не понимаем,\r\nчто вообще происходит.\r\n\r\nА ещё мне нравится,\r\nкогда мы одновременно говорим одно и то же.\r\nКак будто у нас иногда\r\nодна голова на двоих. :D\r\n\r\nС тобой мне просто весело.\r\nМожно быть немного глупыми,\r\nсмеяться с какой-нибудь ерунды\r\nи вообще не думать о том,\r\nкак это выглядит со стороны.\r\n\r\nНаверное, именно поэтому\r\nмне кажется, что мы очень хорошо подходим друг другу. ❤️\r\n';

    if(name === 'Когда мы были вместе.txt') return 'КОГДА МЫ БЫЛИ ВМЕСТЕ\r\n\r\nМне очень нравится быть с тобой.\r\nПросто балдеть рядом, обниматься\r\nи проводить время вместе.\r\n\r\nОсобенно мне запомнился тот день,\r\nкогда мы лежали рядом,\r\nобнимались и засыпали.\r\nБыло так спокойно и уютно,\r\nчто мне очень хотелось,\r\nчтобы этот момент длился подольше.\r\n\r\nМне нравится, когда ты держишь меня за руку\r\nв любой свободный момент.\r\n\r\nМне нравится, когда ты ставишь ножки\r\nмне на коленки или садишься рядом со мной.\r\nМне вообще очень нравятся\r\nтвои маленькие проявления нежности.\r\n\r\nА ещё мне нравится твоя инициатива —\r\nкогда ты сама тянешься ко мне,\r\nсама хочешь быть рядом\r\nи показываешь, что тебе хорошо со мной.\r\n\r\nДля меня такие моменты —\r\nодно из самых приятных,\r\nчто может со мной произойти.\r\n\r\nИ я очень хочу,\r\nчтобы у нас было ещё много таких дней.\r\n\r\nТаких простых,\r\nспокойных и только наших. ❤️';

    if(name === 'То за что я тебя люблю.txt') return 'ТО, ЗА ЧТО Я ТЕБЯ ЛЮБЛЮ\r\n\r\nЯ тебя так люблю, что иногда\r\nвообще не знаю, как это нормально объяснить.\r\n\r\nЛюблю твои милые действия,\r\nтвои маленькие привычки\r\nи моменты, когда ты вдруг\r\nначинаешь вести себя как маленький ребёнок. :)\r\n\r\nЛюблю твою улыбку.\r\nОй боже, как я люблю твою улыбку.\r\nИногда одной твоей улыбки хватает,\r\nчтобы мой день стал намного лучше.\r\n\r\nЛюблю твои глаза.\r\nТы можешь говорить, что они болотные,\r\nно я всё равно считаю их очень красивыми.\r\nТакие большие и милые,\r\nна которые хочется смотреть бесконечно.\r\n\r\nЛюблю твои волосы.\r\nОни такие приятные,\r\nчто иногда хочется просто уткнуться в них\r\nи никуда не уходить.\r\n\r\nНо я люблю тебя не только за внешность.\r\n\r\nЯ люблю твою дурашливость.\r\nТвои шутки.\r\nТвои идеи, которые внезапно появляются\r\nу тебя в голове.\r\n\r\nТы очень творческая девочка,\r\nи мне безумно нравится наблюдать\r\nза тем, что ты придумываешь.\r\n\r\nИ вот где я вообще найду такую, как ты?\r\nНигде.\r\n\r\nТы одна такая.\r\nИменно поэтому я так сильно тебя люблю.\r\n\r\nСпасибо, что ты именно такая,\r\nкакая ты есть. ❤️\r\n';
  const STUB_NOTES = [
    'Как мы познакомились.txt',
    'Наш первый день вместе.txt',
    'Первый подарок.txt',
    'Самый смешной день.txt',
    'День который я никогда не забуду.txt',
    'Твоя улыбка.txt',
    'Наши разговоры.txt',
    'Наши шутки.txt',
    'Когда мы были вместе.txt',
    'То за что я тебя люблю.txt'
  ];

  if(STUB_NOTES.includes(name)) return name.replace(/\.txt$/i,'').toUpperCase() + '\r\n\r\n(этот файл ещё не заполнен)\r\n';

  return '';

}
  function getContent(name){ return files[name] != null ? files[name] : defaultContentFor(name); }
  function setContent(name, val){ files[name] = val; save('notepadFiles', files); }

  buildMenubar(root, [
    { label:'Файл', items:[
      { label:'Создать', action:()=>{ filename = 'Безымянный.txt'; ta.value = ''; } },
      { label:'Открыть...', action:()=>openFileDialog() },
      { label:'Сохранить', action:()=>setContent(filename, ta.value) },
      { sep:true },
      { label:'Выход', action:()=>closeWindow(rec.id) },
    ]},
    { label:'Правка', items:[
      { label:'Отменить', disabled:true },
      { sep:true },
      { label:'Копировать', action:()=>{ ta.focus(); document.execCommand && document.execCommand('copy'); } },
      { label:'Вставить', action:()=>{ ta.focus(); } },
      { label:'Выделить всё', action:()=>{ ta.focus(); ta.select(); } },
    ]},
    { label:'Поиск', items:[ { label:'Найти...', disabled:true } ] },
    { label:'Справка', items:[{label:'О программе', action:()=>showDialog({title:'О программе', icon:'notepad', text:'Блокнот<br>Microsoft Windows 42'})}] },
  ]);
  const body = document.createElement('div');
  body.className = 'win-body';
  const ta = document.createElement('textarea');
  ta.className = 'notepad-textarea';
  ta.value = getContent(filename);
  ta.addEventListener('input', ()=>setContent(filename, ta.value));
  body.appendChild(ta);
  root.appendChild(body);

  function openFileDialog(){
    const docs = (VFS['C:'].children['Мои документы'] || {}).children || {};
    const names = Object.keys(docs).filter(n=>docs[n].type==='file');
    const dlg = showDialog({
      title:'Открытие документа', icon:'folder',
      text: `<div>${names.map(n=>`<div class="of-item" data-name="${n}" style="padding:4px 6px; cursor:default;">${n}</div>`).join('')}</div>`,
      buttons:[{label:'Отмена'}]
    });
    $$('.of-item', dlg).forEach(el=>{
      el.addEventListener('mouseenter', ()=>{ el.style.background='#000080'; el.style.color='#fff'; });
      el.addEventListener('mouseleave', ()=>{ el.style.background=''; el.style.color=''; });
      el.addEventListener('click', ()=>{
        filename = el.dataset.name;
        ta.value = getContent(filename);
        dlg.remove();
      });
    });
  }
};

/* ---- Просмотр рисунков (фото) ---- */
APP_BUILDERS.photoviewer = function(root, rec, openOpts){
  const filename = (openOpts && openOpts.opts && openOpts.opts.filename) || '';
  const src = (openOpts && openOpts.opts && openOpts.opts.src) || '';
  buildMenubar(root, [
    { label:'Файл', items:[{label:'Закрыть', action:()=>closeWindow(rec.id)}] },
    { label:'Вид', items:[{label:'Реальный размер'},{label:'По размеру окна'}] },
    { label:'Справка', items:[{label:'О программе', action:()=>showDialog({title:'О программе', icon:'doc', text:'Просмотр рисунков'})}] },
  ]);
  const body = document.createElement('div');
  body.className = 'win-body';
  body.style.display = 'flex';
  body.style.alignItems = 'center';
  body.style.justifyContent = 'center';
  body.style.background = '#808080';
  body.style.overflow = 'auto';
  body.innerHTML = `<img class="photoviewer-img" src="${src}" alt="${filename}" draggable="false"
       style="max-width:100%; max-height:100%; box-shadow:2px 2px 6px rgba(0,0,0,.4);"
       onerror="this.onerror=null; this.style.display='none'; this.insertAdjacentHTML('afterend', '<div style=\\'color:#eee; font-family:inherit; padding:20px; text-align:center;\\'>Изображение недоступно.</div>');">`;
  root.appendChild(body);
  const sb = document.createElement('div');
  sb.className = 'win-statusbar';
  sb.innerHTML = `<span>${filename}</span>`;
  root.appendChild(sb);
};

/* ---- Калькулятор ---- */
APP_BUILDERS.calculator = function(root, rec){
  const body = document.createElement('div');
  body.className = 'calc-body';
  body.style.flex = '1';
  body.innerHTML = `
    <div class="calc-display" id="calc-disp-${rec.id}">0</div>
    <div class="calc-grid">
      <button data-k="C">C</button><button data-k="CE">CE</button><button data-k="back">←</button><button data-k="/">/</button>
      <button data-k="7">7</button><button data-k="8">8</button><button data-k="9">9</button><button data-k="*">*</button>
      <button data-k="4">4</button><button data-k="5">5</button><button data-k="6">6</button><button data-k="-">-</button>
      <button data-k="1">1</button><button data-k="2">2</button><button data-k="3">3</button><button data-k="+">+</button>
      <button data-k="0" class="wide">0</button><button data-k=".">.</button><button data-k="=">=</button>
    </div>`;
  root.appendChild(body);
  const disp = $(`#calc-disp-${rec.id}`, body);
  let cur = '0', prev = null, op = null, resetNext = false;
  function render(){ disp.textContent = cur; }
  function inputDigit(d){
    if(resetNext){ cur = '0'; resetNext = false; }
    if(d === '.' && cur.includes('.')) return;
    cur = (cur === '0' && d !== '.') ? d : cur + d;
    render();
  }
  function compute(a,b,o){
    a=parseFloat(a); b=parseFloat(b);
    switch(o){ case '+': return a+b; case '-': return a-b; case '*': return a*b; case '/': return b===0?NaN:a/b; }
  }
  $$('.calc-grid button', body).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const k = btn.dataset.k;
      if(/[0-9.]/.test(k)){ inputDigit(k); return; }
      if(k==='C'){ cur='0'; prev=null; op=null; render(); return; }
      if(k==='CE'){ cur='0'; render(); return; }
      if(k==='back'){ cur = cur.length>1 ? cur.slice(0,-1) : '0'; render(); return; }
      if(['+','-','*','/'].includes(k)){
        if(op && prev!=null && !resetNext){ cur = String(compute(prev,cur,op)); }
        prev = cur; op = k; resetNext = true; render(); return;
      }
      if(k==='='){
        if(op && prev!=null){ cur = String(compute(prev,cur,op)); prev=null; op=null; resetNext=true; render(); }
        return;
      }
    });
  });
};

/* ---- Командная строка (Terminal) ---- */
APP_BUILDERS.terminal = function(root, rec){
  const body = document.createElement('div');
  body.className = 'win-body';
  body.style.background = '#000';
  const term = document.createElement('div');
  term.className = 'term-body';
  body.appendChild(term);
  root.appendChild(body);

  function printLine(text){ const d=document.createElement('div'); d.textContent=text; term.insertBefore(d, inputRow); term.scrollTop = term.scrollHeight; }
  const inputRow = document.createElement('div');
  inputRow.className = 'term-line-input';
  inputRow.innerHTML = `<span class="term-prompt">C:\\WINDOWS&gt;</span><input class="term-input" autocomplete="off" spellcheck="false">`;
  term.appendChild(inputRow);
  const input = $('.term-input', inputRow);

  printLine('Microsoft Windows 42 [Версия 4.00.950]');
  printLine('(C) Корпорация Майкрософт, 1981-1995.');
  printLine('');

  const commands = {
    help(){ printLine('Доступные команды:'); printLine(''); ['help','cls','dir','cd','echo','date','time','ver','whoami'].forEach(c=>printLine('  '+c)); },
    cls(){ $$('div', term).forEach(d=>{ if(d!==inputRow) d.remove(); }); },
    dir(){ printLine(' Том в устройстве C: не имеет метки.'); printLine(' Каталог C:\\'); printLine(''); ['Мои документы','Program Files','WINDOWS'].forEach(n=>printLine('  <DIR>   '+n)); },
    cd(arg){ printLine(arg ? ('C:\\'+arg) : 'C:\\'); },
    echo(arg){ printLine(arg||''); },
    date(){ printLine(new Date().toLocaleDateString('ru-RU')); },
    time(){ printLine(new Date().toLocaleTimeString('ru-RU')); },
    ver(){ printLine('Windows 42. [Версия 4.00.950]'); },
    whoami(){ printLine('WIN42\\Пользователь'); },
  };
  input.addEventListener('keydown', (e)=>{
    if(e.key !== 'Enter') return;
    const raw = input.value;
    printLine('C:\\WINDOWS>'+raw);
    input.value='';
    const [cmd, ...rest] = raw.trim().split(' ');
    const arg = rest.join(' ');
    if(!cmd){ return; }
    if(commands[cmd.toLowerCase()]) commands[cmd.toLowerCase()](arg);
    else printLine(`«${cmd}» не является внутренней или внешней командой.`);
    term.scrollTop = term.scrollHeight;
  });
  setTimeout(()=>input.focus(), 50);
  root.addEventListener('mousedown', ()=>setTimeout(()=>input.focus(),0));
};

/* ---- Internet Explorer (local pages) ---- */
const IE_PAGES = {
  'about:home': `<h1>Начальная страница</h1><p>Добро пожаловать в Internet Explorer.</p><p><a data-go="about:news">Новости</a> · <a data-go="about:help">Справка</a></p>`,
  'about:news': `<h1>Новости</h1><p>Сегодня без происшествий. Диск C: в порядке, свободного места достаточно.</p><p><a data-go="about:home">На главную</a></p>`,
  'about:help': `<h1>Справка</h1><p>Используйте кнопки «Назад» и «Вперёд» для перехода между страницами, либо введите адрес и нажмите «Переход».</p><p><a data-go="about:home">На главную</a></p>`,
};
/* ============================================================
   CHROME — "33131" GIFT SEARCH ENGINE
   ------------------------------------------------------------
   A self-contained set of virtual local sites shown ONLY inside
   the Chrome window (passed in as the `gift` argument to
   makeBrowserBuilder below). Internet Explorer and Tor Browser
   keep using plain IE_PAGES and are completely untouched by any
   of this.

   Everything is edited in ONE place — GIFT_CONFIG below. Nothing
   here calls the network; every "site" is just local HTML.
   ============================================================ */
const GIFT_CONFIG = {
  home: 'chrome:home',
  searchQuery: '33131',

  /* Code for the final secret page. Change it here — nothing
     else in the code needs to be touched. */
  secretCode: '2912',

  /* "Анна & Я" — memories shown after the video/photo story ends.
     Each memory has its own `type` (chat / video / video-chat / photos)
     and its own `hint` — the unified "go re-read/re-watch this in our
     real chat" line shown at the bottom of that memory's tab. Replace
     any text/dates here any time; nothing else in the code needs to
     change. */
  annaMemories: [
    {
      key: 'nachalo',
      title: 'НАЧАЛО',
      type: 'chat',
      messages: [
        { from:'anna', text:'Привета, я с дв' },
        { from:'ilya', text:'Привееетк' },
        { from:'ilya', text:'Как зовут?' },
        { from:'anna', text:'Помнишь анкету или скинуть?'},
        { from:'anna', text:'Аня', replyTo:'Как зовут?'  },
        { from:'ilya', text:'Я уже увидел', replyTo:'Помнишь анкету или скинуть?' },
        { from:'anna', text:'Хорошо' },
        { from:'ilya', text:'Илья, на всякий', replyTo:'Аня' },
        { from:'ilya', text:'Хахахах' },
        { from:'anna', text:'Я видела, даже не поленилась почитать' },
        { from:'anna', text:'Ты прикольный челик' },
        { from:'ilya', text:'Спасебе' },
      ],
      hint: '31.10.2025 — Предлагаю вам пересмотреть это в нашем чате \u2764\ufe0f',
    },
    {
      key: 'howItStarted',
      title: 'Как всё начиналось',
      type: 'chat',
      messages: [
        { from:'anna', text:'А то официально пиздануть что я тебе нравлюсь и хочешь со мной отношения и вообще уже будущее по мной построить ты не можешь, а как пиздеть что ревнуешь, как флирт, и тд ты вот тут же. Ты давай мэн определись куда нам, к умным или к красивым' },
        { from:'ilya', text:'Короче мой ответ ты Да мы теперь встречаемся официально ты пиздатая весёлая со своим ебаным характером который мне нравится не нормиска какаято\nМилашка когда хочешь быть\nТакая красивая женщена мне нужна' },
      ],
      caption: 'Было это не так все просто, там было посложнее, предлагаю вам самим почитать.',
      /* Exact date of this conversation — edit here if the real one differs. */
      hint: '19.11.2025 — ПРОШУ вас пересмотреть это в нашем чате \u2764\ufe0f',
    },
    {
      key: 'firstDayTogether',
      title: 'Наш первый день вместе',
      type: 'video',
      video: ASSETS.videos.annaFirstDayTogether,
      caption: 'Есть моменты, которые хочется сохранить не только в памяти.\nЭтот — один из них. \u2764\ufe0f',
      /* No exact date was given for this one — edit here once known. */
      hint: 'Предлагаю вам пересмотреть этот день в нашем чате \u2764\ufe0f',
    },
    {
      key: 'happiestDay',
      title: 'Самый счастливый день',
      type: 'video-chat',
      video: ASSETS.videos.annaHappiestDay,
      messages: [
        { from:'anna', text:'Это бы шикарный день, шикарная прогулка, шикарное всё. Очень хочу чтобы это было по чаще, и по больше времени. Я вполне рада сегодняшней прогулке, и подарки замечательные, это ужасно мило, и они будут в самом ближнем месте находиться, там где всегда на глазах у меня. Сладких снов, щеночек мой, я тебя люблю очень, и счастлива что ты у меня есть, я счастлива что все что связано с тобой, все что я получаю от тебя или то что мы делаем дает мне лишь приятные эмоции и чувства. Крепко тебя обнимаю, очень очень крепко, целую в губки и щечки, надеюсь наша следующая прогулка будет такой же замечательной как и ты сам \u2764\ufe0f\u200d\ud83e\ude79\ud83d\udc8b' },
        { from:'ilya', text:'Спокойны ночки мое солнышко\ud83d\udc8b люблю тебя пиздец как сильно\ud83c\udf53\u2764\ufe0f\u200d\ud83d\udd25\nНадеемся на короткий маринад чтоб след раз могли повторить кайф и увеличить ввиде фоточек и поцелуев долгих\ud83d\udc8b\u2764\ufe0f\u200d\ud83e\ude79\nСладких тебе снов солнце\ud83e\udd70\ud83d\udc9e выспимся с таким охуенным настроением ты у меня самая охуенная и лучшая зайка которую я встречал жду когда мы сьедемся\u2764\ufe0f\u200d\ud83e\ude79\nА так пока гулятки будем моя прекрасная все, не буду отвлекать и тоже пойду спать мне завтра еще тяжелый день, 2 анг которые не готовил и все вещи забрать ничего не забыть.\nЦем цем моя принцеска\ud83d\udc8b' },
      ],
      hint: '19.02.2026 — предлагаю вам пересмотреть все и перечитать.',
    },
    {
      key: 'littleMoments',
      title: 'Наши маленькие моменты',
      type: 'photos',
      photos: ASSETS.photos.annaLittleMoments,
      /* No exact date was given for this one — edit here once known. */
      hint: 'Помнишь эти моменты? Помнишь, как нам было хорошо вместе? \u2764\ufe0f',
    },
    {
      key: 'neverForget',
      title: 'То, что я никогда не забуду',
      type: 'chat',
      messages: [
        { from:'ilya', text:'Будем держать наши отношения до конца да зайка, чтоб не произошло?' },
        { from:'anna', text:'Да' },
        { from:'ilya', text:'Обещаем друг другу?' },
        { from:'anna', text:'Обещаем' },
        { from:'ilya', text:'Обещаем' },
      ],
      hint: '29.12.2025 — предлагаю вам перечитать этот момент.',
    },
  ],

  /* Shown on annalove.local once ALL five memories above have been
     opened at least once. Not a chat message — a separate final page. */
  finalHint: 'Очень надеюсь пересмотреть наш чат в даты указанные в воспоминаниях, хочу чтоб ты вспомнила эти времена те чувства и может поймете как мы поменялись, честно я бы хотел вернуть тех нас которые друг друга отвязаться не могли и слушали разбирались и сдерживали наше совместное обещание быть вместе до конца. Чтоб все были рады в наших отношениях и снова балдели от друг друга.. \u2764\ufe0f\u200d\ud83e\ude79',

  /* "Наше кино" — a live relationship counter, not seasons/episodes.
     Change the start date/time here; everything else recalculates
     automatically and keeps updating in real time. */
  togetherSince: '2025-11-14T00:13:00',

  /* Closing line shown under "Итог:" on "Наше кино". Edit any time. */
  kinoOutro: 'Мы просто продолжаем писать нашу историю. ❤️',

  /* Final celebration scene shown on secret.local after the correct
     code (2912) is entered — cracker/confetti/hearts, then this card.
     Edit the title/text here any time; nothing else needs to change. */
  birthdayCardTitle: 'С ДНЁМ РОЖДЕНИЯ, МОЯ ЛЮБИМАЯ! ❤️',
  birthdayCardText: 'С днём рождения, моя любимая. ❤️\n\nЯ очень долго думал, что же можно сделать для тебя такого, чтобы ты действительно запомнила этот день.\n\nИ в итоге решил сделать вот это маленькое место, которое принадлежит только нам.\n\nТы только что прошла через мой маленький компьютер, открывала разные страницы, смотрела фотографии, видео, читала наши переписки и вспоминала то, что когда-то происходило с нами.\n\nИ, наверное, самое главное для меня во всём этом — не сами фотографии, видео или сайты.\n\nА то, что за каждым из них есть мы.\n\nЕсть моменты, которые я никогда не хочу забывать.\n\nНаши разговоры.\nНаши прогулки.\nНаши шутки.\nНаши ссоры и примирения.\nНаши маленькие приколы.\nНаши обещания.\nНаши чувства.\n\nЯ хочу, чтобы всё это продолжалось.\n\nХочу ещё много фотографий.\nМного прогулок.\nМного разговоров до ночи.\nМного моментов, которые спустя годы мы будем вспоминать и говорить:\n\n«А помнишь, как это было?»\n\nЯ хочу оставаться рядом с тобой.\n\nХочу, чтобы мы продолжали выбирать друг друга даже тогда, когда бывает сложно.\n\nХочу, чтобы мы были верными друг другу, поддерживали друг друга, умели разговаривать и никогда не забывали, почему когда-то выбрали именно друг друга.\n\nСпасибо тебе за то, что ты появилась в моей жизни.\n\nСпасибо за всё хорошее, что связано с тобой.\n\nЯ очень надеюсь, что когда-нибудь спустя много лет мы снова откроем этот маленький компьютер, посмотрим на него и улыбнёмся, потому что будем всё ещё вместе.\n\nИ добавим сюда ещё очень много новых воспоминаний.\n\nЯ люблю тебя.\n\nС днём рождения, мой ты свет. ❤️‍🩹\n\nПусть этот год принесёт тебе много счастья, улыбок, спокойствия и всего того, чего ты действительно хочешь.\n\nА я очень хочу быть рядом и проживать всё это вместе с тобой.\n\nС днём рождения, моя киса. ❤️',

  /* Text shown on the button that appears only once the whole birthday
     card above has actually been read (scrolled to the end). */
  loveButtonText: 'Люблю тебя Киса.. ❤️',

  /* Small screen shown right after the button above is pressed — still
     on the black/falling-hearts background — before the gift button. */
  postCardMessage: 'Ну вот и всё с моей открыткой. ❤️\n\nНо я приготовил для тебя ещё одну маленькую вещь.\n\nТеперь можешь немного поиграть.\n\nА если захочешь — можешь вернуться и снова открыть все наши воспоминания.',
  giftButtonText: 'Открыть подарок 🎁',

  /* "RADIO US" — unrelated to "Наше кино". Real audio files go in
     assets/music/radio-us/ (see ASSETS.songs.radioUs above) — 01.mp3,
     02.mp3, 03.mp3. Edit name/caption for each track here any time;
     nothing else in the code needs to change. */
  songs: [
    { name: 'Bad Boys What You Gonna Do', caption: 'Bad boys bad boys сходи нахуй.' },
    { name: 'Ебать у тебя ноги', caption: 'Кривой хуй 2009. Мы?' },
    { name: 'Я ебу собак', caption: 'Будешь моим щеночком? Буду.' },
  ],

  /* "Наша почта" — the only way in to future.local and secret.local now
     that both are hidden from the 33131 search results. */
  mail: [
    { from: 'Я', subject: 'Я просто хотел сказать...', body: 'Насколько сильно я тебя люблю. Именно поэтому я сделал для тебя этот маленький компьютер. Читай дальше — это ещё не конец. ❤️' },
    { from: 'Я', subject: 'А ты меня любишь?', body: 'Этот вопрос ты иногда мне задаёшь. Были моменты, когда я злился и отвечал: «Да, люблю тебя». А были моменты, когда я с улыбкой и спокойным голосом говорил: «Да, я люблю тебя. И пиздец как люблю». И знай: на этот вопрос я тебе всегда скажу «да». Потому что это правда. Я тебя очень люблю. Если бы не любил, разве я стал бы делать для тебя этот маленький компьютер? Хаха. Люблю тебя, моё ты солнышко. Читай дальше) ❤️' },
    { from: 'Я', subject: 'Открой это последним ❤️', body: 'Спасибо, что дочитала до сюда. Дальше — ещё одна страница.', linkTo: 'future.local', linkLabel: 'Открыть «Наше будущее» →' },
  ],

  futureList: [
    'Остаться вместе',
    'Быть верными',
    'Любить друг друга',
    'Создавать воспоминания',
    'Быть счастливыми',
  ],
};

const GIFT_SITES = [
  { key:'anna',     domain:'annalove.local', label:'Анна & Я',        render: renderGiftAnna },
  { key:'kino',     domain:'ourflix.local',  label:'Наше кино',       render: renderGiftKino },
  { key:'radio',    domain:'radio-us.local', label:'Радио для двоих', render: renderGiftRadio },
  { key:'mail',     domain:'mail.local',     label:'Наша почта',      render: renderGiftMail },
  /* Hidden from the 33131 search results — reachable only through
     links inside "Наша почта" (see GIFT_CONFIG.mail above). Still
     routable here so go('future.local') / go('secret.local') work. */
  { key:'future',   domain:'future.local',   label:'Наше будущее',    render: renderGiftFuture, hidden:true },
  { key:'secret',   domain:'secret.local',   label:'Секретный сайт',  render: renderGiftSecret, hidden:true },
];

/* One shared, scoped stylesheet for every gift page — injected once. */
function ensureGiftStyles(){
  if($('#gift-styles')) return;
  const s = document.createElement('style');
  s.id = 'gift-styles';
  s.textContent = `
    .gift-page{ font-family: Tahoma, Arial, sans-serif; color:#222; padding:14px 18px; height:100%; box-sizing:border-box; overflow:auto; }
    .gift-page a, .gift-page a[data-go]{ color:#0033cc; cursor:pointer; text-decoration:underline; }
    .gift-home{ display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:14px; }
    .gift-home h1{ font-size:34px; margin:0; letter-spacing:1px; }
    .gift-home h1 span{ color:#4285F4; } .gift-home h1 span:nth-child(2){ color:#EA4335; } .gift-home h1 span:nth-child(3){ color:#FBBC05; } .gift-home h1 span:nth-child(4){ color:#4285F4; } .gift-home h1 span:nth-child(5){ color:#34A853; } .gift-home h1 span:nth-child(6){ color:#EA4335; }
    .gift-home form{ display:flex; gap:6px; }
    .gift-home input[type=text]{ width:320px; padding:8px 10px; border:1px solid #999; border-radius:16px; font-size:14px; }
    .gift-home button{ padding:6px 14px; border:1px solid #999; border-radius:14px; background:#f0f0f0; cursor:pointer; }
    .gift-home .gift-hint{ font-size:11px; color:#777; }
    .gift-results h2{ margin:0 0 4px; }
    .gift-results .gift-count{ color:#555; font-size:12px; margin-bottom:14px; }
    .gift-results ul{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; }
    .gift-results li a{ font-size:15px; text-decoration:none; }
    .gift-results li a:hover{ text-decoration:underline; }
    .gift-tabs{ display:flex; gap:6px; margin-bottom:14px; flex-wrap:wrap; }
    .gift-tabs button{ padding:5px 12px; border:1px solid #c9a; border-radius:10px; background:#fff0f5; cursor:pointer; font-size:12px; }
    .gift-tabs button.active{ background:#e75480; color:#fff; }
    .gift-anna{ font-family:'Segoe Print', 'Comic Sans MS', cursive, sans-serif; }
    .gift-anna h1{ color:#c2185b; }
    .gift-anna-stage{ animation: giftFadeIn .45s ease; }
    @keyframes giftFadeIn{ from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:translateY(0); } }
    .gift-anna-start{ text-align:center; padding-top:30px; }
    .gift-anna-start h1{ font-size:26px; }
    .gift-anna-start .gift-anna-sub{ color:#a64a72; margin-bottom:18px; }
    .gift-anna-media{ display:block; max-width:100%; max-height:340px; margin:14px auto; border:4px solid #fff; box-shadow:0 2px 10px rgba(0,0,0,.25); background:#000; }
    .gift-anna-missing{ max-width:420px; height:240px; margin:14px auto; background:#fbe4ec; border:2px dashed #e39ab6; display:flex; align-items:center; justify-content:center; color:#a64a72; font-size:13px; text-align:center; padding:10px; box-sizing:border-box; }
    .gift-anna-caption{ text-align:center; color:#a64a72; font-size:12px; margin-top:-6px; }
    .gift-anna-nav{ display:flex; gap:10px; justify-content:center; margin-top:16px; }
    .gift-anna-nav button{ padding:7px 16px; border:1px solid #e75480; border-radius:14px; background:#fff0f5; color:#a1265a; cursor:pointer; font-size:13px; }
    .gift-anna-nav button:hover{ background:#ffe0ea; }
    .gift-anna-nav button.gift-anna-cta{ background:#e75480; color:#fff; }
    .gift-anna-memories ul{ list-style:none; padding:0; margin:16px 0 0; display:flex; flex-direction:column; gap:0; }
    .gift-anna-memories li{ cursor:pointer; font-size:15px; padding:12px 4px; border-bottom:1px dashed #e3a7c1; }
    .gift-anna-memories li:last-child{ border-bottom:none; }
    .gift-anna-memories li:hover{ text-decoration:underline; }
    .gift-anna-memory-text{ margin-top:14px; line-height:1.6; }
    /* Shared hint line — sits at the bottom of every memory tab, styled
       so it never looks like a chat bubble or a caption. */
    .gift-anna-hint{ margin-top:20px; padding-top:12px; border-top:1px dashed #e3a7c1; text-align:center; color:#a1265a; font-size:12px; font-style:italic; }
    .gift-anna-caption-block{ text-align:center; color:#7a4a5c; font-size:13px; line-height:1.6; margin-top:10px; white-space:pre-line; }
    /* Chat-style memory tabs. */
    .gift-anna-chat{ display:flex; flex-direction:column; gap:10px; margin-top:10px; }
    .gift-anna-chat .gift-msg{ max-width:78%; padding:9px 13px; border-radius:14px; font-size:13px; line-height:1.5; white-space:pre-line; }
    .gift-anna-chat .gift-msg-anna{ align-self:flex-end; background:#e75480; color:#fff; border-bottom-right-radius:3px; }
    .gift-anna-chat .gift-msg-ilya{ align-self:flex-start; background:#f2e3ea; color:#5a2740; border-bottom-left-radius:3px; }
    .gift-anna-chat .gift-msg-who{ display:block; font-size:10px; opacity:.75; margin-bottom:3px; font-weight:bold; }
    /* Optional reply-quote preview shown above a message's own text —
       purely additive, only appears when a message declares replyTo. */
    .gift-anna-chat .gift-msg-reply{ font-size:11px; opacity:.7; padding:4px 8px; margin-bottom:5px; border-left:2px solid currentColor; border-radius:4px; background:rgba(0,0,0,0.08); }
    /* Optional reaction badge shown under a message's own text —
       purely additive, only appears when a message declares reaction. */
    .gift-anna-chat .gift-msg-reaction{ display:inline-block; margin-top:5px; font-size:14px; }
    /* Photo viewer inside a memory tab. */
    .gift-anna-photo-count{ text-align:center; font-size:11px; color:#a64a72; margin-top:-8px; }
    /* Наше кино — live relationship counter. */
    .gift-kino{ background:#141414; color:#eee; margin:-14px -18px; padding:16px; height:100%; box-sizing:border-box; font-family:Arial,sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:22px; }
    .gift-kino h1{ color:#e50914; letter-spacing:1px; margin:0; }
    .gift-kino .gift-kino-since{ color:#aaa; font-size:12px; }
    .gift-kino .gift-kino-main{ font-size:22px; font-weight:bold; }
    .gift-kino .gift-kino-main span{ color:#e50914; }
    .gift-kino .gift-kino-total-label{ color:#999; font-size:12px; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; }
    .gift-kino .gift-kino-grid{ display:flex; gap:14px; flex-wrap:wrap; justify-content:center; }
    .gift-kino .gift-kino-unit{ background:#1f1f1f; border-radius:6px; padding:10px 14px; min-width:64px; }
    .gift-kino .gift-kino-unit b{ display:block; font-size:20px; color:#fff; }
    .gift-kino .gift-kino-unit span{ display:block; font-size:10px; color:#999; text-transform:uppercase; margin-top:2px; }
    .gift-kino .gift-kino-outro{ font-size:14px; color:#eee; font-style:italic; max-width:420px; }
    .gift-radio{ background:linear-gradient(#1a1a2e,#232342); color:#f0f0ff; margin:-14px -18px; padding:24px; height:100%; box-sizing:border-box; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; font-family:Arial,sans-serif; }
    .gift-radio h1{ letter-spacing:2px; }
    .gift-radio .gift-song{ font-size:15px; }
    .gift-radio .gift-caption{ font-size:11px; color:#b3b3ff; font-style:italic; }
    .gift-radio .gift-controls{ display:flex; gap:14px; align-items:center; margin-top:8px; }
    .gift-radio .gift-controls button{ background:none; border:1px solid #7a7ad1; color:#f0f0ff; border-radius:50%; width:34px; height:34px; cursor:pointer; }
    .gift-radio .gift-progress{ width:260px; height:4px; background:#3a3a66; border-radius:2px; margin-top:6px; overflow:hidden; }
    .gift-radio .gift-progress-fill{ height:100%; width:0%; background:#8f8fe0; }
    .gift-radio .gift-volume{ display:flex; gap:10px; align-items:center; margin-top:4px; }
    .gift-radio .gift-volume button{ background:none; border:1px solid #7a7ad1; color:#f0f0ff; border-radius:50%; width:26px; height:26px; cursor:pointer; font-size:13px; }
    .gift-radio .gift-volume-slider{ width:110px; height:4px; -webkit-appearance:none; appearance:none; border-radius:2px; background:#3a3a66; border:none; outline:none; display:block; padding:0; margin:0; box-sizing:border-box; }
    .gift-radio .gift-volume-slider::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; width:12px; height:12px; border-radius:50%; background:#f0f0ff; border:2px solid #8f8fe0; margin-top:-4px; cursor:pointer; }
    .gift-radio .gift-radio-count{ font-size:11px; color:#b3b3ff; opacity:.8; }
    .gift-radio .gift-radio-missing{ font-size:11px; color:#ff9db3; font-style:italic; margin-top:4px; }
    .gift-mail ul{ list-style:none; margin:0; padding:0; }
    .gift-mail li{ border-bottom:1px solid #ccc; padding:8px 4px; cursor:pointer; }
    .gift-mail li:hover{ background:#f0f4ff; }
    .gift-mail .gift-letter-open{ margin-top:14px; padding:12px; border:1px solid #ccc; background:#fffef8; }
    .gift-future{ text-align:center; }
    .gift-future h1{ letter-spacing:2px; }
    .gift-future ul{ list-style:none; padding:0; margin:16px 0; }
    .gift-future li{ padding:4px 0; }
    .gift-future button{ margin-top:16px; padding:8px 18px; border-radius:6px; border:1px solid #888; background:#f5f5f5; cursor:pointer; }
    .gift-future .gift-future-cta{ background:#e75480; color:#fff; border:none; font-size:14px; padding:10px 20px; border-radius:20px; }
    .gift-secret{ background:#0b0b12; color:#ddd; margin:-14px -18px; padding:26px; height:100%; box-sizing:border-box; text-align:center; font-family:Georgia,serif; position:relative; overflow:auto; }
    .gift-secret input{ padding:6px 10px; font-size:14px; text-align:center; }
    .gift-secret button{ padding:6px 16px; margin-left:6px; }
    .gift-secret .gift-secret-msg{ margin-top:12px; font-size:13px; min-height:16px; }
    /* Celebration finale — dim, cracker, confetti/hearts, then the card. */
    .gift-secret-stage{
      position:relative;
      width:100%;
      min-height:100vh;
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      overflow:hidden;
    }
    .gift-secret-dim{ position:absolute; inset:0; background:#000; opacity:0; animation: giftDimIn 1.2s ease forwards; border-radius:8px; }
    .gift-cracker{ position:relative; font-size:60px; z-index:2; opacity:0; animation: giftCrackerAppear .6s ease forwards; }
    .gift-cracker.gift-cracker-pop{ animation: giftCrackerPop .6s ease forwards; }
    .gift-particles{ position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:1; }
    .gift-confetti-piece{ position:absolute; top:35%; width:8px; height:14px; opacity:0; animation-name: giftConfettiFall; animation-timing-function: ease-in; animation-fill-mode: forwards; }
    .gift-heart{ position:absolute; top:55%; font-size:18px; opacity:0; animation-name: giftHeartFloat; animation-timing-function: ease-out; animation-fill-mode: forwards; }
    .gift-card{ position:relative; z-index:2; max-width:480px; padding:26px; border-radius:14px; background:linear-gradient(160deg,#3a1530,#1a0f22 60%,#0b0b12); border:1px solid rgba(255,150,190,.35); box-shadow:0 0 40px rgba(231,84,128,.25); opacity:0; }
    .gift-card.gift-card-in{ animation: giftCardIn 1.4s ease forwards; }
    .gift-card-title{ color:#ff8fab; font-size:22px; margin:0 0 14px; letter-spacing:1px; }
    .gift-card-text{ text-align:left; line-height:1.8; font-size:13px; color:#f2e3ea; white-space:pre-line; max-height:340px; overflow:auto; }
    /* Button only revealed once the card text above has been read to
       the end (see scroll-tracking in playCelebration()). */
    .gift-card-love-btn{ display:block; margin:18px auto 0; padding:9px 20px; font-size:13px; border-radius:20px; border:1px solid rgba(255,150,190,.5); background:#e75480; color:#fff; cursor:pointer; opacity:0; transform:translateY(6px); pointer-events:none; transition:opacity .5s ease, transform .5s ease; }
    .gift-card-love-btn.gift-card-love-btn-in{ opacity:1; transform:translateY(0); pointer-events:auto; }
    /* Small screen shown after the love button, before the gift button. */
    .gift-final{ position:relative; z-index:2; max-width:420px; padding:26px; text-align:center; }
    .gift-final-text{ line-height:1.8; font-size:13px; color:#f2e3ea; white-space:pre-line; }
    .gift-final-btn{ margin-top:20px; padding:10px 22px; font-size:13px; border-radius:20px; border:1px solid rgba(255,150,190,.5); background:#e75480; color:#fff; cursor:pointer; }
    /* Once the card appears the whole stage turns solid black and a
       slow, endless drift of small hearts falls behind everything —
       kept modest in count so the text stays readable. */
    .gift-secret-stage.gift-secret-stage-night{ background:#000; border-radius:8px; }
    .gift-snow-heart{ position:absolute; top:-24px; opacity:0; animation-name: giftSnowFall; animation-timing-function: linear; animation-fill-mode: forwards; pointer-events:none; }
    @keyframes giftDimIn{ from{ opacity:0; } to{ opacity:.35; } }
    @keyframes giftCrackerAppear{ from{ opacity:0; transform:scale(.6); } to{ opacity:1; transform:scale(1); } }
    @keyframes giftCrackerPop{ 0%{ transform:scale(1) rotate(0deg); opacity:1; } 45%{ transform:scale(1.35) rotate(-10deg); opacity:1; } 100%{ transform:scale(.2) rotate(25deg); opacity:0; } }
    @keyframes giftConfettiFall{ 0%{ transform:translateY(-10px) rotate(0deg); opacity:1; } 100%{ transform:translateY(220px) rotate(360deg); opacity:0; } }
    @keyframes giftHeartFloat{ 0%{ transform:translateY(0) scale(.6); opacity:0; } 15%{ opacity:1; } 100%{ transform:translateY(-200px) scale(1.15); opacity:0; } }
    @keyframes giftSnowFall{ 0%{ transform:translateY(0); opacity:0; } 10%{ opacity:.9; } 90%{ opacity:.85; } 100%{ transform:translateY(360px); opacity:0; } }
    @keyframes giftCardIn{ from{ opacity:0; transform:translateY(18px) scale(.96); } to{ opacity:1; transform:translateY(0) scale(1); } }
  `;
  document.head.appendChild(s);
}

function wireGiftLinks(container, go){
  $$('[data-go]', container).forEach(el => el.addEventListener('click', (e)=>{ e.preventDefault(); go(el.dataset.go); }));
}

function renderGiftHome(body, go){
  body.innerHTML = `<div class="gift-page gift-home">
    <h1><span>C</span><span>h</span><span>r</span><span>o</span><span>m</span><span>e</span></h1>
    <form id="gift-home-form">
      <input type="text" id="gift-home-input" autocomplete="off">
      <button type="submit">Поиск</button>
    </form>
    <div class="gift-hint">Введите поисковый запрос или адрес сайта.</div>
  </div>`;
  const form = $('#gift-home-form', body);
  form.addEventListener('submit', (e)=>{ e.preventDefault(); const v = $('#gift-home-input', body).value; if(v) go(v); });
}

function renderGiftSearch(body, go){
  const visible = GIFT_SITES.filter(s => !s.hidden);
  const items = visible.map(s => `<li>♡ <a data-go="${s.domain}">${s.label}</a></li>`).join('');
  body.innerHTML = `<div class="gift-page gift-results">
    <h2>Результаты поиска</h2>
    <div class="gift-count">Найдено: ${visible.length} сайтов</div>
    <ul>${items}</ul>
  </div>`;
  wireGiftLinks(body, go);
}

/* "Анна & Я" — an interactive first-meeting story lived entirely
   inside this one Chrome page:
     start -> video -> photo(0..4) -> memories -> memory(idx)
   Every step re-paints the same .gift-anna-stage container; nothing
   ever opens a new window/tab/site, and Back/Next just move a single
   `stage` pointer back and forth through this same sequence. */
function escapeGiftText(s){
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* Renders one memory's chat bubbles — Аня always on the right, Илья
   always on the left, regardless of what order messages come in. */
function giftChatHtml(messages){
  return `<div class="gift-anna-chat">${messages.map(msg => {
    const isAnna = msg.from === 'anna';
    const who = isAnna ? 'Аня' : 'Илья';
    /* Both fields are optional and only render when a message declares
       them — messages without replyTo/reaction look exactly as before. */
    const replyHtml = msg.replyTo
      ? `<div class="gift-msg-reply">${escapeGiftText(msg.replyTo)}</div>`
      : '';
    const reactionHtml = msg.reaction
      ? `<div class="gift-msg-reaction">${escapeGiftText(msg.reaction)}</div>`
      : '';
    return `<div class="gift-msg ${isAnna ? 'gift-msg-anna' : 'gift-msg-ilya'}"><span class="gift-msg-who">${who}</span>${replyHtml}${escapeGiftText(msg.text)}${reactionHtml}</div>`;
  }).join('')}</div>`;
}

/* The unified "go re-read this in our real chat" line — same visual
   style everywhere, and never mistaken for a chat message or caption. */
function giftHintHtml(hint){
  return hint ? `<div class="gift-anna-hint">${escapeGiftText(hint)}</div>` : '';
}

function renderGiftAnna(body, go){
  const photos = ASSETS.photos.annaFirstMeeting;
  const videoSrc = ASSETS.videos.annaFirstMeeting;
  const MEMORIES = GIFT_CONFIG.annaMemories;
  const OPENED_KEY = 'giftAnnaMemoriesOpened';
  let opened = load(OPENED_KEY, []);

  /* stage is one of: 'start', 'video', 'photo0'..'photo4', 'memories',
     'memory' (single memory, index in memoryIdx) or 'finalHint'. */
  let stage = 'start';
  let memoryIdx = 0;
  let memPhotoIdx = 0; /* sub-index used only by the 'photos'-type memory */

  function mediaBlock(src, isVideo, label){
    const missing = `<div class="gift-anna-missing">${label} — файл ещё не добавлен в проект.</div>`;
    if(!src) return missing;
    return isVideo
      ? `<video class="gift-anna-media" src="${src}" controls playsinline></video>`
      : `<img class="gift-anna-media" src="${src}" alt="${label}">`;
  }

  function markOpened(key){
    if(!opened.includes(key)){
      opened = opened.concat([key]);
      save(OPENED_KEY, opened);
    }
  }
  function allOpened(){
    return MEMORIES.every(m => opened.includes(m.key));
  }

  function renderMemoryBody(m){
    if(m.type === 'chat'){
      return `<h1>${escapeGiftText(m.title)}</h1>
        ${giftChatHtml(m.messages)}
        ${m.caption ? `<div class="gift-anna-caption-block">${escapeGiftText(m.caption)}</div>` : ''}
        ${giftHintHtml(m.hint)}
        <div class="gift-anna-nav"><button data-anna="toMemories">← Назад к воспоминаниям</button></div>`;
    }
    if(m.type === 'video'){
      return `<h1>${escapeGiftText(m.title)}</h1>
        ${mediaBlock(m.video, true, m.title)}
        ${m.caption ? `<div class="gift-anna-caption-block">${escapeGiftText(m.caption)}</div>` : ''}
        ${giftHintHtml(m.hint)}
        <div class="gift-anna-nav"><button data-anna="toMemories">← Назад к воспоминаниям</button></div>`;
    }
    if(m.type === 'video-chat'){
      return `<h1>${escapeGiftText(m.title)}</h1>
        ${mediaBlock(m.video, true, m.title)}
        ${giftChatHtml(m.messages)}
        ${giftHintHtml(m.hint)}
        <div class="gift-anna-nav"><button data-anna="toMemories">← Назад к воспоминаниям</button></div>`;
    }
    /* type === 'photos' */
    const pics = m.photos;
    const isLast = memPhotoIdx === pics.length - 1;
    return `<h1>${escapeGiftText(m.title)}</h1>
      ${mediaBlock(pics[memPhotoIdx], false, `Фото ${memPhotoIdx+1}`)}
      <div class="gift-anna-photo-count">${memPhotoIdx+1} / ${pics.length}</div>
      ${giftHintHtml(m.hint)}
      <div class="gift-anna-nav">
        <button data-anna="photoBack">Назад</button>
        ${isLast
          ? `<button class="gift-anna-cta" data-anna="photoToMemories">К воспоминаниям ❤️</button>`
          : `<button class="gift-anna-cta" data-anna="photoNext">Далее</button>`}
      </div>`;
  }

  function paint(){
    const stageEl = $('.gift-anna-stage', body);
    let html = '';

    if(stage === 'start'){
      html = `<div class="gift-anna-start">
        <h1>АННА & Я ❤️</h1>
        <div class="gift-anna-sub">Наша история</div>
        <div class="gift-anna-nav">
          <button class="gift-anna-cta" data-anna="next">Начать</button>
        </div>
      </div>`;
    } else if(stage === 'video'){
      html = `<h1>IMG_7012.MOV</h1>
        ${mediaBlock(videoSrc, true, 'Видео нашей первой встречи')}
        <div class="gift-anna-caption">Видео нашей первой встречи.</div>
        <div class="gift-anna-nav" id="gift-anna-video-nav"><button data-anna="back">Назад</button></div>`;
    } else if(stage.startsWith('photo')){
      const i = Number(stage.slice(5));
      const isLast = i === photos.length - 1;
      html = `<h1>png ${i+1}</h1>
        ${mediaBlock(photos[i], false, `Фото ${i+1}`)}
        <div class="gift-anna-nav">
          <button data-anna="back">Назад</button>
          ${isLast
            ? `<button class="gift-anna-cta" data-anna="memories">А теперь к воспоминаниям? ❤️</button>`
            : `<button class="gift-anna-cta" data-anna="next">Далее</button>`}
        </div>`;
    } else if(stage === 'memories'){
      html = `<h1>ВОСПОМИНАНИЯ</h1>
        <div class="gift-anna-memories"><ul>${MEMORIES.map((m,i)=>`<li data-mem="${i}">♡ ${escapeGiftText(m.title)}</li>`).join('')}</ul></div>
        ${allOpened() ? `<div class="gift-anna-nav"><button class="gift-anna-cta" data-anna="finalHint">Подсказка ❤️</button></div>` : ''}
        <div class="gift-anna-nav"><button data-anna="back">Назад</button></div>`;
    } else if(stage === 'finalHint'){
      html = `<h1>АННА & Я ❤️</h1>
        <div class="gift-anna-memory-text">${escapeGiftText(GIFT_CONFIG.finalHint).replace(/\n/g,'<br>')}</div>
        <div class="gift-anna-nav"><button data-anna="toStart">← Назад</button></div>`;
    } else { /* single memory */
      html = renderMemoryBody(MEMORIES[memoryIdx]);
    }

    stageEl.classList.remove('gift-anna-stage');
    void stageEl.offsetWidth; /* restart the fade-in animation on every step */
    stageEl.classList.add('gift-anna-stage');
    stageEl.innerHTML = html;
    wire();
  }

  function wire(){
    const stageEl = $('.gift-anna-stage', body);
    const back = () => {
      if(stage === 'video') stage = 'start';
      else if(stage.startsWith('photo')){
        const i = Number(stage.slice(5));
        stage = i === 0 ? 'video' : 'photo' + (i - 1);
      } else if(stage === 'memories'){
        stage = 'photo' + (photos.length - 1);
      }
      paint();
    };
    $$('[data-anna="back"]', stageEl).forEach(b=>b.addEventListener('click', back));
    $$('[data-anna="toMemories"]', stageEl).forEach(b=>b.addEventListener('click', ()=>{ stage = 'memories'; paint(); }));
    $$('[data-anna="memories"]', stageEl).forEach(b=>b.addEventListener('click', ()=>{ stage = 'memories'; paint(); }));
    $$('[data-anna="toStart"]', stageEl).forEach(b=>b.addEventListener('click', ()=>{ stage = 'start'; paint(); }));
    $$('[data-anna="finalHint"]', stageEl).forEach(b=>b.addEventListener('click', ()=>{ stage = 'finalHint'; paint(); }));
    $$('[data-anna="next"]', stageEl).forEach(b=>b.addEventListener('click', ()=>{
      if(stage === 'start') stage = 'video';
      else if(stage.startsWith('photo')){
        const i = Number(stage.slice(5));
        stage = 'photo' + (i + 1);
      }
      paint();
    }));
    $$('[data-mem]', stageEl).forEach(li=>li.addEventListener('click', ()=>{
      memoryIdx = Number(li.dataset.mem);
      memPhotoIdx = 0;
      stage = 'memory';
      markOpened(MEMORIES[memoryIdx].key);
      paint();
    }));
    /* Photo-viewer sub-navigation, used only by the 'photos'-type memory. */
    $$('[data-anna="photoBack"]', stageEl).forEach(b=>b.addEventListener('click', ()=>{
      if(memPhotoIdx === 0){ stage = 'memories'; } else { memPhotoIdx--; }
      paint();
    }));
    $$('[data-anna="photoNext"]', stageEl).forEach(b=>b.addEventListener('click', ()=>{ memPhotoIdx++; paint(); }));
    $$('[data-anna="photoToMemories"]', stageEl).forEach(b=>b.addEventListener('click', ()=>{ stage = 'memories'; paint(); }));

    /* Video: hide "Далее" until playback actually finishes; a missing
       file falls back to a placeholder and unblocks progress right away. */
    const video = $('video.gift-anna-media', stageEl);
    if(video && stage === 'video'){
      const nav = $('#gift-anna-video-nav', stageEl);
      const addNext = () => { if(!$('[data-anna="next"]', nav)){ nav.insertAdjacentHTML('beforeend', '<button class="gift-anna-cta" data-anna="next">Далее</button>'); $('[data-anna="next"]', nav).addEventListener('click', ()=>{ stage='photo0'; paint(); }); } };
      video.addEventListener('ended', addNext);
      video.addEventListener('error', ()=>{ video.outerHTML = `<div class="gift-anna-missing">Видео нашей первой встречи — файл ещё не добавлен в проект.</div>`; addNext(); });
    }
    $$('img.gift-anna-media', stageEl).forEach(img => {
      img.addEventListener('error', ()=>{ img.outerHTML = `<div class="gift-anna-missing">Фото ещё не добавлено в проект.</div>`; });
    });
  }

  body.innerHTML = `<div class="gift-page gift-anna"><div class="gift-anna-stage"></div></div>`;
  paint();
}

/* Calendar-aware breakdown of the time elapsed since `sinceMs`,
   used both for the headline ("9 месяцев 14 дней 2 часа") and for the
   raw totals shown underneath. Nothing here is a fixed number — it is
   recomputed on every tick from the real current time. */
function giftElapsedSince(sinceMs){
  const since = new Date(sinceMs);
  const now = new Date();
  let diff = now.getTime() - since.getTime();
  if(diff < 0) diff = 0;

  let months = (now.getFullYear() - since.getFullYear()) * 12 + (now.getMonth() - since.getMonth());
  let days = now.getDate() - since.getDate();
  let hours = now.getHours() - since.getHours();
  let minutes = now.getMinutes() - since.getMinutes();
  let seconds = now.getSeconds() - since.getSeconds();
  if(seconds < 0){ seconds += 60; minutes--; }
  if(minutes < 0){ minutes += 60; hours--; }
  if(hours < 0){ hours += 24; days--; }
  if(days < 0){
    const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += daysInPrevMonth;
    months--;
  }
  if(months < 0) months = 0;

  const totalDays = Math.floor(diff / 86400000);
  return {
    months, days, hours, minutes, seconds,
    totalMonths: months,
    totalWeeks: Math.floor(totalDays / 7),
    totalDays,
    totalHours: Math.floor(diff / 3600000),
    totalMinutes: Math.floor(diff / 60000),
    totalSeconds: Math.floor(diff / 1000),
    totalMs: diff,
  };
}

function giftPluralRu(n, one, few, many){
  const mod10 = n % 10, mod100 = n % 100;
  if(mod10 === 1 && mod100 !== 11) return one;
  if(mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function renderGiftKino(body, go){
  const sinceMs = new Date(GIFT_CONFIG.togetherSince).getTime();
  const sinceLabel = (() => {
    const d = new Date(sinceMs);
    const pad = n => String(n).padStart(2,'0');
    return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  })();

  body.innerHTML = `<div class="gift-page gift-kino">
    <h1>Наше кино</h1>
    <div>
      <div>Которое началось</div>
      <div class="gift-kino-since">${sinceLabel}</div>
    </div>
    <div>Мы вместе уже как:</div>
    <div class="gift-kino-main" id="gift-kino-main"></div>
    <div class="gift-kino-total-label">Всего:</div>
    <div class="gift-kino-grid" id="gift-kino-grid"></div>
    <div class="gift-kino-total-label">Итог:</div>
    <div class="gift-kino-outro">${escapeGiftText(GIFT_CONFIG.kinoOutro)}</div>
  </div>`;

  const mainEl = $('#gift-kino-main', body);
  const gridEl = $('#gift-kino-grid', body);

  function tick(){
    if(!document.body.contains(body)){ clearInterval(iv); return; }
    const e = giftElapsedSince(sinceMs);
    mainEl.innerHTML = `<span>${e.months}</span> ${giftPluralRu(e.months,'месяц','месяца','месяцев')} `
      + `<span>${e.days}</span> ${giftPluralRu(e.days,'день','дня','дней')} `
      + `<span>${e.hours}</span> ${giftPluralRu(e.hours,'час','часа','часов')} `
      + `<span>${e.minutes}</span> ${giftPluralRu(e.minutes,'минута','минуты','минут')} `
      + `<span>${e.seconds}</span> ${giftPluralRu(e.seconds,'секунда','секунды','секунд')}`;
    const units = [
      [e.totalMonths, 'месяцев'],
      [e.totalWeeks, 'недель'],
      [e.totalDays, 'дней'],
      [e.totalHours, 'часов'],
      [e.totalMinutes, 'минут'],
      [e.totalSeconds, 'секунд'],
      [e.totalMs, 'мс'],
    ];
    gridEl.innerHTML = units.map(([val,label])=>`<div class="gift-kino-unit"><b>${val.toLocaleString('ru-RU')}</b><span>${label}</span></div>`).join('');
  }
  tick();
  /* Updates every 50ms — smooth enough to see milliseconds moving
     without redrawing the whole page 1000 times a second. */
  const iv = setInterval(tick, 50);
}


function renderGiftRadio(body, go){
  const TRACKS = GIFT_CONFIG.songs;
  const SRCS = ASSETS.songs.radioUs;
  let idx = 0;
  const audio = new Audio();
  audio.preload = 'metadata';
  let volume = load('radioVolume', 70); /* 0-100, remembered like other settings (wallpaper, sound) */
  audio.volume = volume / 100;
  let missing = false;

  function paint(){
    const t = TRACKS[idx];
    body.innerHTML = `<div class="gift-page gift-radio">
      <h1>RADIO US ♡</h1>
      <div class="gift-radio-count">${idx+1} / ${TRACKS.length}</div>
      <div>Сейчас играет:</div>
      <div class="gift-song">${escapeGiftText(t.name)}</div>
      <div class="gift-caption">«${escapeGiftText(t.caption)}»</div>
      <div class="gift-controls">
        <button id="gift-radio-prev">◀</button>
        <button id="gift-radio-play">▶</button>
        <button id="gift-radio-next">▶</button>
      </div>
      <div class="gift-progress"><div class="gift-progress-fill" id="gift-radio-fill"></div></div>
      <div class="gift-radio-missing" id="gift-radio-missing" style="display:none;">Файл трека ещё не добавлен в проект.</div>
      <div class="gift-volume">
        <button id="gift-radio-vol-down">🔉</button>
        <input type="range" class="gift-volume-slider" id="gift-radio-vol-slider" min="0" max="100" step="1">
        <button id="gift-radio-vol-up">🔊</button>
        <span class="gift-volume-pct" id="gift-radio-vol-pct"></span>
      </div>
    </div>`;

    const fill = $('#gift-radio-fill', body);
    const missingEl = $('#gift-radio-missing', body);
    const playBtn = $('#gift-radio-play', body);
    const volSlider = $('#gift-radio-vol-slider', body);
    const volPct = $('#gift-radio-vol-pct', body);

    function paintVolume(){
      volSlider.value = volume;
      volPct.textContent = volume + '%';
    }
    function setVolume(v){
      volume = Math.max(0, Math.min(100, Math.round(v)));
      audio.volume = volume / 100;
      save('radioVolume', volume);
      paintVolume();
    }
    /* keep the slider, the audio element and the saved setting all in
       sync from the very first paint — this is what was drifting before */
    setVolume(volume);
    volSlider.addEventListener('input', ()=> setVolume(Number(volSlider.value)));
    $('#gift-radio-vol-up', body).addEventListener('click', ()=> setVolume(volume + 10));
    $('#gift-radio-vol-down', body).addEventListener('click', ()=> setVolume(volume - 10));

    audio.pause();
    audio.src = SRCS[idx] || '';
    missing = false;
    playBtn.textContent = '▶';

    audio.onerror = ()=>{
      missing = true;
      missingEl.style.display = '';
      playBtn.disabled = true;
    };
    audio.ontimeupdate = ()=>{
      if(audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    };
    audio.onended = ()=>{
      playBtn.textContent = '▶';
      fill.style.width = '0%';
    };

    playBtn.addEventListener('click', ()=>{
      if(missing) return;
      if(audio.paused){
        audio.play();
        playBtn.textContent = '❚❚';
      } else {
        audio.pause();
        playBtn.textContent = '▶';
      }
    });

    function switchTrack(newIdx){
      idx = (newIdx + TRACKS.length) % TRACKS.length;
      paint();
    }
    $('#gift-radio-prev', body).addEventListener('click', ()=> switchTrack(idx - 1));
    $('#gift-radio-next', body).addEventListener('click', ()=> switchTrack(idx + 1));
  }

  paint();

  /* The Audio object lives outside the DOM, so closing this window
     wouldn't stop it on its own — same isConnected-watcher pattern
     used elsewhere in this file (e.g. the Tamagotchi timers). This
     covers the whole browser window being closed. */
  const stopWatcher = setInterval(()=>{
    if(!body.isConnected){
      audio.pause();
      clearInterval(stopWatcher);
    }
  }, 500);

  /* Navigating to a different page inside the SAME browser window
     (e.g. clicking another RADIO US link, going back, typing a new
     address) reuses this same `body` element and just overwrites its
     innerHTML — it never becomes disconnected, so the watcher above
     wouldn't catch it and the music would keep playing in the
     background. `render()` in makeBrowserBuilder calls body._cleanup
     right before rendering the next page, so register one here. */
  body._cleanup = ()=>{
    audio.pause();
    clearInterval(stopWatcher);
  };
}

function renderGiftMail(body, go){
  function paint(openIdx){
    const list = GIFT_CONFIG.mail.map((m,i)=>`<li data-idx="${i}">✉ От: ${m.from}<br><b>${m.subject}</b></li>`).join('');
    let openHtml = '';
    if(openIdx !== undefined){
      const m = GIFT_CONFIG.mail[openIdx];
      openHtml = `<div class="gift-letter-open"><div><b>${m.subject}</b></div><p>${m.body}</p>${m.linkTo ? `<p><a data-go="${m.linkTo}">${m.linkLabel}</a></p>` : ''}</div>`;
    }
    $('.gift-page', body).innerHTML = `<h1>Почта</h1><p>Входящие:</p><ul>${list}</ul>${openHtml}`;
    $$('li[data-idx]', body).forEach(el=>el.addEventListener('click', ()=>paint(Number(el.dataset.idx))));
    wireGiftLinks(body, go);
  }
  body.innerHTML = `<div class="gift-page gift-mail"></div>`;
  paint(undefined);
}

function renderGiftFuture(body, go){
  body.innerHTML = `<div class="gift-page gift-future">
    <h1>НАШЕ БУДУЩЕЕ</h1>
    <div>2026</div>
    <ul>${GIFT_CONFIG.futureList.map(x=>`<li>♡ ${x}</li>`).join('')}</ul>
    <div>А дальше?</div>
    <div>[ Пока неизвестно ]</div>
    <p>Но я хочу узнать это вместе с тобой.</p>
    <button class="gift-future-cta" data-go="secret.local">Я готова узнать последнее ❤️</button>
  </div>`;
  wireGiftLinks(body, go);
}

function renderGiftSecret(body, go){
  body.innerHTML = `<div class="gift-page gift-secret">
    <div class="gift-secret-form">
      <h1>СЕКРЕТНЫЙ САЙТ</h1>
      <p>Последний шаг.</p>
      <p>Введите код:</p>
      <div><input type="text" id="gift-secret-input"><button id="gift-secret-ok">Открыть</button></div>
      <div class="gift-secret-msg" id="gift-secret-msg"></div>
    </div>
    <div class="gift-secret-stage" id="gift-secret-stage" hidden></div>
  </div>`;

  function check(){
    const val = $('#gift-secret-input', body).value.trim();
    const msg = $('#gift-secret-msg', body);
    if(val === GIFT_CONFIG.secretCode){
      $('.gift-secret-form', body).style.display = 'none';
      playCelebration();
    } else {
      msg.innerHTML = 'Доступ запрещён.<br><br>Подсказка. То, что я никогда не забуду. 4 цифры.';
    }
  }
  $('#gift-secret-ok', body).addEventListener('click', check);
  $('#gift-secret-input', body).addEventListener('keydown', (e)=>{ if(e.key==='Enter') check(); });

  /* Secret.local's finale: a slow, unhurried dim -> cracker -> confetti
     + hearts -> birthday card sequence, followed by a black background
     with small hearts endlessly falling like snow. The card only shows
     its "continue" button once the whole text has actually been read;
     pressing it swaps in a short closing message and a gift button that
     opens the tamagotchi as a normal window on the Windows 42 desktop. */
  function playCelebration(){
    const stage = $('#gift-secret-stage', body);
    stage.hidden = false;
    stage.innerHTML = `
      <div class="gift-secret-dim"></div>
      <div class="gift-cracker" id="gift-cracker">🎉</div>
      <div class="gift-particles" id="gift-particles"></div>
      <div class="gift-card" id="gift-card" hidden>
        <h1 class="gift-card-title">${escapeGiftText(GIFT_CONFIG.birthdayCardTitle)}</h1>
        <div class="gift-card-text" id="gift-card-text">${escapeGiftText(GIFT_CONFIG.birthdayCardText)}</div>
        <button class="gift-card-love-btn" id="gift-card-love-btn">${escapeGiftText(GIFT_CONFIG.loveButtonText)}</button>
      </div>`;

    const particles = $('#gift-particles', stage);
    const confettiColors = ['#ff8fab','#ffd166','#ff5c8a','#fff2cc','#e75480','#ffffff'];

    function burst(){
      /* Confetti pieces. */
      for(let i=0;i<40;i++){
        const p = document.createElement('div');
        p.className = 'gift-confetti-piece';
        p.style.left = (5 + Math.random()*90) + '%';
        p.style.background = confettiColors[Math.floor(Math.random()*confettiColors.length)];
        p.style.animationDelay = (Math.random()*0.4) + 's';
        p.style.animationDuration = (1.6 + Math.random()*1.2) + 's';
        p.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`;
        particles.appendChild(p);
      }
      /* Floating hearts. */
      for(let i=0;i<10;i++){
        const h = document.createElement('div');
        h.className = 'gift-heart';
        h.textContent = ['❤️','💕','💗','🩷'][Math.floor(Math.random()*4)];
        h.style.left = (15 + Math.random()*70) + '%';
        h.style.animationDelay = (Math.random()*0.6) + 's';
        h.style.animationDuration = (2.2 + Math.random()*1.4) + 's';
        particles.appendChild(h);
      }
    }

    /* Small, endless snow of hearts once the stage has gone black.
       A handful of glyphs mixed together, kept small so the card text
       stays easy to read; one heart roughly every 700ms, each one
       removes itself once its fall animation ends. */
    const snowGlyphs = ['❤️','♡','♥','🩷','🤍'];
    let snowTimer = null;
    function startSnow(){
      if(snowTimer) return;
      snowTimer = setInterval(()=>{
        if(!stage.isConnected){ clearInterval(snowTimer); snowTimer = null; return; }
        const h = document.createElement('div');
        h.className = 'gift-snow-heart';
        h.textContent = snowGlyphs[Math.floor(Math.random()*snowGlyphs.length)];
        h.style.left = (2 + Math.random()*96) + '%';
        h.style.fontSize = (10 + Math.random()*8) + 'px';
        h.style.animationDuration = (5 + Math.random()*4) + 's';
        h.addEventListener('animationend', ()=>h.remove());
        particles.appendChild(h);
      }, 700);
    }

    /* Timeline — deliberately unhurried. */
    setTimeout(()=>{ $('#gift-cracker', stage).classList.add('gift-cracker-pop'); burst(); }, 900);
    setTimeout(()=>{ const c = $('#gift-cracker', stage); if(c) c.remove(); }, 1500);
    setTimeout(()=>{
      stage.classList.add('gift-secret-stage-night');
      startSnow();
      const card = $('#gift-card', stage);
      card.hidden = false;
      void card.offsetWidth;
      card.classList.add('gift-card-in');
      wireReadTracking();
    }, 3200);

    /* Reveals the love button only once the card text has genuinely
       been scrolled to its end (or never needed scrolling at all). */
    function wireReadTracking(){
      const textEl = $('#gift-card-text', stage);
      const loveBtn = $('#gift-card-love-btn', stage);
      function checkRead(){
        const reachedEnd = textEl.scrollHeight - textEl.clientHeight <= 4
          || textEl.scrollTop + textEl.clientHeight >= textEl.scrollHeight - 4;
        if(reachedEnd) loveBtn.classList.add('gift-card-love-btn-in');
      }
      textEl.addEventListener('scroll', checkRead);
      setTimeout(checkRead, 300);
      loveBtn.addEventListener('click', showPostCardMessage);
    }

    /* Step after "Люблю тебя Киса.. ❤️" — a short closing message,
       still on the black/falling-hearts background, ending in the
       gift button that opens the tamagotchi window. */
    function showPostCardMessage(){
      const card = $('#gift-card', stage);
      card.classList.remove('gift-card-in');
      card.hidden = true;
      const final = document.createElement('div');
      final.className = 'gift-final';
      final.innerHTML = `
        <div class="gift-final-text">${escapeGiftText(GIFT_CONFIG.postCardMessage)}</div>
        <button class="gift-final-btn" id="gift-final-btn">${escapeGiftText(GIFT_CONFIG.giftButtonText)}</button>`;
      stage.appendChild(final);
      void final.offsetWidth;
      final.style.opacity = '0';
      final.style.transition = 'opacity 1s ease';
      requestAnimationFrame(()=>{ final.style.opacity = '1'; });
      $('#gift-final-btn', final).addEventListener('click', openTamagotchiGift);
    }

    /* Opens the tamagotchi as a regular, movable Windows 42 window,
       roughly centered on the desktop. Does not touch or hide the
       rest of the desktop/taskbar/Chrome in any way. */
    function openTamagotchiGift(){
      const winW = 380, winH = 560;
      const deskRect = $('#desktop') ? $('#desktop').getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const left = Math.max(20, Math.round((deskRect.width - winW) / 2));
      const top = Math.max(20, Math.round((deskRect.height - winH) / 2));
      openApp('tamagotchi', 'Мой маленький тамагочи ❤️', 'tamagotchi', { width: winW, height: winH, left, top });
    }
  }
}

/* Entry point used by makeBrowserBuilder: handles a url if it is
   part of the gift network, otherwise returns falsy so the caller
   falls back to the normal IE_PAGES / "page not found" behaviour. */
function giftRender(url, go, body){
  ensureGiftStyles();
  if(url === GIFT_CONFIG.home){ renderGiftHome(body, go); return true; }
  if(url === GIFT_CONFIG.searchQuery){ renderGiftSearch(body, go); return true; }
  const site = GIFT_SITES.find(s => s.domain === url);
  if(site){ site.render(body, go); return true; }
  return false;
}

/* Shared browser engine — Chrome and Tor Browser both reuse
   this exact implementation (one program, several shortcuts/skins),
   they only differ in title/icon/about-text so each still looks
   like its own application. `gift`, when passed, is the only thing
   that adds the extra local search-network behaviour (used for
   Chrome only) — IE and Tor call this with no 4th argument and are
   completely unaffected. */
function makeBrowserBuilder(aboutName, iconName, gift){
  return function(root, rec){
    let url = gift ? gift.home : 'about:home';
    buildMenubar(root, [
      { label:'Файл', items:[{label:'Закрыть', action:()=>closeWindow(rec.id)}] },
      { label:'Правка', items:[{label:'Копировать', disabled:true}] },
      { label:'Вид', items:[{label:'Обновить', action:()=>render()}] },
      { label:'Избранное', items:[{label:'Добавить в избранное', disabled:true}] },
      { label:'Сервис', items:[{label:'Свойства обозревателя', disabled:true}] },
      { label:'Справка', items:[{label:'О программе', action:()=>showDialog({title:'О программе', icon:iconName, text:aboutName})}] },
    ]);
    const toolbar = document.createElement('div');
    toolbar.className = 'win-toolbar';
    toolbar.innerHTML = `<button class="ie-back">←</button><button class="ie-fwd">→</button><button class="ie-refresh">↻</button><button class="ie-home">Домой</button>`;
    root.appendChild(toolbar);
    const addr = document.createElement('div');
    addr.className = 'win-addressbar';
    addr.innerHTML = `<span>Адрес:</span><input type="text" class="addr-input"><button class="ie-go">Переход</button>`;
    root.appendChild(addr);
    const body = document.createElement('div');
    body.className = 'win-body';
    root.appendChild(body);

    const hist = [url]; let idx = 0;
    function render(){
      $('.addr-input', addr).value = url;
      /* A page like RADIO US may have registered a cleanup (stopping
         its music, clearing its timers) — run it before wiping the
         body for the next page, and before leaving this page in any
         other way (back/forward, address bar, home, refresh). */
      if(typeof body._cleanup === 'function'){ body._cleanup(); body._cleanup = null; }
      if(gift && giftRender(url, go, body)) return;
      const page = IE_PAGES[url];
      body.innerHTML = `<div class="ie-page">${page || `<h1>Страница не найдена</h1><p>Не удаётся отобразить страницу «${url}».</p>`}</div>`;
      $$('a[data-go]', body).forEach(a=>a.addEventListener('click', ()=>go(a.dataset.go)));
    }
    function go(u, push=true){
      url = gift ? String(u).trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/+$/,'') : u;
      if(push){ hist.splice(idx+1); hist.push(url); idx = hist.length-1; }
      render();
    }
    $('.ie-back', toolbar).addEventListener('click', ()=>{ if(idx>0){ idx--; go(hist[idx], false); } });
    $('.ie-fwd', toolbar).addEventListener('click', ()=>{ if(idx<hist.length-1){ idx++; go(hist[idx], false); } });
    $('.ie-refresh', toolbar).addEventListener('click', render);
    $('.ie-home', toolbar).addEventListener('click', ()=>go(gift ? gift.home : 'about:home'));
    $('.ie-go', addr).addEventListener('click', ()=>go($('.addr-input',addr).value));
    $('.addr-input', addr).addEventListener('keydown', (e)=>{ if(e.key==='Enter') go(e.target.value); });
    render();
  };
}
APP_BUILDERS.browser = makeBrowserBuilder('Microsoft Internet Explorer', 'ie');
APP_BUILDERS.chrome   = makeBrowserBuilder('Google Chrome', 'googleChrome', GIFT_CONFIG);
APP_BUILDERS.tor      = makeBrowserBuilder('Tor Browser', 'torBrowser');

/* ---- Telegram ---- */
APP_BUILDERS.telegram = function(root, rec){
  const body = document.createElement('div');
  body.className = 'win-body';
  body.style.display='flex'; body.style.flexDirection='column';
  const log = document.createElement('div');
  log.style.flex='1'; log.style.overflow='auto'; log.style.padding='8px'; log.style.background='#fff';
  body.appendChild(log);
  const row = document.createElement('div');
  row.style.display='flex'; row.style.borderTop='1px solid #808080'; row.style.padding='4px'; row.style.gap='4px';
  row.innerHTML = `<input type="text" style="flex:1; padding:4px;" placeholder="Введите сообщение"><button>Отправить</button>`;
  body.appendChild(row);
  root.appendChild(body);
  function addMsg(who, text){
    const d = document.createElement('div');
    d.style.margin='4px 0';
    d.innerHTML = `<b>${who}:</b> ${text}`;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }
  addMsg('Система', 'Установлено соединение с сервером.');
  const input = $('input', row);
  function send(){
    if(!input.value.trim()) return;
    addMsg('Вы', input.value);
    input.value='';
    setTimeout(()=>addMsg('Собеседник', 'Сообщение получено.'), 500);
  }
  $('button', row).addEventListener('click', send);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') send(); });
};

/* ---- Discord ---- */
APP_BUILDERS.discord = function(root, rec){
  const SERVERS = ['W95','Друзі'];
  const CHANNELS = { 'W95':['#загальний','#допомога'], 'Друзі':['#чат'] };
  let activeServer = SERVERS[0], activeChannel = CHANNELS[activeServer][0];
  const chatHistory = load('discordChats', {});
  function key(){ return activeServer+'|'+activeChannel; }
  function historyFor(){ const k=key(); if(!chatHistory[k]) chatHistory[k] = [{who:'Система', text:'З’єднання з сервером встановлено.'}]; return chatHistory[k]; }

  const body = document.createElement('div');
  body.className = 'win-body';
  body.innerHTML = `
    <div class="discord-body">
      <div class="discord-servers"></div>
      <div class="discord-channels"></div>
      <div class="discord-main">
        <div class="chat-log"></div>
        <div class="chat-row"><input type="text" placeholder="Написати повідомлення"><button>Надіслати</button></div>
      </div>
    </div>`;
  root.appendChild(body);
  const serversEl = $('.discord-servers', body);
  const channelsEl = $('.discord-channels', body);
  const log = $('.chat-log', body);
  const input = $('input', body);

  function renderServers(){
    serversEl.innerHTML = '';
    SERVERS.forEach(s=>{
      const el = document.createElement('div');
      el.className = 'discord-server' + (s===activeServer?' active':'');
      el.textContent = s.slice(0,2).toUpperCase();
      el.title = s;
      el.addEventListener('click', ()=>{ activeServer=s; activeChannel=CHANNELS[s][0]; renderServers(); renderChannels(); renderLog(); });
      serversEl.appendChild(el);
    });
  }
  function renderChannels(){
    channelsEl.innerHTML = '';
    CHANNELS[activeServer].forEach(c=>{
      const el = document.createElement('div');
      el.className = 'discord-channel' + (c===activeChannel?' active':'');
      el.textContent = c;
      el.addEventListener('click', ()=>{ activeChannel=c; renderChannels(); renderLog(); });
      channelsEl.appendChild(el);
    });
  }
  function renderLog(){
    log.innerHTML = '';
    historyFor().forEach(m=>{
      const d = document.createElement('div');
      d.className = 'chat-msg';
      d.innerHTML = `<b>${m.who}:</b> ${m.text}`;
      log.appendChild(d);
    });
    log.scrollTop = log.scrollHeight;
  }
  function send(){
    if(!input.value.trim()) return;
    historyFor().push({ who:'Ви', text: input.value });
    input.value='';
    save('discordChats', chatHistory);
    renderLog();
  }
  $('button', body).addEventListener('click', send);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') send(); });
  renderServers(); renderChannels(); renderLog();
};

/* ---- Steam ---- */
APP_BUILDERS.steam = function(root, rec){
  const GAMES = [
    { name:'Counter-Strike', size:'2.1 ГБ', info:'Командний тактичний шутер.' },
    { name:'Half-Life', size:'0.9 ГБ', info:'Класичний однокористувацький шутер.' },
    { name:'Ретро-гонки', size:'1.4 ГБ', info:'Аркадні перегони на швидкість.' },
    { name:'Пасьянс+', size:'0.1 ГБ', info:'Збірка карткових ігор.' },
  ];
  let active = GAMES[0];
  const body = document.createElement('div');
  body.className = 'win-body';
  body.innerHTML = `
    <div class="steam-body">
      <div class="steam-list"></div>
      <div class="steam-main"></div>
    </div>`;
  root.appendChild(body);
  const listEl = $('.steam-list', body);
  const mainEl = $('.steam-main', body);

  function renderList(){
    listEl.innerHTML = '';
    GAMES.forEach(g=>{
      const el = document.createElement('div');
      el.className = 'steam-game' + (g===active?' active':'');
      el.textContent = g.name;
      el.addEventListener('click', ()=>{ active=g; renderList(); renderMain(); });
      listEl.appendChild(el);
    });
  }
  function renderMain(){
    mainEl.innerHTML = `
      <h2>${active.name}</h2>
      <div>${active.info}</div>
      <div style="margin-top:8px; color:#8f98a0;">Розмір на диску: ${active.size}</div>
      <button id="steam-play">Грати</button>`;
    $('#steam-play', mainEl).addEventListener('click', ()=>showErrorDialog(`Не вдалося запустити «${active.name}». Відсутній необхідний компонент.`));
  }
  renderList(); renderMain();
};

/* ---- Switch Virtual Router ---- */
APP_BUILDERS.router = function(root, rec){
  const body = document.createElement('div');
  body.className = 'win-body util-body';
  body.innerHTML = `
    <div class="util-row"><label>Имя сети (SSID):</label><input type="text" value="Virtual Network" id="svr-ssid"></div>
    <div class="util-row"><label>Пароль:</label><input type="password" value="********" id="svr-pass"></div>
    <div class="util-row"><label>Состояние:</label><span id="svr-state">Остановлено</span></div>
    <div class="util-row"><button id="svr-start">Запустить</button><button id="svr-stop">Остановить</button></div>
    <div class="util-list" id="svr-clients"><div style="color:#888; padding:6px;">Нет подключённых устройств.</div></div>
  `;
  root.appendChild(body);
  const stateEl = $('#svr-state', body);
  const clientsEl = $('#svr-clients', body);
  let running = false, timer = null;
  $('#svr-start', body).addEventListener('click', ()=>{
    if(running) return;
    running = true;
    stateEl.textContent = 'Работает — точка доступа активна';
    let n = 0;
    const devices = ['DESKTOP-4F2A1', 'ANDROID-9B12', 'LAPTOP-WORK'];
    timer = setInterval(()=>{
      if(n < devices.length){
        if(n===0) clientsEl.innerHTML = '';
        const d = document.createElement('div');
        d.textContent = devices[n] + ' — подключено';
        clientsEl.appendChild(d);
        n++;
      }
    }, 900);
  });
  $('#svr-stop', body).addEventListener('click', ()=>{
    running = false;
    clearInterval(timer);
    stateEl.textContent = 'Остановлено';
    clientsEl.innerHTML = '<div style="color:#888; padding:6px;">Нет подключённых устройств.</div>';
  });
};

/* ---- BarsCryptor ---- */
APP_BUILDERS.barscryptor = function(root, rec){
  const body = document.createElement('div');
  body.className = 'win-body util-body';
  body.innerHTML = `
    <div class="util-row"><label>Файл:</label><input type="text" id="bc-file" placeholder="Файл не выбран" readonly><button id="bc-browse">Обзор...</button></div>
    <div class="util-row"><label>Пароль:</label><input type="password" id="bc-pass"></div>
    <div class="util-row"><button id="bc-enc">Зашифровать</button><button id="bc-dec">Расшифровать</button></div>
    <div class="util-status" id="bc-status">Готово.</div>
  `;
  root.appendChild(body);
  const fileEl = $('#bc-file', body), passEl = $('#bc-pass', body), statusEl = $('#bc-status', body);
  $('#bc-browse', body).addEventListener('click', ()=>{
    const docs = Object.keys((VFS['C:'].children['Мои документы']||{}).children||{});
    const dlg = showDialog({
      title:'Выбор файла', icon:'folder',
      text: `<div>${docs.map(n=>`<div class="of-item" data-name="${n}" style="padding:4px 6px; cursor:default;">${n}</div>`).join('')}</div>`,
      buttons:[{label:'Отмена'}]
    });
    $$('.of-item', dlg).forEach(el=>{
      el.addEventListener('mouseenter', ()=>{ el.style.background='#000080'; el.style.color='#fff'; });
      el.addEventListener('mouseleave', ()=>{ el.style.background=''; el.style.color=''; });
      el.addEventListener('click', ()=>{ fileEl.value = el.dataset.name; dlg.remove(); });
    });
  });
  function run(action){
    if(!fileEl.value){ statusEl.textContent = 'Ошибка: файл не выбран.'; return; }
    if(!passEl.value){ statusEl.textContent = 'Ошибка: введите пароль.'; return; }
    statusEl.textContent = action + '...';
    setTimeout(()=>{ statusEl.textContent = `Готово: «${fileEl.value}» ${action==='Шифрование' ? 'зашифрован' : 'расшифрован'}.`; }, 700);
  }
  $('#bc-enc', body).addEventListener('click', ()=>run('Шифрование'));
  $('#bc-dec', body).addEventListener('click', ()=>run('Расшифровка'));
};

/* ---- NoxScan ---- */
APP_BUILDERS.noxscan = function(root, rec){
  const body = document.createElement('div');
  body.className = 'win-body util-body';
  body.innerHTML = `
    <div class="util-row"><label>Устройство:</label><select id="ns-device"><option>NoxScan Flatbed 200</option><option>NoxScan Portable</option></select></div>
    <div class="util-row"><label>Режим:</label><select id="ns-mode"><option>Цветной</option><option>Оттенки серого</option><option>Чёрно-белый</option></select></div>
    <div class="util-scan-preview" id="ns-preview">Предпросмотр недоступен</div>
    <div class="util-progress"><div class="util-progress-fill" id="ns-fill"></div></div>
    <div class="util-row" style="margin-top:8px;"><button id="ns-scan">Сканировать</button><button id="ns-save">Сохранить</button></div>
    <div class="util-status" id="ns-status">Готово.</div>
  `;
  root.appendChild(body);
  const fill = $('#ns-fill', body), status = $('#ns-status', body), preview = $('#ns-preview', body);
  let scanned = false;
  $('#ns-scan', body).addEventListener('click', ()=>{
    scanned = false;
    status.textContent = 'Сканирование...';
    fill.style.width = '0%';
    let p = 0;
    const t = setInterval(()=>{
      p += 10;
      fill.style.width = p+'%';
      if(p >= 100){
        clearInterval(t);
        status.textContent = 'Сканирование завершено.';
        preview.textContent = 'Документ отсканирован';
        scanned = true;
      }
    }, 120);
  });
  $('#ns-save', body).addEventListener('click', ()=>{
    if(!scanned){ status.textContent = 'Нечего сохранять — сначала выполните сканирование.'; return; }
    status.textContent = 'Изображение сохранено в «Мои документы».';
  });
};

/* ---- AnyDesk ---- */
APP_BUILDERS.anydesk = function(root, rec){
  const myId = '482 731 905';
  const body = document.createElement('div');
  body.className = 'win-body util-body';
  body.innerHTML = `
    <div class="util-row"><label>Ваш адрес:</label><span>${myId}</span></div>
    <div class="util-row"><label>Удалённый адрес:</label><input type="text" id="ad-remote" placeholder="Введите адрес AnyDesk"></div>
    <div class="util-row"><button id="ad-connect">Подключиться</button></div>
    <div class="util-status" id="ad-status">Ожидание подключения...</div>
  `;
  root.appendChild(body);
  $('#ad-connect', body).addEventListener('click', ()=>{
    const remote = $('#ad-remote', body).value.trim();
    const status = $('#ad-status', body);
    if(!remote){ status.textContent = 'Введите адрес удалённого устройства.'; return; }
    status.textContent = 'Установление соединения...';
    setTimeout(()=>{ status.textContent = `Не удалось подключиться к «${remote}»: устройство не в сети.`; }, 1000);
  });
};

/* ---- TeamViewer ---- */
APP_BUILDERS.teamviewer = function(root, rec){
  const myId = '791 244 683';
  const body = document.createElement('div');
  body.className = 'win-body util-body';
  body.innerHTML = `
    <div class="util-row"><label>Ваш ID:</label><span>${myId}</span></div>
    <div class="util-row"><label>Пароль:</label><span>vX9k2q</span></div>
    <div class="util-row"><label>ID партнёра:</label><input type="text" id="tv-partner" placeholder="Введите ID партнёра"></div>
    <div class="util-row"><button id="tv-connect">Подключиться к партнёру</button></div>
    <div class="util-status" id="tv-status">Готов к соединению.</div>
  `;
  root.appendChild(body);
  $('#tv-connect', body).addEventListener('click', ()=>{
    const partner = $('#tv-partner', body).value.trim();
    const status = $('#tv-status', body);
    if(!partner){ status.textContent = 'Введите ID партнёра.'; return; }
    status.textContent = 'Ожидание подтверждения...';
    setTimeout(()=>{ status.textContent = `Партнёр «${partner}» не отвечает.`; }, 1200);
  });
};

/* ---- Epson Printer Connection ---- */
APP_BUILDERS.epson = function(root, rec){
  const body = document.createElement('div');
  body.className = 'win-body util-body';
  body.innerHTML = `
    <div class="util-row"><label>Принтер:</label><span>EPSON Stylus Series</span></div>
    <div class="util-row"><label>Состояние:</label><span>Готов</span></div>
    <div class="util-row"><label>Уровень чернил:</label>
      <div style="flex:1; display:flex; gap:4px;">
        <div style="flex:1; height:14px; background:#eee; border:1px solid #808080;"><div style="width:70%; height:100%; background:#000;"></div></div>
        <div style="flex:1; height:14px; background:#eee; border:1px solid #808080;"><div style="width:55%; height:100%; background:#0af;"></div></div>
        <div style="flex:1; height:14px; background:#eee; border:1px solid #808080;"><div style="width:40%; height:100%; background:#f0a;"></div></div>
        <div style="flex:1; height:14px; background:#eee; border:1px solid #808080;"><div style="width:65%; height:100%; background:#ff0;"></div></div>
      </div>
    </div>
    <div class="util-row"><button id="ep-test">Печать пробной страницы</button></div>
    <div class="util-status" id="ep-status">Принтер подключён по USB.</div>
  `;
  root.appendChild(body);
  $('#ep-test', body).addEventListener('click', ()=>{
    const status = $('#ep-status', body);
    status.textContent = 'Печать...';
    setTimeout(()=>{ status.textContent = 'Пробная страница напечатана.'; }, 900);
  });
};

/* ---- Документ Microsoft Word ---- */
APP_BUILDERS.word = function(root, rec, openOpts){
  const filename = (openOpts && openOpts.opts && openOpts.opts.filename) || 'Документ.docx';
  const files = load('wordFiles', {});
  const defaultText = 'Документ Microsoft Word\n\nВведите текст здесь...';
  buildMenubar(root, [
    { label:'Файл', items:[
      { label:'Сохранить', action:()=>{ files[filename] = page.innerHTML; save('wordFiles', files); } },
      { sep:true },
      { label:'Выход', action:()=>closeWindow(rec.id) },
    ]},
    { label:'Правка', items:[{label:'Копировать', disabled:true},{label:'Вставить', disabled:true}] },
    { label:'Вид', items:[{label:'Разметка страницы'}] },
    { label:'Вставка', items:[{label:'Рисунок', disabled:true}] },
    { label:'Формат', items:[{label:'Шрифт', disabled:true}] },
    { label:'Справка', items:[{label:'О программе', action:()=>showDialog({title:'О программе', icon:'word', text:'Документ Microsoft Word'})}] },
  ]);
  const toolbar = document.createElement('div');
  toolbar.className = 'win-toolbar';
  toolbar.innerHTML = `<button id="wd-bold"><b>Ж</b></button><button id="wd-italic"><i>К</i></button><button id="wd-underline"><u>Ч</u></button>`;
  root.appendChild(toolbar);
  const wrap = document.createElement('div');
  wrap.className = 'word-page-wrap';
  wrap.innerHTML = `<div class="word-page" contenteditable="true" spellcheck="false"></div>`;
  root.appendChild(wrap);
  const page = $('.word-page', wrap);
  page.innerHTML = files[filename] != null ? files[filename] : defaultText.replace(/\n/g,'<br>');
  page.addEventListener('input', ()=>{ files[filename] = page.innerHTML; save('wordFiles', files); });
  $('#wd-bold', toolbar).addEventListener('click', ()=>{ page.focus(); document.execCommand && document.execCommand('bold'); });
  $('#wd-italic', toolbar).addEventListener('click', ()=>{ page.focus(); document.execCommand && document.execCommand('italic'); });
  $('#wd-underline', toolbar).addEventListener('click', ()=>{ page.focus(); document.execCommand && document.execCommand('underline'); });
};

/* ---- SoftEther ---- */
APP_BUILDERS.softether = function(root, rec){
  buildMenubar(root, [
    { label:'Файл', items:[{label:'Закрыть', action:()=>closeWindow(rec.id)}] },
    { label:'Сервис', items:[{label:'Проверить обновления', action:()=>showDialog({title:'SoftEther', icon:'softether', text:'Обновления не найдены. У вас установлена последняя версия.'})}] },
    { label:'Справка', items:[{label:'О программе', action:()=>showDialog({title:'О программе', icon:'softether', text:'SoftEther VPN'})}] },
  ]);
  const body = document.createElement('div');
  body.className = 'win-body util-body';
  body.innerHTML = `
    <div class="util-row"><label>Версия:</label><span>3.2.118</span></div>
    <div class="util-row"><label>Статус:</label><span>Активирован</span></div>
    <div class="util-row"><label>Лицензия:</label><span>SF-882A-119X</span></div>
    <div class="util-row"><button id="sf-check">Проверить обновления</button></div>
    <div class="util-status" id="sf-status">Служба работает в штатном режиме.</div>
  `;
  root.appendChild(body);
  $('#sf-check', body).addEventListener('click', ()=>{ $('#sf-status', body).textContent = 'Обновления не найдены.'; });
};

/* ---- Игры ---- */
APP_BUILDERS.games = function(root, rec){
  const body = document.createElement('div');
  body.className = 'win-body';
  body.innerHTML = `<div class="icon-grid"></div>`;
  root.appendChild(body);
  const grid = $('.icon-grid', body);
  ['Сапёр','Пасьянс «Косынка»','Тетрис'].forEach((label)=>{
    const el = document.createElement('div');
    el.className='grid-item';
    el.innerHTML = `<div class="icon-img">${iconTag('games', label)}</div><div class="icon-label">${label}</div>`;
    el.addEventListener('dblclick', ()=>showErrorDialog(`Не удаётся запустить «${label}». Приложение не найдено.`));
    grid.appendChild(el);
  });
};

/* ============================================================
   ТАМАГОЧИ — the little gift that keeps going after the birthday
   card and Chrome finale close. A normal, closeable/movable window
   like any other app here; state is saved to localStorage (via the
   shared save()/load() helpers at the top of this file) so nothing
   resets between visits, and there is deliberately no win/lose state
   — it is meant to just keep running for as long as it's wanted.
   ============================================================ */
const TAMA_STORE_KEY = 'tamagotchi';
const TAMA_DECAY_TICK_MS = 30000;   /* one slow "needs decay" tick while the window is open */
const TAMA_AI_TICK_MS = 3200;       /* how often Kisa decides what to do next / moves */
const TAMA_FLOOR = 15;              /* neglect can never drag hunger/energy/clean/mood below this — no punishing the player for being away */

function tamaDefaultState(){
  const now = Date.now();

  return {
    hunger: 40,
    energy: 60,
    mood: 20,
    clean: 0,
    affection: 0,

    personality: { playful: 50, tender: 50, appetite: 50 },
    activity: 'idle',
    x: 50,
    y: 50,

    isSleeping: false,

    lastFeedAt: 0,
    feedStreak: 0,
    overfedUntil: 0,

    lastLoveAt: 0,
    loveStreak: 0,
    loveCooldownUntil: 0,

    seenRules: false,

    lastTick: now,
    lastVisit: now,
  };
}

/* Reads a saved numeric field safely: returns the saved number when it's
   genuinely present (including a legitimate 0), otherwise falls back to
   the default. */
function tamaNumOr(v, fallback){
  if(v === null || v === undefined) return fallback;

  const n = +v;

  return Number.isNaN(n) ? fallback : n;
}
/* Reads a saved numeric field safely: returns the saved number when it's
   genuinely present (including a legitimate 0), otherwise falls back to
   the default. Plain `+v ?? fallback` is a trap here — `+undefined` is
   `NaN`, and `NaN ?? fallback` is still `NaN` (?? only catches null/
   undefined), so a missing field would silently become NaN instead of
   falling back. This is what a truly new save relies on for 0-values. */
function tamaNumOr(v, fallback){
  if(v === null || v === undefined) return fallback;
  const n = +v;
  return Number.isNaN(n) ? fallback : n;
}
function tamaLoad(){
  const s = load(TAMA_STORE_KEY, null);
  const d = tamaDefaultState();
  if(!s || typeof s !== 'object') return d;
  const p = (s.personality && typeof s.personality === 'object') ? s.personality : {};
  return {
    hunger: tamaClamp(tamaNumOr(s.hunger, d.hunger)), energy: tamaClamp(tamaNumOr(s.energy, d.energy)),
    mood: tamaClamp(tamaNumOr(s.mood, d.mood)), clean: tamaClamp(tamaNumOr(s.clean, d.clean)),
    affection: tamaClamp(tamaNumOr(s.affection, d.affection)),
    personality: {
      playful: tamaClamp(tamaNumOr(p.playful, d.personality.playful)),
      tender: tamaClamp(tamaNumOr(p.tender, d.personality.tender)),
      appetite: tamaClamp(tamaNumOr(p.appetite, d.personality.appetite)),
    },
    activity: 'idle', x: s.isSleeping ? TAMA_SPOTS.bed.x : 50, y: s.isSleeping ? TAMA_SPOTS.bed.y : 50, isSleeping: !!s.isSleeping,
    lastFeedAt: +s.lastFeedAt || 0, feedStreak: +s.feedStreak || 0, overfedUntil: +s.overfedUntil || 0,
    lastLoveAt: +s.lastLoveAt || 0, loveStreak: +s.loveStreak || 0, loveCooldownUntil: +s.loveCooldownUntil || 0,
    seenRules: !!s.seenRules,
    lastTick: +s.lastTick || Date.now(), lastVisit: +s.lastVisit || Date.now(),
  };
}
function tamaSave(state){ save(TAMA_STORE_KEY, state); }
function tamaClamp(v){ return Math.max(0, Math.min(100, Math.round(v))); }
function tamaClampFloor(v){ return Math.max(TAMA_FLOOR, Math.min(100, Math.round(v))); }

/* Applies `ticks` worth of slow, gentle decay in one go — used both for the
   live in-window timer (ticks=1) and to catch up on however much real time
   passed while the window/app was closed. Neglect drags mood down faster,
   but nothing here can ever push a stat to zero or "end" anything — there's
   always a soft floor so coming back after a long break never feels like
   a punishment. */
function tamaApplyDecay(state, ticks){
  if(ticks <= 0) return;
  if(!state.isSleeping){
    state.hunger = tamaClampFloor(state.hunger - ticks);
    state.energy = tamaClampFloor(state.energy - ticks * 0.7);
  } else {
    /* resting in bed restores energy instead of losing it */
    state.energy = tamaClamp(state.energy + ticks * 1.6);
  }
  state.clean = tamaClampFloor(state.clean - ticks * 0.8);
  let moodPenalty = ticks * 0.35;
  if(state.hunger < 30) moodPenalty += ticks * 0.4;
  if(state.clean  < 30) moodPenalty += ticks * 0.3;
  if(state.energy < 20) moodPenalty += ticks * 0.4;
  state.mood = tamaClampFloor(state.mood - moodPenalty);
  /* affection grows slowly on its own whenever the pet is well cared for —
     it only ever grows through good care, never decays from neglect */
  if(state.hunger >= 50 && state.energy >= 50 && state.clean >= 50){
    state.affection = tamaClamp(state.affection + ticks * 0.25);
  }
}
function tamaCatchUp(state){
  const now = Date.now();
  const elapsedMs = Math.max(0, now - (state.lastTick || now));
  const ticks = Math.min(200000, Math.floor(elapsedMs / TAMA_DECAY_TICK_MS));
  if(ticks > 0) tamaApplyDecay(state, ticks);
  const awayMs = now - (state.lastVisit || now);
  state.lastTick = now;
  return awayMs;
}

/* How much trash is lying around, purely derived from `clean` so we never
   have to track item lists/timestamps through long catch-up periods. */
function tamaTrashCount(state){
  return Math.max(0, Math.min(4, Math.floor((100 - state.clean) / 25)));
}
const TAMA_TRASH_SPOTS = [
  { x: 37, y: 62 }, { x: 63, y: 57 }, { x: 46, y: 42 }, { x: 70, y: 38 },
];

/* Furniture the pet can walk to. Percent coordinates within the room. */
const TAMA_SPOTS = {
  bed:    { x: 15, y: 24 },
  window: { x: 83, y: 18 },
  bowl:   { x: 14, y: 80 },
  toys:   { x: 82, y: 76 },
  clean:  { x: 50, y: 84 },
  center: { x: 50, y: 50 },
};

/* Зозя — a small, round, plush-looking black cat drawn as a tiny flat
   SVG (no external image). Body/ears/paws never change between states;
   only the eyes swap between an "open" and a "closed" variant via CSS
   classes, which is enough to fake sleeping/blinking cheaply while the
   character itself always reads as the same Зозя. */
const TAMA_BODY_FILL = '#1c1c1c';
const TAMA_BODY_STROKE = '#7a4258';
function tamaZozyaEyes(closed){
  if(closed){
    return `
      <path d="M15,33 Q23,28 31,33" stroke="#ffcf4d" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M33,33 Q41,28 49,33" stroke="#ffcf4d" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  }
  return `
    <circle cx="23" cy="34" r="7.6" fill="#141414" stroke="#ffcf4d" stroke-width="2.4"/>
    <circle cx="41" cy="34" r="7.6" fill="#141414" stroke="#ffcf4d" stroke-width="2.4"/>
    <circle cx="20.4" cy="31.4" r="2.1" fill="#fff"/>
    <circle cx="38.4" cy="31.4" r="2.1" fill="#fff"/>
    <circle cx="25.6" cy="36.6" r="1" fill="#fff" opacity=".55"/>
    <circle cx="43.6" cy="36.6" r="1" fill="#fff" opacity=".55"/>`;
}
function tamaZozyaSvg(closed){
  return `<svg viewBox="0 0 64 64" class="tama-zozya-svg" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="55" rx="6.6" ry="4.2" fill="${TAMA_BODY_FILL}" stroke="${TAMA_BODY_STROKE}" stroke-width="1"/>
    <ellipse cx="40" cy="55" rx="6.6" ry="4.2" fill="${TAMA_BODY_FILL}" stroke="${TAMA_BODY_STROKE}" stroke-width="1"/>
    <path d="M14,27 Q11,9 25,18 Q20,25 14,27 Z" fill="${TAMA_BODY_FILL}" stroke="${TAMA_BODY_STROKE}" stroke-width="1"/>
    <path d="M50,27 Q53,9 39,18 Q44,25 50,27 Z" fill="${TAMA_BODY_FILL}" stroke="${TAMA_BODY_STROKE}" stroke-width="1"/>
    <path d="M17,23 Q16,13 23,18 Q20,22 17,23 Z" fill="#3a2430" opacity=".55"/>
    <path d="M47,23 Q48,13 41,18 Q44,22 47,23 Z" fill="#3a2430" opacity=".55"/>
    <ellipse cx="32" cy="43" rx="19" ry="15.5" fill="${TAMA_BODY_FILL}" stroke="${TAMA_BODY_STROKE}" stroke-width="1.3"/>
    <ellipse cx="26" cy="33" rx="7" ry="4.5" fill="#2c2c2c" opacity=".35"/>
    ${tamaZozyaEyes(closed)}
    <path d="M29.5,44 L34.5,44 L32,47.4 Z" fill="#ff9ec2"/>
  </svg>`;
}

function ensureTamagotchiStyles(){
  if($('#tamagotchi-styles')) return;
  const s = document.createElement('style');
  s.id = 'tamagotchi-styles';
  s.textContent = `
    .tama-body{ height:100%; box-sizing:border-box; overflow:auto; font-family:Tahoma, Arial, sans-serif; background:linear-gradient(180deg,#2a1420,#160a12); color:#fbe4ec; }
    .tama-rules{ padding:16px 18px; text-align:center; }
    .tama-rules h2{ font-size:15px; color:#ff9ec2; margin:0 0 10px; }
    .tama-rules p{ font-size:12px; line-height:1.6; margin:0 0 8px; color:#f2dde6; }
    .tama-rules-list{ text-align:left; background:rgba(255,255,255,.06); border-radius:8px; padding:10px 12px; margin:14px 0; font-size:12px; line-height:1.9; }
    .tama-start-btn{ margin-top:6px; padding:9px 22px; border-radius:20px; border:1px solid rgba(255,150,190,.5); background:#e75480; color:#fff; font-size:13px; cursor:pointer; }

    .tama-game{ padding:10px 12px 12px; display:flex; flex-direction:column; align-items:center; gap:7px; height:100%; box-sizing:border-box; }
    .tama-name{ font-size:13px; color:#ff9ec2; letter-spacing:.5px; }

    .tama-room{ position:relative; width:100%; max-width:340px; aspect-ratio:16/11; box-sizing:border-box; border:2px solid #6b3a4f; border-radius:6px; overflow:hidden;
      background:
        linear-gradient(180deg, #3a2233 0%, #3a2233 38%, #532d3a 38%, #532d3a 39%, #4a2436 39%, #4a2436 100%);
      image-rendering:pixelated; flex:0 0 auto; }
    .tama-room::before{ content:''; position:absolute; left:0; right:0; top:39%; bottom:0;
      background-image: repeating-linear-gradient(90deg, rgba(0,0,0,.10) 0 6%, transparent 6% 12%);
      pointer-events:none; }

    .tama-deco{ position:absolute; transform:translate(-50%,-50%); pointer-events:none; }
    .tama-deco-emoji{ font-size:20px; filter:drop-shadow(0 2px 0 rgba(0,0,0,.35)); }
    .tama-deco-small{ font-size:13px; opacity:.85; }

    .tama-spot{ position:absolute; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; pointer-events:none; }
    .tama-spot-icon{ font-size:24px; filter:drop-shadow(0 2px 0 rgba(0,0,0,.35)); }
    .tama-spot-base{ width:34px; height:8px; margin-top:-3px; background:rgba(0,0,0,.28); border-radius:50%; }

    .tama-trash{ position:absolute; transform:translate(-50%,-50%); font-size:13px; opacity:.9; animation: tama-trash-in .25s ease; }
    @keyframes tama-trash-in{ from{ opacity:0; transform:translate(-50%,-50%) scale(.4); } to{ opacity:.9; transform:translate(-50%,-50%) scale(1); } }

    .tama-pet{ position:absolute; transform:translate(-50%,-50%); transition:left .95s linear, top .95s linear; z-index:5; }
    .tama-pet.slow{ transition-duration:1.7s; }
    .tama-pet-inner{ position:relative; }
    .tama-zozya-svg{ width:38px; height:38px; display:block; filter: drop-shadow(0 2px 1px rgba(0,0,0,.45)); }
    .tama-pet-closed{ display:none; }

    .tama-pet.st-walking .tama-pet-inner{ animation: tama-bob .38s steps(2) infinite; }
    .tama-pet.st-playing .tama-pet-inner{ animation: tama-jump .5s ease-in-out infinite; }
    .tama-pet.st-happy .tama-pet-inner{ animation: tama-jump .6s ease-in-out infinite; }
    .tama-pet.st-eating .tama-pet-inner{ animation: tama-nod .5s ease-in-out infinite; }
    .tama-pet.st-angry .tama-pet-inner{ animation: tama-shake .28s linear infinite; }
    .tama-pet.st-tired .tama-pet-inner{ animation: tama-bob 1.4s steps(2) infinite; opacity:.9; }
    .tama-pet.st-sad .tama-pet-inner{ transform: translateY(3px); opacity:.85; }
    .tama-pet.st-sitting .tama-pet-inner{ transform: scaleY(.85) translateY(4px); }
    .tama-pet.st-lying .tama-pet-inner{ transform: scaleY(.55) translateY(9px); }
    .tama-pet.st-sleeping .tama-pet-inner{ transform: scaleY(.55) translateY(9px); }
    .tama-pet.dir-left .tama-pet-inner{ transform: scaleX(-1); }
    .tama-pet.dir-left.st-sitting .tama-pet-inner{ transform: scaleX(-1) scaleY(.85) translateY(4px); }
    .tama-pet.dir-left.st-lying .tama-pet-inner, .tama-pet.dir-left.st-sleeping .tama-pet-inner{ transform: scaleX(-1) scaleY(.55) translateY(9px); }

    .tama-pet.st-sleeping .tama-pet-open, .tama-pet.st-tired .tama-pet-open{ display:none; }
    .tama-pet.st-sleeping .tama-pet-closed, .tama-pet.st-tired .tama-pet-closed{ display:block; }

    @keyframes tama-bob{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-2.5px); } }
    @keyframes tama-jump{ 0%,100%{ transform:translateY(0); } 45%{ transform:translateY(-6px); } }
    @keyframes tama-nod{ 0%,100%{ transform:translateY(0) rotate(0deg); } 50%{ transform:translateY(1px) rotate(-4deg); } }
    @keyframes tama-shake{ 0%,100%{ transform:translateX(0); } 25%{ transform:translateX(-1.5px); } 75%{ transform:translateX(1.5px); } }

    .tama-bubble{ position:absolute; left:50%; bottom:100%; transform:translateX(-50%); margin-bottom:2px; font-size:12px; white-space:nowrap; filter:drop-shadow(0 1px 0 rgba(0,0,0,.4)); animation: tama-bubble-in .2s ease; }
    @keyframes tama-bubble-in{ from{ opacity:0; transform:translateX(-50%) translateY(3px); } to{ opacity:1; transform:translateX(-50%) translateY(0); } }
    .tama-zzz{ position:absolute; left:62%; bottom:85%; font-size:11px; color:#cfe3ff; animation: tama-zzz-float 2.2s ease-in infinite; }
    @keyframes tama-zzz-float{ 0%{ opacity:0; transform:translateY(0) scale(.7); } 20%{ opacity:1; } 100%{ opacity:0; transform:translateY(-14px) scale(1.1); } }

    .tama-room.dim::after{ content:''; position:absolute; inset:0; background:rgba(5,3,10,.42); transition:background .6s ease; pointer-events:none; }

    .tama-reaction{ min-height:15px; font-size:12px; color:#ffd1e0; text-align:center; }
    .tama-stats{ width:100%; max-width:300px; font-family:'Courier New', monospace; font-size:11px; }
    .tama-stat-row{ display:flex; justify-content:space-between; gap:8px; padding:1px 0; }
    .tama-bar{ letter-spacing:1px; color:#ff9ec2; }
    .tama-actions{ display:flex; flex-wrap:wrap; gap:6px; justify-content:center; }
    .tama-actions button{ padding:6px 10px; font-size:12px; border-radius:14px; border:1px solid rgba(255,150,190,.4); background:rgba(255,255,255,.08); color:#fbe4ec; cursor:pointer; }
    .tama-actions button:hover{ background:rgba(255,150,190,.25); }
    .tama-actions button:disabled{ opacity:.45; cursor:default; }
    .tama-footer{ margin-top:2px; font-size:10px; line-height:1.6; color:#c9a3b3; text-align:center; white-space:pre-line; }
  `;
  document.head.appendChild(s);
}

/* Rare one-off flavour beats (спец. п.10) — shown occasionally instead of
   the usual behaviour-driven message, purely for texture. */
const TAMA_RANDOM_EVENTS = [
  'Зозя нашла игрушку под кроватью!',
  'Зозя сидит у окна и смотрит наружу.',
  'Зозя решила немного побегать по комнате.',
  'Зозя нашла что-то интересное...',
  'Зозя ждала тебя. ❤️',
];

APP_BUILDERS.tamagotchi = function(root, rec){
  ensureTamagotchiStyles();
  const state = tamaLoad();
  const awayMs = tamaCatchUp(state);
  tamaSave(state);

  const body = document.createElement('div');
  body.className = 'tama-body';
  root.appendChild(body);

  let aiTimer = null, decayTimer = null, msgTimer = null;
  let petEl = null, roomEl = null;
  let welcomeMsg = null;
  if(awayMs > 1000*60*60*20){ welcomeMsg = 'Зозя: Я тебя ждала... 🥺'; }
  else if(awayMs > 1000*60*45){ welcomeMsg = 'Ты снова пришла! ❤️'; }

  function renderRules(){
    body.innerHTML = `<div class="tama-rules">
      <h2>МОЙ МАЛЕНЬКИЙ ТАМАГОЧИ ❤️</h2>
      <p>Открытка закончилась, но это ещё не значит, что закончилась наша история.</p>
      <p>Теперь можешь немного поиграть со своим маленьким питомцем.</p>
      <p>Зозя живёт в своей маленькой комнате: ходит между кроватью, миской и игрушками сама, по настроению.</p>
      <p>Ухаживай за ней, корми её, играй с ней и следи за её настроением.</p>
      <p>Можешь возвращаться к ней когда захочешь. Она никуда не денется. ❤️</p>
      <div class="tama-rules-list">
        <div>🍓 Кормить — восстанавливает сытость.</div>
        <div>❤️ Любить — повышает настроение и привязанность.</div>
        <div>🎮 Играть — развлекает питомца, но тратит энергию.</div>
        <div>😴 Спать — восстанавливает энергию.</div>
        <div>🧼 Убрать — поддерживает чистоту в комнате.</div>
      </div>
      <button class="tama-start-btn" id="tama-start-btn">Начать игру ❤️</button>
    </div>`;
    $('#tama-start-btn', body).addEventListener('click', ()=>{
      state.seenRules = true;
      tamaSave(state);
      renderGame();
    });
  }

  function setBar(sel, val){
    const el = $(sel, body); if(!el) return;
    const filled = Math.max(0, Math.min(5, Math.round(val/20)));
    el.textContent = '■'.repeat(filled) + '□'.repeat(5-filled);
  }
  function updateBars(){
    setBar('#tama-bar-hunger', state.hunger);
    setBar('#tama-bar-energy', state.energy);
    setBar('#tama-bar-mood', state.mood);
    setBar('#tama-bar-clean', state.clean);
    setBar('#tama-bar-affection', state.affection);
  }
  function react(text, ms){
    const el = $('#tama-reaction', body);
    if(!el) return;
    el.textContent = text;
    if(msgTimer) clearTimeout(msgTimer);
    msgTimer = setTimeout(()=>{ if(el.isConnected) el.textContent = '\u00a0'; }, ms || 4200);
  }
  function setButtonsDisabled(disabled){
    $$('.tama-actions button', body).forEach(b => b.disabled = disabled);
  }

  /* ---------- room rendering ---------- */
  function renderRoom(){
    const trashCount = tamaTrashCount(state);
    const trashHtml = TAMA_TRASH_SPOTS.slice(0, trashCount).map(p =>
      `<div class="tama-trash" style="left:${p.x}%; top:${p.y}%;">🧻</div>`
    ).join('');
    return `<div class="tama-room" id="tama-room">
      <div class="tama-deco" style="left:50%; top:8%;"><span class="tama-deco-emoji">🪴</span></div>
      <div class="tama-deco" style="left:32%; top:9%;"><span class="tama-deco-small">🖼️</span></div>
      <div class="tama-deco" style="left:58%; top:88%;"><span class="tama-deco-small">🧸</span></div>

      <div class="tama-spot" style="left:${TAMA_SPOTS.bed.x}%; top:${TAMA_SPOTS.bed.y}%;">
        <span class="tama-spot-icon">🛏️</span><span class="tama-spot-base"></span>
      </div>
      <div class="tama-spot" style="left:${TAMA_SPOTS.window.x}%; top:${TAMA_SPOTS.window.y}%;">
        <span class="tama-spot-icon">🪟</span>
      </div>
      <div class="tama-spot" style="left:${TAMA_SPOTS.bowl.x}%; top:${TAMA_SPOTS.bowl.y}%;">
        <span class="tama-spot-icon">🍓</span><span class="tama-spot-base"></span>
      </div>
      <div class="tama-spot" style="left:${TAMA_SPOTS.toys.x}%; top:${TAMA_SPOTS.toys.y}%;">
        <span class="tama-spot-icon">🧶</span><span class="tama-spot-base"></span>
      </div>
      <div class="tama-spot" style="left:${TAMA_SPOTS.clean.x}%; top:${TAMA_SPOTS.clean.y}%;">
        <span class="tama-deco-small">🧽</span>
      </div>
      ${trashHtml}
      <div class="tama-pet" id="tama-pet" style="left:${state.x}%; top:${state.y}%;">
        <div class="tama-pet-inner">
          <div class="tama-pet-open">${tamaZozyaSvg(false)}</div>
          <div class="tama-pet-closed">${tamaZozyaSvg(true)}</div>
          <div class="tama-bubble" id="tama-bubble"></div>
          <div class="tama-zzz" id="tama-zzz" style="display:none;">z z z</div>
        </div>
      </div>
    </div>`;
  }

  function setBubble(text){
    const b = $('#tama-bubble', body);
    if(!b) return;
    b.textContent = text || '';
    b.style.display = text ? '' : 'none';
  }

  /* Applies the current activity/mood to the pet's CSS classes, eyes and
     little emoji bubble. Called after every state change. */
  function paintPet(){
    if(!petEl) return;
    const cls = ['tama-pet'];
    if(state.overfedUntil > Date.now()) cls.push('slow');
    const a = state.activity;
    if(['walking','sitting','lying','sleeping','eating','playing','happy','sad','angry','tired'].includes(a)) cls.push('st-'+a);
    if(state.facing === 'left') cls.push('dir-left');
    petEl.className = cls.join(' ');

    const zzz = $('#tama-zzz', body);
    if(zzz) zzz.style.display = (a === 'sleeping') ? '' : 'none';

    const bubbles = { eating:'🍓', playing:'🧶', happy:'💗', sad:'💧', angry:'💢', tired:'💤', sleeping:'' };
    setBubble(bubbles[a] || '');

    if(roomEl) roomEl.classList.toggle('dim', a === 'sleeping');
  }

  function movePetTo(spot, slow){
    if(!petEl) return;
    state.facing = spot.x < state.x ? 'left' : 'right';
    state.x = spot.x; state.y = spot.y;
    petEl.style.left = spot.x + '%';
    petEl.style.top = spot.y + '%';
  }
  function setActivity(a){
    state.activity = a;
    paintPet();
  }

  /* ---------- autonomous "AI" — Kisa lives her own little life ---------- */
  let forcedUntil = 0; /* while >Date.now(), a button-triggered action owns the pet */

  function idleDisplayState(){
    if(state.hunger < 25) return 'sad';
    if(state.energy < 20) return 'tired';
    if(state.clean < 25) return 'angry';
    if(state.mood < 25) return 'sad';
    if(state.mood > 75 && state.hunger > 55 && state.energy > 55 && state.clean > 55) return 'happy';
    return 'idle';
  }

  function aiStep(){
    if(Date.now() < forcedUntil) return;
    if(state.isSleeping) return;

    /* rare flavour event instead of the usual routine */
    if(Math.random() < 0.045){
      const line = TAMA_RANDOM_EVENTS[Math.floor(Math.random()*TAMA_RANDOM_EVENTS.length)];
      react(line);
    }

    /* weighted pick of where Kisa wanders next, biased by her needs */
    const weights = {
      bowl:   1 + (100 - state.hunger) / 18,
      toys:   1 + state.personality.playful / 45 + (state.mood > 55 ? 0.6 : 0),
      bed:    1 + (100 - state.energy) / 16,
      window: 1 + (state.mood < 40 ? 1.2 : 0.4),
      center: 1,
    };
    if(state.mood < 30){ weights.toys *= 0.4; weights.window *= 1.6; }
    const keys = Object.keys(weights);
    const total = keys.reduce((sum,k)=>sum+weights[k], 0);
    let r = Math.random() * total, pick = keys[0];
    for(const k of keys){ r -= weights[k]; if(r <= 0){ pick = k; break; } }

    const spot = TAMA_SPOTS[pick];
    const wasSame = Math.abs(state.x - spot.x) < 2 && Math.abs(state.y - spot.y) < 2;
    if(!wasSame){
      setActivity('walking');
      movePetTo(spot, state.overfedUntil > Date.now());
    }
    /* settle into a little idle behaviour once "arrived" */
    setTimeout(()=>{
      if(Date.now() < forcedUntil || state.isSleeping) return;
      if(pick === 'bed') setActivity('lying');
      else if(pick === 'window') setActivity(Math.random() < 0.5 ? 'sitting' : idleDisplayState());
      else if(pick === 'toys' && Math.random() < 0.6) setActivity('playing');
      else setActivity(idleDisplayState());
      setTimeout(()=>{ if(Date.now() >= forcedUntil && !state.isSleeping) setActivity(idleDisplayState()); }, 1400);
    }, 1000);
  }

  /* ---------- button actions ---------- */
  function doAction(kind){
    if(state.isSleeping){
      if(state.energy < 90){ react('Зозя: Я ещё хочу спать... 😴'); return; }
      wakeUp();
    }
    const now = Date.now();
    forcedUntil = now + 2600;

    if(kind === 'feed'){
      movePetTo(TAMA_SPOTS.bowl);
      setActivity('walking');
      setTimeout(()=>{
        if(state.hunger >= 92){
          react('Зозя: Я пока не хочу...');
          setActivity(idleDisplayState());
          return;
        }
        const streakWindow = now - state.lastFeedAt < 22000;
        state.feedStreak = streakWindow ? state.feedStreak + 1 : 1;
        state.lastFeedAt = now;
        if(state.feedStreak >= 4){
          react('Зозя: Кажется, я переела... 😵');
          state.mood = tamaClampFloor(state.mood - 8);
          state.overfedUntil = now + 90000;
          state.feedStreak = 0;
          setActivity('tired');
        } else {
          const overfed = state.overfedUntil > now;
          const gain = overfed ? 10 : 24;
          state.hunger = tamaClamp(state.hunger + gain);
          state.mood = tamaClamp(state.mood + (overfed ? 0 : 2));
          state.affection = tamaClamp(state.affection + 1);
          state.personality.appetite = tamaClamp(state.personality.appetite + 1);
          react(overfed ? 'Зозя: Ещё немного... но я ещё сыта после переедания 😵' : 'Зозя: ням-ням 🍓');
          setActivity('eating');
        }
        tamaSave(state); updateBars();
      }, 900);
    }

    else if(kind === 'love'){
      const streakWindow = now - state.lastLoveAt < 15000;
      state.loveStreak = streakWindow ? state.loveStreak + 1 : 1;
      state.lastLoveAt = now;
      if(state.loveStreak >= 5){
        react('Зозя: Ну хватит меня тискать 😳');
        state.mood = tamaClamp(state.mood + 2);
        state.loveCooldownUntil = now + 60000;
        state.loveStreak = 0;
        setActivity('angry');
      } else if(state.loveCooldownUntil > now){
        state.mood = tamaClamp(state.mood + 5);
        react('Зозя: муррр... (тихонько) ❤️');
        setActivity('happy');
      } else {
        state.mood = tamaClamp(state.mood + 18);
        state.affection = tamaClamp(state.affection + 5);
        state.personality.tender = tamaClamp(state.personality.tender + 1);
        react('Зозя: муррр... ❤️');
        setActivity('happy');
      }
      tamaSave(state); updateBars();
    }

    else if(kind === 'play'){
      if(state.energy < 15){
        react('Зозя: Я устала... давай потом 😴');
        setActivity('tired');
      } else {
        movePetTo(TAMA_SPOTS.toys);
        setActivity('walking');
        setTimeout(()=>{
          state.mood = tamaClamp(state.mood + 15);
          state.energy = tamaClampFloor(state.energy - 10);
          state.affection = tamaClamp(state.affection + 1);
          state.personality.playful = tamaClamp(state.personality.playful + 1);
          react('Зозя: Ещё! ❤️');
          setActivity('playing');
          tamaSave(state); updateBars();
        }, 700);
        forcedUntil = now + 3600;
      }
    }

    else if(kind === 'sleep'){
      movePetTo(TAMA_SPOTS.bed);
      setActivity('walking');
      setTimeout(()=>{
        state.isSleeping = true;
        setActivity('sleeping');
        react('Зозя: zzz... 😴');
        tamaSave(state);
      }, 900);
      forcedUntil = now + 1600;
    }

    else if(kind === 'clean'){
      movePetTo(TAMA_SPOTS.clean);
      setActivity('walking');
      setTimeout(()=>{
        if(state.clean >= 90){
          react('Зозя: Тут и так чистенько ✨');
        } else {
          state.clean = tamaClamp(state.clean + 35);
          react('Зозя: Теперь чистенько! ✨');
        }
        setActivity(idleDisplayState());
        tamaSave(state); updateBars(); renderTrash();
      }, 800);
    }

    tamaSave(state);
  }

  function wakeUp(){
    state.isSleeping = false;
    setActivity(state.energy >= 90 ? 'happy' : idleDisplayState());
    if(state.energy >= 90) react('Зозя: Я выспалась! ❤️');
    tamaSave(state);
  }

  function renderTrash(){
    if(!roomEl) return;
    $$('.tama-trash', roomEl).forEach(el => el.remove());
    const trashCount = tamaTrashCount(state);
    TAMA_TRASH_SPOTS.slice(0, trashCount).forEach(p=>{
      const el = document.createElement('div');
      el.className = 'tama-trash';
      el.style.left = p.x + '%'; el.style.top = p.y + '%';
      el.textContent = '🧻';
      roomEl.appendChild(el);
    });
  }

  function renderGame(){
    if(aiTimer) clearInterval(aiTimer);
    if(decayTimer) clearInterval(decayTimer);
    if(msgTimer) clearTimeout(msgTimer);
    body.innerHTML = `<div class="tama-game">
      <div class="tama-name">Имя: Зозя ❤️</div>
      ${renderRoom()}
      <div class="tama-reaction" id="tama-reaction">&nbsp;</div>
      <div class="tama-stats">
        <div class="tama-stat-row"><span>Сытость:</span><span class="tama-bar" id="tama-bar-hunger"></span></div>
        <div class="tama-stat-row"><span>Энергия:</span><span class="tama-bar" id="tama-bar-energy"></span></div>
        <div class="tama-stat-row"><span>Настроение:</span><span class="tama-bar" id="tama-bar-mood"></span></div>
        <div class="tama-stat-row"><span>Чистота:</span><span class="tama-bar" id="tama-bar-clean"></span></div>
        <div class="tama-stat-row"><span>Привязанность:</span><span class="tama-bar" id="tama-bar-affection"></span></div>
      </div>
      <div class="tama-actions">
        <button data-act="feed">🍓 Покормить</button>
        <button data-act="love">❤️ Любить</button>
        <button data-act="play">🎮 Играть</button>
        <button data-act="sleep">😴 Спать</button>
        <button data-act="clean">🧼 Убрать</button>
      </div>
      <div class="tama-footer">Открытка закончилась.
Но наша история продолжается. ❤️
Можешь возвращаться сюда когда захочешь.</div>
    </div>`;

    roomEl = $('#tama-room', body);
    petEl = $('#tama-pet', body);
    state.activity = state.isSleeping ? 'sleeping' : idleDisplayState();
    updateBars();
    paintPet();
    if(welcomeMsg){ react(welcomeMsg, 5000); welcomeMsg = null; }

    $$('.tama-actions button', body).forEach(btn=>{
      btn.addEventListener('click', ()=> doAction(btn.dataset.act));
    });

    /* fast tick: Kisa's autonomous movement/behaviour */
    aiTimer = setInterval(()=>{
      if(!body.isConnected){ clearInterval(aiTimer); return; }
      aiStep();
    }, TAMA_AI_TICK_MS);

    /* slow tick: gentle needs decay + persistence, same cadence as before */
    decayTimer = setInterval(()=>{
      if(!body.isConnected){ clearInterval(decayTimer); return; }
      tamaApplyDecay(state, 1);
      state.lastTick = Date.now();
      state.lastVisit = Date.now();
      tamaSave(state);
      updateBars();
      renderTrash();
      if(!state.isSleeping && Date.now() >= forcedUntil) setActivity(idleDisplayState());
    }, TAMA_DECAY_TICK_MS);

    setTimeout(aiStep, 900);
  }

  if(state.seenRules) renderGame(); else renderRules();
};

/* ---- Панель управления ---- */
APP_BUILDERS.control = function(root, rec){
  const body = document.createElement('div');
  body.className = 'win-body';
  body.innerHTML = `<div class="icon-grid"></div>`;
  root.appendChild(body);
  const grid = $('.icon-grid', body);
  const items = [
    { label:'Экран', icon:'display', action: openDisplayDialog },
    { label:'Мышь', icon:'mouse', action: ()=>showDialog({title:'Свойства: Мышь', icon:'mouse', text:'<div class="dlg-field"><label>Скорость:</label><input type="range" min="1" max="10" value="6" style="flex:1"></div><div class="dlg-field"><label>Двойной клик:</label><input type="range" min="1" max="10" value="5" style="flex:1"></div>'}) },
    { label:'Клавиатура', icon:'doc', action: ()=>showDialog({title:'Свойства: Клавиатура', icon:'doc', text:'<div class="dlg-field"><label>Задержка:</label><input type="range" min="1" max="10" value="4" style="flex:1"></div><div class="dlg-field"><label>Скорость:</label><input type="range" min="1" max="10" value="7" style="flex:1"></div>'}) },
    { label:'Звук', icon:'soundSettings', action: openSoundDialog },
    { label:'Дата и время', icon:'clockIcon', action: ()=>showDialog({title:'Свойства: Дата и время', icon:'clockIcon', text: new Date().toLocaleString('ru-RU')}) },
    { label:'Оформление', icon:'wallpaperSetting', action: openThemeDialog },
  ];
  items.forEach(it=>{
    const el = document.createElement('div');
    el.className='grid-item';
    el.innerHTML = `<div class="icon-img">${iconTag(it.icon, it.label)}</div><div class="icon-label">${it.label}</div>`;
    el.addEventListener('dblclick', it.action);
    grid.appendChild(el);
  });
};

function openDisplayDialog(){
  const dlg = showDialog({
    title:'Свойства: Экран', icon:'display',
    text: `<div>
      <div class="dlg-field"><label>Обои:</label>
        <select id="wp-select">
          <option value="fantasy_night">Классические обои</option>
          <option value="aurora_dusk">Bloom</option>
          <option value="classic_teal">Безжалостный Мороз</option>
          <option value="classic_teal2">Одетта</option>
        </select>
      </div>
      <div class="dlg-field"><label>CRT-эффект:</label>
        <input type="checkbox" id="crt-toggle">
      </div>
    </div>`,
    buttons:[{label:'Применить'},{label:'ОК'}]
  });
  const sel = $('#wp-select', dlg);
  sel.value = load('wallpaper','classic_teal');
  const crt = $('#crt-toggle', dlg);
  crt.checked = load('crtOn', true);
  sel.addEventListener('change', ()=>{ save('wallpaper', sel.value); applyWallpaper(); });
  crt.addEventListener('change', ()=>{ save('crtOn', crt.checked); applyCrt(); });
}
function openSoundDialog(){
  const dlg = showDialog({
    title:'Свойства: Звук', icon:'soundSettings',
    text: `<div class="dlg-field"><label>Системные звуки:</label><input type="checkbox" id="snd-toggle"></div>`,
    buttons:[{label:'ОК'}]
  });
  const cb = $('#snd-toggle', dlg);
  cb.checked = load('soundOn', false);
  cb.addEventListener('change', ()=>{ save('soundOn', cb.checked); paintTraySound(); });
}
function openThemeDialog(){
  showDialog({title:'Свойства: Оформление', icon:'wallpaperSetting', text:'<div class="dlg-field"><label>Схема:</label><select><option>Windows Стандартная</option></select></div>'});
}

function applyCrt(){
  $('#crt-overlay').classList.toggle('off', !load('crtOn', true));
}

/* ============================================================
   CLOCK / TRAY
   ============================================================ */
function tickClock(){
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  $('#tray-clock').textContent = `${hh}:${mm}`;
  $('#tray-clock').title = now.toLocaleDateString('ru-RU');
}

/* ============================================================
   INIT
   ============================================================ */
const QUICKLAUNCH_ITEMS = [
  { label:'Папка', icon:'folder', app:'explorer', opts:{path:'C:'} },
  { label:'Браузер', icon:'browser', app:'chrome' },
  { label:'Discord', icon:'discord', app:'discord' },
  { label:'Telegram', icon:'telegram', app:'telegram' },
];
function renderQuickLaunch(){
  const box = $('#taskbar-quicklaunch');
  if(!box) return;
  box.innerHTML = '';
  QUICKLAUNCH_ITEMS.forEach(it=>{
    const btn = document.createElement('div');
    btn.className = 'ql-btn';
    btn.title = it.label;
    btn.innerHTML = `<span class="ql-icon">${iconTag(it.icon, it.label)}</span><span class="ql-label">${it.label}</span>`;
    btn.addEventListener('click', ()=> openApp(it.app, it.label, it.icon, it.opts ? { opts: it.opts } : {}));
    box.appendChild(btn);
  });
}

function initDesktop(){
  applyWallpaper();
  applyCrt();
  renderIcons();
  renderStartMenu();
  renderQuickLaunch();
  renderTrayIcons();
  tickClock();
  setInterval(tickClock, 1000*15);

  $('#start-btn').addEventListener('click', (e)=>{ e.stopPropagation(); toggleStartMenu(); });

  showWelcomeTip();
}

function renderTrayIcons(){
  const battery = $('.tray-icon[title="Питание"]');
  if(battery) battery.innerHTML = iconTag('batteryTray');
  paintTraySound();
  $('#tray-sound').addEventListener('click', ()=>{
    save('soundOn', !load('soundOn', false));
    paintTraySound();
  });
}
function paintTraySound(){
  $('#tray-sound').innerHTML = iconTag(load('soundOn', false) ? 'soundTray' : 'soundOffTray');
}

const STARTUP_TIPS = [
  'Чтобы увеличить экран для удобства, нажмите F11, чтобы перейти в полноэкранный режим, а затем нажмите Ctrl + «+», чтобы увеличить масштаб.',
];
function showWelcomeTip(){
  const tip = STARTUP_TIPS[Math.floor(Math.random()*STARTUP_TIPS.length)];
  showDialog({
    title: 'Совет дня',
    icon: 'info',
    text: `<b>Знаете ли вы...</b><br><br>${tip}`,
    buttons: [{ label:'Закрыть' }],
  });
}
