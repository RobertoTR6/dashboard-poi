"""
PEI Data Processor
Extracts and processes PEI 2025-2030 indicators from Excel
Generates JSON data for dashboard integration
"""

import pandas as pd
import json
from datetime import datetime

def process_pei_indicators():
    """Process PEI indicators from Excel file"""
    
    print("="*80)
    print("PROCESADOR DE INDICADORES PEI 2025-2030")
    print("="*80)
    
    # Read Excel sheets
    try:
        df_oei = pd.read_excel('Indicadores_PEI2026.xlsx', sheet_name='bd_ind_OEI')
        df_aei = pd.read_excel('Indicadores_PEI2026.xlsx', sheet_name='bd_ind_AEI')
        
        # Sanitize column names
        df_oei.columns = df_oei.columns.str.replace('\n', ' ').str.strip()
        df_aei.columns = df_aei.columns.str.replace('\n', ' ').str.strip()
        
        print(f"\n✓ Archivo leído correctamente")
        print(f"  - Indicadores OEI: {len(df_oei)}")
        print(f"  - Indicadores AEI: {len(df_aei)}")
        print(f"  Columnas encontradas en AEI: {df_aei.columns.tolist()}")
    except Exception as e:
        print(f"\n✗ Error al leer archivo: {e}")
        return None
    
    # Process OEI data
    print("\n" + "="*80)
    print("PROCESANDO INDICADORES OEI")
    print("="*80)
    
    oei_data = []
    for idx, row in df_oei.iterrows():
        # Extract OEI information
        oei_item = {
            "nro": int(row.get('Nro', idx + 1)),
            "codigo": row.get('COD_OEI', f'OE.{idx+1:02d}'),
            "descripcion": row.get('OEI', row.get('Objetivo', 'Sin descripción')),
            "indicador": {
                "codigo": row.get('COD_IND', ''),
                "nombre": row.get('INDICADORES', row.get('Indicador', '')),
                "unidad_medida": row.get('Unidad de Medida', ''),
                "formula": row.get('ind_formula', row.get('Fórmula', '')),
                "uo_responsable": row.get('U.O. Responsable', row.get('U O Responsable', row.get('U.O. Responsable ', row.get('Area Responsable', '')))),
                "especificaciones_tecnicas": row.get('ind_espec_tec', ''),
                "fuente": row.get('ind_fuente', ''),
                "base_datos": row.get('ind_base_datos', '')
            },

            "metas": {
                "2025": float(row.get('2025', 0)) if pd.notna(row.get('2025')) else 0,
                "2026": float(row.get('2026', 0)) if pd.notna(row.get('2026')) else 0,
                "2027": float(row.get('2027', 0)) if pd.notna(row.get('2027')) else 0,
                "2028": float(row.get('2028', 0)) if pd.notna(row.get('2028')) else 0,
                "2029": float(row.get('2029', 0)) if pd.notna(row.get('2029')) else 0,
                "2030": float(row.get('2030', 0)) if pd.notna(row.get('2030')) else 0
            },
            "linea_base": float(row.get('LINEA BASE \n2024', row.get('LINEA BASE 2024', 0))) if pd.notna(row.get('LINEA BASE \n2024', row.get('LINEA BASE 2024'))) else 0,
            "avance_actual": 0,  # To be updated with real data
            "estado": "En progreso"
        }
        
        # Calculate progress percentage (simulated for now)
        meta_2026 = oei_item["metas"]["2026"]
        if meta_2026 > 0:
            oei_item["porcentaje_cumplimiento"] = round((oei_item["avance_actual"] / meta_2026) * 100, 2)
        else:
            oei_item["porcentaje_cumplimiento"] = 0
        
        oei_data.append(oei_item)
        print(f"\n  OEI {oei_item['nro']}: {oei_item['codigo']}")
        print(f"    Meta 2026: {meta_2026}")
    
    # Process AEI data
    print("\n" + "="*80)
    print("PROCESANDO INDICADORES AEI")
    print("="*80)
    
    aei_data = []
    for idx, row in df_aei.iterrows():
        aei_item = {
            "nro": int(row.get('Nro', idx + 1)),
            "codigo": row.get('COD_AEI', f'AE.{idx+1:02d}'),
            "oei_padre": row.get('COD_OEI', 'OE.01'),  # Link to parent OEI
            "descripcion": row.get('AEI', row.get('Acción', 'Sin descripción')),
            "indicador": {
                "codigo": row.get('COD_IND', ''),
                "nombre": row.get('INDICADORES', row.get('Indicador', '')),
                "unidad_medida": row.get('Unidad de Medida', ''),
                "formula": row.get('ind_formula', row.get('Fórmula', '')),
                "uo_responsable": row.get('U.O. Responsable', row.get('U O Responsable', row.get('U.O. Responsable ', row.get('Area Responsable', '')))),
                "especificaciones_tecnicas": row.get('ind_espec_tec', ''),
                "fuente": row.get('ind_fuente', ''),
                "base_datos": row.get('ind_base_datos', '')
            },
            "metas": {
                "2025": float(row.get('2025', 0)) if pd.notna(row.get('2025')) else 0,
                "2026": float(row.get('2026', 0)) if pd.notna(row.get('2026')) else 0,
                "2027": float(row.get('2027', 0)) if pd.notna(row.get('2027')) else 0,
                "2028": float(row.get('2028', 0)) if pd.notna(row.get('2028')) else 0,
                "2029": float(row.get('2029', 0)) if pd.notna(row.get('2029')) else 0,
                "2030": float(row.get('2030', 0)) if pd.notna(row.get('2030')) else 0
            },
            "linea_base": float(row.get('LINEA BASE \n2024', row.get('LINEA BASE 2024', 0))) if pd.notna(row.get('LINEA BASE \n2024', row.get('LINEA BASE 2024'))) else 0,
            "avance_actual": 0,
            "estado": "En progreso"
        }
        
        meta_2026 = aei_item["metas"]["2026"]
        if meta_2026 > 0:
            aei_item["porcentaje_cumplimiento"] = round((aei_item["avance_actual"] / meta_2026) * 100, 2)
        else:
            aei_item["porcentaje_cumplimiento"] = 0
        
        aei_data.append(aei_item)
        print(f"\n  AEI {aei_item['nro']}: {aei_item['codigo']} → {aei_item['oei_padre']}")
        print(f"    Meta 2026: {meta_2026}")
    
    # Create unified structure
    pei_structure = {
        "metadata": {
            "version": "1.0",
            "fecha_actualizacion": datetime.now().isoformat(),
            "periodo": "2025-2030",
            "año_actual": 2026
        },
        "oei": oei_data,
        "aei": aei_data,
        "resumen": {
            "total_oei": len(oei_data),
            "total_aei": len(aei_data),
            "cumplimiento_promedio_oei": round(sum(item["porcentaje_cumplimiento"] for item in oei_data) / len(oei_data), 2) if oei_data else 0,
            "cumplimiento_promedio_aei": round(sum(item["porcentaje_cumplimiento"] for item in aei_data) / len(aei_data), 2) if aei_data else 0
        }
    }
    
    return pei_structure

