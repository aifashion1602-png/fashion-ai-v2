// Basic Interactivity
document.addEventListener('DOMContentLoaded', () => {
    console.log("Fashion AI Chatbot Site Ready");

    // =============================================
    // SCROLL REVEAL ANIMATIONS
    // =============================================
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.feature-card, .blog-card, .glass-card, .section-badge').forEach((el, i) => {
            el.style.transitionDelay = `${(i % 5) * 0.1}s`;
            observer.observe(el);
        });
    }

    initScrollReveal();

    const brandLogo = document.querySelector('.brand-text');
    if (brandLogo) {
        brandLogo.style.cursor = 'pointer';
        brandLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -- AUTH MODAL LOGIC --
    const regForm = document.getElementById('registration-form');

    window.openLoginModal = function () {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    };

    window.closeLoginModal = function () {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    };

    let authMode = 'login';
    window.toggleAuthMode = function () {
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        const regName = document.getElementById('reg-name');
        const submitBtn = document.getElementById('auth-submit-btn');
        const toggleBtnText = document.getElementById('toggle-auth-text');
        const forgotPwContainer = document.getElementById('forgot-password-container');

        if (authMode === 'register') {
            authMode = 'login';
            modalTitle.textContent = "Accedi";
            modalSubtitle.textContent = "Bentornato! Inserisci i tuoi dati.";
            if (regName) regName.style.display = 'none';
            submitBtn.textContent = "Accedi";
            toggleBtnText.innerHTML = `Non hai un account? <br><button onclick="toggleAuthMode()" style="background:none; border:none; color:#9d4edd; cursor:pointer; font-size:0.85rem; padding:0; font-weight:bold;">REGISTRATI</button>`;
            if (forgotPwContainer) forgotPwContainer.style.display = 'block';
        } else {
            authMode = 'register';
            modalTitle.textContent = "Registrazione";
            modalSubtitle.textContent = "Crea un account per salvare le tue chat!";
            if (regName) { regName.style.display = 'block'; regName.required = true; }
            submitBtn.textContent = "Registrati";
            toggleBtnText.innerHTML = `Hai già un account? <br><button onclick="toggleAuthMode()" style="background:none; border:none; color:#9d4edd; cursor:pointer; font-size:0.85rem; padding:0; font-weight:bold;">ACCEDI</button>`;
            if (forgotPwContainer) forgotPwContainer.style.display = 'none';
        }
    };

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('reg-email');
            const nameInput = document.getElementById('reg-name');
            if (!emailInput) return;
            const email = emailInput.value.trim().toLowerCase();
            const name = (authMode === 'register' && nameInput) ? nameInput.value : email.split('@')[0];

            if (authMode === 'login') {
                const registry = JSON.parse(localStorage.getItem('fashion_ai_global_registry') || '[]');
                const user = registry.find(u => u.email === email);
                if (user) {
                    localStorage.setItem('fashion_ai_user_name', user.name);
                    localStorage.setItem('fashion_ai_user_email', email);
                    localStorage.setItem('fashion_ai_user_verified', 'true');
                    updateNavbarAfterLogin(user.name, `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7b2cbf&color=fff`, email);
                    closeLoginModal();
                    loadChatHistory();
                } else {
                    alert("Account non trovato. Registrati per iniziare!");
                }
            } else {
                addToGlobalRegistry(name, email);
                localStorage.setItem('fashion_ai_user_email', email);
                localStorage.setItem('fashion_ai_user_name', name);
                localStorage.setItem('fashion_ai_user_verified', 'true');
                updateNavbarAfterLogin(name, `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7b2cbf&color=fff`, email);
                closeLoginModal();
                loadChatHistory();
            }
        });
    }

    window.addToGlobalRegistry = function (name, email) {
        let registry = JSON.parse(localStorage.getItem('fashion_ai_global_registry') || '[]');
        if (!registry.find(u => u.email === email)) {
            registry.push({ id: Date.now(), name: name, email: email, date: new Date().toISOString().split('T')[0], verified: true });
            localStorage.setItem('fashion_ai_global_registry', JSON.stringify(registry));
        }
    };

    window.updateNavbarAfterLogin = function (name, picture, email = "") {
        const authContainer = document.getElementById('nav-auth-container');
        if (authContainer) {
            authContainer.style.display = 'flex';
            authContainer.innerHTML = `
                <div class="user-profile-nav" style="display:flex !important; align-items:center; gap:12px; padding: 4px 10px; background: rgba(157,78,221,0.08); border-radius: 12px; border: 1px solid rgba(157,78,221,0.2);">
                    <img src="${picture}" alt="pfp" style="width:38px; height:38px; border-radius:50%; border:2px solid #9d4edd;">
                    <div style="display:flex; flex-direction:column; line-height:1.2;">
                        <span style="color:white; font-weight:800; font-size:0.95rem; cursor:pointer;" onclick="openSettings()">${name}</span>
                        <a href="dashboard.html" style="color:#c084fc; font-size:0.75rem; font-weight:bold; text-decoration:none; text-transform:uppercase; letter-spacing:1px;">💬 Le Mie Chat</a>
                    </div>
                    <button onclick="logout()" style="background:none; border:none; color:rgba(255,255,255,0.4); font-size:1.1rem; cursor:pointer; margin-left:5px;">🚪</button>
                </div>
            `;
        }
    };

    window.logout = function () {
        if (confirm("Vuoi uscire?")) {
            localStorage.removeItem('fashion_ai_user_email');
            localStorage.removeItem('fashion_ai_user_name');
            localStorage.removeItem('fashion_ai_user_verified');
            window.location.reload();
        }
    };

    // -- IMAGE HANDLING --
    window.handleImageSelection = function (event) {
        let file;
        if (event.target && event.target.files) file = event.target.files[0];
        else if (event.dataTransfer && event.dataTransfer.files) file = event.dataTransfer.files[0];

        if (!file) return;

        // Check if file is image
        if (!file.type.startsWith('image/')) {
            alert("Per favore, seleziona un'immagine valida (JPG, PNG, GIF).");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImageBase64 = e.target.result.split(',')[1];
            const preview = document.getElementById('image-preview');
            if (preview) preview.src = e.target.result;
            const container = document.getElementById('image-preview-container');
            if (container) container.style.display = 'flex';
        };
        reader.onerror = () => {
            alert("Errore nell'accesso alla galleria o al file. Assicurati di aver concesso i permessi.");
        };
        reader.readAsDataURL(file);
    };

    window.clearSelectedImage = function () {
        selectedImageBase64 = null;
        const input = document.getElementById('image-upload');
        if (input) input.value = '';
        const container = document.getElementById('image-preview-container');
        if (container) container.style.display = 'none';
        const preview = document.getElementById('image-preview');
        if (preview) preview.src = '#';
    };

    // PASTE HANDLING
    document.addEventListener('paste', (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        selectedImageBase64 = ev.target.result.split(',')[1];
                        const preview = document.getElementById('image-preview');
                        if (preview) preview.src = ev.target.result;
                        const container = document.getElementById('image-preview-container');
                        if (container) container.style.display = 'flex';
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    });

    // DRAG AND DROP HANDLING
    const chatWrapper = document.getElementById('chat-interface-wrapper');
    if (chatWrapper) {
        chatWrapper.addEventListener('dragover', (e) => {
            e.preventDefault();
            const overlay = document.getElementById('drop-overlay');
            if (overlay) overlay.style.display = 'flex';
        });
        chatWrapper.addEventListener('dragleave', (e) => {
            const overlay = document.getElementById('drop-overlay');
            if (overlay && !chatWrapper.contains(e.relatedTarget)) overlay.style.display = 'none';
        });
        chatWrapper.addEventListener('drop', (e) => {
            e.preventDefault();
            const overlay = document.getElementById('drop-overlay');
            if (overlay) overlay.style.display = 'none';
            handleImageSelection(e);
        });
    }

    // SPEECH RECOGNITION
    let isListening = false;
    const recognition = (window.SpeechRecognition || window.webkitSpeechRecognition) ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;

    if (recognition) {
        recognition.lang = 'it-IT';
        recognition.continuous = false;
        recognition.onstart = () => {
            isListening = true;
            const voiceBtn = document.getElementById('voice-btn');
            if (voiceBtn) voiceBtn.style.color = '#9d4edd';
            const userInput = document.getElementById('user-input');
            if (userInput) userInput.placeholder = "Sto ascoltando... 🎤";
        };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const userInput = document.getElementById('user-input');
            if (userInput) userInput.value = transcript;
        };
        recognition.onend = () => {
            isListening = false;
            const voiceBtn = document.getElementById('voice-btn');
            if (voiceBtn) voiceBtn.style.color = '#aaa';
            const userInput = document.getElementById('user-input');
            if (userInput) userInput.placeholder = "Chiedimi qualsiasi cosa...";
        };
    }

    window.toggleVoiceRecognition = function () {
        if (!recognition) return alert("Il tuo browser non supporta la trascrizione vocale.");

        if (isListening) {
            recognition.stop();
            return;
        }

        // Request explicit microphone permission first
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    recognition.start();
                })
                .catch((err) => {
                    console.error("Microphone permission denied:", err);
                    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                        alert("⚠️ Permesso microfono negato. Per favore, abilita l'accesso nelle impostazioni del browser/dispositivo per usare il vocale.");
                    } else {
                        alert("Errore nell'accesso al microfono. Riprova.");
                    }
                });
        } else {
            // Fallback for browsers without getUserMedia but with SpeechRecognition
            recognition.start();
        }
    };
});

