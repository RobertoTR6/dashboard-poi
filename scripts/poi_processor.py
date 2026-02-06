#!/usr/bin/env python3
"""
POI 2026 Data Processor
Unified script for Excel processing, analysis, and validation
"""

import zipfile
import xml.etree.ElementTree as ET
import json
import argparse
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


class ExcelProcessor:
    """Process Excel files to JSON with comprehensive error handling."""
    
    def __init__(self, filename: str):
        self.filename = Path(filename)
        self.shared_strings: List[str] = []
        self.data: List[Dict[str, Any]] = []
        
        # Validate file exists
        if not self.filename.exists():
            raise FileNotFoundError(f"Excel file '{filename}' does not exist")
        
        if not self.filename.suffix.lower() in ['.xlsx', '.xlsm']:
            raise ValueError(f"File must be .xlsx or .xlsm, got {self.filename.suffix}")
    
    def _load_shared_strings(self, zipfile_obj: zipfile.ZipFile) -> None:
        """Load shared strings from Excel file."""
        if 'xl/sharedStrings.xml' not in zipfile_obj.namelist():
            logger.warning("No shared strings found in Excel file")
            return
        
        try:
            with zipfile_obj.open('xl/sharedStrings.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                
                for si in root.findall('main:si', ns):
                    t = si.find('main:t', ns)
                    if t is not None and t.text:
                        self.shared_strings.append(t.text)
                    else:
                        # Handle rich text or empty strings
                        self.shared_strings.append("")
                
                logger.info(f"Loaded {len(self.shared_strings)} shared strings")
        except ET.ParseError as e:
            logger.error(f"Failed to parse shared strings: {e}")
            raise
    
    def _get_cell_value(self, cell: ET.Element, ns: Dict[str, str]) -> str:
        """Extract value from a cell element."""
        cell_type = cell.get('t')
        v = cell.find('main:v', ns)
        val = v.text if v is not None else ""
        
        if cell_type == 's':  # Shared string
            if val.isdigit():
                idx = int(val)
                if idx < len(self.shared_strings):
                    val = self.shared_strings[idx]
                else:
                    logger.warning(f"Shared string index {idx} out of range")
                    val = ""
        
        return val
    
    def parse_to_json(self, output_json: str, generate_js: bool = False) -> int:
        """
        Parse Excel file to JSON.
        
        Args:
            output_json: Output JSON file path
            generate_js: If True, also generate data.js for web
            
        Returns:
            Number of rows processed
        """
        try:
            with zipfile.ZipFile(self.filename, 'r') as z:
                # Validate Excel structure
                if 'xl/worksheets/sheet1.xml' not in z.namelist():
                    raise ValueError("Invalid Excel file: sheet1.xml not found")
                
                # Load shared strings
                self._load_shared_strings(z)
                
                # Process sheet data
                with z.open('xl/worksheets/sheet1.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    
                    sheet_data = root.find('main:sheetData', ns)
                    if sheet_data is None:
                        raise ValueError("No sheet data found in Excel file")
                    
                    headers = []
                    
                    for i, row in enumerate(sheet_data.findall('main:row', ns)):
                        cells = row.findall('main:c', ns)
                        if not cells:
                            continue
                        
                        vals = [self._get_cell_value(c, ns) for c in cells]
                        
                        if i == 0:
                            # Normalize headers (remove trailing spaces)
                            headers = [h.strip() for h in vals]
                            logger.info(f"Found {len(headers)} columns: {headers[:5]}...")
                        else:
                            # Create data entry
                            entry = {}
                            for h_idx, header in enumerate(headers):
                                if h_idx < len(vals):
                                    entry[header] = vals[h_idx]
                                else:
                                    entry[header] = ""
                            self.data.append(entry)
            
            # Validate data
            if not self.data:
                logger.warning("No data rows extracted from Excel file")
            
            # Save JSON
            output_path = Path(output_json)
            with output_path.open('w', encoding='utf-8') as f:
                json.dump(self.data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✓ Successfully exported {len(self.data)} rows to {output_json}")
            
            # Generate data.js if requested
            if generate_js:
                self._generate_js_file(output_path.parent / 'data.js')
            
            return len(self.data)
            
        except zipfile.BadZipFile:
            logger.error(f"Invalid ZIP/Excel file: {self.filename}")
            raise
        except ET.ParseError as e:
            logger.error(f"XML parsing error: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {type(e).__name__}: {e}")
            raise
    
    def _generate_js_file(self, output_path: Path) -> None:
        """Generate data.js file for web dashboard."""
        try:
            with output_path.open('w', encoding='utf-8') as f:
                f.write("// Auto-generated POI data\n")
                f.write("window.poiData = ")
                json.dump(self.data, f, indent=2, ensure_ascii=False)
                f.write(";\n")
            logger.info(f"✓ Generated {output_path}")
        except Exception as e:
            logger.error(f"Failed to generate data.js: {e}")
    
    def analyze_structure(self, max_rows: int = 10) -> None:
        """Analyze and display Excel structure."""
        try:
            with zipfile.ZipFile(self.filename, 'r') as z:
                self._load_shared_strings(z)
                
                with z.open('xl/worksheets/sheet1.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    
                    sheet_data = root.find('main:sheetData', ns)
                    rows = []
                    
                    for row in sheet_data.findall('main:row', ns):
                        cells = row.findall('main:c', ns)
                        if not cells:
                            continue
                        
                        vals = [self._get_cell_value(c, ns) for c in cells]
                        rows.append(vals)
                        
                        if len(rows) >= max_rows:
                            break
                    
                    print(f"\n{'='*80}")
                    print(f"Excel Structure Analysis: {self.filename.name}")
                    print(f"{'='*80}\n")
                    
                    for i, r in enumerate(rows):
                        row_type = "HEADER" if i == 0 else f"Row {i}"
                        print(f"{row_type:8} | {r[:5]}...")  # Show first 5 columns
                    
                    print(f"\n{'='*80}\n")
                    
        except Exception as e:
            logger.error(f"Analysis failed: {e}")
            raise


class DataValidator:
    """Validate POI data quality."""
    
    REQUIRED_FIELDS = [
        'Centro de Costo',
        'OEI',
        'ACTIVIDAD OPERATIVA',
        'COD_TAREA_V2'
    ]
    
    def __init__(self, json_file: str):
        self.json_file = Path(json_file)
        
        if not self.json_file.exists():
            raise FileNotFoundError(f"JSON file '{json_file}' does not exist")
        
        with self.json_file.open('r', encoding='utf-8') as f:
            self.data = json.load(f)
    
    def validate(self) -> Dict[str, Any]:
        """
        Validate data quality.
        
        Returns:
            Dictionary with validation results
        """
        results = {
            'total_rows': len(self.data),
            'missing_fields': [],
            'empty_values': {},
            'data_types': {},
            'warnings': []
        }
        
        if not self.data:
            results['warnings'].append("No data found in JSON file")
            return results
        
        # Check for required fields
        sample_row = self.data[0]
        for field in self.REQUIRED_FIELDS:
            if field not in sample_row:
                results['missing_fields'].append(field)
        
        # Count empty values
        for field in self.REQUIRED_FIELDS:
            if field in sample_row:
                empty_count = sum(1 for row in self.data if not row.get(field) or str(row.get(field)).strip() == '')
                if empty_count > 0:
                    results['empty_values'][field] = {
                        'count': empty_count,
                        'percentage': round(empty_count / len(self.data) * 100, 2)
                    }
        
        # Check for trailing spaces in keys
        keys_with_spaces = [k for k in sample_row.keys() if k != k.strip()]
        if keys_with_spaces:
            results['warnings'].append(f"Keys with trailing spaces: {keys_with_spaces}")
        
        return results
    
    def print_report(self) -> None:
        """Print validation report."""
        results = self.validate()
        
        print(f"\n{'='*80}")
        print(f"Data Validation Report: {self.json_file.name}")
        print(f"{'='*80}\n")
        
        print(f"Total Rows: {results['total_rows']}")
        
        if results['missing_fields']:
            print(f"\n❌ Missing Required Fields: {', '.join(results['missing_fields'])}")
        else:
            print(f"\n✓ All required fields present")
        
        if results['empty_values']:
            print(f"\n⚠️  Empty Values Found:")
            for field, info in results['empty_values'].items():
                print(f"  - {field}: {info['count']} rows ({info['percentage']}%)")
        else:
            print(f"\n✓ No empty values in required fields")
        
        if results['warnings']:
            print(f"\n⚠️  Warnings:")
            for warning in results['warnings']:
                print(f"  - {warning}")
        
        print(f"\n{'='*80}\n")


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description='POI 2026 Data Processor - Unified Excel processing tool',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Convert Excel to JSON and generate data.js
  python poi_processor.py convert POI20206.xlsx --js
  
  # Analyze Excel structure
  python poi_processor.py analyze POI20206.xlsx --rows 5
  
  # Validate data quality
  python poi_processor.py validate poi_data.json
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Convert command
    convert_parser = subparsers.add_parser('convert', help='Convert Excel to JSON')
    convert_parser.add_argument('input', help='Input Excel file (.xlsx)')
    convert_parser.add_argument('-o', '--output', default='poi_data.json', help='Output JSON file (default: poi_data.json)')
    convert_parser.add_argument('--js', action='store_true', help='Also generate data.js for web dashboard')
    
    # Analyze command
    analyze_parser = subparsers.add_parser('analyze', help='Analyze Excel structure')
    analyze_parser.add_argument('input', help='Input Excel file (.xlsx)')
    analyze_parser.add_argument('--rows', type=int, default=10, help='Number of rows to display (default: 10)')
    
    # Validate command
    validate_parser = subparsers.add_parser('validate', help='Validate data quality')
    validate_parser.add_argument('input', help='Input JSON file')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    try:
        if args.command == 'convert':
            processor = ExcelProcessor(args.input)
            row_count = processor.parse_to_json(args.output, generate_js=args.js)
            print(f"\n✓ Success! Processed {row_count} rows")
            
        elif args.command == 'analyze':
            processor = ExcelProcessor(args.input)
            processor.analyze_structure(max_rows=args.rows)
            
        elif args.command == 'validate':
            validator = DataValidator(args.input)
            validator.print_report()
            
    except Exception as e:
        logger.error(f"Command failed: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
