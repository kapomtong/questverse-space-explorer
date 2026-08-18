/**
 * QuestVerse M.1: Space Explorer — Configuration & Core System
 * ไฟล์กลางที่เก็บข้อมูลดาวเคราะห์ ค่าคงที่ระบบ ฟังก์ชันจัดการ state และ utility ต่างๆ
 */

window.QV = window.QV || {};
// QV local ref merged

// ========================================
// ดาวเคราะห์ทั้g 5 ดวงในเกม
// ========================================
QV.planets = [
  {
    id: "numberon",
    name: "ดาวนัมเบอร์รอน",
    nameEn: "Numberon",
    subject: "คณิตศาสตร์",
    themeColor: "#7c6ff7",
    image: "assets/planet_numberon.webp",
    bg: "assets/mission_bg_numberon.jpg",
    desc: "อาณาจักรแห่งตัวเลขและรูปทรงที่รอผู้พิชิต มาเป็นนักคำนวณผู้ยิ่งใหญ่กันเถอะ!",
    zoneCount: 5
  },
  {
    id: "bionia",
    name: "ดาวไบโอเนีย",
    nameEn: "Bionia",
    subject: "วิทยาศาสตร์",
    themeColor: "#06d6a0",
    image: "assets/planet_bionia.webp",
    bg: "assets/mission_bg_bionia.jpg",
    desc: "โลกแห่งสิ่งมีชีวิตและธรรมชาติอันน่าอัศจรรย์ มาค้นพบความลับของจักรวาลด้วยกัน!",
    zoneCount: 5
  },
  {
    id: "aksara",
    name: "ดาวอักษรา",
    nameEn: "Aksara",
    subject: "ภาษาไทย",
    themeColor: "#ffd166",
    image: "assets/planet_aksara.webp",
    bg: "assets/mission_bg_aksara.jpg",
    desc: "ดินแดนแห่งวรรณคดีและภาษาไทยอันงดงาม มาเรียนรู้ภาษาแม่ของเราให้มีความสุขกันเถอะ!",
    zoneCount: 5
  },
  {
    id: "lingua",
    name: "ดาวลิงกัว",
    nameEn: "Lingua",
    subject: "ภาษาอังกฤษ",
    themeColor: "#4cc9f0",
    image: "assets/planet_lingua.webp",
    bg: "assets/mission_bg_lingua.jpg",
    desc: "ดาวที่เต็มไปด้วยคำศัพท์และไวยากรณ์สากล มาพูดภาษาอังกฤษได้อย่างมั่นใจกันนะ!",
    zoneCount: 5
  },
  {
    id: "civilis",
    name: "ดาวซิวิลิส",
    nameEn: "Civilis",
    subject: "สังคมศึกษา",
    themeColor: "#f5a623",
    image: "assets/planet_civilis.webp",
    bg: "assets/mission_bg_civilis.jpg",
    desc: "ดาวแห่งประวัติศาสตร์ วัฒนธรรม และสังคมโลก มาเป็นพลเมืองที่ดีของจักรวาลด้วยกัน!",
    zoneCount: 5
  }
];

// ========================================
// ค่าคงที่ระบบ
// ========================================
QV.MAX_ENERGY = 5;
QV.XP_CORRECT = 10;
QV.XP_COMBO = 5;
QV.QUESTIONS_PER_ZONE = 5;
QV.QUESTION_TIME_LIMIT = 30; // วินาทีต่อ 1 คำถาม
QV.SAVE_KEY = "questverse_save_v1";

QV.DEFAULT_ITEMS = {
  shield: 2,
  compass: 2,
  telescope: 2
};

QV.ITEM_DEFS = {
  shield: {
    id: "shield",
    name: "โล่ป้องกัน",
    desc: "ตอบผิดไม่เสียพลังงาน",
    image: "assets/item_shield.webp"
  },
  compass: {
    id: "compass",
    name: "เข็มทิศอวกาศ",
    desc: "ตัดตัวเลือกผิด 1 ตัว",
    image: "assets/item_compass.webp"
  },
  telescope: {
    id: "telescope",
    name: "กล้องส่องทางไกล",
    desc: "ขอดูคำใบ้ 1 ครั้ง",
    image: "assets/item_telescope.webp"
  }
};

// ========================================
// ระบบยศ (Rank)
// ========================================
QV.ranks = [
  [0, "นักเรียนนายร้อยอวกาศ", "🚀"],
  [100, "กัปตัน", "⭐"],
  [300, "พลเรือเอกจักรวาล", "🌟"]
];

