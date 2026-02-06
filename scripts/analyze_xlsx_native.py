
import zipfile
import xml.etree.ElementTree as ET
import re

def analyze_xlsx(filename):
    try:
        with zipfile.ZipFile(filename, 'r') as z:
            # List files to verify structure
            # print(z.namelist())
            
            # Load Shared Strings
            shared_strings = []
            if 'xl/sharedStrings.xml' in z.namelist():
                with z.open('xl/sharedStrings.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    # namespace usually: {http://schemas.openxmlformats.org/spreadsheetml/2006/main}
                    ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    for si in root.findall('main:si', ns):
                        t = si.find('main:t', ns)
                        if t is not None:
                            shared_strings.append(t.text)
                        else:
                            # Handle rich text components if needed, or fallback
                            shared_strings.append("")
            
            print(f"Found {len(shared_strings)} shared strings.")

            # Load Sheet 1
            if 'xl/worksheets/sheet1.xml' in z.namelist():
                print("\n--- Analyzing Sheet 1 ---")
                with z.open('xl/worksheets/sheet1.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    
                    sheet_data = root.find('main:sheetData', ns)
                    rows = []
                    for row in sheet_data.findall('main:row', ns):
                        row_data = []
                        for c in row.findall('main:c', ns):
                            cell_type = c.get('t')
                            v = c.find('main:v', ns)
                            val = v.text if v is not None else ""
                            
                            if cell_type == 's': # Shared string
                                if val.isdigit():
                                    val = shared_strings[int(val)]
                            
                            row_data.append(val)
                        rows.append(row_data)
                        if len(rows) >= 10: # Just get first 10 rows
                            break
                    
                    for i, r in enumerate(rows):
                        print(f"Row {i+1}: {r}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_xlsx('POI20206.xlsx')
