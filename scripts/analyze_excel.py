
import pandas as pd

try:
    # Read the Excel file
    excel_file = 'POI20206.xlsx'
    # Load all sheets to understand the structure
    xl = pd.ExcelFile(excel_file)
    
    print(f"Sheet names: {xl.sheet_names}")
    
    for sheet_name in xl.sheet_names:
        print(f"\n--- Analyzing Sheet: {sheet_name} ---")
        df = xl.parse(sheet_name)
        print(f"Columns: {list(df.columns)}")
        print(f"Shape: {df.shape}")
        print("First 5 rows:")
        print(df.head().to_string())
        print("\nData Types:")
        print(df.dtypes)
        
        # Basic stats for numeric columns
        print("\nDescription:")
        print(df.describe())

except Exception as e:
    print(f"Error analyzing Excel file: {e}")
