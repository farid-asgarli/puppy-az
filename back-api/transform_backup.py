#!/usr/bin/env python3
"""
Transform old backup SQL to match new database schema.
Key changes:
- Cities table: "Name" column split into "NameAz", "NameEn", "NameRu"
- Remove CREATE TABLE, ALTER TABLE, CREATE INDEX, etc. (only keep data)
- Keep COPY statements and data
"""
import re
import sys

def transform_backup(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    output_lines = []
    in_copy_data = False
    current_table = None
    skip_until_backslash = False
    
    for i, line in enumerate(lines):
        # Match COPY statements
        if line.startswith('COPY public.'):
            match = re.match(r'COPY public\."(.+?)" \((.+?)\) FROM stdin;', line)
            if match:
                table_name = match.group(1)
                columns = match.group(2)
                current_table = table_name
                
                # Special handling for Cities table
                if table_name == 'Cities':
                    # Old schema: Id, Name, IsActive, IsDeleted, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy, DeletedAt, DeletedBy
                    # New schema: Id, NameAz, NameEn, NameRu, IsActive, IsDeleted, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy, DeletedAt, DeletedBy
                    new_columns = '"Id", "NameAz", "NameEn", "NameRu", "IsActive", "IsDeleted", "CreatedAt", "UpdatedAt", "CreatedBy", "UpdatedBy", "DeletedAt", "DeletedBy"'
                    output_lines.append(f'COPY public."{table_name}" ({new_columns}) FROM stdin;\n')
                else:
                    output_lines.append(line)
                
                in_copy_data = True
                continue
        
        # Copy data rows
        if in_copy_data:
            if line.strip() == '\\.':
                # End of COPY data
                output_lines.append(line)
                in_copy_data = False
                current_table = None
                continue
            else:
                # Data row
                if current_table == 'Cities':
                    # Transform Cities data: duplicate Name column to NameAz, NameEn, NameRu
                    parts = line.strip().split('\t')
                    if len(parts) >= 2:
                        # Old: Id, Name, IsActive, IsDeleted, CreatedAt, ...
                        # New: Id, NameAz, NameEn, NameRu, IsActive, IsDeleted, CreatedAt, ...
                        city_id = parts[0]
                        city_name = parts[1]
                        rest = parts[2:] if len(parts) > 2 else []
                        
                        # Insert name 3 times (Az, En, Ru)
                        new_parts = [city_id, city_name, city_name, city_name] + rest
                        output_lines.append('\t'.join(new_parts) + '\n')
                    else:
                        output_lines.append(line)
                else:
                    output_lines.append(line)
                continue
    
    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.writelines(output_lines)
    
    print(f"✅ Transformed {len(output_lines)} lines")
    print(f"✅ Output written to: {output_file}")

if __name__ == '__main__':
    input_file = 'original_backup.sql'
    output_file = 'transformed_data.sql'
    
    print(f"🔄 Transforming {input_file}...")
    transform_backup(input_file, output_file)
    print("✅ Done!")