/* CHATBOT CORE LOGIC */
let conversationHistory = [];
let selectedImageBase64 = null;
let currentChatId = sessionStorage.getItem('fashion_ai_current_chat_id') || 'chat_' + Date.now();
sessionStorage.setItem('fashion_ai_current_chat_id', currentChatId);

async function sendMessage() {
    const input = document.getElementById('user-input');
    const messages = document.getElementById('chat-messages');
    if (!input || !messages) return;
    const text = input.value.trim();
    if (!text && !selectedImageBase64) return;

    addMessage(text || "Analizza questa immagine", 'user', true, selectedImageBase64);
    const imgToSend = selectedImageBase64;
    input.value = '';
    clearSelectedImage();

    const typing = document.createElement('div');
    typing.className = 'message bot-message typing-indicator chat-msg-appear';
    typing.innerHTML = 'Fashion AI sta scrivendo...';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    try {
        const response = await generateAIResponse(text, imgToSend);
        if (typing.parentNode) messages.removeChild(typing);
        addMessage(response, 'bot', true, null, true);
    } catch (e) {
        if (typing.parentNode) messages.removeChild(typing);
        if (e.message === 'NEED_LOGIN') {
            addMessage("Effettua il login per salvare le tue chat! ✨", 'bot', false);
            openLoginModal();
        } else if (e.message === 'API_KEY_INVALID') {
            addMessage("⚠️ La chiave API di Fashion AI sembra non essere valida o scaduta (Errore 401). Per favore, contatta l'amministratore.", 'bot', false);
        } else {
            addMessage(`Si è verificato un errore: ${e.message}. Riprova più tardi.`, 'bot', false);
        }
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight) + 'px';
}

