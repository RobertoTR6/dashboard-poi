import pandas as pd

# Leer ambas hojas
df_oei = pd.read_excel('Indicadores_PEI2026.xlsx', sheet_name='bd_ind_OEI')
df_aei = pd.read_excel('Indicadores_PEI2026.xlsx', sheet_name='bd_ind_AEI')

print("="*80)
print("ANÁLISIS DE INDICADORES PEI 2025-2030")
print("="*80)

print("\n### INDICADORES OEI ###")
print(f"Total indicadores OEI: {len(df_oei)}")
print(f"\nColumnas: {df_oei.columns.tolist()}")
print("\nDatos completos:")
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', 50)
print(df_oei)

print("\n\n### INDICADORES AEI ###")
print(f"Total indicadores AEI: {len(df_aei)}")
print(f"\nColumnas: {df_aei.columns.tolist()}")
print("\nDatos completos:")
print(df_aei)

# Resumen por OEI
if 'OEI' in df_oei.columns or 'Objetivo' in df_oei.columns:
    print("\n\n### RESUMEN POR OEI ###")
    for col in df_oei.columns:
        if 'OE' in str(col).upper() or 'OBJETIVO' in str(col).upper():
            print(f"\n{col}:")
            print(df_oei[col].value_counts())

# Resumen por AEI
if 'AEI' in df_aei.columns or 'Acción' in df_aei.columns:
    print("\n\n### RESUMEN POR AEI ###")
    for col in df_aei.columns:
        if 'AE' in str(col).upper() or 'ACCIÓN' in str(col).upper() or 'ACCION' in str(col).upper():
            print(f"\n{col}:")
            print(df_aei[col].value_counts())
