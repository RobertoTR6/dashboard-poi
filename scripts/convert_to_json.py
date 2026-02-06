
import zipfile
import xml.etree.ElementTree as ET
import json

def parse_xlsx_to_json(filename, output_json):
    try:
        data = []
        with zipfile.ZipFile(filename, 'r') as z:
            # Load Shared Strings
            shared_strings = []
            if 'xl/sharedStrings.xml' in z.namelist():
                with z.open('xl/sharedStrings.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    for si in root.findall('main:si', ns):
                        t = si.find('main:t', ns)
                        if t is not None:
                            shared_strings.append(t.text)
                        else:
                            shared_strings.append("")

            # Load Sheet 1
            if 'xl/worksheets/sheet1.xml' in z.namelist():
                with z.open('xl/worksheets/sheet1.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    
                    sheet_data = root.find('main:sheetData', ns)
                    headers = []
                    
                    for i, row in enumerate(sheet_data.findall('main:row', ns)):
                        row_data = []
                        # Excel cells can be sparse, need to handle indices if needed, 
                        # but for simple tables usually they are in order.
                        # Ideally track 'r' attribute like 'A1', 'B1'.
                        # For simplicity, assuming full dense rows or just appending.
                        # Better approach: track max col index.
                        
                        cells = row.findall('main:c', ns)
                        if not cells: 
                            continue

                        current_row_vals = {} 
                        # We need to handle column indices (A, B, C...) to map correctly if sparse
                        # But typically POI exports are dense.
                        
                        vals = []
                        for c in cells:
                            cell_type = c.get('t')
                            v = c.find('main:v', ns)
                            val = v.text if v is not None else ""
                            
                            if cell_type == 's': # Shared string
                                if val.isdigit():
                                    val = shared_strings[int(val)]
                            
                            vals.append(val)
                            
                        if i == 0:
                            headers = vals
                        else:
                            # Zip headers with vals
                            # Handle case where row might be shorter than headers
                            entry = {}
                            for h_idx, header in enumerate(headers):
                                if h_idx < len(vals):
                                    entry[header] = vals[h_idx]
                                else:
                                    entry[header] = ""
                            data.append(entry)

        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"Successfully exported {len(data)} rows to {output_json}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    parse_xlsx_to_json('POI20206.xlsx', 'poi_data.json')
