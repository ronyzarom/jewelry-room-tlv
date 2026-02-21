/* ===========================
   Jewelry Room TLV — Script
   =========================== */

/* ---- CONFIG ---- */
const CONFIG = {
  // Replace with your actual WhatsApp number (with country code, no dashes or spaces)
  whatsappNumber: '972547938844',

  // Google Sheets published CSV URL for testimonials (optional)
  // 1. Create a Google Sheet with columns: name, type, text, initial
  // 2. File → Share → Publish to web → select the sheet → CSV
  // 3. Paste the URL below
  googleSheetURL: '',

  businessName: 'Jewelry Room TLV',
};

/* ---- Hero Image Progressive Load ---- */
const heroImg = new Image();
heroImg.src = 'assets/hero-photo-wide.jpg';
heroImg.onload = () => document.querySelector('.hero').classList.add('hero-loaded');

/* ---- Navbar Scroll ---- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ---- Mobile Menu Toggle ---- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---- Calendar ---- */
const hebrewMonths = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

let currentDate = new Date();
let selectedDate = null;

const calendarMonth = document.getElementById('calendarMonth');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  calendarMonth.textContent = `${hebrewMonths[month]} ${year}`;
  calendarDays.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'calendar-day empty';
    calendarDays.appendChild(emptyEl);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.textContent = day;

    if (dateObj < today) {
      dayEl.classList.add('disabled');
    } else {
      if (dateObj.getTime() === today.getTime()) {
        dayEl.classList.add('today');
      }

      if (
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      ) {
        dayEl.classList.add('selected');
      }

      dayEl.addEventListener('click', () => {
        selectedDate = new Date(year, month, day);
        renderCalendar();
      });
    }

    calendarDays.appendChild(dayEl);
  }
}

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

/* ---- Booking → WhatsApp ---- */
const bookingSubmit = document.getElementById('bookingSubmit');

bookingSubmit.addEventListener('click', () => {
  const time = document.getElementById('bookingTime').value;
  const duration = document.getElementById('bookingDuration').value;
  const name = document.getElementById('bookingName').value.trim();
  const phone = document.getElementById('bookingPhone').value.trim();

  if (!selectedDate || !time || !duration || !name || !phone) {
    showModal('אנא מלאו את כל השדות ובחרו תאריך בלוח השנה.');
    return;
  }

  const dateStr = selectedDate.toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const message = [
    `שלום, אשמח להזמין סדנא פרטית 🎨`,
    ``,
    `📅 תאריך: ${dateStr}`,
    `🕐 שעה: ${time}`,
    `⏱ משך: ${duration} שעות`,
    `👤 שם: ${name}`,
    `📱 טלפון: ${phone}`,
    ``,
    `תודה!`,
  ].join('\n');

  openWhatsApp(message);
});

/* ---- Contact Form → WhatsApp ---- */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const subject = document.getElementById('contactSubject');
  const subjectText = subject.options[subject.selectedIndex].text;
  const messageText = document.getElementById('contactMessage').value.trim();

  if (!name || !phone || !subject.value) {
    showModal('אנא מלאו את כל השדות.');
    return;
  }

  const message = [
    `שלום, פנייה מהאתר 💬`,
    ``,
    `👤 שם: ${name}`,
    `📱 טלפון: ${phone}`,
    `📌 נושא: ${subjectText}`,
    messageText ? `💬 הודעה: ${messageText}` : '',
    ``,
    `תודה!`,
  ]
    .filter(Boolean)
    .join('\n');

  openWhatsApp(message);
});

/* ---- WhatsApp Helper ---- */
function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
  window.open(url, '_blank');
}

/* ---- Modal ---- */
const successModal = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');

function showModal(customMessage) {
  if (customMessage) {
    successModal.querySelector('p').textContent = customMessage;
  }
  successModal.classList.add('active');
}

function hideModal() {
  successModal.classList.remove('active');
  successModal.querySelector('p').textContent =
    'קיבלנו את הפנייה שלכם ונחזור אליכם בהקדם.';
}

modalClose.addEventListener('click', hideModal);
modalOk.addEventListener('click', hideModal);
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) hideModal();
});

