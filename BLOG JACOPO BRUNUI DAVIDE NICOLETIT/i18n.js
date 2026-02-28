/**
 * Fashion AI - Internationalization (i18n) System
 * Supports: Italian (it), English (en), Chinese (zh), Spanish (es), German (de), Hindi (hi)
 */

const i18nTranslations = {
    it: {
        "nav.home": "Home",
        "nav.stylist": "AI Stylist",
        "nav.blog": "Blog",
        "nav.about": "Chi Siamo",
        "nav.login": "Registrati / Accedi",
        "nav.chats": "Le Mie Chat",
        "hero.cta": "Inizia Gratis",
        "hero.secondary": "Prova AI Stylist",
        "community.title": "Vuoi entrare nella nostra community?",
        "community.subtitle": "Ogni settimana ricevi automaticamente un paio di outfit in base al genere e allo stile che scegli.",
        "community.cta": "✨ Compila il modulo",
        "chat.placeholder": "Chiedimi qualsiasi cosa...",
        "chat.send": "Invia",
        "chat.welcome": "Ciao! Sono Fashion AI, il tuo assistente intelligente.",
        "settings.language": "Lingua",
        "settings.logout": "Disconnettiti",
        "settings.chats": "Gestisci le Mie Chat",
    },
    en: {
        "nav.home": "Home",
        "nav.stylist": "AI Stylist",
        "nav.blog": "Blog",
        "nav.about": "About Us",
        "nav.login": "Sign Up / Log In",
        "nav.chats": "My Chats",
        "hero.cta": "Start Free",
        "hero.secondary": "Try AI Stylist",
        "community.title": "Want to join our community?",
        "community.subtitle": "Every week you automatically receive outfit suggestions based on your style and gender.",
        "community.cta": "✨ Fill in the form",
        "chat.placeholder": "Ask me anything...",
        "chat.send": "Send",
        "chat.welcome": "Hello! I'm Fashion AI, your intelligent assistant.",
        "settings.language": "Language",
        "settings.logout": "Log Out",
        "settings.chats": "Manage My Chats",
    },
    zh: {
        "nav.home": "首页",
        "nav.stylist": "AI造型师",
        "nav.blog": "博客",
        "nav.about": "关于我们",
        "nav.login": "注册 / 登录",
        "nav.chats": "我的聊天",
        "hero.cta": "免费开始",
        "hero.secondary": "试试AI造型师",
        "community.title": "想加入我们的社区吗？",
        "community.subtitle": "每周根据您选择的风格和性别自动接收搭配建议。",
        "community.cta": "✨ 填写表格",
        "chat.placeholder": "问我任何问题...",
        "chat.send": "发送",
        "chat.welcome": "你好！我是Fashion AI，您的智能助手。",
        "settings.language": "语言",
        "settings.logout": "退出登录",
        "settings.chats": "管理我的聊天",
    },
    es: {
        "nav.home": "Inicio",
        "nav.stylist": "Estilista IA",
        "nav.blog": "Blog",
        "nav.about": "Quiénes somos",
        "nav.login": "Registrarse / Iniciar sesión",
        "nav.chats": "Mis Chats",
        "hero.cta": "Empieza Gratis",
        "hero.secondary": "Prueba el Estilista IA",
        "community.title": "¿Quieres unirte a nuestra comunidad?",
        "community.subtitle": "Cada semana recibirás automáticamente outfits según el género y el estilo que elijas.",
        "community.cta": "✨ Rellena el formulario",
        "chat.placeholder": "Pregúntame cualquier cosa...",
        "chat.send": "Enviar",
        "chat.welcome": "¡Hola! Soy Fashion AI, tu asistente inteligente.",
        "settings.language": "Idioma",
        "settings.logout": "Cerrar sesión",
        "settings.chats": "Gestionar mis Chats",
    },
    de: {
        "nav.home": "Startseite",
        "nav.stylist": "KI-Stylist",
        "nav.blog": "Blog",
        "nav.about": "Über uns",
        "nav.login": "Registrieren / Anmelden",
        "nav.chats": "Meine Chats",
        "hero.cta": "Kostenlos starten",
        "hero.secondary": "KI-Stylist ausprobieren",
        "community.title": "Möchtest du unserer Community beitreten?",
        "community.subtitle": "Jede Woche erhältst du automatisch Outfit-Vorschläge basierend auf deinem Stil und Geschlecht.",
        "community.cta": "✨ Formular ausfüllen",
        "chat.placeholder": "Frag mich alles...",
        "chat.send": "Senden",
        "chat.welcome": "Hallo! Ich bin Fashion AI, dein intelligenter Assistent.",
        "settings.language": "Sprache",
        "settings.logout": "Abmelden",
        "settings.chats": "Meine Chats verwalten",
    },
    hi: {
        "nav.home": "होम",
        "nav.stylist": "AI स्टाइलिस्ट",
        "nav.blog": "ब्लॉग",
        "nav.about": "हमारे बारे में",
        "nav.login": "साइन अप / लॉग इन",
        "nav.chats": "मेरी चैट",
        "hero.cta": "मुफ्त शुरू करें",
        "hero.secondary": "AI स्टाइलिस्ट आज़माएं",
        "community.title": "क्या आप हमारे समुदाय में शामिल होना चाहते हैं?",
        "community.subtitle": "हर हफ्ते आपको आपके स्टाइल और लिंग के आधार पर आउटफिट सुझाव मिलेंगे।",
        "community.cta": "✨ फॉर्म भरें",
        "chat.placeholder": "मुझसे कुछ भी पूछें...",
        "chat.send": "भेजें",
        "chat.welcome": "नमस्ते! मैं Fashion AI हूँ, आपका बुद्धिमान सहायक।",
        "settings.language": "भाषा",
        "settings.logout": "लॉग आउट करें",
        "settings.chats": "मेरी चैट प्रबंधित करें",
    }
};

// ========================
// i18n Engine
// ========================
const i18n = {
    currentLang: localStorage.getItem('fashion_ai_lang') || 'it',

    t(key) {
        const lang = this.currentLang;
        return (i18nTranslations[lang] && i18nTranslations[lang][key])
            || (i18nTranslations['it'] && i18nTranslations['it'][key])
            || key;
    },

    setLang(lang) {
        if (!i18nTranslations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('fashion_ai_lang', lang);

        // Save in user profile
        const userEmail = localStorage.getItem('fashion_ai_user_email');
        if (userEmail) {
            localStorage.setItem(`fashion_ai_lang_${userEmail}`, lang);
        }

        this.applyTranslations();
        document.documentElement.lang = lang;
    },

    applyTranslations() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) el.textContent = translation;
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) el.placeholder = translation;
        });

        // Update active language selector
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    },

    init() {
        // Restore language from user profile if logged in
        const userEmail = localStorage.getItem('fashion_ai_user_email');
        if (userEmail) {
            const userLang = localStorage.getItem(`fashion_ai_lang_${userEmail}`);
            if (userLang) this.currentLang = userLang;
        }
        this.applyTranslations();
    }
};

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => i18n.init());
