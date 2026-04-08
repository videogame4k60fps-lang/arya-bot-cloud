/* ============================================
   ARYA Hair Salon - AI Chat Agent
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // SCROLL RESET - Force top on every load
    // ==========================================
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    // ==========================================
    // AI CHAT AGENT
    // ==========================================

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const dayFullNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const monthFullNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    const services = [
        { id: 'bambino', name: 'Taglio Bambino', desc: 'Per i più piccoli (max 10 anni)', price: '13 €', duration: '25 min', icon: '✂' },
        { id: 'rasatura-lama', name: 'Rasatura a Lama', desc: 'Panno caldo e freddo', price: '10 €', duration: '20 min', icon: '🪒' },
        { id: 'barba-relax', name: 'Barba Relax', desc: 'Rifinitura con panno caldo', price: '10 €', duration: '20 min', icon: '🧔' },
        { id: 'rifinitura-barba', name: 'Rifinitura Barba', desc: 'Definizione contorni', price: '7 €', duration: '20 min', icon: '◈' },
        { id: 'rasatura-capelli', name: 'Rasatura Capelli', desc: 'Con shampoo purificante', price: '10 €', duration: '20 min', icon: '💈' },
        { id: 'taglio-pettine-forbice', name: 'Taglio Classico', desc: 'Pettine e forbice', price: '25 €', duration: '1 h', icon: '✂' },
        { id: 'combo-taglio-barba', name: 'Combo Completo', desc: 'Shampoo + taglio + barba', price: '25 €', duration: '1 h', icon: '◆' },
        { id: 'taglio-shampoo', name: 'Taglio + Shampoo', desc: 'Taglio completo', price: '20 €', duration: '40 min', icon: '✦' }
    ];

    const timeSlotsWeekday = ['09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30'];
    const timeSlotsSaturday = ['09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

    let state = {
        selectedService: null,
        selectedDate: null,
        selectedTime: null,
        clientName: '',
        clientPhone: '',
        clientEmail: ''
    };

    const chatMessages = document.getElementById('aiChatMessages');
    const chatInput = document.getElementById('aiChatInput');

    // Initialize chat
    function initChat() {
        setTimeout(() => {
            addAgentMessage("Ciao! 👋 Benvenuto da <strong>ARYA</strong>.");
            setTimeout(() => {
                addAgentMessage("Sono il tuo assistente personale. Ti guiderò nella prenotazione del tuo appuntamento. Come posso chiamarti?");
                showTextInput("Il tuo nome...", submitName);
            }, 600);
        }, 400);
    }

    // Add agent message with typing indicator
    function addAgentMessage(html, callback) {
        const typing = addTypingIndicator();
        setTimeout(() => {
            typing.remove();
            const msg = document.createElement('div');
            msg.className = 'chat-message agent';
            msg.innerHTML = `
                <div class="chat-message-avatar">✂</div>
                <div class="chat-message-bubble">${html}</div>
            `;
            chatMessages.appendChild(msg);
            scrollToBottom();
            if (callback) setTimeout(callback, 200);
        }, 800 + Math.random() * 400);
    }

    // Add user message
    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-message user';
        msg.innerHTML = `
            <div class="chat-message-avatar">👤</div>
            <div class="chat-message-bubble">${text}</div>
        `;
        chatMessages.appendChild(msg);
        scrollToBottom();
    }

    // Typing indicator
    function addTypingIndicator() {
        const existing = document.getElementById('typingIndicator');
        if (existing) existing.remove();
        const typing = document.createElement('div');
        typing.className = 'chat-message agent';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="chat-message-avatar">✂</div>
            <div class="typing-indicator"><span></span><span></span><span></span></div>
        `;
        chatMessages.appendChild(typing);
        scrollToBottom();
        return typing;
    }

    // Scroll to bottom
    function scrollToBottom() {
        setTimeout(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }, 50);
    }

    // Show text input
    function showTextInput(placeholder, onSubmit) {
        chatInput.innerHTML = `
            <input type="text" id="chatTextInput" placeholder="${placeholder}" autocomplete="off">
            <button id="chatSendBtn" aria-label="Invia">➤</button>
        `;
        const input = document.getElementById('chatTextInput');
        const btn = document.getElementById('chatSendBtn');
        input.focus({ preventScroll: true });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) onSubmit(input.value.trim());
        });
        btn.addEventListener('click', () => {
            if (input.value.trim()) onSubmit(input.value.trim());
        });
    }

    // Show service cards popup in chat
    function showServiceCards() {
        addAgentMessage("Scegli il servizio che preferisci:");
        
        setTimeout(() => {
            const popup = document.createElement('div');
            popup.className = 'chat-message agent';
            
            let cardsHtml = '<div class="service-cards-popup">';
            services.forEach((s, i) => {
                cardsHtml += `
                    <div class="service-card-chat" onclick="selectService(this, '${s.id}')" style="animation-delay: ${i * 0.05}s">
                        <div class="sc-icon">${s.icon}</div>
                        <div class="sc-info">
                            <div class="sc-name">${s.name}</div>
                            <div class="sc-desc">${s.desc} · ${s.duration}</div>
                        </div>
                        <div class="sc-price">${s.price}</div>
                    </div>
                `;
            });
            cardsHtml += '</div>';
            
            popup.innerHTML = `
                <div class="chat-message-avatar">✂</div>
                <div class="chat-message-bubble">${cardsHtml}</div>
            `;
            chatMessages.appendChild(popup);
            scrollToBottom();
        }, 1200);
    }

    // Select service
    window.selectService = function(el, serviceId) {
        document.querySelectorAll('.service-card-chat').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        
        state.selectedService = services.find(s => s.id === serviceId);
        addUserMessage(`${state.selectedService.icon} ${state.selectedService.name}`);
        
        // Disable all cards
        document.querySelectorAll('.service-card-chat').forEach(c => {
            c.style.pointerEvents = 'none';
            if (!c.classList.contains('selected')) c.style.opacity = '0.3';
        });
        
        setTimeout(() => showDatePopup(), 600);
    };

    // Show date popup in chat
    function showDatePopup() {
        addAgentMessage(`Perfetto! <strong>${state.selectedService.name}</strong> — ${state.selectedService.price}<br>Ora scegli il giorno:`);
        
        setTimeout(() => {
            const popup = document.createElement('div');
            popup.className = 'chat-message agent';
            
            let gridHtml = '<div class="date-popup">';
            const today = new Date();
            for (let i = 1; i <= 12; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dayOfWeek = date.getDay();
                const isClosed = dayOfWeek === 0 || dayOfWeek === 1;
                
                gridHtml += `
                    <div class="date-card-chat${isClosed ? ' unavailable' : ''}" data-date="${date.toISOString()}" ${isClosed ? '' : 'onclick="selectDate(this)"'}>
                        <div class="dc-day">${dayNames[dayOfWeek]}</div>
                        <div class="dc-num">${date.getDate()}</div>
                        <div class="dc-month">${monthNames[date.getMonth()]}</div>
                    </div>
                `;
            }
            gridHtml += '</div>';
            
            popup.innerHTML = `
                <div class="chat-message-avatar">✂</div>
                <div class="chat-message-bubble">${gridHtml}</div>
            `;
            chatMessages.appendChild(popup);
            scrollToBottom();
        }, 1000);
    }

    // Select date
    window.selectDate = function(el) {
        document.querySelectorAll('.date-card-chat').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        
        state.selectedDate = new Date(el.getAttribute('data-date'));
        const dayName = dayFullNames[state.selectedDate.getDay()];
        const dateFormatted = `${state.selectedDate.getDate()} ${monthFullNames[state.selectedDate.getMonth()]}`;
        addUserMessage(`📅 ${dayName} ${dateFormatted}`);
        
        document.querySelectorAll('.date-card-chat').forEach(c => {
            c.style.pointerEvents = 'none';
            if (!c.classList.contains('selected')) c.style.opacity = '0.3';
        });
        
        setTimeout(() => showTimePopup(), 600);
    };

    // Show time popup in chat
    async function showTimePopup() {
        const dayOfWeek = state.selectedDate.getDay();
        const endTime = dayOfWeek === 6 ? '18:00' : '19:00';
        const dateStr = state.selectedDate.toISOString().split('T')[0];
        
        addAgentMessage(`Verifico le disponibilità per questa data...`);
        
        try {
            const res = await fetch(`/api/availability?date=${dateStr}`);
            const data = await res.json();
            const slots = data.available || [];
            
            if (slots.length === 0) {
                setTimeout(() => addAgentMessage(`Siamo spiacenti, in questa data non ci sono orari liberi. Scegli un'altra giornata, per favore.`), 800);
                return;
            }
            
            setTimeout(() => {
                addAgentMessage(`Ecco gli orari disponibili<br><span style="color:var(--gray);font-size:0.75rem">09:30 – ${endTime}</span>`);
                
                setTimeout(() => {
                    const popup = document.createElement('div');
                    popup.className = 'chat-message agent';
                    
                    let gridHtml = '<div class="time-popup">';
                    slots.forEach((time, i) => {
                        gridHtml += `<div class="time-slot-chat" onclick="selectTime(this, '${time}')" style="animation-delay: ${i * 0.03}s">${time}</div>`;
                    });
                    gridHtml += '</div>';
                    
                    popup.innerHTML = `
                        <div class="chat-message-avatar">✂</div>
                        <div class="chat-message-bubble">${gridHtml}</div>
                    `;
                    chatMessages.appendChild(popup);
                    scrollToBottom();
                }, 1000);
            }, 800);
        } catch (e) {
            console.error(e);
            setTimeout(() => addAgentMessage(`Siamo spiacenti, c'è un problema di connessione. Riprova più tardi.`), 800);
        }
    }

    // Select time
    window.selectTime = function(el, time) {
        document.querySelectorAll('.time-slot-chat').forEach(s => s.classList.remove('selected'));
        el.classList.add('selected');
        state.selectedTime = time;
        addUserMessage(`🕐 ${time}`);
        
        document.querySelectorAll('.time-slot-chat').forEach(s => {
            s.style.pointerEvents = 'none';
            if (!s.classList.contains('selected')) s.style.opacity = '0.3';
        });
        
        setTimeout(() => {
            addAgentMessage("Ottimo! Ora ho bisogno dei tuoi dati per completare la prenotazione.");
            setTimeout(() => {
                addAgentMessage("Qual è il tuo <strong>numero di telefono</strong>?");
                showTextInput("Il tuo numero...", submitPhone);
            }, 600);
        }, 500);
    };

    // Submit name
    function submitName(name) {
        state.clientName = name;
        addUserMessage(name);
        chatInput.innerHTML = '';
        
        addAgentMessage(`Piacere <strong>${name}</strong>! 😊 Ecco i nostri servizi:`);
        setTimeout(() => showServiceCards(), 500);
    }

    // Submit phone
    function submitPhone(phone) {
        state.clientPhone = phone;
        addUserMessage(phone);
        chatInput.innerHTML = '';
        
        addAgentMessage("Grazie! E la tua <strong>email</strong>?");
        setTimeout(() => {
            showTextInput("La tua email...", submitEmail);
        }, 600);
    }

    // Submit email
    function submitEmail(email) {
        state.clientEmail = email;
        addUserMessage(email);
        chatInput.innerHTML = '';
        
        setTimeout(() => showConfirmation(), 500);
    }

    // Show confirmation
    function showConfirmation() {
        const dayName = dayFullNames[state.selectedDate.getDay()];
        const dateFormatted = `${dayName} ${state.selectedDate.getDate()} ${monthFullNames[state.selectedDate.getMonth()]} ${state.selectedDate.getFullYear()}`;
        
        const html = `
            Ecco il riepilogo della prenotazione:
            <div class="chat-summary">
                <p><span>Servizio</span><strong>${state.selectedService.icon} ${state.selectedService.name}</strong></p>
                <p><span>Data</span><strong>${dateFormatted}</strong></p>
                <p><span>Orario</span><strong>${state.selectedTime}</strong></p>
                <p><span>Prezzo</span><strong>${state.selectedService.price}</strong></p>
                <p><span>Cliente</span><strong>${state.clientName}</strong></p>
                <p><span>Telefono</span><strong>${state.clientPhone}</strong></p>
                <p><span>Email</span><strong>${state.clientEmail}</strong></p>
            </div>
            Confermo la prenotazione?
        `;
        
        addAgentMessage(html);
        
        setTimeout(() => {
            const popup = document.createElement('div');
            popup.className = 'chat-message agent';
            popup.innerHTML = `
                <div class="chat-message-avatar">✂</div>
                <div class="chat-message-bubble">
                    <div class="confirm-buttons">
                        <button class="confirm-btn yes" onclick="confirmBooking()">✅ Conferma</button>
                        <button class="confirm-btn no" onclick="cancelBooking()">❌ Annulla</button>
                    </div>
                </div>
            `;
            chatMessages.appendChild(popup);
            scrollToBottom();
        }, 1200);
    }

    // Confirm booking
    window.confirmBooking = async function() {
        // Disable buttons
        document.querySelectorAll('.confirm-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.4'; });
        
        addUserMessage("Confermo! ✅");
        addAgentMessage("Salvataggio nel sistema in corso...");
        
        const dayName = dayFullNames[state.selectedDate.getDay()];
        const dateFormatted = `${dayName} ${state.selectedDate.getDate()} ${monthFullNames[state.selectedDate.getMonth()]} ${state.selectedDate.getFullYear()}`;
        const dateStr = state.selectedDate.toISOString().split('T')[0];
        
        try {
            await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: state.clientName,
                    clientPhone: state.clientPhone,
                    clientEmail: state.clientEmail,
                    serviceId: state.selectedService.id,
                    date: dateStr,
                    time: state.selectedTime
                })
            });
            
            setTimeout(() => {
                const html = `
                    <div style="text-align:center;">
                        <div style="font-size:2.5rem;margin-bottom:0.5rem;">🎉</div>
                        <strong style="font-size:1.1rem;">Prenotazione Confermata!</strong><br>
                        <span style="color:var(--medium-gray);font-size:0.85rem;">Registrata nel Calendario del Negozio.</span>
                    </div>
                `;
                addAgentMessage(html);
                
                // Build WhatsApp message
                const waMessage = `Prenotazione ARYA:%0A%0A📅 ${dateFormatted}%0A🕐 ${state.selectedTime}%0A✂️ ${state.selectedService.name} — ${state.selectedService.price}%0A👤 ${state.clientName}%0A📱 ${state.clientPhone}%0A📧 ${state.clientEmail}`;
                
                // Show modal
                const modalDetails = document.getElementById('modalDetails');
                modalDetails.innerHTML = `
                    <p><strong>Nome:</strong> <span>${state.clientName}</span></p>
                    <p><strong>Data:</strong> <span>${dateFormatted}</span></p>
                    <p><strong>Orario:</strong> <span>${state.selectedTime}</span></p>
                    <p><strong>Servizio:</strong> <span>${state.selectedService.name}</span></p>
                    <p><strong>Telefono:</strong> <span>${state.clientPhone}</span></p>
                `;
                document.getElementById('whatsappConfirm').href = `https://wa.me/390801234567?text=${waMessage}`;
                
                setTimeout(() => {
                    document.getElementById('confirmModal').classList.add('active');
                }, 1500);
                
                setTimeout(() => {
                    window.open(`https://wa.me/390801234567?text=${waMessage}`, '_blank');
                }, 2000);
                
                chatInput.innerHTML = '';
            }, 800);
        } catch (e) {
            console.error(e);
            addAgentMessage("Si è verificato un errore durante la prenotazione. Riprova più tardi.");
        }
    };

    // Cancel booking
    window.cancelBooking = function() {
        document.querySelectorAll('.confirm-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.4'; });
        addUserMessage("Annulla");
        
        setTimeout(() => {
            addAgentMessage("Nessun problema! Quando vuoi, sono qui per aiutarti. A presto! 👋");
            chatInput.innerHTML = '';
        }, 600);
    };

    // Close modal
    window.closeModal = function() {
        document.getElementById('confirmModal').classList.remove('active');
        state = { selectedService: null, selectedDate: null, selectedTime: null, clientName: '', clientPhone: '', clientEmail: '' };
        chatMessages.innerHTML = '';
        initChat();
    };

    // Initialize the AI chat agent
    initChat();

    // ==========================================
    // NAVIGATION
    // ==========================================
    
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    });
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNavLink);
    
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.querySelectorAll('span').forEach((s, i) => {
            if (i === 0) s.style.transform = 'none';
            if (i === 1) s.style.opacity = '1';
            if (i === 2) s.style.transform = 'none';
        });
    }
    
    navToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        navToggle.setAttribute('aria-expanded', isOpen);
        const spans = navToggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else closeMobileMenu();
    });
    
    document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => link.addEventListener('click', closeMobileMenu));
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 65, behavior: 'smooth' });
        });
    });
    
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    // ==========================================
    // SCROLL REVEAL
    // ==========================================
    
    const revealElements = document.querySelectorAll('.team-photo-wrapper, .team-description, .fondatore-image, .fondatore-content, .portfolio-item, .product-card, .review-card, .salon-content, .salon-image, .contact-item, .contact-map');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('active'); revealObserver.unobserve(entry.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    revealElements.forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });
    
    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; const startTime = Date.now();
            function updateCounter() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                stat.textContent = current.toLocaleString();
                if (progress < 1) requestAnimationFrame(updateCounter);
                else stat.textContent = target.toLocaleString();
            }
            updateCounter();
        });
        countersAnimated = true;
    }
    
    const fondatoreSection = document.querySelector('.fondatore');
    if (fondatoreSection) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) { animateCounters(); } });
        }, { threshold: 0.3 }).observe(fondatoreSection);
    }
    
    // ==========================================
    // PORTFOLIO LIGHTBOX
    // ==========================================
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src; lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    lightboxClose.addEventListener('click', () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) { lightbox.classList.remove('active'); document.body.style.overflow = ''; } });
    
    // ==========================================
    // PARALLAX
    // ==========================================
    
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) heroVideo.style.transform = `translateY(${scrolled * 0.15}px)`;
        });
    }
    
    // ==========================================
    // KEYBOARD ACCESSIBILITY
    // ==========================================
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
            if (lightbox.classList.contains('active')) { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
            closeModal();
        }
    });
    
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    
    console.log('ARYA Hair Salon - AI Agent loaded ✂️');
});
