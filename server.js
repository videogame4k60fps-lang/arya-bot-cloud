require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ==========================================
// 1. DATABASE SQLITE
// ==========================================
const dbPath = process.env.DB_PATH || './database.sqlite';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Errore apertura DB:', err.message);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT NOT NULL,
        client_phone TEXT,
        client_email TEXT,
        service_id TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// ==========================================
// 2. API REST
// ==========================================

// Tutti gli slot di default
function getAllSlots(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDay(); // 0=Dom, 6=Sab
    if (day === 0) return []; // Domenica chiuso
    if (day === 6) {
        return ['09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];
    }
    return ['09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30'];
}

async function getAvailableSlots(dateStr) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT time FROM appointments WHERE date = ?`, [dateStr], (err, rows) => {
            if (err) return reject(err);
            const booked = rows.map(r => r.time);
            const all = getAllSlots(dateStr);
            resolve(all.filter(s => !booked.includes(s)));
        });
    });
}

async function bookAppointment(date, time, name, phone) {
    return new Promise((resolve) => {
        db.run(
            `INSERT INTO appointments (client_name, client_phone, date, time) VALUES (?, ?, ?, ?)`,
            [name, phone, date, time],
            function(err) {
                resolve(!err);
            }
        );
    });
}

// GET /api/availability?date=YYYY-MM-DD
app.get('/api/availability', async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Parametro date mancante' });
    try {
        const available = await getAvailableSlots(date);
        res.json({ date, available });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/appointments
app.post('/api/appointments', (req, res) => {
    const { clientName, clientPhone, clientEmail, serviceId, date, time } = req.body;
    if (!clientName || !date || !time) return res.status(400).json({ error: 'Dati mancanti' });
    db.run(
        `INSERT INTO appointments (client_name, client_phone, client_email, service_id, date, time) VALUES (?, ?, ?, ?, ?, ?)`,
        [clientName, clientPhone, clientEmail, serviceId, date, time],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

// ==========================================
// 3. WHATSAPP AI AGENT CON GROQ (LLaMA 3)
// ==========================================
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const chatMemories = {};

const waClient = new Client({
    authStrategy: new LocalAuth({ dataPath: process.env.SESSION_PATH || './.wwebjs_auth' }),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu']
    }
});

waClient.on('qr', (qr) => {
    console.log('\n📱 Scansiona il QR Code con WhatsApp:\n');
    qrcode.generate(qr, { small: true });
});

waClient.on('ready', () => {
    console.log('\n✅ Agente WhatsApp Collegato e Attivo! Ora risponde ai messaggi.\n');
});

waClient.on('message', async (msg) => {
    // Ignora messaggi di gruppo
    if (msg.from.endsWith('@g.us')) return;
    // Ignora messaggi inviati da noi stessi
    if (msg.fromMe) return;

    const text = msg.body;
    const phone = msg.from;

    if (!chatMemories[phone]) {
        chatMemories[phone] = [];
    }
    chatMemories[phone].push({ role: 'user', content: text });

    const todayStr = new Date().toISOString().split('T')[0];
    const systemPrompt = `Sei l'assistente IA di ARYA Barber Shop. Oggi è il ${todayStr}.
Regole:
1. Sii conciso (max 2 frasi). Non ripetere il saluto se ti abbiamo già salutato.
2. Se il cliente vuole prenotare o tagliare i capelli, chiedi esplicitamente "Per quale giorno desideri l'appuntamento?".
3. SE e SOLO SE il cliente specifica il giorno, DEVI usare questo comando testuale nascosto nella tua risposta:
[CMD:CHECK_AVAILABILITY, date: YYYY-MM-DD]
Esempio: Se oggi è il 14 e chiede "domani", usa [CMD:CHECK_AVAILABILITY, date: 2026-04-15]. NON usare questo comando se non hai capito il giorno.
4. SE e SOLO SE avete concordato un giorno, un orario e sai il nome del cliente, esegui quest'ultimo comando:
[CMD:BOOK, date: YYYY-MM-DD, time: HH:MM, name: NOME_CLIENTE, phone: ${phone}]
Non aggiungere altro dopo i comandi.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...chatMemories[phone].slice(-6)
    ];

    try {
        const result = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.1-8b-instant",
        });
        let aiResponse = result.choices[0]?.message?.content || "";

        // Command Interceptors
        if (aiResponse.includes('[CMD:CHECK_AVAILABILITY')) {
            const dateMatch = aiResponse.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
                const dateTarget = dateMatch[1];
                const slots = await getAvailableSlots(dateTarget);
                const stringSlots = slots.length > 0 ? slots.join(', ') : "Esauriti. Chiedi al cliente un altro giorno.";

                const reflectionMsgs = [
                    ...messages,
                    { role: "assistant", content: aiResponse },
                    { role: "system", content: `SISTEMA: Orari disponibili per ${dateTarget}: ${stringSlots}. Scrivi UNA breve frase per proporli al cliente.` }
                ];

                const r2 = await groq.chat.completions.create({
                    messages: reflectionMsgs,
                    model: "llama-3.1-8b-instant",
                });
                aiResponse = r2.choices[0]?.message?.content || "";
            }
        }
        else if (aiResponse.includes('[CMD:BOOK')) {
            const dM = aiResponse.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
            const tM = aiResponse.match(/time:\s*(\d{2}:\d{2})/);
            const nM = aiResponse.match(/name:\s*(.*?)(?:,|$|\])/);
            if (dM && tM && nM) {
                const cleanName = nM[1].replace(/\]/g, '').trim() || "Cliente";
                const success = await bookAppointment(dM[1], tM[1], cleanName, phone);
                aiResponse = success
                    ? `Perfetto ${cleanName}! Confermo la tua prenotazione per il ${dM[1]} alle ${tM[1]}. Ti aspettiamo in Salone! ✂️`
                    : `Scusami, ho avuto un calo di linea al database. Potresti ripetere l'orario se eri interessato?`;
            }
        }

        const finalMessage = aiResponse.replace(/\[CMD:.*?\]/gs, '').trim();

        if (finalMessage) {
            chatMemories[phone].push({ role: 'assistant', content: finalMessage });
            msg.reply(finalMessage);
        }

    } catch (e) {
        console.error('Errore Generazione AI:', e);
    }
});

waClient.initialize();

// ==========================================
// 4. AVVIO SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n\n[ SERVER AVVIATO ]\n`);
    console.log(`🌍 Interfaccia Web Attiva su http://0.0.0.0:${PORT}`);
    console.log(`🤖 Logica AI Inizializzata`);
    console.log(`\nAttendere l'apertura del modulo WhatsApp...\n`);
});
