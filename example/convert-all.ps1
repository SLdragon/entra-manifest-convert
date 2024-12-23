$ErrorActionPreference = "Stop"

# Define the path to the templates folder
$templatesFolder = "templates"

# Get all .json and .tpl files in the templates folder and subfolders
$files = Get-ChildItem -Path $templatesFolder -Recurse -Include *.json, *.tpl

$totalFiles = $files.Count
$processedFiles = 0

foreach ($file in $files) {
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw

    # Check if the file contains "accessTokenAcceptedVersion": 2
    if ($content -match '"accessTokenAcceptedVersion":\s*2') {
        # Convert the file using the CLI tool
        Write-Host "Converting $($file.FullName)"
        entra-manifest-convert $file.FullName
    }

    $processedFiles++
    Write-Progress -Activity "Processing files" -Status "$processedFiles of $totalFiles files processed" -PercentComplete (($processedFiles / $totalFiles) * 100)
}

Write-Host "Processing completed. $processedFiles files processed."
