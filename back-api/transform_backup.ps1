# Transform backup SQL to match new schema
$inputFile = "original_backup.sql"
$outputFile = "transformed_data.sql"

Write-Host "Reading $inputFile..." -ForegroundColor Cyan

$lines = Get-Content $inputFile -Encoding UTF8
$outputLines = @()
$inCopyData = $false
$currentTable = $null

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    
    # Match COPY statements
    if ($line -match '^COPY public\."(.+?)" \((.+?)\) FROM stdin;$') {
        $tableName = $matches[1]
        $columns = $matches[2]
        $currentTable = $tableName
        
        # Special handling for Cities table
        if ($tableName -eq 'Cities') {
            # Transform columns: add NameAz, NameEn, NameRu instead of Name
            $newColumns = '"Id", "NameAz", "NameEn", "NameRu", "IsActive", "IsDeleted", "CreatedAt", "UpdatedAt", "CreatedBy", "UpdatedBy", "DeletedAt", "DeletedBy"'
            $outputLines += "COPY public.`"$tableName`" ($newColumns) FROM stdin;"
            Write-Host "  Transforming table: $tableName" -ForegroundColor Yellow
        } else {
            $outputLines += $line
        }
        
        $inCopyData = $true
        continue
    }
    
    # Process COPY data
    if ($inCopyData) {
        if ($line -eq '\.') {
            # End of COPY data
            $outputLines += $line
            $inCopyData = $false
            $currentTable = $null
            continue
        } else {
            # Data row
            if ($currentTable -eq 'Cities') {
                # Transform Cities data: duplicate Name to NameAz, NameEn, NameRu
                $parts = $line -split "`t"
                if ($parts.Count -ge 2) {
                    $cityId = $parts[0]
                    $cityName = $parts[1]
                    $rest = $parts[2..($parts.Count-1)] -join "`t"
                    
                    # New format: Id, NameAz, NameEn, NameRu, rest...
                    $newLine = "$cityId`t$cityName`t$cityName`t$cityName`t$rest"
                    $outputLines += $newLine
                } else {
                    $outputLines += $line
                }
            } else {
                $outputLines += $line
            }
            continue
        }
    }
}

Write-Host "Writing to $outputFile..." -ForegroundColor Cyan
$outputLines | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "Done! Transformed $($outputLines.Count) lines" -ForegroundColor Green
Write-Host "Output: $outputFile" -ForegroundColor Green
