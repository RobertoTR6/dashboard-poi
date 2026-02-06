/**
 * POI 2026 Dashboard - Chart Rendering
 * D3.js visualization functions
 */

const ChartRenderer = {
    /**
     * Render horizontal bar chart
     */
    /**
     * Render horizontal bar chart with advanced interactivity and SIS styling
     */
    renderBarChart(selector, dataset) {
        console.log('renderBarChart called with', dataset.length, 'items');

        const container = document.querySelector(selector);
        if (!container) return;

        const width = container.clientWidth;
        const config = window.POI_CONFIG.charts.barChart;
        const height = container.clientHeight || config.height;
        const margin = { top: 20, right: 50, bottom: 20, left: 220 }; // Increased left margin for labels

        // Clear previous
        d3.select(selector).selectAll("*").remove();

        const svg = d3.select(selector).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`);

        // SIS Institutional Color - Solid Primary (#5b6fb3)
        // No gradients per SIS design manual

        const x = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d[1]) * 1.1]) // Add headroom
            .range([margin.left, width - margin.right]);

        const y = d3.scaleBand()
            .domain(dataset.map(d => d[0]))
            .range([margin.top, height - margin.bottom])
            .padding(0.4); // More spacing

        // X axis (hidden grid lines only)
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5).tickSize(-height + margin.top + margin.bottom).tickFormat(""))
            .call(g => g.select(".domain").remove())
            .selectAll("line")
            .attr("stroke", "#e2e8f0")
            .attr("stroke-dasharray", "2,2");

        // Y axis
        const yAxis = svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSize(0))
            .call(g => g.select(".domain").remove());

        yAxis.selectAll("text")
            .style("font-size", "11px")
            .style("font-family", "Roboto")
            .style("font-weight", "500")
            .style("fill", "#475569")
            .text(d => d.length > 35 ? d.substring(0, 35) + '...' : d)
            .style("cursor", "pointer")
            .on("mouseover", function (event, d) {
                // Show full name on hover
                d3.select("#tooltip")
                    .style("opacity", 1)
                    .html(`<strong class="text-sis-primary">${d}</strong><br>Haga clic para filtrar`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => d3.select("#tooltip").style("opacity", 0));

        // Bars
        const bars = svg.selectAll("rect")
            .data(dataset)
            .join("rect")
            .attr("x", x(0))
            .attr("y", d => y(d[0]))
            .attr("height", y.bandwidth())
            .attr("fill", window.POI_CONFIG.colors.primary) // SIS Primary: #5b6fb3
            .attr("rx", 4)
            .attr("class", "bar transition-all duration-300")
            .style("cursor", "pointer");

        // Animation
        bars.attr("width", 0)
            .transition()
            .duration(800)
            .attr("width", d => Math.max(x(d[1]) - x(0), 2)) // Min width 2px visibility
            .delay((d, i) => i * 50);

        // Interaction
        bars.on("mouseover", function (event, d) {
            d3.select(this).style("opacity", 0.8);
            const tooltip = d3.select("#tooltip");
            tooltip.style("opacity", 1)
                .html(`
                    <div class="font-signika font-bold text-sis-primary border-b border-gray-200 pb-1 mb-1">${d[0]}</div>
                    <div class="flex justify-between items-center gap-4">
                        <span class="text-gray-600">Total Tareas:</span>
                        <span class="font-bold text-lg text-gray-800">${d[1]}</span>
                    </div>
                    <div class="text-xs text-sis-secondary mt-1">Clic para filtrar</div>
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
            .on("mouseout", function () {
                d3.select(this).style("opacity", 1);
                d3.select("#tooltip").style("opacity", 0);
            })
            .on("click", function (event, d) {
                // Simulate drill-down / filter
                console.log("Drill-down to:", d[0]);
                // Here you would trigger filter logic:
                // updateFilter('global-cc-filter', d[0]); 

                // Visual feedback
                d3.select(this)
                    .transition().duration(100)
                    .attr("transform", "scale(0.98)")
                    .transition().duration(100)
                    .attr("transform", "scale(1)");
            });

        // Value labels
        svg.selectAll(".label")
            .data(dataset)
            .join("text")
            .attr("x", d => x(d[1]) + 8)
            .attr("y", d => y(d[0]) + y.bandwidth() / 2 + 4)
            .text(d => d[1])
            .attr("fill", "#64748b")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("font-family", "Signika")
            .style("opacity", 0)
            .transition()
            .duration(800)
            .style("opacity", 1)
            .delay((d, i) => i * 50 + 400);

        console.log('Chart rendered successfully');
    },

    /**
     * Render donut chart
     */
    renderDonutChart(selector, dataset) {
        const container = document.querySelector(selector);
        const config = window.POI_CONFIG.charts.donutChart;
        const width = container ? container.clientWidth : config.width;
        const height = container ? container.clientHeight : config.height;
        const radius = Math.min(width, height) / 2;

        // Clear previous
        d3.select(selector).selectAll("*").remove();

        const svg = d3.select(selector).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal()
            .domain(dataset.map(d => d[0]))
            .range(window.POI_CONFIG.colors.chart);

        const pie = d3.pie()
            .value(d => d[1])
            .sort(null);

        const arc = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius * 0.9);

        const arcHover = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius * 0.95);

        svg.selectAll("path")
            .data(pie(dataset))
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data[0]))
            .attr("class", "arc")
            .style("stroke", "#ffffff")
            .style("stroke-width", "2px")
            .on("mouseover", function (event, d) {
                d3.select(this).transition().duration(200).attr("d", arcHover);
                const tooltip = d3.select("#tooltip");
                tooltip.style("opacity", 1)
                    .html(`<strong class="text-sis-primary">${d.data[0]}</strong><br>${d.data[1]} Actividades<br>${((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1)}%`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                d3.select(this).transition().duration(200).attr("d", arc);
                d3.select("#tooltip").style("opacity", 0);
            });
    },

    /**
     * Render line chart
     */
    renderLineChart(selector, dataset) {
        // For now, redirect to vertical bar chart as requested
        this.renderVerticalBarChart(selector, dataset);
    },

    /**
     * Render vertical bar chart (New for Monthly Data)
     */
    renderVerticalBarChart(selector, dataset) {
        console.log('renderVerticalBarChart called with', dataset.length, 'items');

        const container = document.querySelector(selector);
        const width = container.clientWidth;
        const config = window.POI_CONFIG.charts.lineChart; // Reuse config or create new
        const height = config.height;
        const margin = config.margin;

        // Clear previous
        d3.select(selector).selectAll("*").remove();

        const svg = d3.select(selector).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`);

        // X axis (Categorical for Months)
        const x = d3.scaleBand()
            .range([margin.left, width - margin.right])
            .domain(dataset.map(d => d.month))
            .padding(0.2);

        // Y axis (Linear for Values)
        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.value) * 1.1]) // 10% headroom
            .range([height - margin.bottom, margin.top]);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "middle");

        // Add Y axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - margin.left - margin.right)
                .attr("stroke-opacity", 0.1)) // Grid lines
            .selectAll("text")
            .style("font-size", "10px");

        // Bars
        svg.selectAll("mybar")
            .data(dataset)
            .join("rect")
            .attr("x", d => x(d.month))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - margin.bottom - y(d.value))
            .attr("fill", window.POI_CONFIG.colors.primary) // SIS Primary: #5b6fb3
            .attr("rx", 4);

        // Labels on top of bars
        svg.selectAll(".label")
            .data(dataset)
            .join("text")
            .attr("class", "label")
            .attr("x", (d) => x(d.month) + x.bandwidth() / 2)
            .attr("y", (d) => y(d.value) - 5)
            .attr("text-anchor", "middle")
            .text((d) => d.value > 0 ? d.value.toLocaleString() : "")
            .style("font-size", "10px")
            .style("fill", "#4b5563");
    }
};

// Export
window.ChartRenderer = ChartRenderer;
