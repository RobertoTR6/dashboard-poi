/**
 * AEI Dashboard Component
 * Displays strategic actions (AEI) with filtering and visualizations
 */

const AEIDashboard = {
    currentFilters: {
        oei: 'all',
        aei: 'all',
        indicator: 'all'
    },

    /**
     * Initialize AEI dashboard
     */
    init() {
        console.log('Initializing AEI Dashboard...');
        this.populateOEIFilter();
        this.populateAEIFilter();
        this.populateIndicatorFilter();
        this.renderAEIList();
        this.setupEventListeners();

        // Window Resize Handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));
    },

    /**
     * Handle Window Resize
     */
    handleWindowResize() {
        if (this.currentFilters.indicator !== 'all' || this.currentFilters.aei !== 'all') {
            this.renderChart();
        }
    },

    /**
     * Debounce Utility
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

    // ... (keep existing populate methods)

    // ... code moved to renderChart ...

    /**
     * Populate OEI filter dropdown
     */
    populateOEIFilter() {
        const oeiList = PEIDataProcessor.getAllOEI();
        const filterSelect = document.getElementById('aei-oei-filter');
        if (!filterSelect) return;

        // Clear existing options except "all"
        filterSelect.innerHTML = '<option value="all">Todos los OEI</option>';

        // Add OEI options
        oeiList.forEach(oei => {
            const option = document.createElement('option');
            option.value = oei.codigo;
            option.textContent = `${oei.codigo} - ${oei.descripcion.substring(0, 60)}...`;
            filterSelect.appendChild(option);
        });
    },

    /**
     * Populate AEI filter dropdown
     */
    populateAEIFilter() {
        const aeiList = PEIDataProcessor.getAllAEI();
        const filterSelect = document.getElementById('aei-aei-filter');
        if (!filterSelect) return;

        // Clear existing options except "all"
        filterSelect.innerHTML = '<option value="all">Todos los AEI</option>';

        // Deduplicate AEIs by code
        const uniqueAEIs = new Map();
        aeiList.forEach(aei => {
            if (!uniqueAEIs.has(aei.codigo)) {
                uniqueAEIs.set(aei.codigo, aei);
            }
        });

        // Add AEI options
        uniqueAEIs.forEach(aei => {
            const option = document.createElement('option');
            option.value = aei.codigo;
            option.textContent = `${aei.codigo} - ${aei.descripcion.substring(0, 60)}...`;
            filterSelect.appendChild(option);
        });
    },

    /**
     * Populate Indicator filter dropdown
     */
    populateIndicatorFilter() {
        const filterSelect = document.getElementById('aei-indicator-filter');
        if (!filterSelect) return;

        // Get list of indicators based on current filters
        let aeiList = PEIDataProcessor.getAllAEI();

        if (this.currentFilters.oei !== 'all') {
            aeiList = aeiList.filter(aei => aei.oei_padre === this.currentFilters.oei);
        }

        if (this.currentFilters.aei !== 'all') {
            aeiList = aeiList.filter(aei => aei.codigo === this.currentFilters.aei);
        }

        // Clear existing options except "all"
        filterSelect.innerHTML = '<option value="all">Todos los Indicadores</option>';

        // Add Indicator options
        aeiList.forEach((aei, index) => {
            const indCode = aei.indicador && aei.indicador.codigo ? aei.indicador.codigo : `Ind-${index}`;
            const indDesc = aei.indicador && aei.indicador.codigo ? `${aei.indicador.codigo}` : (aei.descripcion ? aei.descripcion.substring(0, 40) + '...' : `Indicador ${index + 1}`);

            const option = document.createElement('option');
            option.value = indCode;
            option.textContent = indDesc;
            filterSelect.appendChild(option);
        });
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const oeiFilterSelect = document.getElementById('aei-oei-filter');
        const aeiFilterSelect = document.getElementById('aei-aei-filter');
        const indicatorFilterSelect = document.getElementById('aei-indicator-filter');

        if (oeiFilterSelect) {
            oeiFilterSelect.addEventListener('change', (e) => {
                this.currentFilters.oei = e.target.value;
                this.updateAEIFilterOptions();
                this.updateIndicatorFilterOptions();
                this.renderAEIList();
                this.renderChart();
            });
        }

        if (aeiFilterSelect) {
            aeiFilterSelect.addEventListener('change', (e) => {
                this.currentFilters.aei = e.target.value;
                this.updateIndicatorFilterOptions();
                this.renderAEIList();
                this.renderChart();
            });
        }

        if (indicatorFilterSelect) {
            indicatorFilterSelect.addEventListener('change', (e) => {
                this.currentFilters.indicator = e.target.value;
                this.renderAEIList();
                this.renderChart();
            });
        }
    },

    /**
     * Update AEI filter options based on selected OEI
     */
    updateAEIFilterOptions() {
        const filterSelect = document.getElementById('aei-aei-filter');
        if (!filterSelect) return;

        let aeiList;
        if (this.currentFilters.oei === 'all') {
            aeiList = PEIDataProcessor.getAllAEI();
        } else {
            aeiList = PEIDataProcessor.getAEIByOEI(this.currentFilters.oei);
        }

        // Reset AEI filter
        this.currentFilters.aei = 'all';
        filterSelect.innerHTML = '<option value="all">Todos los AEI</option>';

        // Deduplicate AEIs by code
        const uniqueAEIs = new Map();
        aeiList.forEach(aei => {
            if (!uniqueAEIs.has(aei.codigo)) {
                uniqueAEIs.set(aei.codigo, aei);
            }
        });

        // Add filtered AEI options
        uniqueAEIs.forEach(aei => {
            const option = document.createElement('option');
            option.value = aei.codigo;
            option.textContent = `${aei.codigo} - ${aei.descripcion.substring(0, 60)}...`;
            filterSelect.appendChild(option);
        });
    },

    /**
     * Update Indicator filter options based on selected OEI/AEI
     */
    updateIndicatorFilterOptions() {
        this.currentFilters.indicator = 'all';
        this.populateIndicatorFilter();
    },

    /**
     * Render line chart for selected AEI
     */
    renderChart() {
        const chartContainer = document.getElementById('aei-chart-container');
        const chartDiv = document.getElementById('aei-line-chart');

        if (!chartDiv) return;

        // Show placeholder when no Indicator is selected explicitly OR implies multiple indicators.
        let targetIndicator = null;

        if (this.currentFilters.indicator !== 'all') {
            const all = PEIDataProcessor.getAllAEI();
            targetIndicator = all.find(aei => aei.indicador && aei.indicador.codigo === this.currentFilters.indicator);
        } else if (this.currentFilters.aei !== 'all') {
            const matching = PEIDataProcessor.getAllAEI().filter(aei => aei.codigo === this.currentFilters.aei);
            if (matching.length === 1) {
                targetIndicator = matching[0];
            }
        }

        if (!targetIndicator) {
            chartContainer.style.display = 'block';
            chartDiv.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-slate-400">
                    <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    <p class="text-lg font-medium">Seleccione un Indicador</p>
                    <p class="text-sm">Seleccione un Indicador específico para visualizar su gráfico de cumplimiento</p>
                </div>
            `;
            return;
        }

        chartContainer.style.display = 'block';

        // Get selected AEI data (which acts as Indicator data here)
        const aeiData = targetIndicator;
        if (!aeiData) return;

        // Update Chart Title
        const titleEl = document.getElementById('aei-chart-title');
        if (titleEl) {
            const indCode = aeiData.indicador && aeiData.indicador.codigo ? aeiData.indicador.codigo : aeiData.codigo;
            // Use indicator name if present, otherwise fall back to AEI description
            const indDesc = aeiData.indicador && aeiData.indicador.nombre ? aeiData.indicador.nombre : aeiData.descripcion;
            titleEl.textContent = `${indCode} - ${indDesc}`;
        }

        // Prepare data for chart
        const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];
        const metas = years.map(year => aeiData.metas[year] || 0);

        // Prepare detailed progress data
        const currentYear = new Date().getFullYear();
        const avances = years.map(year => {
            const yearInt = parseInt(year);
            if (yearInt > 2026) return null; // Hard stop for now based on user context

            const val = year === '2024' ? aeiData.linea_base : aeiData.avance_actual;
            if (year !== '2024' && (val === 0 || val === undefined)) return null;

            return val || 0;
        });

        // Clear previous chart
        chartDiv.innerHTML = '';

        // Dimensions (Match OEI)
        const margin = { top: 30, right: 30, bottom: 40, left: 50 };
        const width = chartDiv.offsetWidth - margin.left - margin.right;
        const height = (chartDiv.offsetHeight || 400) - margin.top - margin.bottom;

        const svg = d3.select(chartDiv)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Defs for Gradients (Match OEI)
        const defs = svg.append("defs");

        // Gradient for Meta Area
        const areaGradient = defs.append("linearGradient")
            .attr("id", "aeiMetaGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        areaGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "var(--sis-primary)")
            .attr("stop-opacity", 0.1);

        areaGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "var(--sis-primary)")
            .attr("stop-opacity", 0.01);

        // Scales (Match OEI - scalePoint)
        const x = d3.scalePoint()
            .domain(years)
            .range([0, width])
            .padding(0.1);

        // Determine Y domain
        // Filter out nulls/zeros correctly for max calculation
        const validAvances = avances.filter(v => v !== null);
        const allValues = [...metas, ...validAvances];
        const maxValue = Math.max(...allValues, 0.1); // Ensure at least small scale if all 0
        const isDecimalScale = maxValue <= 1.5;

        const y = d3.scaleLinear()
            .domain([0, isDecimalScale ? Math.max(maxValue * 1.1, 1) : Math.max(maxValue * 1.1, 100)])
            .range([height, 0]);

        // Grid (Horizontal)
        svg.append('g')
            .attr('class', 'grid')
            .style('stroke', '#e5e7eb')
            .style('stroke-opacity', 0.5)
            .call(d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(6));

        // Axes
        // X Axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .style('font-family', 'Signika')
            .style('font-size', '12px')
            .style('color', '#64748b')
            .selectAll(".tick line").remove();

        // Y Axis
        svg.append('g')
            .call(d3.axisLeft(y)
                .ticks(6)
                .tickFormat(d => isDecimalScale ? (d * 100).toFixed(0) + '%' : d + '%')
            )
            .style('font-family', 'Signika')
            .style('font-size', '11px')
            .style('color', '#94a3b8')
            .select(".domain").remove();

        // Area Generator (Meta)
        const area = d3.area()
            .x((d, i) => x(years[i]))
            .y0(height)
            .y1(d => y(d))
            .curve(d3.curveMonotoneX);

        // Line Generator (Meta)
        const lineMeta = d3.line()
            .x((d, i) => x(years[i]))
            .y(d => y(d))
            .curve(d3.curveMonotoneX);

        // Draw Meta Area
        svg.append('path')
            .datum(metas)
            .attr('fill', 'url(#aeiMetaGradient)')
            .attr('d', area);

        // Draw Meta Line
        svg.append('path')
            .datum(metas)
            .attr('fill', 'none')
            .attr('stroke', 'var(--sis-primary)')
            .attr('stroke-width', 2.5)
            .attr('d', lineMeta);

        // Meta Points (Hollow)
        svg.selectAll('.meta-dot')
            .data(metas)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => x(years[i]))
            .attr('cy', d => y(d))
            .attr('r', 5)
            .attr('fill', '#fff')
            .attr('stroke', 'var(--sis-primary)')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .append('title').text((d, i) => `Meta ${years[i]}: ${isDecimalScale ? (d * 100).toFixed(2) : d.toFixed(2)}%`);

        // Labels for Meta (Programado)
        svg.selectAll('.meta-label')
            .data(metas)
            .enter()
            .append('text')
            .attr('x', (d, i) => x(years[i]))
            .attr('y', d => y(d) - 12)
            .text((d) => isDecimalScale ? (d * 100).toFixed(1) + '%' : d.toFixed(1) + '%')
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('font-family', 'Signika')
            .style('fill', 'var(--sis-primary)');

        // Prepare Avance Data for Line (connect only existing points)
        const definedAvance = avances.map((v, i) => ({ val: v, year: years[i], idx: i })).filter(d => d.val !== null);

        // Draw Avance Line (Dashed)
        if (definedAvance.length > 1) {
            const lineAvance = d3.line()
                .x(d => x(d.year))
                .y(d => y(d.val))
                .curve(d3.curveMonotoneX);

            svg.append('path')
                .datum(definedAvance)
                .attr('fill', 'none')
                .attr('stroke', 'var(--sis-magenta)')
                .attr('stroke-width', 3)
                .attr('stroke-dasharray', '5,5')
                .attr('d', lineAvance);
        }

        // Avance Points (Solid)
        svg.selectAll('.avance-dot')
            .data(avances)
            .enter()
            .map((d, i) => ({ val: d, year: years[i] })) // wrap to keep index
            .filter(item => item.val !== null)
            .append('circle')
            .attr('cx', item => x(item.year))
            .attr('cy', item => y(item.val))
            .attr('r', 6)
            .attr('fill', 'var(--sis-magenta)')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))')
            .style('cursor', 'pointer')
            .append('title').text(item => `Avance ${item.year}: ${isDecimalScale ? (item.val * 100).toFixed(2) : item.val.toFixed(2)}%`);

        // Stats Labels for Avance
        svg.selectAll('.avance-label')
            .data(avances)
            .enter()
            .map((d, i) => ({ val: d, year: years[i] }))
            .filter(item => item.val !== null)
            .append('text')
            .attr('x', item => x(item.year))
            .attr('y', item => y(item.val) - 12)
            .text(item => isDecimalScale ? (item.val * 100).toFixed(1) + '%' : item.val.toFixed(1) + '%')
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('font-family', 'Signika')
            .style('fill', 'var(--sis-magenta)');

        // Legend (Top Left)
        const legend = svg.append('g').attr('transform', `translate(0, -${margin.top / 2})`);

        // Meta Legend
        const legMeta = legend.append('g').attr('transform', 'translate(0, 0)');
        legMeta.append('line')
            .attr('x1', 0).attr('y1', 0).attr('x2', 20).attr('y2', 0)
            .attr('stroke', 'var(--sis-primary)')
            .attr('stroke-width', 2.5);
        legMeta.append('text').attr('x', 25).attr('y', 4).text('Meta Programada').style('font-size', '12px').style('fill', '#475569');

        // Avance Legend
        const legAvance = legend.append('g').attr('transform', 'translate(130, 0)');
        legAvance.append('line')
            .attr('x1', 0).attr('y1', 0).attr('x2', 20).attr('y2', 0)
            .attr('stroke', 'var(--sis-magenta)')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '5,5');
        legAvance.append('text').attr('x', 25).attr('y', 4).text('Avance Real').style('font-size', '12px').style('fill', '#475569');
    },

    /**
     * Render AEI list (Table)
     */
    renderAEIList() {
        const container = document.getElementById('aei-list');
        if (!container) return;

        container.style.display = 'block';

        // Get AEI data based on filters
        let aeiList;
        if (this.currentFilters.oei === 'all') {
            aeiList = PEIDataProcessor.getAllAEI();
        } else {
            aeiList = PEIDataProcessor.getAEIByOEI(this.currentFilters.oei);
        }

        if (this.currentFilters.aei !== 'all') {
            aeiList = aeiList.filter(aei => aei.codigo === this.currentFilters.aei);
        }

        if (this.currentFilters.indicator !== 'all') {
            aeiList = aeiList.filter(aei => aei.indicador && aei.indicador.codigo === this.currentFilters.indicator);
        }

        if (aeiList.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">No se encontraron indicadores para los filtros seleccionados.</p>';
            return;
        }

        // Build Table
        let html = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicador</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">U.O. Responsable</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fórmula</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especificación</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuente</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base de Datos</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
        `;

        aeiList.forEach(aei => {
            const ind = aei.indicador || {};
            // Display values or fallback
            const indCode = ind.codigo || aei.codigo;
            const indName = ind.nombre || aei.descripcion;
            const uo = ind.uo_responsable || '-';
            const formula = ind.formula || '-';
            const espec = ind.especificaciones_tecnicas || '-';
            const fuente = ind.fuente || '-';
            const bd = ind.base_datos || '-';

            html += `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-sis-primary mb-1">${indCode}</span>
                            <span class="text-xs text-gray-600 whitespace-normal">${indName}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-xs text-gray-600 align-top">${uo}</td>
                    <td class="px-6 py-4 text-xs text-gray-600 align-top whitespace-normal">${formula}</td>
                    <td class="px-6 py-4 text-xs text-gray-600 align-top whitespace-normal">${espec}</td>
                    <td class="px-6 py-4 text-xs text-gray-600 align-top whitespace-normal">${fuente}</td>
                    <td class="px-6 py-4 text-xs text-gray-600 align-top whitespace-normal">${bd}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
            <div class="mt-2 text-right text-xs text-gray-500">
                Mostrando ${aeiList.length} indicador(es)
            </div>
        `;

        container.innerHTML = html;
    },

    /**
     * Get AEI summary statistics
     */
    getAEISummary() {
        return PEIDataProcessor.getAEISummary();
    }
};

// Export
window.AEIDashboard = AEIDashboard;
