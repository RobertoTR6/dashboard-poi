/**
 * OEI Dashboard Component
 * Displays strategic objectives (OEI) with visualizations
 */

const OEIDashboard = {
    /**
     * Initialize OEI dashboard
     */
    init() {
        console.log('Initializing OEI Dashboard...');
        this.renderOEITable();
        this.renderRadarChart();

        this.populateOEITrendFilter();

        // Initial specs render if we have a default selection
        const oeiList = PEIDataProcessor.getAllOEI();
        if (oeiList.length > 0) {
            this.renderOEISpecs(oeiList[0].codigo);
        }

        // Window Resize Handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));
    },

    currentOEICode: null, // Track current selection

    /**
     * Handle Window Resize
     */
    handleWindowResize() {
        console.log('Resizing OEI Dashboard...');
        if (this.currentOEICode) {
            this.renderTrendChart(this.currentOEICode);
            this.renderOEISpecs(this.currentOEICode);
        } else {
            // Default check if no state set yet (fallback to first item)
            const oeiList = PEIDataProcessor.getAllOEI();
            if (oeiList.length > 0) {
                this.renderTrendChart(oeiList[0].codigo);
                this.renderOEISpecs(oeiList[0].codigo);
            }
        }
        this.renderRadarChart();
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

    /**
     * Populate OEI Trend Filter
     */
    populateOEITrendFilter() {
        const oeiList = PEIDataProcessor.getAllOEI();
        const filterSelect = document.getElementById('oei-trend-filter');
        if (!filterSelect) return;

        filterSelect.innerHTML = '';

        oeiList.forEach((oei, index) => {
            const option = document.createElement('option');
            option.value = oei.codigo;
            option.textContent = `${oei.codigo} - ${oei.descripcion.substring(0, 60)}...`;
            if (index === 0) option.selected = true;
            filterSelect.appendChild(option);
        });

        // Initial render
        if (oeiList.length > 0) {
            this.renderTrendChart(oeiList[0].codigo);
        }

        // Listener
        filterSelect.addEventListener('change', (e) => {
            const oeiCode = e.target.value;
            this.renderTrendChart(oeiCode);
            this.renderOEISpecs(oeiCode);
        });
    },

    /**
     * Render Trend Chart (2024-2030) - Modernized
     */
    renderTrendChart(oeiCode) {
        this.currentOEICode = oeiCode;
        const oeiData = PEIDataProcessor.getOEIByCodigo(oeiCode);
        const chartDiv = document.getElementById('oei-line-chart');

        if (!chartDiv || !oeiData) return;

        // Years range
        const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

        // Metas (2024-2030)
        const metaValues = years.map(year => {
            if (year === '2024') return oeiData.linea_base || 0;
            return oeiData.metas[year] || 0;
        });

        // Actual progress
        const avanceValues = years.map(year => {
            if (year === '2024') return oeiData.linea_base || 0;
            if (year === '2026' && oeiData.avance_actual > 0) return oeiData.avance_actual;
            return null;
        });

        // Clear previous
        chartDiv.innerHTML = '';

        // Dimensions
        const margin = { top: 40, right: 40, bottom: 50, left: 60 };
        const width = chartDiv.offsetWidth - margin.left - margin.right;
        const height = (chartDiv.offsetHeight || 400) - margin.top - margin.bottom;

        const svg = d3.select(chartDiv)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // --- 1. DEFINITIONS (Gradients & Filters) ---
        const defs = svg.append("defs");

        // Gradient for Meta Line Area
        const areaGradient = defs.append("linearGradient")
            .attr("id", "meta-area-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        areaGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "var(--sis-primary)") // #5b6fb3
            .attr("stop-opacity", 0.15);

        areaGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "var(--sis-primary)")
            .attr("stop-opacity", 0.01);

        // Filter for Line Shadow (Glow effect)
        const filter = defs.append("filter")
            .attr("id", "glow");
        filter.append("feGaussianBlur")
            .attr("stdDeviation", "2.5")
            .attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // --- LEGEND ---
        const legend = svg.append("g")
            .attr("class", "chart-legend")
            .attr("transform", `translate(${width - 150}, -30)`); // Top right

        // Legend Item 1: Meta
        legend.append("line")
            .attr("x1", 0).attr("y1", 10).attr("x2", 20).attr("y2", 10)
            .attr("stroke", "var(--sis-primary)").attr("stroke-width", 2.5);
        legend.append("circle")
            .attr("cx", 10).attr("cy", 10).attr("r", 4)
            .attr("fill", "#fff").attr("stroke", "var(--sis-primary)").attr("stroke-width", 2);
        legend.append("text")
            .attr("x", 30).attr("y", 14)
            .text("Meta Programada")
            .style("font-size", "11px").style("fill", "#64748b").style("font-weight", "500").style("font-family", "Signika");

        // Legend Item 2: Avance
        const leg2 = legend.append("g").attr("transform", "translate(0, 20)");
        leg2.append("circle")
            .attr("cx", 10).attr("cy", 10).attr("r", 5)
            .attr("fill", "var(--sis-magenta)").attr("stroke", "#fff").attr("stroke-width", 1.5)
            .style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.2))");
        leg2.append("text")
            .attr("x", 30).attr("y", 14)
            .text("Avance Ejecutado")
            .style("font-size", "11px").style("fill", "#64748b").style("font-weight", "500").style("font-family", "Signika");


        // --- 2. SCALES ---
        const x = d3.scalePoint()
            .domain(years)
            .range([0, width])
            .padding(0.1); // Slightly more padding

        const allValues = [...metaValues, ...avanceValues].filter(v => v !== null);
        const maxY = Math.max(...allValues, 0.1);
        const isDecimalScale = maxY <= 1.5;

        // Add 15% headroom for better visuals
        const yMax = isDecimalScale ? Math.max(maxY * 1.15, 1) : Math.max(maxY * 1.15, 100);

        const y = d3.scaleLinear()
            .domain([0, yMax])
            .range([height, 0]);

        // --- 3. GRID & AXES ---

        // Grid (Horizontal only) - Custom styling
        svg.append('g')
            .attr('class', 'grid-lines')
            .call(d3.axisLeft(y)
                .tickSize(-width)
                .tickFormat('')
                .ticks(6)
            )
            .call(g => g.select(".domain").remove()) // Remove vertical axis line
            .selectAll("line")
            .attr("stroke", "#e2e8f0") // Slate-200
            .attr("stroke-dasharray", "4,4"); // Dashed grid

        // X Axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .call(g => g.select(".domain").attr("stroke", "#cbd5e1").attr("stroke-width", 1.5)) // Custom baseline
            .selectAll("text")
            .style('font-family', 'Signika, sans-serif')
            .style('font-size', '13px')
            .style('color', '#64748b')
            .attr("dy", "1em");

        // Y Axis (Labels only)
        svg.append('g')
            .call(d3.axisLeft(y)
                .ticks(6)
                .tickFormat(d => isDecimalScale ? (d * 100).toFixed(0) + '%' : d + '%')
            )
            .call(g => g.select(".domain").remove()) // Hide axis line
            .selectAll("text")
            .style('font-family', 'Signika, sans-serif')
            .style('font-size', '12px')
            .style('color', '#94a3b8')
            .style("font-weight", 600);


        // --- 4. CHARTS (Area & Line) ---

        // Line Generator
        const lineMeta = d3.line()
            .x((d, i) => x(years[i]))
            .y(d => y(d))
            .curve(d3.curveMonotoneX); // Smooth curve

        // Area Generator
        const areaMeta = d3.area()
            .x((d, i) => x(years[i]))
            .y0(height)
            .y1(d => y(d))
            .curve(d3.curveMonotoneX);

        // Add Area (Background)
        svg.append("path")
            .datum(metaValues)
            .attr("fill", "url(#meta-area-gradient)")
            .attr("d", areaMeta)
            .style("opacity", 0)
            .transition().duration(1000)
            .style("opacity", 1);

        // Add Line (Foreground)
        const pathMeta = svg.append('path')
            .datum(metaValues)
            .attr('fill', 'none')
            .attr('stroke', 'var(--sis-primary)')
            .attr('stroke-width', 3)
            .attr('d', lineMeta)
            .attr("filter", "url(#glow)") // Add glow
            .attr("stroke-linecap", "round");

        // Animate Line Drawing
        const totalLength = pathMeta.node().getTotalLength();
        pathMeta
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1500)
            .ease(d3.easeCubicOut)
            .attr("stroke-dashoffset", 0);


        // --- 5. DATA POINTS (Interactivity) ---

        // Meta Points (White with colored border)
        const metaPoints = svg.selectAll('.meta-dot')
            .data(metaValues)
            .enter()
            .append('circle')
            .attr('class', 'meta-dot')
            .attr('cx', (d, i) => x(years[i]))
            .attr('cy', d => y(d))
            .attr('r', 0) // Start radius 0 for animation
            .attr('fill', '#fff')
            .attr('stroke', 'var(--sis-primary)')
            .attr('stroke-width', 2.5);

        // Animate Meta Points appearance
        metaPoints.transition()
            .delay((d, i) => i * 150 + 500) // Staggered
            .duration(500)
            .ease(d3.easeBackOut)
            .attr('r', 6);

        // Interaction for Meta Points
        metaPoints.on("mouseover", function (event, d) {
            d3.select(this)
                .transition().duration(200)
                .attr("r", 9)
                .attr("stroke-width", 3);

            // Simple Tooltip
            const formatVal = isDecimalScale ? (d * 100).toFixed(1) + '%' : d.toFixed(1) + '%';

            // Create or update tooltip container if not exists (using existing #tooltip logic)
            const tooltip = d3.select("#tooltip");
            tooltip.style("opacity", 1)
                .html(`<div class="text-xs font-bold text-sis-primary mb-1">Meta Programada</div>
                       <div class="text-lg font-bold text-slate-700">${formatVal}</div>`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 40) + "px"); // Higher up
        })
            .on("mouseout", function () {
                d3.select(this)
                    .transition().duration(200)
                    .attr("r", 6)
                    .attr("stroke-width", 2.5);
                d3.select("#tooltip").style("opacity", 0);
            });


        // Avance Points (Magenta)
        // Group them so we can manage z-index if needed
        const avanceGroup = svg.append("g");

        const avanceDots = avanceGroup.selectAll('.avance-dot')
            .data(avanceValues)
            .enter()
            .filter(d => d !== null);

        // The dots
        const avanceCircles = avanceDots.append('circle')
            .attr('cx', (d, i) => x(years[i]))
            .attr('cy', d => y(d))
            .attr('r', 0) // Start 0
            .attr('fill', 'var(--sis-magenta)')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"); // Shadow for emphasis

        // Animate Avance Points
        avanceCircles.transition()
            .delay(1800) // Wait for line animation
            .duration(600)
            .ease(d3.easeElasticOut)
            .attr('r', 8);

        // Labels for Avance (Pills)
        const avanceLabels = avanceDots.append('g')
            .attr('transform', (d, i) => `translate(${x(years[i])}, ${y(d) - 20})`)
            .style("opacity", 0);

        // Pill Background
        avanceLabels.append("rect")
            .attr("x", -24)
            .attr("y", -10)
            .attr("width", 48)
            .attr("height", 20)
            .attr("rx", 10)
            .attr("fill", "var(--sis-magenta)");

        // Pill Text
        avanceLabels.append('text')
            .text((d) => isDecimalScale ? (d * 100).toFixed(1) + '%' : d.toFixed(1) + '%')
            .attr('text-anchor', 'middle')
            .attr("y", 4)
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#ffffff');

        // Animate Labels
        avanceLabels.transition()
            .delay(2000)
            .duration(500)
            .style("opacity", 1)
            .attr('transform', (d, i) => `translate(${x(years[i])}, ${y(d) - 25})`); // Slide up

    },

    /**
     * Render Radar Chart - Improved
     */
    renderRadarChart() {
        const data = PEIDataProcessor.getOEIRadarData();
        const container = document.getElementById('oei-radar-chart');
        if (!container) return;
        container.innerHTML = '';

        const width = container.offsetWidth || 500;
        const height = container.offsetHeight || 400;
        const margin = 60; // Increased margin for labels
        const radius = Math.min(width, height) / 2 - margin;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        // Scales
        const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);
        const angleSlice = Math.PI * 2 / data.length;

        // --- 1. DRAW GRID CIRCLES (Background) ---
        const levels = 5;
        const levelData = d3.range(1, levels + 1).reverse();

        const axisGrid = svg.append("g").attr("class", "axisWrapper");

        // Concentric circles
        axisGrid.selectAll(".levels")
            .data(levelData)
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", d => radius / levels * d)
            .style("fill", "#CDCDCD")
            .style("stroke", "#CDCDCD")
            .style("fill-opacity", 0.05)
            .style("filter", "glow");

        // Text indicating levels
        axisGrid.selectAll(".axisLabel")
            .data(levelData)
            .enter().append("text")
            .attr("class", "axisLabel")
            .attr("x", 4)
            .attr("y", d => -radius / levels * d)
            .attr("dy", "0.4em")
            .style("font-size", "10px")
            .attr("fill", "#737373")
            .text(d => `${d * 20}%`);


        // --- 2. DRAW AXES (Spokes) ---
        const axis = axisGrid.selectAll(".axis")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "axis");

        // The lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        // The labels (OEI Codes)
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .style("font-weight", "bold")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", (d, i) => rScale(115) * Math.cos(angleSlice * i - Math.PI / 2)) // Push out a bit
            .attr("y", (d, i) => rScale(115) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d.axis)
            .style("fill", "var(--sis-primary)")
            .call(wrap, 60); // Simple wrap function if defined, or just text

        // Helper function for wrapping text (simplified)
        function wrap(text, width) {
            text.each(function () {
                // Implementation or just leave standard
            });
        }


        // --- 3. DRAW THE DATA AREA (Radar Blob) ---
        const radarLine = d3.lineRadial()
            .angle((d, i) => i * angleSlice)
            .radius(d => rScale(d.value))
            .curve(d3.curveLinearClosed);

        const blobWrapper = svg.append("g").attr("class", "radarWrapper");

        // Create a glow filter for the blob
        const defs = svg.append("defs");
        const filter = defs.append("filter").attr("id", "glow");
        filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // The path
        blobWrapper.append("path")
            .datum(data)
            .attr("class", "radarArea")
            .attr("d", radarLine)
            .style("fill", "var(--sis-primary)")
            .style("fill-opacity", 0.35)
            .style("stroke", "var(--sis-primary)")
            .style("stroke-width", 2)
            .style("filter", "url(#glow)")
            .on("mouseover", function () {
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.6);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.35);
            });

        // --- 4. DRAW DATA POINTS ---
        blobWrapper.selectAll(".radarCircle")
            .data(data)
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", 4)
            .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
            .style("fill", "white")
            .style("stroke", "var(--sis-primary)")
            .style("stroke-width", 1.5)
            .style("fill-opacity", 1)
            .on("mouseover", function (event, d) {
                const tooltip = d3.select("#tooltip");
                tooltip.style("opacity", 1)
                    .html(`<div class="font-bold text-sis-primary">${d.axis}</div><div>Cumplimiento: ${d.value.toFixed(1)}%</div>`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");

                d3.select(this).transition().duration(200).attr("r", 7);
            })
            .on("mouseout", function () {
                d3.select("#tooltip").style("opacity", 0);
                d3.select(this).transition().duration(200).attr("r", 4);
            });

    },

    /**
     * Render OEI table
     */
    renderOEITable() {
        const tableData = PEIDataProcessor.getOEITableData();
        const container = document.getElementById('oei-table-detail');
        if (!container) return;

        let tableHTML = `
            <div class="card p-6">
                <h3 class="text-lg font-bold mb-4" style="color: var(--sis-primary); font-family: 'Signika', sans-serif;">
                    Indicadores OEI 2026
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr style="background-color: rgba(91, 111, 179, 0.08);">
                                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--sis-primary);">Código</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--sis-primary);">Objetivo Estratégico</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style="color: var(--sis-primary);">Meta 2026</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style="color: var(--sis-primary);">Meta 2030</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style="color: var(--sis-primary);">Avance</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style="color: var(--sis-primary);">% Cumplimiento</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style="color: var(--sis-primary);">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        tableData.forEach((oei, index) => {
            const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            tableHTML += `
                <tr class="${rowBg} hover:bg-gray-100 transition-colors">
                    <td class="px-4 py-3 text-sm font-semibold" style="color: var(--sis-primary);">${oei.codigo}</td>
                    <td class="px-4 py-3 text-sm">${oei.descripcion}</td>
                    <td class="px-4 py-3 text-sm text-center font-semibold">${oei.meta2026.toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-center font-semibold text-gray-500">${(oei.metas['2030'] || 0).toFixed(2)}</td>
                    <td class="px-4 py-3 text-sm text-center">${oei.avance.toFixed(2)}</td>
                    <td class="px-4 py-3 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <div class="w-24 bg-gray-200 rounded-full h-2">
                                <div class="h-2 rounded-full" style="width: ${oei.porcentaje}%; background-color: ${oei.color};"></div>
                            </div>
                            <span class="text-sm font-bold" style="color: ${oei.color};">${oei.porcentaje.toFixed(1)}%</span>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-center">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold" style="background-color: ${oei.color}20; color: ${oei.color};">
                            ${oei.estado}
                        </span>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table></div></div>`;
        container.innerHTML = tableHTML;
    },

    /**
     * Render OEI Indicator technical specifications (NEW)
     */
    renderOEISpecs(oeiCode) {
        const container = document.getElementById('oei-indicator-specs');
        if (!container) return;

        const oeiData = PEIDataProcessor.getOEIByCodigo(oeiCode);
        if (!oeiData || !oeiData.indicador) {
            container.innerHTML = '';
            return;
        }

        const ind = oeiData.indicador;

        // Dynamic fields based on content
        const fields = [
            { label: 'Código', value: ind.codigo || oeiData.codigo },
            { label: 'Indicador', value: ind.nombre || oeiData.descripcion },
            { label: 'Unidad de Medida', value: ind.unidad_medida },
            { label: 'Fórmula', value: ind.formula },
            { label: 'U.O. Responsable', value: ind.uo_responsable },
            { label: 'Especificación', value: ind.especificaciones_tecnicas },
            { label: 'Fuente', value: ind.fuente },
            { label: 'Base de Datos', value: ind.base_datos }
        ];

        // Filter out empty fields
        const activeFields = fields.filter(f =>
            f.value &&
            f.value !== '-' &&
            f.value !== '' &&
            f.value.toString().trim() !== ''
        );

        if (activeFields.length === 0) {
            container.innerHTML = '';
            return;
        }

        let html = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm border border-gray-100">
                    <thead class="bg-gray-50">
                        <tr>
                            ${activeFields.map(f => `<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${f.label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr class="hover:bg-gray-50 transition-colors">
                            ${activeFields.map(f => `<td class="px-6 py-4 text-xs text-gray-600 align-top whitespace-normal">${f.value}</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }
};

window.OEIDashboard = OEIDashboard;
