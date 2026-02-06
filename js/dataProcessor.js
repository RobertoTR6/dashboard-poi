/**
 * POI 2026 Dashboard - Data Processing
 * Functions for data validation, filtering, and aggregation
 */

const DataProcessor = {
    /**
     * Validate data structure and quality
     */
    validateData(data) {
        const requiredFields = window.POI_CONFIG.dataKeys.requiredFields;
        const issues = [];

        if (!data || data.length === 0) {
            return { valid: false, issues: ['No data provided'] };
        }

        data.forEach((row, index) => {
            requiredFields.forEach(field => {
                if (!row[field]) {
                    issues.push(`Row ${index + 1}: Missing '${field}'`);
                }
            });
        });

        if (issues.length > 0) {
            console.warn('Data validation issues:', issues.slice(0, 10));
            if (issues.length > 10) {
                console.warn(`... and ${issues.length - 10} more issues`);
            }
        }

        return {
            valid: issues.length === 0,
            issues: issues,
            totalRows: data.length,
            issueCount: issues.length
        };
    },

    /**
     * Filter out empty rows and headers
     */
    cleanData(rawData) {
        const cleaned = rawData.filter(d =>
            d['Centro de Costo'] &&
            d['Centro de Costo'] !== 'Centro de Costo' &&
            // Filter out tasks marked as ELIMINAR (check both Code and Name)
            !(d['COD_TAREA_V2'] && d['COD_TAREA_V2'].trim().startsWith('ELIMINAR')) &&
            !(d['TAREAS_V2'] && d['TAREAS_V2'].trim().startsWith('ELIMINAR'))
        );

        // Performance Optimization: Pre-calculate metadata ONCE
        // This avoids expensive lookups and string splitting during every filter change
        console.time('Pre-calculation');
        cleaned.forEach(row => {
            // 1. Derive SIGESP Code
            let derivedSigesp = '';
            if (row['COD_TAREA_V2']) {
                const parts = row['COD_TAREA_V2'].split('.');
                if (parts.length >= 3) {
                    derivedSigesp = parts.slice(0, 3).join('.');
                }
            }
            row._sigesp_code = derivedSigesp;

            // 2. Lookup Process Metadata
            let pType = 'No Identificado';
            let pN0 = 'Sin Proceso';
            let pN1 = ''; // Cache N1 as well

            if (window.poiDefinitions && window.poiDefinitions.activities) {
                // Try lookup by SIGESP code first, then by CEPLAN ID
                const id = row['Actividad Operativa ID_CEPLAN'];
                const mappedDef = window.poiDefinitions.activities[derivedSigesp] || window.poiDefinitions.activities[id];

                if (mappedDef) {
                    pType = mappedDef.proceso_tipo || 'No Identificado';
                    pN0 = mappedDef.proceso_n0_nom || 'Sin Proceso';
                    pN1 = mappedDef.proceso_n1_nom || '';
                }
            }
            row._process_type = pType;
            row._process_n0 = pN0;
            row._process_n1 = pN1;
        });
        console.timeEnd('Pre-calculation');

        return cleaned;
    },

    /**
     * Calculate KPIs from data
     */
    calculateKPIs(data) {
        const totalRecords = data.length;
        const uniqueCC = new Set(data.map(d => d['Centro de Costo'])).size;
        const uniqueOEI = new Set(data.map(d => d['OEI'])).size;

        // Actividades Operativas: unique Actividad Operativa ID_CEPLAN
        const uniqueAO = new Set(
            data.filter(d => d['Actividad Operativa ID_CEPLAN'])
                .map(d => d['Actividad Operativa ID_CEPLAN'])
        ).size;

        // Actividades Estandarizadas: unique activities with 8 characters in ID_SIGESP
        const uniqueStd = new Set(
            data.filter(d => {
                const code = d['Actividad Operativa ID_SIGESP'];
                return code && code.trim().length === 8;
            })
                .map(d => d['Actividad Operativa ID_SIGESP'])
        ).size;

        // Tareas: unique COD_TAREA_V2, non-empty
        const uniqueTareas = new Set(
            data.filter(d => d['COD_TAREA_V2'] && d['COD_TAREA_V2'].trim() !== '')
                .map(d => d['COD_TAREA_V2'])
        ).size;

        // AEIs: unique AEI codes
        const uniqueAEI = new Set(
            data.filter(d => d['AEI'] && d['AEI'].trim() !== '')
                .map(d => d['AEI'])
        ).size;

        // Find TOTAL key (handle potential trailing spaces)
        const keys = Object.keys(data[0] || {});
        const totalKey = keys.find(k => k.trim() === 'TOTAL') || 'TOTAL';

        // Process N0 and N1 counts (requires grouping)
        const groupedData = this.groupActivities(data);

        // Count unique Process N0
        const uniqueProcessN0 = new Set(
            groupedData
                .map(g => g.process_n0)
                .filter(p => p && p !== 'Sin Proceso')
        ).size;

        // Count unique Process N1
        const processN1Set = new Set();
        groupedData.forEach(g => {
            if (window.poiDefinitions && window.poiDefinitions.activities) {
                const def = window.poiDefinitions.activities[g.sigesp_code] || window.poiDefinitions.activities[g.id_ceplan];
                if (def && def.proceso_n1_nom && def.proceso_n1_nom.trim() !== '') {
                    processN1Set.add(def.proceso_n1_nom);
                }
            }
        });
        const uniqueProcessN1 = processN1Set.size;



        return {
            totalRecords,

            uniqueCC,
            uniqueOEI,
            uniqueAEI,
            uniqueAO,
            uniqueStd,
            uniqueTareas,
            uniqueProcessN0,
            uniqueProcessN1,
            totalKey  // Return for later use
        };
    },

    /**
     * Group data by Operational Activity for hierarchical view
     */
    groupActivities(data) {
        console.time('DataProcessor.groupActivities');
        const groups = {};
        // Note: Keys in data.js have trailing spaces
        const monthKeys = ['ENE ', 'FEB ', 'MAR ', 'ABR ', 'MAY ', 'JUN ', 'JUL ', 'AGO ', 'SET ', 'OCT ', 'NOV ', 'DIC '];
        const totalKey = 'TOTAL ';

        data.forEach(row => {
            const id = row['Actividad Operativa ID_CEPLAN'] || 'SIN_ID';

            if (!groups[id]) {
                // OPTIMIZED: Use pre-calculated values
                const sigespCode = row._sigesp_code || '';

                groups[id] = {
                    id_ceplan: id,
                    sigesp_code: sigespCode,
                    activity_name: row['ACTIVIDAD OPERATIVA'] || 'SIN NOMBRE',
                    um_ao: row['UM_AO'] || '',
                    cc_name: row['Centro de Costo'] || '',

                    // Use cached metadata
                    process_type: row._process_type || 'No Identificado',
                    process_n0: row._process_n0 || 'Sin Proceso',
                    process_n1: row._process_n1 || '',

                    children: [],
                    totals: {
                        'ENE ': 0, 'FEB ': 0, 'MAR ': 0, 'ABR ': 0, 'MAY ': 0, 'JUN ': 0,
                        'JUL ': 0, 'AGO ': 0, 'SET ': 0, 'OCT ': 0, 'NOV ': 0, 'DIC ': 0,
                        'TOTAL ': 0
                    }
                };
            }

            // Add to children (happens for every row)
            groups[id].children.push(row);

            // Accumulate totals (happens for every row)
            monthKeys.forEach(m => {
                const val = parseFloat(row[m]) || 0;
                groups[id].totals[m] += val;
            });

            // Accumulate grand total
            const totalVal = parseFloat(row[totalKey]) || 0;
            groups[id].totals[totalKey] += totalVal;
        });

        // Convert to array and sort by ID (as per image) or Name
        const result = Object.values(groups).sort((a, b) => a.id_ceplan.localeCompare(b.id_ceplan));
        console.timeEnd('DataProcessor.groupActivities');
        return result;
    },

    /**
     * Aggregate data for Centro de Costo chart
     */
    aggregateCCData(data, filterType = 'all') {
        console.log('aggregateCCData called with filterType:', filterType);
        console.log('Input data length:', data.length);

        let filteredData = data;
        let countField = 'Actividad Operativa ID_CEPLAN'; // Default: count all operational activities

        if (filterType === 'operativa') {
            // Filter: only rows with Actividad Operativa ID_CEPLAN
            filteredData = data.filter(d => d['Actividad Operativa ID_CEPLAN']);
            countField = 'Actividad Operativa ID_CEPLAN';
            console.log('After operativa filter:', filteredData.length);

        } else if (filterType === 'estandarizada') {
            // Filter: only standardized activities (8 characters in Actividad Operativa ID_SIGESP)
            filteredData = data.filter(d => {
                const code = d['Actividad Operativa ID_SIGESP'];
                return code && code.trim().length === 8;
            });
            countField = 'Actividad Operativa ID_SIGESP';
            console.log('After estandarizada filter:', filteredData.length);
        }

        // Count unique activities per Centro de Costo
        const ccCounts = d3.rollups(
            filteredData,
            v => new Set(v.map(d => d[countField])).size, // Count unique activities
            d => d['Centro de Costo']
        )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        console.log(`Final ccCounts for ${filterType}:`, ccCounts.map(d => `${d[0]}: ${d[1]}`));
        return ccCounts;
    },

    /**
     * Aggregate data for task distribution (Top 10)
     */
    aggregateTaskData(data) {
        // Create a map to store task code and name together
        const taskMap = new Map();

        data.forEach(d => {
            const taskName = d['TAREAS_V2'];
            const taskCode = d['COD_TAREA_V2'];

            if (taskName && taskName.trim() !== '') {
                const key = taskName;
                if (!taskMap.has(key)) {
                    taskMap.set(key, {
                        code: taskCode || '',
                        name: taskName,
                        count: 0
                    });
                }
                taskMap.get(key).count++;
            }
        });

        // Convert to array and format labels with code
        return Array.from(taskMap.values())
            .map(task => {
                const label = task.code && task.code.trim() !== ''
                    ? `${task.code} - ${task.name}`
                    : task.name;
                return [label, task.count];
            })
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Top 10 tasks
    },

    /**
     * Aggregate monthly data
     */
    aggregateMonthlyData(data) {
        const monthKeys = window.POI_CONFIG.dataKeys.months;
        const cleanMonthKeys = monthKeys.map(k => k.trim());

        return monthKeys.map((key, i) => {
            const sum = data.reduce((acc, d) => acc + (parseFloat(d[key]) || 0), 0);
            return { month: cleanMonthKeys[i], value: sum };
        });
    },

    /**
     * Search/filter data
     */
    searchData(data, searchTerm) {
        const term = searchTerm.toLowerCase();
        return data.filter(d =>
            (d['Centro de Costo'] && d['Centro de Costo'].toLowerCase().includes(term)) ||
            (d['ACTIVIDAD OPERATIVA'] && d['ACTIVIDAD OPERATIVA'].toLowerCase().includes(term)) ||
            (d['OEI'] && d['OEI'].toLowerCase().includes(term)) ||
            (d['COD_TAREA_V2'] && d['COD_TAREA_V2'].toLowerCase().includes(term)) || // Task Code
            (d['TAREAS_V2'] && d['TAREAS_V2'].toLowerCase().includes(term)) || // Task Name
            (d['Actividad Operativa ID_SIGESP'] && d['Actividad Operativa ID_SIGESP'].toLowerCase().includes(term)) || // AA - SIGESP
            (d['Actividad Operativa ID_CEPLAN'] && d['Actividad Operativa ID_CEPLAN'].toLowerCase().includes(term))    // AA - CEPLAN
        );
    },

    /**
     * Aggregate data for Process Charts
     * input: groups (Array of activity objects)
     */
    aggregateProcessStats(groups) {
        if (!groups) return { typeCounts: [], n0Counts: [] };

        // Count by Process Type
        const typeCounts = d3.rollups(
            groups,
            v => v.length,
            d => d.process_type || 'No Identificado'
        ).sort((a, b) => b[1] - a[1]);

        // Count by Macroprocess (N0)
        const n0Counts = d3.rollups(
            groups,
            v => v.length,
            d => d.process_n0 || 'Sin Proceso'
        ).sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Limit to top 5

        return { typeCounts, n0Counts };
    }
};

// Export
window.DataProcessor = DataProcessor;
