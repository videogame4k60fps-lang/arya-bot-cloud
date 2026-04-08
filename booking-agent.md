# ARYA AI Booking Agent

## Sistema di Prenotazione Intelligente

### Architettura

Il sistema di prenotazione AI può essere implementato in diversi modi:

#### Opzione 1: WhatsApp Business API (Consigliato per l'Italia)
- Usa la WhatsApp Business API (Meta)
- Bot che risponde automaticamente
- Guida l'utente: Servizio → Data → Ora → Conferma
- Invia promemoria automatici

**Costi**: ~$0.005 per messaggio (prezzi Meta)
**Setup**: Richiede numero WhatsApp Business verificato

#### Opzione 2: Instagram DM Automation
- Usa Instagram Basic Display API
- Risposte automatiche ai DM
- Meno flessibile di WhatsApp

#### Opzione 3: Chat Widget sul Sito
- Chat integrata nel sito web
- AI che guida la prenotazione
- Nessun costo aggiuntivo
- Funziona subito

#### Opzione 4: OpenClaw.ai / Piattaforme No-Code
- Piattaforme come ManyChat, Chatfuel
- Creazione bot visual senza codice
- Integrazione WhatsApp/Instagram

### Implementazione Consigliata

Per ARYA, consiglio questa strategia progressiva:

**Fase 1 (Subito)**: Chat widget sul sito + WhatsApp link con messaggio precompilato
**Fase 2 (1-2 mesi)**: WhatsApp Business API con bot automatico
**Fase 3 (3-6 mesi)**: Integrazione completa Instagram + promemoria automatici

### Struttura del Bot

```
Utente: "Voglio prenotare"
Bot: "Ciao! 👋 Benvenuto da ARYA. Quale servizio ti serve?"
     [Taglio] [Barba] [Taglio+Barba] [Altro]

Utente: "Taglio"
Bot: "Perfetto! Quando preferisci venire?"
     [Oggi] [Domani] [Scegli data]

Utente: "Domani"
Bot: "Ecco gli orari disponibili per domani:"
     [09:30] [10:00] [10:30] [11:00] [14:00] [15:30]

Utente: "10:00"
Bot: "Prenotazione confermata! ✅
     📅 Domani alle 10:00
     ✂️ Taglio e shampoo
     📍 Via Cesare Battisti 225, Triggiano
     
     Ti aspetto! - Gianni"
```

### Promemoria Automatici
- 24h prima: "Ricorda il tuo appuntamento domani alle 10:00"
- 2h prima: "Ci vediamo tra 2 ore! 📍 Via Cesare Battisti 225"