/**
 * หายศจาก XP ที่มี
 * @param {number} xp - คะแนนประสบการณ์
 * @returns {{name: string, emoji: string, index: number}}
 */
QV.getRank = function(xp) {
  let currentRank = QV.ranks[0];
  let currentIndex = 0;
  
  for (let i = 0; i < QV.ranks.length; i++) {
    if (xp >= QV.ranks[i][0]) {
      currentRank = QV.ranks[i];
      currentIndex = i;
    } else {
      break;
    }
  }
  
  return {
    name: currentRank[1],
    emoji: currentRank[2],
    index: currentIndex
  };
};

// ========================================
// ระบบเหรียญตรา (Badges)
// ========================================
QV.badges = [
  {
    id: "explorer-numberon",
    name: "นักสำรวจดาวนัมเบอร์รอน",
    desc: "ผ่านครบ 5 โซนของดาวนัมเบอร์รอน",
    icon: "🛸"
  },
  {
    id: "explorer-bionia",
    name: "นักสำรวจดาวไบโอเนีย",
    desc: "ผ่านครบ 5 โซนของดาวไบโอเนีย",
    icon: "🛸"
  },
  {
    id: "explorer-aksara",
    name: "นักสำรวจดาวอักษรา",
    desc: "ผ่านครบ 5 โซนของดาวอักษรา",
    icon: "🛸"
  },
  {
    id: "explorer-lingua",
    name: "นักสำรวจดาวลิงกัว",
    desc: "ผ่านครบ 5 โซนของดาวลิงกัว",
    icon: "🛸"
  },
  {
    id: "explorer-civilis",
    name: "นักสำรวจดาวซิวิลิส",
    desc: "ผ่านครบ 5 โซนของดาวซิวิลิส",
    icon: "🛸"
  },
  {
    id: "combo-master",
    name: "จอมคอมโบ",
    desc: "ตอบถูกติดต่อกัน 10 ข้อ",
    icon: "🔥"
  },
  {
    id: "globe-trotter",
    name: "นักเดินทางข้ามดาว",
    desc: "เล่นครบทุกดาว",
    icon: "🌌"
  },
  {
    id: "universe-conqueror",
    name: "ผู้พิชิตจักรวาล",
    desc: "ผ่านทุกด่านทั้งหมด",
    icon: "🏆"
  },
  {
    id: "speed-runner",
    name: "Speed Runner",
    desc: "ตอบถูกใน 5 วินาที 10 ครั้ง",
    icon: "⚡"
  },
  {
    id: "boss-mathos",
    name: "ผู้พิชิต Mathos",
    desc: "เอาชนะ Mathos หุ่นพิชิต ในโหมด Boss Battle",
    icon: "🤖"
  },
  {
    id: "boss-chronos",
    name: "ผู้พิชิต Chronos",
    desc: "เอาชนะ Chronos มังกรนาฬิกา ในโหมด Boss Battle",
    icon: "🐉"
  }
];

// ========================================
// ระบบ State (การบันทึกความคืบหน้า)
// ========================================

/**
 * สร้าง state ใหม่เริ่มต้น
 * @returns {object} - state object เริ่มต้น
 */
QV.newState = function() {
  return {
    player: {
      name: "",
      suit: "blue"
    },
    xp: 0,
    totalCorrect: 0,
    combo: 0,
    maxCombo: 0,
    energy: 5,
    lastEnergyDate: "",
    planets: {
      numberon: {
        currentZone: 0,
        zonesDone: []
      },
      bionia: {
        currentZone: 0,
        zonesDone: []
      },
      aksara: {
        currentZone: 0,
        zonesDone: []
      },
      lingua: {
        currentZone: 0,
        zonesDone: []
      },
      civilis: {
        currentZone: 0,
        zonesDone: []
      }
    },
    items: {
      shield: 2,
      compass: 2,
      telescope: 2
    },
    badges: [],
    bossDefeated: [], // id บอสที่พิชิตแล้ว ['mathos'|'chronos']
    fastCorrect5s: 0,
    minigamePlays: {}
  };
};

/**
 * บันทึก state ลง localStorage
 * @param {object} state - state object ที่จะบันทึก
 */
