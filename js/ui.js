/**
 * POI 2026 Dashboard - UI Utilities
 * Functions for table rendering, loading states, and user interactions
 */

const UIUtils = {
    /**
     * Show loading overlay
     */
    showLoading() {
        if (document.getElementById('loading-overlay')) return;

        document.body.insertAdjacentHTML('beforeend', `
            <div id="loading-overlay" class="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white p-8 rounded-lg shadow-xl">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sis-primary mx-auto"></div>
                    <p class="mt-4 text-slate-700 font-medium">Cargando datos...</p>
                </div>
            </div>
        `);
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    },

    /**
     * Show warning banner
     */
    showWarning(message) {
        const existing = document.getElementById('warning-banner');
        if (existing) existing.remove();

        const banner = document.createElement('div');
        banner.id = 'warning-banner';
        banner.className = 'bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded shadow-sm';
        banner.innerHTML = `
            <div class="flex items-start">
                <svg class="h-5 w-5 text-amber-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-1">
                    <p class="text-sm font-medium text-amber-800">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-amber-500 hover:text-amber-700">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        `;

        const header = document.querySelector('header');
        header.insertAdjacentElement('afterend', banner);
    },

    /**
     * Update KPI cards
     */
    updateKPIs(kpis) {


        document.getElementById('kpi-cc').textContent = kpis.uniqueCC;

        // Use PEIDataProcessor if available for Strategic Indicators (OEI/AEI)
        if (window.PEIDataProcessor) {
            const oeiSummary = window.PEIDataProcessor.getOEISummary();
            const aeiSummary = window.PEIDataProcessor.getAEISummary();

            // Total Indicators
            document.getElementById('kpi-oei').textContent = oeiSummary.total;
            document.getElementById('kpi-aei').textContent = aeiSummary.total;

            // Unique Counts (Objectives/Strategies)
            const oeiCountEl = document.getElementById('kpi-oei-count');
            if (oeiCountEl) oeiCountEl.textContent = oeiSummary.uniqueCount;

            const aeiCountEl = document.getElementById('kpi-aei-count');
            if (aeiCountEl) aeiCountEl.textContent = aeiSummary.uniqueCount;

        } else {
            document.getElementById('kpi-oei').textContent = kpis.uniqueOEI;
            document.getElementById('kpi-aei').textContent = kpis.uniqueAEI;
        }
        document.getElementById('kpi-ao').textContent = kpis.uniqueAO;
        document.getElementById('kpi-std').textContent = kpis.uniqueStd;
        document.getElementById('kpi-tareas').textContent = kpis.uniqueTareas;
        document.getElementById('kpi-process-n0').textContent = kpis.uniqueProcessN0 || 0;
        document.getElementById('kpi-process-n1').textContent = kpis.uniqueProcessN1 || 0;
    },

    /**
     * Render table with data
     */
    /**
     * Render table with hierarchical data
     */
    /**
     * Show glossary tooltip
     */
    showTooltip(e, title, content, meta = '') {
        const tooltip = document.getElementById('tooltip');
        if (!tooltip) return;

        // Cancel any pending hide
        this.cancelHide();

        tooltip.innerHTML = `
            <div class="font-bold text-slate-100 mb-1 border-b border-slate-600 pb-1">${title}</div>
            <div class="text-xs text-slate-300 mb-2">${content}</div>
            ${meta ? `<div class="text-[10px] text-slate-400 italic border-t border-slate-600 pt-1">${meta}</div>` : ''}
        `;

        // Add interaction events to tooltip itself
        tooltip.onmouseenter = () => this.cancelHide();
        tooltip.onmouseleave = () => this.hideTooltip();

        tooltip.style.opacity = '1';
        tooltip.style.display = 'block';

        const x = e.pageX;
        const y = e.pageY;

        // Basic positioning (adjust if off-screen logic could be added)
        tooltip.style.left = (x + 10) + 'px';
        tooltip.style.top = (y + 10) + 'px';
    },

    hideTooltip() {
        // Small delay to allow moving mouse into tooltip
        this.hideTimeout = setTimeout(() => {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip.style.opacity === '0') tooltip.style.display = 'none';
                }, 200);
            }
        }, 300);
    },

    cancelHide() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    },

    /**
     * Render the main data table
     */
    renderTable(groups) {
        console.time('UIUtils.renderTable');
        const tbody = document.getElementById('table-body');

        // Use DocumentFragment for batch insertion (Performance Optimization)
        const fragment = document.createDocumentFragment();

        if (!groups || groups.length === 0) {
            tbody.innerHTML = ''; // Clear existing content first
            tbody.innerHTML = `
                <tr>
                    <td colspan="18" class="px-6 py-12 text-center text-slate-500">
                        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="mt-2 font-medium">No se encontraron resultados</p>
                        <p class="text-sm">Intenta con otros términos de búsqueda</p>
                    </td>
                </tr>
            `;
            return;
        }

        const definitions = window.poiDefinitions || { activities: {}, tasks: {} };
        const monthKeys = ['ENE ', 'FEB ', 'MAR ', 'ABR ', 'MAY ', 'JUN ', 'JUL ', 'AGO ', 'SET ', 'OCT ', 'NOV ', 'DIC '];
        const totalKey = 'TOTAL ';

        groups.forEach(group => {
            // 1. Render Group Header Row (Activity Level)
            const trGroup = document.createElement('tr');
            trGroup.className = "bg-slate-100 border-b border-slate-300 font-bold text-slate-800 text-xs";

            // Lookup Definition
            // Use derived SIGESP code (e.g. M1.01.01) if available, otherwise try direct ID
            const actKey = group.sigesp_code || group.id_ceplan;
            const actDef = definitions.activities[actKey];

            // Helper for tooltip icon HTML
            const getInfoIcon = (title, def, meta) => {
                if (!def) return '';

                // Aggressive sanitization for HTML attribute validity
                const sanitize = (str) => {
                    if (!str) return '';
                    return str
                        .replace(/\\/g, '\\\\')       // Escape backslashes first
                        .replace(/'/g, "&apos;")      // Escape single quotes
                        .replace(/"/g, "&quot;")      // Escape double quotes
                        .replace(/\n/g, " ")          // Replace newlines with space
                        .replace(/\r/g, "")           // Remove returns
                        .replace(/`/g, "\`");         // Escape backticks
                };

                const safeTitle = sanitize(title);
                const safeDef = sanitize(def);
                const safeMeta = sanitize(meta);

                return `
                    <button class="ml-2 text-blue-400 hover:text-blue-600 focus:outline-none transition-colors" 
                        onmouseenter="UIUtils.showTooltip(event, '${safeTitle}', '${safeDef}', '${safeMeta}')"
                        onmouseleave="UIUtils.hideTooltip()">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                `;
            };

            const actInfo = actDef ? getInfoIcon('Definición Operativa', actDef.def, actDef.norma) : '';

            let groupHtml = `
                <td class="px-3 py-2 border-r border-slate-300 align-middle">
                    <div class="flex flex-col">
                        <div class="flex items-center">
                            <span class="text-xs uppercase text-slate-800 font-bold">${group.activity_name}</span>
                            ${actInfo}
                        </div>
                        <div class="flex items-center gap-2 mt-1">
                             <span class="font-mono text-[10px] text-slate-500">[${group.id_ceplan}]</span>
                             ${group.cc_name ? `<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold border border-blue-200">🚩 ${group.cc_name}</span>` : ''}
                        </div>
                    </div>
                </td>
                <td class="px-2 py-2 text-center border-r border-slate-300 text-[10px] align-middle">${group.um_ao}</td>
            `;

            // Group Monthly Totals
            monthKeys.forEach(m => {
                const val = group.totals[m];
                const displayVal = val > 0 ? val.toLocaleString() : '0';
                groupHtml += `<td class="px-1 py-2 text-center border-r border-slate-300 text-[10px]">${displayVal}</td>`;
            });

            // Group Grand Total
            const totalVal = group.totals[totalKey];
            groupHtml += `<td class="px-2 py-2 text-center font-bold text-slate-900 border-l border-slate-300">${totalVal.toLocaleString()}</td>`;

            trGroup.innerHTML = groupHtml;
            fragment.appendChild(trGroup);

            // 2. Render Child Rows (Task Level)
            group.children.forEach(row => {
                const trTask = document.createElement('tr');
                trTask.className = "bg-white hover:bg-slate-50 transition-colors border-b border-slate-100 text-xs";

                // Lookup Task Definition
                const taskDef = definitions.tasks[row['COD_TAREA_V2']];
                const taskInfo = taskDef ? getInfoIcon('Definición Operacional', taskDef.def, '') : '';

                let taskHtml = `
                    <td class="px-3 py-1 border-r border-slate-100 text-slate-600 pl-8 relative">
                         <!-- Indentation indicator line -->
                        <div class="absolute left-4 top-0 bottom-0 w-px bg-slate-200"></div>
                        <!-- Horizontal connector -->
                        <div class="absolute left-4 top-1/2 w-3 h-px bg-slate-200"></div>
                        
                        <div class="flex items-center">
                            ${row['COD_TAREA_V2'] ? `<span class="font-mono text-[9px] text-slate-400 mr-1">${row['COD_TAREA_V2']}</span> ` : ''}
                            <span class="truncate">${row['TAREAS_V2'] || '-'}</span>
                            ${taskInfo}
                        </div>
                    </td>
                    <td class="px-2 py-1 text-center text-slate-500 border-r border-slate-100 text-[10px]">${row['UM_TAREA'] || '-'}</td>
                `;

                // Task Monthly Values
                monthKeys.forEach(m => {
                    const val = parseFloat(row[m]) || 0;
                    const displayVal = val > 0 ? val.toLocaleString() : '0';
                    const colorClass = val > 0 ? 'text-slate-700 font-medium' : 'text-slate-300 text-[9px]';
                    taskHtml += `<td class="px-1 py-1 text-center border-r border-slate-100 text-[10px] ${colorClass}">${displayVal}</td>`;
                });

                // Task Grand Total
                const rowTotal = parseFloat(row[totalKey]) || 0;
                taskHtml += `<td class="px-2 py-1 text-center font-bold text-sis-primary border-l border-slate-200 bg-slate-50">${rowTotal.toLocaleString()}</td>`;

                trTask.innerHTML = taskHtml;
                fragment.appendChild(trTask);
            });
        });

        // Single DOM update
        tbody.innerHTML = '';
        tbody.appendChild(fragment);

        console.timeEnd('UIUtils.renderTable');
    },

    /**
     * Debounce function for search
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Show error message
     */
    showError(message) {
        document.body.innerHTML += `
            <div class="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-md">
                    <div class="text-red-500 text-center mb-4">
                        <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-2 text-center">Error al Cargar Datos</h3>
                    <p class="text-slate-600 text-sm text-center mb-4">${message}</p>
                    <button onclick="location.reload()" class="w-full bg-sis-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition">
                        Recargar Página
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Initialize tab system
     */
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        const searchContainer = document.getElementById('tab-search-container');
        const filterButton = document.getElementById('open-filters-drawer'); // Filter drawer button

        // Helper to update filter visibility
        const updateFilterVisibility = (tabId) => {
            if (filterButton) {
                if (tabId === 'tab-detalle' || tabId === 'tab-timeline') {
                    filterButton.style.display = 'block'; // Show for Tareas and Cronograma
                } else {
                    filterButton.style.display = 'none'; // Hide for others
                }
            }
        };

        // Initialize visibility based on active tab
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            updateFilterVisibility(activeTab.dataset.tab);
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked
                button.classList.add('active');
                const targetId = button.dataset.tab;
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Show/hide search input based on tab
                if (searchContainer) {
                    if (targetId === 'tab-detalle') {
                        searchContainer.classList.remove('hidden');
                    } else {
                        searchContainer.classList.add('hidden');
                    }
                }

                // Update Filter Button Visibility
                updateFilterVisibility(targetId);
            });
        });
    },

    /**
     * Toggle advanced filters
     */
    toggleAdvancedFilters() {
        const advancedSection = document.getElementById('filters-advanced');
        const toggleBtn = document.getElementById('toggle-advanced-filters');

        if (!advancedSection || !toggleBtn) return;

        advancedSection.classList.toggle('expanded');

        // Update button text and icon
        const isExpanded = advancedSection.classList.contains('expanded');
        const icon = toggleBtn.querySelector('svg path');

        if (isExpanded) {
            toggleBtn.innerHTML = `
                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                Ocultar
            `;
        } else {
            toggleBtn.innerHTML = `
                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                Avanzados
            `;
        }
    }
};

// Export
window.UIUtils = UIUtils;