/* ---- Testimonials Slider ---- */
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll('.testimonial-dot');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  currentSlide = index;
  const direction = document.documentElement.dir === 'rtl' ? 1 : -1;
  track.style.transform = `translateX(${direction * currentSlide * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index));
    resetAutoSlide();
  });
});

function autoSlide() {
  slideInterval = setInterval(() => {
    const next = (currentSlide + 1) % dots.length;
    goToSlide(next);
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  autoSlide();
}

autoSlide();

/* ---- Google Sheets Testimonials ---- */
async function loadTestimonialsFromSheet() {
  if (!CONFIG.googleSheetURL) return;

  try {
    const response = await fetch(CONFIG.googleSheetURL);
    const csv = await response.text();
    const rows = csv.split('\n').slice(1).filter((r) => r.trim());

    if (rows.length === 0) return;

    track.innerHTML = '';

    const testimonials = rows.map((row) => {
      const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const clean = (s) => (s || '').replace(/^"|"$/g, '').trim();
      return {
        name: clean(cols[0]),
        type: clean(cols[1]),
        text: clean(cols[2]),
        initial: clean(cols[3]) || clean(cols[0])[0],
      };
    });

    testimonials.forEach((t) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <div class="testimonial-avatar"><span>${t.initial}</span></div>
        <h4 class="testimonial-name">${t.name}</h4>
        <span class="testimonial-type">${t.type}</span>
        <p class="testimonial-text">"${t.text}"</p>
      `;
      track.appendChild(card);
    });

    const navContainer = document.querySelector('.testimonials-nav');
    navContainer.innerHTML = '';

    testimonials.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
      dot.dataset.index = i;
      dot.setAttribute('aria-label', `המלצה ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoSlide();
      });
      navContainer.appendChild(dot);
    });

    goToSlide(0);
    resetAutoSlide();
  } catch (err) {
    // Silently fall back to hardcoded testimonials
  }
}

loadTestimonialsFromSheet();

/* ---- Blog Filters ---- */
const blogFilters = document.querySelectorAll('.blog-filter');
const blogCards = document.querySelectorAll('.blog-card');

blogFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    blogFilters.forEach((f) => f.classList.remove('active'));
    filter.classList.add('active');

    const category = filter.dataset.category;

    blogCards.forEach((card) => {
      if (category === 'all' || card.dataset.category === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- Blog Posts Data ---- */
const blogPosts = [
  {
    tag: 'טיפים',
    date: '15 בפברואר 2026',
    title: '5 טיפים לבחירת תכשיט מושלם למתנה',
    content: `
      <p>בחירת תכשיט כמתנה יכולה להיות מרגשת – אבל גם קצת מאתגרת. איך בוחרים משהו שבאמת ידבר ללב? הנה חמישה דברים שכדאי לשים לב אליהם:</p>
      <h3>1. הכירו את הסגנון האישי</h3>
      <p>שימו לב לתכשיטים שהאדם כבר עונד. האם הוא מעדיף זהב או כסף? מינימליסטי או דרמטי? הסגנון הקיים הוא המדריך הכי טוב שלכם.</p>
      <h3>2. חשבו על אורח החיים</h3>
      <p>מישהו שעובד עם הידיים יעדיף טבעת פשוטה, בזמן שמי שעובד במשרד יכול לענוד תכשיטים עדינים יותר.</p>
      <h3>3. המשמעות חשובה</h3>
      <p>תכשיט עם סיפור – אבן לידה, אות ראשון, סמל משמעותי – הופך מתנה יפה למתנה בלתי נשכחת.</p>
      <h3>4. איכות על פני כמות</h3>
      <p>תכשיט אחד איכותי שווה יותר מעשרה זולים. חומרים טובים מבטיחים שהתכשיט ייראה נהדר גם אחרי שנים.</p>
      <h3>5. אם לא בטוחים – סדנא!</h3>
      <p>מתנה של חוויה היא תמיד בטוחה. בואו ביחד לסדנא וצרו תכשיט משמעותי שגם יהיה לכם זיכרון מהכנתו.</p>
    `,
  },
  {
    tag: 'מאחורי הקלעים',
    date: '8 בפברואר 2026',
    title: 'איך נולד תכשיט? המסע מרעיון ליצירה',
    content: `
      <p>כל תכשיט מתחיל כרעיון – לפעמים כשרטוט על מפית, לפעמים כתמונה בראש. בואו נעקוב אחרי המסע המרתק מהרגע הראשון ועד התוצאה הסופית.</p>
      <h3>שלב 1: ההשראה</h3>
      <p>ההשראה יכולה לבוא מכל מקום – מהטבע, מאדריכלות, מזיכרון ילדות או ממפגש מקרי. אצלנו בסטודיו, אנחנו אוהבות לשבת עם הלקוחות ולשמוע את הסיפור שלהם לפני שמתחילים.</p>
      <h3>שלב 2: העיצוב</h3>
      <p>משרטטים, מתקנים, ומשרטטים שוב. העיצוב חייב להיות גם יפה וגם פרקטי – תכשיט צריך להיות נוח לעניד.</p>
      <h3>שלב 3: בחירת החומרים</h3>
      <p>כסף, זהב, פליז? אבנים טבעיות או חרוזים? כל חומר נותן אופי אחר ליצירה.</p>
      <h3>שלב 4: היצירה</h3>
      <p>הרגע הכי קסום – כשהמתכת מתחילה לקבל צורה, כשאבן מוצאת את המקום שלה, כשהחתיכות מתחברות לשלם.</p>
      <h3>שלב 5: הליטוש הסופי</h3>
      <p>הפרטים הקטנים עושים את ההבדל. ליטוש, ניקוי, בדיקה אחרונה – ואז הרגע שהתכשיט מוכן.</p>
    `,
  },
  {
    tag: 'השראה',
    date: '1 בפברואר 2026',
    title: 'טרנדים בעולם התכשיטים ל-2026',
    content: `
      <p>שנת 2026 מביאה איתה טרנדים מרגשים בעולם התכשיטים. הנה מה שחם השנה:</p>
      <h3>מתכות מעורבות</h3>
      <p>שילוב של זהב וכסף באותו תכשיט כבר לא נחשב "פאשן פו" – זה הטרנד הכי חם. הניגוד בין הגוונים יוצר מראה מודרני ומעניין.</p>
      <h3>אבנים טבעיות ולא מעובדות</h3>
      <p>אבנים בצורתן הטבעית, ללא חיתוך מושלם, הן ההיט של השנה. הן מביאות תחושה אורגנית ואותנטית.</p>
      <h3>מינימליזם עם טוויסט</h3>
      <p>הקו הנקי והמינימליסטי ממשיך לשלוט, אבל עם טוויסט – פרט לא צפוי, טקסטורה מיוחדת, או צורה אסימטרית.</p>
      <h3>תכשיטים בהתאמה אישית</h3>
      <p>יותר ויותר אנשים מחפשים תכשיטים ייחודיים שנוצרו במיוחד עבורם – וזה בדיוק מה שאנחנו עושים בסדנאות!</p>
      <h3>קיימות ומודעות</h3>
      <p>תכשיטים ממחוזרים, חומרים אתיים ויצירה מקומית – הצרכנים של 2026 רוצים לדעת את הסיפור מאחורי מה שהם עונדים.</p>
    `,
  },
  {
    tag: 'מדריכים',
    date: '25 בינואר 2026',
    title: 'מדריך למתחילים: סוגי מתכות לתכשיטים',
    content: `
      <p>בחירת המתכת הנכונה היא אחת ההחלטות החשובות ביותר ביצירת תכשיט. הנה מדריך שיעזור לכם להבין את ההבדלים:</p>
      <h3>כסף סטרלינג (925)</h3>
      <p>הבחירה הפופולרית ביותר. 92.5% כסף טהור ו-7.5% נחושת לחוזק. צבע כסוף בהיר ויפה, מחיר נגיש ועמיד. צריך ניקוי מעת לעת כי הוא נוטה להשחיר.</p>
      <h3>זהב (14K / 18K)</h3>
      <p>זהב 14K מכיל 58.3% זהב טהור – חזק ועמיד ליומיום. זהב 18K מכיל 75% – צבע עשיר יותר אבל רך יותר. שניהם לא משחירים.</p>
      <h3>רוז גולד</h3>
      <p>סגסוגת של זהב ונחושת שנותנת גוון ורוד-חם. רומנטי, ייחודי ומחמיא לרוב גווני העור.</p>
      <h3>פליז</h3>
      <p>סגסוגת של נחושת ואבץ בגוון זהוב. מחיר נגיש מאוד, מצוין ללמידה ולניסויים. משנה גוון עם הזמן (פטינה) – יש כאלה שדווקא אוהבים את האפקט.</p>
      <h3>מה לבחור?</h3>
      <ul>
        <li>לשימוש יומיומי: כסף סטרלינג או זהב 14K</li>
        <li>למראה יוקרתי: זהב 18K</li>
        <li>למשהו מיוחד: רוז גולד</li>
        <li>ללמידה ויצירה: פליז</li>
      </ul>
      <p>בסדנאות שלנו תוכלו להתנסות בחומרים שונים ולגלות מה הכי מתאים לכם!</p>
    `,
  },
  {
    tag: 'טיפים',
    date: '18 בינואר 2026',
    title: 'איך לשמור על תכשיטים שייראו כמו חדשים',
    content: `
      <p>השקעתם ביצירת תכשיט מושלם? הנה איך לשמור עליו כדי שיחזיק מעמד לשנים:</p>
      <h3>אחסון נכון</h3>
      <p>אחסנו כל תכשיט בנפרד – בשקית בד רך או בתא נפרד בקופסת תכשיטים. מניעת מגע בין תכשיטים מונעת שריטות.</p>
      <h3>הסירו לפני...</h3>
      <ul>
        <li>מקלחת ושחייה (מים וכלור פוגעים)</li>
        <li>ספורט (זיעה ומכות)</li>
        <li>ניקיון הבית (חומרי ניקוי)</li>
        <li>שינה (לחיצה וחיכוך)</li>
      </ul>
      <h3>ניקוי תכשיטי כסף</h3>
      <p>טבלו במים חמים עם מעט סבון כלים, שפשפו בעדינות עם מברשת שיניים רכה, ויבשו עם מטלית רכה. לשחרור – השתמשו בבייקינג סודה.</p>
      <h3>ניקוי תכשיטי זהב</h3>
      <p>זהב דורש פחות תחזוקה, אבל מגיע לו ניקוי עדין עם מים ומעט סבון מעת לעת.</p>
      <h3>הכלל הזהב</h3>
      <p>"אחרון נכנס, ראשון יוצא" – התכשיט צריך להיות הדבר האחרון שאתם עונדים (אחרי בושם, קרם ואיפור) והדבר הראשון שאתם מסירים.</p>
    `,
  },
  {
    tag: 'השראה',
    date: '10 בינואר 2026',
    title: 'סיפור הסדנא: כשצוות עבודה הפך למשפחה',
    content: `
      <p>לפני כמה שבועות הגיע אלינו צוות של 12 אנשים מחברת הייטק. הם הגיעו כעמיתים לעבודה ויצאו כמשפחה. הנה מה שקרה:</p>
      <h3>ההתחלה</h3>
      <p>הצוות הגיע קצת מהוסס. חלקם לא הכירו טוב, חלקם עבדו מרחוק ונפגשו לראשונה פנים אל פנים. האווירה הייתה מנומסת אבל מרוחקת.</p>
      <h3>הקסם של היצירה</h3>
      <p>משהו קרה ברגע שהתחלנו לעבוד. כשהידיים עסוקות, הפה מתחיל לדבר. אנשים שיתפו, צחקו, עזרו אחד לשני. מישהו שקט במיוחד פתאום הפך למומחה של הקבוצה בקשירת קשרים.</p>
      <h3>הרגע שלנו</h3>
      <p>בסוף הסדנא, כולם ישבו יחד עם התכשיטים שיצרו, מחייכים ומצלמים. מנהלת הצוות אמרה לנו: "עשינו עשרות גיבושים, וזה הראשון שבאמת חיבר אותנו."</p>
      <p>זה בדיוק למה אנחנו עושות את מה שאנחנו עושות – כי יצירה מחברת אנשים באופן שום דבר אחר לא יכול.</p>
    `,
  },
];

/* ---- Blog Modal ---- */
const blogModal = document.getElementById('blogModal');
const blogModalClose = document.getElementById('blogModalClose');
const blogModalTag = document.getElementById('blogModalTag');
const blogModalDate = document.getElementById('blogModalDate');
const blogModalTitle = document.getElementById('blogModalTitle');
const blogModalContent = document.getElementById('blogModalContent');

document.querySelectorAll('.blog-card-link').forEach((link) => {
  link.addEventListener('click', () => {
    const postIndex = parseInt(link.dataset.post);
    const post = blogPosts[postIndex];
    if (!post) return;

    blogModalTag.textContent = post.tag;
    blogModalDate.textContent = post.date;
    blogModalTitle.textContent = post.title;
    blogModalContent.innerHTML = post.content;
    blogModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeBlogModal() {
  blogModal.classList.remove('active');
  document.body.style.overflow = '';
}

blogModalClose.addEventListener('click', closeBlogModal);
blogModal.addEventListener('click', (e) => {
  if (e.target === blogModal) closeBlogModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBlogModal();
    hideModal();
  }
});

/* ---- Fade-in on Scroll ---- */
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

fadeElements.forEach((el) => fadeObserver.observe(el));
