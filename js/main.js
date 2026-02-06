/**
 * POI 2026 Dashboard - Main Application
 * Initialization and event handling
 */

(function () {
    'use strict';

    // Application state
    let appData = {
        raw: [],
        clean: [],
        filtered: [],
        kpis: {},
        totalKey: 'TOTAL',
        lastFilterState: {}, // Cache for filter DOM state
        globalTipoCCFilter: 'all', // Global Tipo CC filter
        globalCCFilter: 'all', // Global cost center filter
        globalOEIFilter: 'all', // Global OEI filter
        globalAEIFilter: 'all',  // Global AEI filter
        globalAOFilter: 'all',   // Global Actividad Operativa filter
        globalTareaFilter: 'all', // Global Tarea filter
        globalProcessTypeFilter: 'all', // Global Process Type filter
        globalProcessN0Filter: 'all',   // Global Process N0 filter
        globalProcessN1Filter: 'all'    // Global Process N1 filter
    }

    /**
     * Update all filter dropdowns based on current filter state (cascading filters)
     */
    /**
     * Optimized Single-Pass Filter Logic
     * Checks all cascading conditions in ONE loop over the data
     */
    /**
     * Refactored Filter Logic: Separation of Concern & Diffing
     */
    function updateFilterDropdowns() {
        const timerLabel = 'FilterUpdate-' + Date.now();
        console.time(timerLabel);

        // 1. Calculate available options based on current filters
        const options = calculateAvailableOptions();

        // 2. Render only what changed
        renderFilterDropdowns(options);

        console.timeEnd(timerLabel);
    }

    function calculateAvailableOptions() {
        const filters = {
            tipo_cc: appData.globalTipoCCFilter,
            cc: appData.globalCCFilter,
            oei: appData.globalOEIFilter,
            aei: appData.globalAEIFilter,
            ao: appData.globalAOFilter,
            tarea: appData.globalTareaFilter,
            p_type: appData.globalProcessTypeFilter,
            p_n0: appData.globalProcessN0Filter,
            p_n1: appData.globalProcessN1Filter
        };

        const sets = {
            tipo_cc: new Set(),
            cc: new Map(),
            oei: new Map(),
            aei: new Map(),
            ao: new Map(),
            tarea: new Map(),
            p_type: new Set(),
            p_n0: new Set(),
            p_n1: new Set()
        };

        // Single Pass Loop
        appData.clean.forEach(row => {
            const m = {
                tipo_cc: filters.tipo_cc === 'all' || row['tipo_cc'] === filters.tipo_cc,
                cc: filters.cc === 'all' || row['Centro de Costo'] === filters.cc,
                oei: filters.oei === 'all' || row['OEI'] === filters.oei,
                aei: filters.aei === 'all' || row['AEI'] === filters.aei,
                ao: filters.ao === 'all' || row['Actividad Operativa ID_CEPLAN'] === filters.ao || row['Actividad Operativa ID_SIGESP'] === filters.ao,
                tarea: filters.tarea === 'all' || row['COD_TAREA_V2'] === filters.tarea,
                p_type: filters.p_type === 'all' || row._process_type === filters.p_type,
                p_n0: filters.p_n0 === 'all' || row._process_n0 === filters.p_n0,
                p_n1: filters.p_n1 === 'all' || row._process_n1 === filters.p_n1
            };

            // 1. Tipo CC
            if (m.cc && m.oei && m.aei && m.ao && m.tarea && m.p_type && m.p_n0 && m.p_n1) {
                if (row['tipo_cc']) sets.tipo_cc.add(row['tipo_cc']);
            }
            // 2. CC
            if (m.tipo_cc && m.oei && m.aei && m.ao && m.tarea && m.p_type && m.p_n0 && m.p_n1) {
                if (row['Centro de Costo']) sets.cc.set(row['Centro de Costo'], row['Centro Costo ID'] || '');
            }
            // 3. OEI
            if (m.tipo_cc && m.cc && m.aei && m.ao && m.tarea && m.p_type && m.p_n0 && m.p_n1) {
                if (row['OEI']) sets.oei.set(row['OEI'], row['Objetivo Estrategico Institucional']);
            }
            // 4. AEI
            if (m.tipo_cc && m.cc && m.oei && m.ao && m.tarea && m.p_type && m.p_n0 && m.p_n1) {
                if (row['AEI']) sets.aei.set(row['AEI'], row['Acción Estratégica Institucional']);
            }
            // 5. AO
            if (m.tipo_cc && m.cc && m.oei && m.aei && m.tarea && m.p_type && m.p_n0 && m.p_n1) {
                const aoCode = row['Actividad Operativa ID_CEPLAN'];
                const aoSigesp = row['Actividad Operativa ID_SIGESP'] || '';
                const aoName = row['ACTIVIDAD OPERATIVA'];
                const label = aoSigesp ? `${aoSigesp} - ${aoName}` : aoName;
                const value = aoSigesp ? aoSigesp : aoCode;
                if (aoCode) sets.ao.set(label, value);
            }
            // 6. Tarea
            if (m.tipo_cc && m.cc && m.oei && m.aei && m.ao && m.p_type && m.p_n0 && m.p_n1) {
                if (row['COD_TAREA_V2']) sets.tarea.set(row['COD_TAREA_V2'], row['TAREAS_V2']);
            }
            // 7. Process Type
            if (m.tipo_cc && m.cc && m.oei && m.aei && m.ao && m.tarea && m.p_n0 && m.p_n1) {
                if (row._process_type) sets.p_type.add(row._process_type);
            }
            // 8. Process N0
            if (m.tipo_cc && m.cc && m.oei && m.aei && m.ao && m.tarea && m.p_type && m.p_n1) {
                if (row._process_n0) sets.p_n0.add(row._process_n0);
            }
            // 9. Process N1
            if (m.tipo_cc && m.cc && m.oei && m.aei && m.ao && m.tarea && m.p_type && m.p_n0) {
                if (row._process_n1) sets.p_n1.add(row._process_n1);
            }
        });

        return {
            tipo_cc: Array.from(sets.tipo_cc).sort(),
            cc: sortMap(sets.cc),
            oei: sortMap(sets.oei),
            aei: sortMap(sets.aei),
            ao: sortMap(sets.ao),
            tarea: sortMap(sets.tarea),
            p_type: Array.from(sets.p_type).sort(),
            p_n0: Array.from(sets.p_n0).sort(),
            p_n1: Array.from(sets.p_n1).sort()
        };
    }

    function renderFilterDropdowns(options) {
        // Helper to check if update is needed
        const shouldUpdate = (id, newItems) => {
            const lastState = appData.lastFilterState[id];
            // Simple signature: length + first item key + last item key
            // This is a heuristic. For perfect accuracy we'd need full comparison, 
            // but for filters, length + boundaries usually detects changes well enough and is O(1)
            let newSignature = newItems.length + '-';
            if (newItems.length > 0) {
                if (Array.isArray(newItems[0])) { // Map entry [key, val]
                    newSignature += newItems[0][0] + '-' + newItems[newItems.length - 1][0];
                } else { // String
                    newSignature += newItems[0] + '-' + newItems[newItems.length - 1];
                }
            }

            if (lastState === newSignature) return false;

            appData.lastFilterState[id] = newSignature;
            return true;
        };

        requestAnimationFrame(() => {
            // Only re-render if changed
            if (shouldUpdate('global-tipo-cc-filter', options.tipo_cc))
                renderDropdown('global-tipo-cc-filter', options.tipo_cc, null, appData.globalTipoCCFilter);

            if (shouldUpdate('global-cc-filter', options.cc))
                renderDropdown('global-cc-filter', options.cc, 'map', appData.globalCCFilter);

            if (shouldUpdate('global-oei-filter', options.oei))
                renderDropdown('global-oei-filter', options.oei, 'map-label', appData.globalOEIFilter);

            if (shouldUpdate('global-aei-filter', options.aei))
                renderDropdown('global-aei-filter', options.aei, 'map-label', appData.globalAEIFilter);

            if (shouldUpdate('global-ao-filter', options.ao))
                renderDropdown('global-ao-filter', options.ao, 'map-raw', appData.globalAOFilter, 500);

            if (shouldUpdate('global-tarea-filter', options.tarea))
                renderDropdown('global-tarea-filter', options.tarea, 'map-label', appData.globalTareaFilter, 500);

            if (shouldUpdate('global-process-type-filter', options.p_type))
                renderDropdown('global-process-type-filter', options.p_type, null, appData.globalProcessTypeFilter);

            if (shouldUpdate('global-process-n0-filter', options.p_n0))
                renderDropdown('global-process-n0-filter', options.p_n0, null, appData.globalProcessN0Filter);

            if (shouldUpdate('global-process-n1-filter', options.p_n1))
                renderDropdown('global-process-n1-filter', options.p_n1, null, appData.globalProcessN1Filter);
        });
    }

    // Helper: Sort Map entries
    function sortMap(map) {
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }

    // Helper: Generalized Dropdown Renderer
    function renderDropdown(id, items, type, currentValue, limit = 0) {
        const dropdown = document.getElementById(id);
        if (!dropdown) return;

        const fragment = document.createDocumentFragment();
        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.textContent = (type === 'ao' || type === 'tarea') ? 'Todas' : 'Todos';
        fragment.appendChild(defaultOption);

        let count = 0;
        for (const item of items) {
            if (limit > 0 && count >= limit) break;

            const option = document.createElement('option');
            if (type === 'map') { // [Key=Name, Val=ID] -> Display "ID - Name"
                const [name, id] = item;
                option.value = name;
                option.textContent = id ? `${id.replace(/^'/, '')} - ${name}` : name;
            } else if (type === 'map-label') { // [Key=ID, Val=Name] -> Display "ID - Name" (Standard)
                const [id, name] = item;
                option.value = id;
                option.textContent = name ? `${id} - ${name.substring(0, 60)}` : id;
            } else if (type === 'map-raw') { // [Key=Label, Val=Value] -> Display Label
                const [label, val] = item;
                option.value = val;
                option.textContent = label.substring(0, 80);
            } else { // Array of strings
                option.value = item;
                option.textContent = item;
            }
            fragment.appendChild(option);
            count++;
        }

        if (limit > 0 && items.length > limit) {
            const option = document.createElement('option');
            option.disabled = true;
            option.textContent = `... y ${items.length - limit} más`;
            fragment.appendChild(option);
        }

        dropdown.innerHTML = '';
        dropdown.appendChild(fragment);

        // Restore value logic
        if (currentValue !== 'all') {
            dropdown.value = currentValue;
            // Strict check: if value doesn't exist in new options, reset (visual only, state logic handles cascade)
            if (dropdown.value !== currentValue && currentValue !== '') {
                // Optimization: Don't force reset here, let the state update handler naturally reset it if needed
                // Or better yet, leave it blank to indicate "Invalid Selection" 
                // But for now, we'll leave it as is to avoid jumping
                dropdown.value = 'all';
            }
        }
    }



    /**
     * Update entire dashboard with current filters
     */
    function updateDashboard() {
        console.time('Main.updateDashboard');
        // Update filter dropdowns based on current selections (cascading)
        updateFilterDropdowns();

        // Update breadcrumb navigation (NEW)
        if (window.BreadcrumbNav) {
            BreadcrumbNav.update(appData);
        }

        const filteredData = getFilteredData();
        console.log('Updating dashboard with', filteredData.length, 'rows');

        // Recalculate KPIs with filtered data
        const kpis = DataProcessor.calculateKPIs(filteredData);
        UIUtils.updateKPIs(kpis);

        // Update charts
        const ccData = DataProcessor.aggregateCCData(filteredData, 'all');
        ChartRenderer.renderBarChart('#chart-cc', ccData);

        const taskData = DataProcessor.aggregateTaskData(filteredData);
        ChartRenderer.renderBarChart('#chart-tasks', taskData);

        const monthlyData = DataProcessor.aggregateMonthlyData(filteredData);
        ChartRenderer.renderVerticalBarChart('#chart-timeline-content', monthlyData); // Updated for tab system

        // Update table - HIERARCHICAL VIEW
        const groupedData = DataProcessor.groupActivities(filteredData);
        const displayGroups = groupedData.slice(0, POI_CONFIG.table.initialRows);
        UIUtils.renderTable(displayGroups);
        console.timeEnd('Main.updateDashboard');
    }

    /**
     * Render all charts
     */
    function renderAllCharts() {
        // Bar chart: Top 10 CC
        const ccData = DataProcessor.aggregateCCData(appData.clean, 'all');
        ChartRenderer.renderBarChart('#chart-cc', ccData);

        // Donut chart: OEI distribution
        const oeiData = DataProcessor.aggregateOEIData(appData.clean);
        // Note: Donut chart might have been removed in previous steps or replaced, checking charts.js existence
        if (ChartRenderer.renderDonutChart) {
            ChartRenderer.renderDonutChart('#chart-oei', oeiData);
        }

        // Line chart: Monthly distribution
        const monthlyData = DataProcessor.aggregateMonthlyData(appData.clean);
        ChartRenderer.renderVerticalBarChart('#chart-timeline', monthlyData);
    }


    /**
     * Initialize the dashboard
     */
    function initDashboard() {
        UIUtils.showLoading();

        // Check if data is loaded
        if (typeof window.poiData === 'undefined') {
            console.error("Data file 'data.js' not loaded or window.poiData is undefined.");
            UIUtils.hideLoading();
            UIUtils.showError(
                'No se pudo cargar data.js. Por favor asegúrate de ejecutar poi_processor.py primero.'
            );
            return;
        }

        try {
            // Load and clean data
            appData.raw = window.poiData;
            console.log("Data loaded:", appData.raw.length, "rows");

            appData.clean = DataProcessor.cleanData(appData.raw);
            console.log("Clean data:", appData.clean.length, "rows");

            // Validate data
            const validation = DataProcessor.validateData(appData.clean);
            if (!validation.valid) {
                UIUtils.showWarning(
                    `Se encontraron ${validation.issueCount} problemas en los datos. Los resultados pueden ser inexactos.`
                );
            }

            // Populate dropdowns
            updateFilterDropdowns();

            // Initial dashboard render
            updateDashboard();

            // Setup event listeners
            setupEventListeners();

            // Initialize PEI Dashboards (NEW)
            if (window.PEI_DATA && window.OEIDashboard && window.AEIDashboard) {
                console.log('Initializing PEI Dashboards...');
                OEIDashboard.init();
                AEIDashboard.init();
            } else {
                console.warn('PEI data or dashboards not loaded');
            }

            UIUtils.hideLoading();

        } catch (error) {
            console.error("Error initializing dashboard:", error);
            UIUtils.hideLoading();
            UIUtils.showError(`Error al procesar los datos: ${error.message}`);
        }
    }

    /**
     * Get filtered data based on global filters
     * @param {boolean} excludeOne - Whether to exclude one filter from application (for dropdown updates)
     * @param {string} excludedFilter - The filter key to exclude ('ao', 'tarea', etc.)
     */
    function getFilteredData(excludeOne = false, excludedFilter = '') {
        let filtered = appData.clean;

        // Apply Tipo CC filter
        if (appData.globalTipoCCFilter !== 'all' && (!excludeOne || excludedFilter !== 'tipo_cc')) {
            filtered = filtered.filter(d => d['tipo_cc'] === appData.globalTipoCCFilter);
        }

        // Apply cost center filter
        if (appData.globalCCFilter !== 'all' && (!excludeOne || excludedFilter !== 'cc')) {
            filtered = filtered.filter(d => d['Centro de Costo'] === appData.globalCCFilter);
        }

        // Apply OEI filter
        if (appData.globalOEIFilter !== 'all' && (!excludeOne || excludedFilter !== 'oei')) {
            filtered = filtered.filter(d => d['OEI'] === appData.globalOEIFilter);
        }

        // Apply AEI filter
        if (appData.globalAEIFilter !== 'all' && (!excludeOne || excludedFilter !== 'aei')) {
            filtered = filtered.filter(d => d['AEI'] === appData.globalAEIFilter);
        }

        // Apply AO filter
        if (appData.globalAOFilter !== 'all' && (!excludeOne || excludedFilter !== 'ao')) {
            // Check both CEPLAN ID and SIGESP ID
            filtered = filtered.filter(d =>
                d['Actividad Operativa ID_CEPLAN'] === appData.globalAOFilter ||
                d['Actividad Operativa ID_SIGESP'] === appData.globalAOFilter
            );
        }

        // Apply Tarea filter
        if (appData.globalTareaFilter !== 'all' && (!excludeOne || excludedFilter !== 'tarea')) {
            filtered = filtered.filter(d => d['COD_TAREA_V2'] === appData.globalTareaFilter);
        }

        // Apply Process filters (these work on grouped data, so we need special handling)
        if ((appData.globalProcessTypeFilter !== 'all' && (!excludeOne || excludedFilter !== 'process_type')) ||
            (appData.globalProcessN0Filter !== 'all' && (!excludeOne || excludedFilter !== 'process_n0')) ||
            (appData.globalProcessN1Filter !== 'all' && (!excludeOne || excludedFilter !== 'process_n1'))) {

            // Group the filtered data to get process metadata
            const groupedData = DataProcessor.groupActivities(filtered);
            const validActivityIds = new Set();

            groupedData.forEach(group => {
                let include = true;

                // Check process type filter
                if (appData.globalProcessTypeFilter !== 'all' && (!excludeOne || excludedFilter !== 'process_type')) {
                    if (group.process_type !== appData.globalProcessTypeFilter) {
                        include = false;
                    }
                }

                // Check process N0 filter
                if (appData.globalProcessN0Filter !== 'all' && (!excludeOne || excludedFilter !== 'process_n0')) {
                    if (group.process_n0 !== appData.globalProcessN0Filter) {
                        include = false;
                    }
                }

                // Check process N1 filter
                if (appData.globalProcessN1Filter !== 'all' && (!excludeOne || excludedFilter !== 'process_n1')) {
                    if (window.poiDefinitions && window.poiDefinitions.activities) {
                        const def = window.poiDefinitions.activities[group.sigesp_code] || window.poiDefinitions.activities[group.id_ceplan];
                        if (!def || def.proceso_n1_nom !== appData.globalProcessN1Filter) {
                            include = false;
                        }
                    } else {
                        include = false;
                    }
                }

                if (include) {
                    validActivityIds.add(group.id_ceplan);
                }
            });

            // Filter raw data to only include rows from valid activities
            filtered = filtered.filter(d => validActivityIds.has(d['Actividad Operativa ID_CEPLAN']));
        }

        return filtered;
    }

    // ... (Render and Init functions remain mostly same, just ensuring getFilteredData() call is standard)

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // ... (Existing listeners for TipoCC, CC, OEI, AEI - Update them to call updateDashboard)
        // Note: I will rewrite the existing listeners block to include the new ones and ensure consistency

        const filters = [
            { id: 'global-tipo-cc-filter', key: 'globalTipoCCFilter' },
            { id: 'global-cc-filter', key: 'globalCCFilter' },
            { id: 'global-oei-filter', key: 'globalOEIFilter' },
            { id: 'global-aei-filter', key: 'globalAEIFilter' },
            { id: 'global-ao-filter', key: 'globalAOFilter' },
            { id: 'global-tarea-filter', key: 'globalTareaFilter' },
            { id: 'global-process-type-filter', key: 'globalProcessTypeFilter' },
            { id: 'global-process-n0-filter', key: 'globalProcessN0Filter' },
            { id: 'global-process-n1-filter', key: 'globalProcessN1Filter' }
        ];

        filters.forEach(filter => {
            const el = document.getElementById(filter.id);
            if (el) {
                el.addEventListener('change', (e) => {
                    appData[filter.key] = e.target.value;
                    console.log(`${filter.key} changed to:`, appData[filter.key]);

                    // Advanced Reset Logic to prevent stale filters
                    if (filter.key === 'globalTipoCCFilter') {
                        // Reset CC, AO, Tarea when Tipo CC changes
                        appData.globalCCFilter = 'all';
                        appData.globalAOFilter = 'all';
                        appData.globalTareaFilter = 'all';

                        // Update DOM elements
                        document.getElementById('global-cc-filter').value = 'all';
                        document.getElementById('global-ao-filter').value = 'all';
                        document.getElementById('global-tarea-filter').value = 'all';
                    }
                    else if (filter.key === 'globalCCFilter') {
                        // Reset AO, Tarea when CC changes
                        appData.globalAOFilter = 'all';
                        appData.globalTareaFilter = 'all';

                        // Update DOM elements
                        document.getElementById('global-ao-filter').value = 'all';
                        document.getElementById('global-tarea-filter').value = 'all';
                    }

                    updateDashboard();
                });
            }
        });

        // CC chart filter (activity type)
        const ccFilter = document.getElementById('cc-filter');
        if (ccFilter) {
            ccFilter.addEventListener('change', (e) => {
                const filterType = e.target.value;
                const filteredData = getFilteredData();
                const ccData = DataProcessor.aggregateCCData(filteredData, filterType);
                ChartRenderer.renderBarChart('#chart-cc', ccData);
            });
        }

        // Search input
        const searchInput = document.getElementById('search-input');
        const debouncedSearch = UIUtils.debounce((term) => {
            // Search logic
            const baseData = getFilteredData();
            if (term.trim() === '') {
                appData.filtered = baseData;
            } else {
                appData.filtered = DataProcessor.searchData(baseData, term);
            }
            // Re-render components that depend on search (KPIs, Table)
            // Note: usually we re-render everything
            const kpis = DataProcessor.calculateKPIs(appData.filtered);
            UIUtils.updateKPIs(kpis);

            const groupedData = DataProcessor.groupActivities(appData.filtered);
            const displayGroups = groupedData.slice(0, POI_CONFIG.table.initialRows);
            UIUtils.renderTable(displayGroups);
        }, POI_CONFIG.searchDebounce);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => { debouncedSearch(e.target.value); });
        }


        // Reset Filters Button
        const resetFiltersBtn = document.getElementById('reset-filters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                console.log('Resetting all filters');

                // Reset internal state
                filters.forEach(f => appData[f.key] = 'all');

                // Reset dropdown values
                filters.forEach(f => {
                    const el = document.getElementById(f.id);
                    if (el) el.value = 'all';
                });

                // Update dropdowns to restore full lists
                updateFilterDropdowns(); // Should re-populate everything with 'all' data

                // Update dashboard
                updateDashboard();
            });
        }

        // Window Resize
        window.addEventListener('resize', UIUtils.debounce(() => {
            updateDashboard();
        }, 250));

        // Initialize Tab System
        UIUtils.initTabs();

        // Fix for charts in hidden tabs: Re-render when tab actually becomes visible
        const graphicTabBtn = document.querySelector('button[data-tab="tab-graficos"]');
        if (graphicTabBtn) {
            graphicTabBtn.addEventListener('click', () => {
                requestAnimationFrame(() => {
                    const ccData = DataProcessor.aggregateCCData(appData.filtered, 'all');
                    ChartRenderer.renderBarChart('#chart-cc', ccData);

                    const taskData = DataProcessor.aggregateTaskData(appData.filtered);
                    ChartRenderer.renderBarChart('#chart-tasks', taskData);
                });
            });
        }

        const timelineTabBtn = document.querySelector('button[data-tab="tab-timeline"]');
        if (timelineTabBtn) {
            timelineTabBtn.addEventListener('click', () => {
                requestAnimationFrame(() => {
                    const monthlyData = DataProcessor.aggregateMonthlyData(appData.filtered);
                    ChartRenderer.renderVerticalBarChart('#chart-timeline-content', monthlyData);
                });
            });
        }

        // Advanced Filters Toggle
        const toggleAdvancedBtn = document.getElementById('toggle-advanced-filters');
        if (toggleAdvancedBtn) {
            toggleAdvancedBtn.addEventListener('click', () => {
                UIUtils.toggleAdvancedFilters();
            });
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initDashboard);

})();
