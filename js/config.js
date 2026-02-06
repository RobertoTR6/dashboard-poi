/**
 * POI 2026 Dashboard - Configuration
 * Color schemes, constants, and settings
 */

const CONFIG = {
    // SIS Corporate Colors
    colors: {
        primary: '#005696',
        secondary: '#00A3E0',
        slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a'
        },
        chart: [
            '#005696',  // Primary
            '#00A3E0',  // Secondary
            '#475569',  // Slate 600
            '#94a3b8',  // Slate 400
            '#cbd5e1'   // Slate 300
        ]
    },

    // Chart dimensions
    charts: {
        barChart: {
            height: 400,
            margin: { top: 20, right: 30, bottom: 40, left: 220 }
        },
        donutChart: {
            width: 300,
            height: 300
        },
        lineChart: {
            height: 300,
            margin: { top: 20, right: 30, bottom: 30, left: 50 }
        }
    },

    // Data keys
    dataKeys: {
        months: ['ENE ', 'FEB ', 'MAR ', 'ABR ', 'MAY ', 'JUN ',
            'JUL ', 'AGO ', 'SET ', 'OCT ', 'NOV ', 'DIC '],
        requiredFields: [
            'Centro de Costo',
            'OEI',
            'ACTIVIDAD OPERATIVA',
            'COD_TAREA_V2'
        ]
    },

    // Table settings
    table: {
        initialRows: 50,
        rowsPerPage: 50
    },

    // Search debounce delay (ms)
    searchDebounce: 300
};

// Export for use in other modules
window.POI_CONFIG = CONFIG;
