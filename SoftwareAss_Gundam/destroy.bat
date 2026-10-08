@echo off
setlocal

cd /d C:\Users\david\OneDrive\Documents\SQLite\SoftwareAss_Gundam\CSV_files
set sqlite3=C:\Users\david\OneDrive\Documents\SQLite\SoftwareAss_Gundam\sqlite3.exe
set gunpladata=C:\Users\david\OneDrive\Documents\SQLite\SoftwareAss_Gundam\gunpladata.db

echo Dropping all tables...

for %%f in (*.csv) do (
    echo dropping %%~nf
    "%sqlite3%" "%gunpladata%" "DROP TABLE [%%~nf]"
    if %ERRORLEVEL% neq 0 (
        echo ERROR: The command failed!
    )
)

echo Dropping complete. Tables:
"%sqlite3%" "%gunpladata%" ".tables"
PAUSE

endlocal