QV.saveState = function(state) {
  try {
    localStorage.setItem(QV.SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("ไม่สามารถบันทึกข้อมูลได้:", e);
  }
};

/**
 * โหลด state จาก localStorage
 * @returns {object} - state object ที่โหลดมา
 */
QV.loadState = function() {
  try {
    const saved = localStorage.getItem(QV.SAVE_KEY);
    if (!saved) {
      return QV.newState();
    }
    
    const loaded = JSON.parse(saved);
    const defaultState = QV.newState();
    
    // merge ค่า default เข้ากับ loaded state เพื่อรองรับ save เก่า
    const merged = { ...defaultState };
    
    // merge top-level properties
    Object.keys(loaded).forEach(key => {
      if (typeof loaded[key] === 'object' && !Array.isArray(loaded[key]) && loaded[key] !== null) {
        merged[key] = { ...defaultState[key], ...loaded[key] };
      } else {
        merged[key] = loaded[key];
      }
    });
    
    // ตรวจสอบว่า planets มีครบทุกดาวหรือไม่
    QV.planets.forEach(planet => {
      if (!merged.planets[planet.id]) {
        merged.planets[planet.id] = {
          currentZone: 0,
          zonesDone: []
        };
      }
    });
    
    // ตรวจสอบว่า items มีครบหรือไม่
    Object.keys(QV.DEFAULT_ITEMS).forEach(itemId => {
      if (typeof merged.items[itemId] === 'undefined') {
        merged.items[itemId] = QV.DEFAULT_ITEMS[itemId];
      }
    });
    
    return merged;
  } catch (e) {
    console.error("ไม่สามารถโหลดข้อมูลได้:", e);
    return QV.newState();
  }
};

/**
 * สร้าง key วันที่แบบ YYYY-MM-DD
 * @returns {string} - วันที่ในรูปแบบ YYYY-MM-DD
 */
QV.todayKey = function() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * ฟื้นฟูพลังงานถ้าเป็นวันใหม่
 * @param {object} state - state object
 * @returns {boolean} - true ถ้ามีการ refresh, false ถ้าไม่มี
 */
QV.refreshEnergy = function(state) {
  const today = QV.todayKey();
  if (state.lastEnergyDate !== today) {
    state.energy = QV.MAX_ENERGY;
    state.lastEnergyDate = today;
    return true;
  }
  return false;
};

// ========================================
// Utility Functions
// ========================================

/**
 * แปลงเศษส่วนในข้อความเป็น HTML แบบตั้งแนว
 * เช่น "3/4" → จำนวนบน/เส้นขวาง/จำนวนล่าง, "2 1/2" (จำนวนคู่) → เลขคู่หน้าเศษส่วน
 * @param {string} text - ข้อความเดิม
 * @returns {string} - HTML ที่แปลงแล้ว
 */
QV.formatFrac = function(text) {
  if (!text) return '';
  let html = String(text)
    // จำนวนคู่: a b/c → เลขคู่หน้าเศษส่วนตั้งแนวน
    .replace(/(\d+) (\d+)\/(\d+)/g,
      '<span class="mixed"><span class="mixed-num">$1</span><span class="frac"><span class="frac-n">$2</span><span class="frac-bar"></span><span class="frac-d">$3</span></span></span>')
    // เศษส่วนธรรมดา: a/b → ตั้งแนว
    .replace(/(\d+)\/(\d+)/g,
      '<span class="frac"><span class="frac-n">$1</span><span class="frac-bar"></span><span class="frac-d">$2</span></span>');
  return html;
};

/**
 * Escape HTML เพื่อป้องกัน XSS
 * @param {string} s - string ที่ต้องการ escape
 * @returns {string} - string ที่ escape แล้ว
 */
QV.escapeHtml = function(s) {
  if (!s) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(s).replace(/[&<>"']/g, m => map[m]);
};

/**
 * จัดรูปแบบตัวเลขให้มีคอมมา
 * @param {number} n - ตัวเลขที่ต้องการจัดรูปแบบ
 * @returns {string} - ตัวเลขที่จัดรูปแบบแล้ว
 */
QV.formatNumber = function(n) {
  if (typeof n !== 'number') return '0';
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * ค้นหาดาวเคราะห์จาก ID
 * @param {string} id - ID ของดาวเคราะห์
 * @returns {object|null} - object ของดาวเคราะห์ หรือ null ถ้าไม่เจอ
 */
QV.planetById = function(id) {
  return QV.planets.find(p => p.id === id) || null;
};

// ส่งออก namespace สำหรับใช้งานในไฟล์อื่น
window.QV = QV;