function processAIText(text) {
    return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function addMessage(content, sender, save = true, img = null, animate = false) {
    const messages = document.getElementById('chat-messages');
    if (!messages) return;
    const div = document.createElement('div');
    div.className = `message ${sender}-message chat-msg-appear`;

    // Style adjustments for chat bubbles
    div.style.padding = '12px 18px';
    div.style.borderRadius = '16px';
    div.style.maxWidth = '85%';
    div.style.marginBottom = '10px';
    div.style.lineHeight = '1.6';

    if (sender === 'user') {
        div.style.alignSelf = 'flex-end';
        div.style.background = '#5a32a3';
        div.style.color = 'white';
        if (img) {
            const i = document.createElement('img');
            i.src = `data:image/jpeg;base64,${img}`;
            i.style.maxWidth = '220px';
            i.style.borderRadius = '12px';
            i.style.display = 'block';
            i.style.marginBottom = '8px';
            div.appendChild(i);
        }
    } else {
        div.style.alignSelf = 'flex-start';
        div.style.border = '1px solid rgba(157, 78, 221, 0.2)';
        div.style.background = 'rgba(157,78,221,0.07)';
        div.style.color = '#f0f0f0';
    }

    const span = document.createElement('span');
    div.appendChild(span);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;

    if (sender === 'bot' && animate) {
        let i = 0;
        const textToType = content;
        function type() {
            if (i < textToType.length) {
                span.innerHTML = processAIText(textToType.substring(0, i + 1));
                i++;
                messages.scrollTop = messages.scrollHeight;
                setTimeout(type, 12);
            }
        }
        type();
    } else {
        span.innerHTML = sender === 'bot' ? processAIText(content) : content;
        messages.scrollTop = messages.scrollHeight;
    }

    if (save) saveChatHistory(sender, content, img);
}

function saveChatHistory(role, content, img = null) {
    const email = localStorage.getItem('fashion_ai_user_email') || 'guest';
    const key = `fashion_ai_chats_${email}`;
    const chats = JSON.parse(localStorage.getItem(key) || '{}');
    if (!chats[currentChatId]) {
        chats[currentChatId] = { id: currentChatId, title: content.slice(0, 30) + '...', date: new Date().toLocaleString(), messages: [] };
    }
    chats[currentChatId].messages.push({ role, content, imageBase64: img });
    localStorage.setItem(key, JSON.stringify(chats));
    localStorage.setItem('fashion_ai_chats', JSON.stringify(chats));
}

function loadChatHistory(id = null) {
    if (id) { currentChatId = id; sessionStorage.setItem('fashion_ai_current_chat_id', id); }
    const email = localStorage.getItem('fashion_ai_user_email') || 'guest';
    const chats = JSON.parse(localStorage.getItem(`fashion_ai_chats_${email}`) || '{}');
    const history = chats[currentChatId]?.messages || [];
    const messages = document.getElementById('chat-messages');
    if (messages) {
        messages.innerHTML = '';
        if (history.length > 0) history.forEach(m => addMessage(m.content, m.role, false, m.imageBase64));
    }
}

async function generateAIResponse(text, img) {
    if (localStorage.getItem('fashion_ai_user_verified') !== 'true') throw new Error('NEED_LOGIN');

    // 🔑 NOTA: Se ricevi un errore 401, la chiave qui sotto potrebbe essere scaduta o non valida.
    const apiKey = "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";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin, // OpenRouter richiede referer per alcuni modelli
                "X-Title": "Fashion AI"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [{
                    role: "user",
                    content: img ? [
                        { type: "text", text: text || "Analizza questa immagine di moda" },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${img}` } }
                    ] : text
                }]
            })
        });

        if (response.status === 401) {
            throw new Error("API_KEY_INVALID");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Errore API: ${response.status}`);
        }

        const d = await response.json();
        return (d.choices && d.choices[0]) ? d.choices[0].message.content : "Nessuna risposta ricevuta dall'IA.";
    } catch (e) {
        console.error("Dettaglio Errore AI:", e);
        throw e;
    }
}

function refreshAuthState() {
    const isVerified = localStorage.getItem('fashion_ai_user_verified') === 'true';
    const email = localStorage.getItem('fashion_ai_user_email');
    const name = localStorage.getItem('fashion_ai_user_name') || "Utente";
    if (isVerified && email) {
        if (typeof updateNavbarAfterLogin === 'function') {
            updateNavbarAfterLogin(name, `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7b2cbf&color=fff`, email);
        }
        loadChatHistory();
    }
}

document.addEventListener('DOMContentLoaded', refreshAuthState);
window.addEventListener('focus', refreshAuthState);
