/**
 * Breadcrumb Navigation Module
 * Handles breadcrumb rendering and interaction
 */

const BreadcrumbNav = {
    /**
     * Update breadcrumb display based on active filters
     */
    update(appData) {
        const container = document.getElementById('filter-breadcrumb');
        if (!container) return;

        const crumbs = [];

        // Add OEI if selected
        if (appData.globalOEIFilter !== 'all' && window.PEIDataProcessor) {
            const oei = PEIDataProcessor.getOEIByCodigo(appData.globalOEIFilter);
            crumbs.push({
                icon: '🎯',
                label: oei ? `${oei.codigo}` : appData.globalOEIFilter,
                tooltip: oei ? oei.descripcion : '',
                type: 'oei',
                filterKey: 'globalOEIFilter'
            });
        }

        // Add AEI if selected
        if (appData.globalAEIFilter !== 'all' && window.PEIDataProcessor) {
            const aei = PEIDataProcessor.getAEIByCodigo(appData.globalAEIFilter);
            crumbs.push({
                icon: '⚡',
                label: aei ? `${aei.codigo}` : appData.globalAEIFilter,
                tooltip: aei ? aei.descripcion : '',
                type: 'aei',
                filterKey: 'globalAEIFilter'
            });
        }

        // Add AO if selected
        if (appData.globalAOFilter !== 'all') {
            crumbs.push({
                icon: '📋',
                label: 'Actividad',
                tooltip: appData.globalAOFilter,
                type: 'ao',
                filterKey: 'globalAOFilter'
            });
        }

        // Add Tarea if selected
        if (appData.globalTareaFilter !== 'all') {
            crumbs.push({
                icon: '✓',
                label: 'Tarea',
                tooltip: appData.globalTareaFilter,
                type: 'tarea',
                filterKey: 'globalTareaFilter'
            });
        }

        // Add Centro de Costo if selected
        if (appData.globalCCFilter !== 'all') {
            crumbs.push({
                icon: '🏢',
                label: 'CC',
                tooltip: appData.globalCCFilter,
                type: 'cc',
                filterKey: 'globalCCFilter'
            });
        }

        // Show/hide breadcrumb
        if (crumbs.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        container.className = 'filter-breadcrumb';
        container.innerHTML = this.renderHTML(crumbs);
    },

    /**
     * Render breadcrumb HTML
     */
    renderHTML(crumbs) {
        let html = '<div class="breadcrumb-list">';

        crumbs.forEach((crumb, index) => {
            if (index > 0) {
                html += '<span class="breadcrumb-separator">›</span>';
            }

            html += `
                <div class="breadcrumb-item ${crumb.type}" 
                     data-filter="${crumb.filterKey}"
                     title="${crumb.tooltip}">
                    <span class="breadcrumb-icon">${crumb.icon}</span>
                    <span>${crumb.label}</span>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }
};

// Export
window.BreadcrumbNav = BreadcrumbNav;
