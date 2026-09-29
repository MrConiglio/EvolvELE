# EvolveELE 🇨🇭 | Sizing Web App Impianti Elettrici (NIBT / NIN / SIA)

Web Application reattiva, moderna e conforme alle norme elettrotecniche svizzere per il dimensionamento rapido di impianti elettrici a bassa tensione per il settore **Residenziale** (multi-blocco o singolo) e **Industriale**.

---

## ⚡ Caratteristiche Principali

### 1. Selettore Tipologia
- **Residenziale:** Gestione strutturata a blocchi multipli ($N$ blocchi, $M$ appartamenti per blocco) o edificio singolo.
- **Industriale:** Gestione linee macchinari, motori, HVAC, illuminazione, IT/uffici con fattori $k_u$ e $k_s$.

### 2. Parametri di Default Svizzeri (NIBT)
- **Alloggi:** Protezione principale standard da **25 A** (~17.3 kVA), montante in rame **5x6 mm² XLPE** (modificabili a 32A, 40A, 5x10 mm²).
- **Tensione di Rete:** Trifase simmetrica **400 V** (fase-neutro **230 V**), 50 Hz, sistema TN-S / TN-C-S.

### 3. Motore di Calcolo Automatico
- **Contemporaneità Appartamenti ($k_s$):** Curva e tabella esatta **NIBT Tabella 3.1.2** / Tabellenbuch Elektrotechnik.
- **Servizi Generali / Parte Padronale:** Calcolo carichi tecnologici (Pompa di calore PAC, ascensore, illuminazione, pompe riscaldamento/autoclave, ventilazione) con riserva configurabile (default 20% secondo raccomandazioni SIA 380/4).
- **Integrazione Mobilità Elettrica (EV):** Dimensionamento colonnine (11 kW o 22 kW) con sistema di gestione dinamica dei carichi (**LMS / Peak Shaving** conforme NIBT 7.22 e direttive VSE).
- **Fotovoltaico & RCP / ZEV:** Raggruppamento ai fini del Consumo Proprio con calcolo bidirezionale della corrente al punto di consegna (HAK) per prelievo di punta vs immissione solare estiva.
- **Protezione Generale HAK/HVD ($I_n$):** Scelta automatica della taglia standard ($I_n \ge I_b$) tra 16 A e 1000 A.
- **Cavi di Alimentazione e Portata ($I_z'$):** Calcolo portata con fattori di correzione temperatura $f_T$ (NIBT 5.2.5) e raggruppamento $f_r$ (NIBT 5.2.6) per metodi di posa B1, B2 (in soletta calcestruzzo), C, E (passerella forata).
- **Verifica Caduta di Tensione ($\Delta U\%$):** Verifica rigorosa $\Delta U \le 1.5\%$ o $2.0\%$ con formula trifase con componenti attiva e reattiva ($R' \cos\varphi + X' \sin\varphi$).
- **Tubi Protettivi Serie Svizzera KRFWG:** Selezione diametro nominale serie EN 61386 (M16...M110 o passerella forata) nel rispetto del **fattore di riempimento $\le 40\%-45\%$** per garantire sfilabilità del cavo.

### 4. Generatore di Relazione Tecnica (Stampa & PDF)
- Report ingegneristico formale in layout **A4**, pronto per la stampa o salvataggio in PDF con pulsante dedicato (`window.print()`).
- Dettaglio passo-passo di ogni formula applicata, valori numerici sostituiti, riferimenti normativi NIBT/SIA, tabella montanti e distinta materiali.

---

## 🚀 Avvio Rapido (Senza Riga di Comando)

Basta fare **doppio clic** sul file:
👉 **`AVVIA_EVOLVEELE.bat`** (oppure **`AVVIA.bat`**)

Il file si occuperà automaticamente di:
1. Verificare l'ambiente e i componenti
2. Avviare il server web locale
3. **Aprire in automatico il tuo browser predefinito** su `http://localhost:5173`

---

## 🛠️ Avvio Alternativo da Terminale

Se preferisci usare il terminale:
```bash
npm run dev
```

### Esecuzione Test & Validazione Normativa NIBT
```bash
npm run test:nibt
```

### Build di Produzione
```bash
npm run build
```

---

## 📐 Riferimenti Normativi e Standard
- **NIBT / NIN 2020 - 2025** (Norme d'installazione a bassa tensione - Electrosuisse)
- **SIA 380/4** (Energia elettrica negli edifici)
- **Raccomandazioni VSE / AES** per la mobilità elettrica e il Raggruppamento per il Consumo Proprio (RCP / ZEV)
- **Prescrizioni Gestori di Rete Cantonali** (AIL, SES, AMB, EKZ, BKW, SIG, CKW)