def export_to_json(data, filename='pei_data.json'):
    """Export PEI data to JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\n✓ Datos exportados a: {filename}")
        return True
    except Exception as e:
        print(f"\n✗ Error al exportar: {e}")
        return False

def export_to_js(data, filename='pei_data.js'):
    """Export PEI data to JavaScript file"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("/**\n")
            f.write(" * PEI 2025-2030 Data\n")
            f.write(" * Auto-generated from Indicadores_PEI2026.xlsx\n")
            f.write(f" * Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(" */\n\n")
            f.write("const PEI_DATA = ")
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write(";\n\n")
            f.write("// Export for use in dashboard\n")
            f.write("window.PEI_DATA = PEI_DATA;\n")
        print(f"✓ Datos exportados a: {filename}")
        return True
    except Exception as e:
        print(f"✗ Error al exportar JS: {e}")
        return False

if __name__ == "__main__":
    # Process indicators
    pei_data = process_pei_indicators()
    
    if pei_data:
        print("\n" + "="*80)
        print("EXPORTANDO DATOS")
        print("="*80)
        
        # Export to JSON
        export_to_json(pei_data, 'assets/data/pei_data.json')
        
        # Export to JS
        export_to_js(pei_data, 'js/pei_data.js')
        
        print("\n" + "="*80)
        print("RESUMEN")
        print("="*80)
        print(f"\nOEI: {pei_data['resumen']['total_oei']}")
        print(f"AEI: {pei_data['resumen']['total_aei']}")
        print(f"Cumplimiento Promedio OEI: {pei_data['resumen']['cumplimiento_promedio_oei']}%")
        print(f"Cumplimiento Promedio AEI: {pei_data['resumen']['cumplimiento_promedio_aei']}%")
        print("\n✓ Proceso completado exitosamente")
    else:
        print("\n✗ Error en el procesamiento")
