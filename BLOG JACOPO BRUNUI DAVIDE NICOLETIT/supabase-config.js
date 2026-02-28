/**
 * Fashion AI — Supabase Configuration
 * 
 * Istruzioni:
 * 1. Vai su supabase.com → crea un progetto gratuito
 * 2. Settings → API → copia le chiavi qui sotto
 * 3. Salva e riapri il sito
 */

// =============================================
//  🔑 INSERISCI LE TUE CHIAVI QUI
// =============================================

const SUPABASE_URL = 'https://dytqqfwdwlrldhvmvgml.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dHFxZndkd2xybGRodm12Z21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTI4NDYsImV4cCI6MjA4Nzc4ODg0Nn0.5kG7siLzma7F7LBkLOXgJok5WcrcTVlhreqosbBRi2Y';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dHFxZndkd2xybGRodm12Z21sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjIxMjg0NiwiZXhwIjoyMDg3Nzg4ODQ2fQ.6EsvS6bb021yVmwjHQVFER2Nsby3kvqcNwQkp61M_X8'; // Solo admin

// =============================================
//  Supabase Client (no npm needed — CDN)
// =============================================

// Determine which key to use (admin pages use service key)
const _isAdminPage = window.location.pathname.includes('admin');
const _activeKey = _isAdminPage ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY;

/**
 * Generic Supabase fetch helper
 * Replaces the @supabase/supabase-js npm package with plain fetch
 */
const supabase = {
    url: SUPABASE_URL,
    key: _activeKey,

    headers() {
        return {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    },

    /**
     * INSERT a row
     * @param {string} table - Table name
     * @param {object} data - Row data
     */
    async insert(table, data) {
        const res = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Errore inserimento');
        }
        return await res.json();
    },

    /**
     * SELECT rows with optional filters
     * @param {string} table
     * @param {object} opts - { filter: string, order: string, limit: number }
     */
    async select(table, opts = {}) {
        let url = `${this.url}/rest/v1/${table}?select=*`;
        if (opts.filter) url += `&${opts.filter}`;
        if (opts.order) url += `&order=${opts.order}`;
        if (opts.limit) url += `&limit=${opts.limit}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: this.headers()
        });
        if (!res.ok) throw new Error('Errore lettura dati');
        return await res.json();
    },

    /**
     * SELECT single row by id
     */
    async selectOne(table, id) {
        const res = await fetch(`${this.url}/rest/v1/${table}?id=eq.${id}&select=*`, {
            method: 'GET',
            headers: this.headers()
        });
        if (!res.ok) throw new Error('Errore lettura');
        const rows = await res.json();
        return rows[0] || null;
    },

    /**
     * UPDATE a row by id
     * @param {string} table
     * @param {string} id
     * @param {object} data
     */
    async update(table, id, data) {
        const res = await fetch(`${this.url}/rest/v1/${table}?id=eq.${id}`, {
            method: 'PATCH',
            headers: this.headers(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Errore aggiornamento');
        return await res.json();
    },

    /**
     * DELETE a row by id
     */
    async delete(table, id) {
        const res = await fetch(`${this.url}/rest/v1/${table}?id=eq.${id}`, {
            method: 'DELETE',
            headers: this.headers()
        });
        if (!res.ok) throw new Error('Errore eliminazione');
        return true;
    },

    /**
     * Check if Supabase is configured
     */
    isConfigured() {
        return !SUPABASE_URL.includes('TUO-PROGETTO') && !SUPABASE_ANON_KEY.startsWith('eyJhbGciOiJIUzI1');
    }
};

// Log config status
if (supabase.isConfigured()) {
    console.log('✅ Supabase configurato correttamente');
} else {
    console.warn('⚠️ Supabase non configurato — usando localStorage come fallback. Segui la guida supabase_setup_guide.md');
}
