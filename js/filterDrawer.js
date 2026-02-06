/**
 * Filter Drawer and Chips Management
 * Handles the drawer UI, active filters tracking, and filter chips display
 */

// Active filters state
const activeFilters = new Map();

// DOM Elements
let drawer, openBtn, closeBtn, overlay, filterBadge, chipsBar;
let chipsBarListenerAdded = false;

// Initialize drawer controls
function initializeDrawer() {
    drawer = document.getElementById('filters-drawer');
    openBtn = document.getElementById('open-filters-drawer');
    closeBtn = document.querySelector('.close-drawer');
    overlay = document.querySelector('.drawer-overlay');
    filterBadge = document.getElementById('filter-badge');
    chipsBar = document.getElementById('filter-chips-bar');

    if (!drawer || !openBtn) {
        console.warn('Drawer elements not found');
        return;
    }

    // Event listeners
    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Close with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });

    // Initialize filter change listeners
    initializeFilterListeners();

    // Initialize chips bar event delegation (once)
    initializeChipsBarEvents();

    console.log('✅ Drawer initialized');
}

// Open drawer
function openDrawer() {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close drawer
function closeDrawer() {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
}

// Initialize filter change listeners
function initializeFilterListeners() {
    const filterSelects = document.querySelectorAll('#filters-drawer select');

    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            updateActiveFilters();
            // Apply filters immediately
            if (typeof applyFilters === 'function') {
                applyFilters();
            }
        });
    });

    // Reset filters button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', clearAllFilters);
    }

    // Apply filters button (closes drawer)
    const applyBtn = document.getElementById('apply-filters');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            closeDrawer();
        });
    }
}

// Initialize chips bar event delegation (only once)
function initializeChipsBarEvents() {
    if (!chipsBar || chipsBarListenerAdded) return;

    chipsBar.addEventListener('click', (e) => {
        // Handle chip removal
        if (e.target.classList.contains('chip-remove')) {
            e.preventDefault();
            e.stopPropagation();

            const filterId = e.target.getAttribute('data-filter-id');
            console.log('Removing filter:', filterId);

            const select = document.getElementById(filterId);
            if (select) {
                select.value = 'all';
                // Trigger change event to update everything
                select.dispatchEvent(new Event('change'));
            } else {
                console.warn('Filter select not found:', filterId);
            }
        }

        // Handle clear all
        if (e.target.classList.contains('clear-all-chips')) {
            clearAllFilters();
        }
    });

    chipsBarListenerAdded = true;
}

// Update active filters tracking
function updateActiveFilters() {
    activeFilters.clear();

    const filterSelects = document.querySelectorAll('#filters-drawer select');

    filterSelects.forEach(select => {
        if (select.value !== 'all') {
            const label = select.previousElementSibling?.textContent.trim() || select.id;
            const value = select.options[select.selectedIndex].text;
            activeFilters.set(select.id, { label, value });
        }
    });

    updateFilterChips();
    updateFilterBadge();
}

// Update filter chips display
function updateFilterChips() {
    if (!chipsBar) return;

    chipsBar.innerHTML = '';

    if (activeFilters.size === 0) {
        chipsBar.style.display = 'none';
        return;
    }

    chipsBar.style.display = 'flex';

    // Create chips
    activeFilters.forEach((filter, id) => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `
            <span>${filter.label}: ${filter.value}</span>
            <button class="chip-remove" data-filter-id="${id}" aria-label="Eliminar filtro ${filter.label}">×</button>
        `;
        chipsBar.appendChild(chip);
    });

    // Add clear all button if there are 2+ filters
    if (activeFilters.size >= 2) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-all-chips';
        clearBtn.textContent = 'Limpiar todo';
        chipsBar.appendChild(clearBtn);
    }
}

// Update filter badge count
function updateFilterBadge() {
    if (!filterBadge) return;

    const count = activeFilters.size;

    if (count > 0) {
        filterBadge.textContent = count;
        filterBadge.style.display = 'flex';
        // Change button appearance when filters are active
        openBtn.classList.add('filters-active');
    } else {
        filterBadge.style.display = 'none';
        openBtn.classList.remove('filters-active');
    }
}

// Clear all filters
function clearAllFilters() {
    const filterSelects = document.querySelectorAll('#filters-drawer select');
    filterSelects.forEach(select => {
        select.value = 'all';
    });

    activeFilters.clear();
    updateFilterChips();
    updateFilterBadge();

    if (typeof applyFilters === 'function') {
        applyFilters();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDrawer);
} else {
    initializeDrawer();
}

// Export functions for use in other modules
window.FilterDrawer = {
    open: openDrawer,
    close: closeDrawer,
    updateActiveFilters,
    clearAllFilters,
    getActiveFilters: () => new Map(activeFilters)
};
