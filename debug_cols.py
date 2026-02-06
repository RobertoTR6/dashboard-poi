import pandas as pd
try:
    df_aei = pd.read_excel('Indicadores_PEI2026.xlsx', sheet_name='bd_ind_AEI')
    for col in df_aei.columns:
        print(f"COLUMN: {col}")
except Exception as e:
    print(e)
