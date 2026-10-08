@echo off
setlocal

cd /d C:\Users\david\OneDrive\Documents\SQLite\SoftwareAss_Gundam\CSV_files
set sqlite3=C:\Users\david\OneDrive\Documents\SQLite\SoftwareAss_Gundam\sqlite3.exe
set gunpladata=C:\Users\david\OneDrive\Documents\SQLite\SoftwareAss_Gundam\gunpladata.db

echo Importing tables into database...

for %%f in (*.csv) do (
    echo importing %%~f
    "%sqlite3%" "%gunpladata%" "CREATE TABLE %%~nf ( 'Order' TEXT, Product_name TEXT, Release_date DATE, First_appearance TEXT, Grade TEXT, MSRP FLOAT )"
    "%sqlite3%" "%gunpladata%" ".mode csv"
    "%sqlite3%" "%gunpladata%" ".import --csv --skip 1 %%~f %%~nf"
    if %ERRORLEVEL% neq 0 (
        echo ERROR: The command failed!
    )
)

echo Import complete. Tables:
"%sqlite3%" "%gunpladata%" ".tables"
PAUSE

endlocal