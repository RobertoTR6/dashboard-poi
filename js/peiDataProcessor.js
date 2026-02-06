/**
 * PEI Data Processor
 * Frontend processing for PEI 2025-2030 indicators
 */

const PEIDataProcessor = {
    /**
     * Get all OEI with calculated metrics
     */
    getAllOEI() {
        if (!window.PEI_DATA || !window.PEI_DATA.oei) {
            console.error('PEI_DATA not loaded');
            return [];
        }
        return window.PEI_DATA.oei;
    },

    /**
     * Get all AEI with calculated metrics
     */
    getAllAEI() {
        if (!window.PEI_DATA || !window.PEI_DATA.aei) {
            console.error('PEI_DATA not loaded');
            return [];
        }
        return window.PEI_DATA.aei;
    },

    /**
     * Get AEI filtered by OEI
     */
    getAEIByOEI(oeiCodigo) {
        const allAEI = this.getAllAEI();
        return allAEI.filter(aei => aei.oei_padre === oeiCodigo);
    },

    /**
     * Get OEI by code
     */
    getOEIByCodigo(codigo) {
        const allOEI = this.getAllOEI();
        return allOEI.find(oei => oei.codigo === codigo);
    },

    /**
     * Get AEI by code
     */
    getAEIByCodigo(codigo) {
        const allAEI = this.getAllAEI();
        return allAEI.find(aei => aei.codigo === codigo);
    },

    /**
     * Get AEI by code
     */
    getAEIByCodigo(codigo) {
        const allAEI = this.getAllAEI();
        return allAEI.find(aei => aei.codigo === codigo);
    },

    /**
     * Calculate overall PEI compliance percentage
     */
    calculatePEICompliance() {
        if (!window.PEI_DATA || !window.PEI_DATA.resumen) {
            return 0;
        }
        return window.PEI_DATA.resumen.cumplimiento_promedio_oei;
    },

    /**
     * Get OEI summary statistics
     */
    getOEISummary() {
        const oeiList = this.getAllOEI();

        const total = oeiList.length; // Total Indicators (rows)
        const uniqueCount = new Set(oeiList.map(item => item.codigo)).size; // Unique OEI Codes

        const enRiesgo = oeiList.filter(oei => oei.porcentaje_cumplimiento < 70).length;
        const enProgreso = oeiList.filter(oei => oei.porcentaje_cumplimiento >= 70 && oei.porcentaje_cumplimiento < 90).length;
        const cumplidos = oeiList.filter(oei => oei.porcentaje_cumplimiento >= 90).length;
        const promedioAvance = oeiList.reduce((sum, oei) => sum + oei.porcentaje_cumplimiento, 0) / (total || 1);

        return {
            total,
            uniqueCount,
            enRiesgo,
            enProgreso,
            cumplidos,
            promedioAvance: Math.round(promedioAvance * 100) / 100
        };
    },

    /**
     * Get AEI summary statistics
     */
    getAEISummary() {
        const aeiList = this.getAllAEI();

        const total = aeiList.length; // Total Indicators (rows)
        const uniqueCount = new Set(aeiList.map(item => item.codigo)).size; // Unique AEI Codes

        const noIniciadas = aeiList.filter(aei => aei.porcentaje_cumplimiento === 0).length;
        const enProgreso = aeiList.filter(aei => aei.porcentaje_cumplimiento > 0 && aei.porcentaje_cumplimiento < 100).length;
        const completadas = aeiList.filter(aei => aei.porcentaje_cumplimiento >= 100).length;
        const promedioAvance = aeiList.reduce((sum, aei) => sum + aei.porcentaje_cumplimiento, 0) / (total || 1);

        return {
            total,
            uniqueCount,
            noIniciadas,
            enProgreso,
            completadas,
            promedioAvance: Math.round(promedioAvance * 100) / 100
        };
    },

    /**
     * Get status color based on percentage (SIS colors)
     */
    getStatusColor(percentage) {
        if (percentage >= 90) return '#afcc46'; // Verde SIS
        if (percentage >= 70) return '#57c4f2'; // Celeste SIS
        return '#dc388d'; // Magenta SIS (en riesgo)
    },

    /**
     * Get status label
     */
    getStatusLabel(percentage) {
        if (percentage >= 90) return 'Cumplido';
        if (percentage >= 70) return 'En Progreso';
        if (percentage > 0) return 'En Riesgo';
        return 'No Iniciado';
    },

    /**
     * Format data for radar chart (OEI)
     */
    getOEIRadarData() {
        const oeiList = this.getAllOEI();
        return oeiList.map(oei => ({
            axis: oei.codigo,
            value: oei.porcentaje_cumplimiento,
            fullName: oei.descripcion
        }));
    },

    /**
     * Get OEI data for table display
     */
    getOEITableData() {
        const oeiList = this.getAllOEI();
        return oeiList.map(oei => ({
            codigo: oei.codigo,
            descripcion: oei.descripcion,
            meta2026: oei.metas['2026'],
            metas: oei.metas, // Include full metas object
            avance: oei.avance_actual,
            porcentaje: oei.porcentaje_cumplimiento,
            estado: this.getStatusLabel(oei.porcentaje_cumplimiento),
            color: this.getStatusColor(oei.porcentaje_cumplimiento)
        }));
    },

    /**
     * Get AEI data grouped by OEI
     */
    getAEIGroupedByOEI() {
        const oeiList = this.getAllOEI();
        const result = {};

        oeiList.forEach(oei => {
            result[oei.codigo] = {
                oei: oei,
                aei: this.getAEIByOEI(oei.codigo)
            };
        });

        return result;
    },

    /**
     * Search OEI/AEI by keyword
     */
    search(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        const oeiResults = this.getAllOEI().filter(oei =>
            oei.descripcion.toLowerCase().includes(lowerKeyword) ||
            oei.codigo.toLowerCase().includes(lowerKeyword)
        );
        const aeiResults = this.getAllAEI().filter(aei =>
            aei.descripcion.toLowerCase().includes(lowerKeyword) ||
            aei.codigo.toLowerCase().includes(lowerKeyword)
        );

        return {
            oei: oeiResults,
            aei: aeiResults
        };
    }
};

// Export
window.PEIDataProcessor = PEIDataProcessor;
