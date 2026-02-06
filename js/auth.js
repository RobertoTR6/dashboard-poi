import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// --- CONFIGURATION ---
// REPLACE THESE WITH YOUR SUPABASE PROJECT CREDENTIALS
// Go to Project Settings -> API
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'eyJxh... (your anon key)';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Login Function
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) throw error;
    return data.user;
}

// Logout Function
export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    window.location.href = 'login.html';
}

// Check Authentication Status
export function requireAuth() {
    // Check active session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            handleNoAuth();
        } else {
            handleAuth(session.user);
        }
    });

    // Listen for changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
            handleNoAuth();
        } else if (event === 'SIGNED_IN' || session) {
            handleAuth(session.user);
        }
    });
}

function handleNoAuth() {
    if (!window.location.href.includes('login.html')) {
        console.log("No active session, redirecting...");
        window.location.href = 'login.html';
    }
}

function handleAuth(user) {
    console.log("User authenticated:", user.email);
    if (window.location.href.includes('login.html')) {
        window.location.href = 'dashboard_poi.html';
    }
}
