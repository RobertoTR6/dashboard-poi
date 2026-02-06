
import json

def update_data_js(json_file, js_file):
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        js_content = f"// Auto-generated POI data\nwindow.poiData = {json.dumps(data, indent=2, ensure_ascii=False)};"
        
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print(f"Successfully updated {js_file} from {json_file}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_data_js('poi_data.json', 'data.js')
