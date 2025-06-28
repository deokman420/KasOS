# KasOS Build Script for Windows PowerShell
# Automatically updates version information and prepares for deployment
#
# Usage:
#   .\build.ps1 [major|minor|patch|prerelease] [-DryRun] [-Environment ENV] [-Commit HASH] [-Branch NAME] [-NoGit]

param(
    [Parameter(Position=0)]
    [ValidateSet("major", "minor", "patch", "prerelease")]
    [string]$VersionType = "patch",
    
    [switch]$DryRun,
    
    [ValidateSet("development", "staging", "production")]
    [string]$Environment = "production",
    
    [string]$Commit,
    
    [string]$Branch,
    
    [switch]$NoGit
)

function Write-BuildLog {
    param(
        [string]$Message,
        [ValidateSet("Info", "Success", "Warning", "Error")]
        [string]$Level = "Info"
    )
    
    $prefix = switch ($Level) {
        "Info" { "[INFO]" }
        "Success" { "[SUCCESS]" }
        "Warning" { "[WARNING]" }
        "Error" { "[ERROR]" }
        default { "[BUILD]" }
    }
    
    Write-Host "$prefix $Message" -ForegroundColor $(
        switch ($Level) {
            "Success" { "Green" }
            "Warning" { "Yellow" }
            "Error" { "Red" }
            default { "White" }
        }
    )
}

function Invoke-BuildCommand {
    param(
        [string]$Command,
        [switch]$IgnoreErrors
    )
    
    if ($DryRun) {
        Write-BuildLog "Would execute: $Command" "Info"
        return ""
    }
    
    try {
        $result = Invoke-Expression $Command 2>$null
        return $result
    }
    catch {
        if (-not $IgnoreErrors) {
            throw
        }
        return ""
    }
}

function Get-GitInformation {
    if ($NoGit) {
        return @{
            CommitHash = if ($Commit) { $Commit } else { "unknown" }
            Branch = if ($Branch) { $Branch } else { "unknown" }
            IsClean = $true
        }
    }
    
    try {
        $commitHash = if ($Commit) { $Commit } else { 
            (Invoke-BuildCommand "git rev-parse HEAD" -IgnoreErrors).Substring(0, 8)
        }
        $branchName = if ($Branch) { $Branch } else {
            Invoke-BuildCommand "git rev-parse --abbrev-ref HEAD" -IgnoreErrors
        }
        $status = Invoke-BuildCommand "git status --porcelain" -IgnoreErrors
        
        return @{
            CommitHash = if ($commitHash) { $commitHash } else { "unknown" }
            Branch = if ($branchName) { $branchName } else { "main" }
            IsClean = [string]::IsNullOrEmpty($status)
        }
    }
    catch {
        Write-BuildLog "Git not available, using defaults" "Warning"
        return @{
            CommitHash = "unknown"
            Branch = "main"
            IsClean = $true
        }
    }
}

function Update-VersionFile {
    $versionFile = "version-control.js"
    
    if (-not (Test-Path $versionFile)) {
        Write-BuildLog "Version control file not found" "Error"
        return $false
    }
    
    $gitInfo = Get-GitInformation
    $timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    $buildNumber = [Math]::Floor((Get-Date).Subtract((Get-Date "1970-01-01")).TotalMilliseconds)
    
    # Read current version file
    $content = Get-Content $versionFile -Raw
    
    # Create new build information
    $buildInfo = @"
        build: {
            number: $buildNumber,
            timestamp: "$timestamp",
            commitHash: "$($gitInfo.CommitHash)",
            branch: "$($gitInfo.Branch)",
            environment: "$Environment",
            buildId: null
        },
"@
    
    # Replace build section
    $content = $content -replace 'build:\s*\{[^}]*\},', ($buildInfo.Trim() + ',')
    
    if ($DryRun) {
        Write-BuildLog "Would update version file with new build info" "Info"
        return $true
    }
    
    $content | Set-Content $versionFile -Encoding UTF8
    Write-BuildLog "Updated version file with build information" "Success"
    return $true
}

function Test-RequiredFiles {
    $requiredFiles = @(
        "index.html",
        "version-control.js", 
        "version-display.js",
        "README.md"
    )
    
    $missing = $requiredFiles | Where-Object { -not (Test-Path $_) }
    
    if ($missing.Count -gt 0) {
        Write-BuildLog "Missing required files: $($missing -join ', ')" "Error"
        return $false
    }
    
    Write-BuildLog "All required files present" "Success"
    return $true
}

function Show-BuildSummary {
    $gitInfo = Get-GitInformation
    
    Write-Host ""
    Write-Host "Build Summary" -ForegroundColor Cyan
    Write-Host "=============" -ForegroundColor Cyan
    Write-Host "Version Type: $VersionType"
    Write-Host "Environment: $Environment"
    Write-Host "Commit: $($gitInfo.CommitHash)"
    Write-Host "Branch: $($gitInfo.Branch)"
    Write-Host "Clean: $(if ($gitInfo.IsClean) { 'Yes' } else { 'No' })"
    Write-Host "Dry Run: $(if ($DryRun) { 'Yes' } else { 'No' })"
    
    if (-not $gitInfo.IsClean -and -not $DryRun) {
        Write-BuildLog "Working directory is not clean - uncommitted changes detected" "Warning"
    }
}

# Main execution
try {
    Write-BuildLog "Starting KasOS build process" "Info"
    
    # Validate environment
    if (-not (Test-RequiredFiles)) {
        throw "Validation failed"
    }
    
    # Update version information
    Update-VersionFile | Out-Null
    
    # Display summary
    Show-BuildSummary
    
    Write-BuildLog "Build process completed successfully" "Success"
}
catch {
    Write-BuildLog "Build failed: $($_.Exception.Message)" "Error"
    exit 1
}
