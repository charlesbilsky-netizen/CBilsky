@echo off
rem Joins the 16 SalesMind chapter files into one film with chapter markers.
rem Put this file, SalesMind_chapters.txt, SalesMind_soundtrack.m4a and the
rem 16 SalesMind_ChXX files in one folder, then double-click this file.
cd /d "%~dp0"
where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo FFmpeg is not installed yet.
  echo Open Start, type cmd, press Enter, then paste this line and press Enter:
  echo     winget install --id Gyan.FFmpeg -e
  echo When it finishes, close that window and double-click this file again.
  pause
  exit /b 1
)
for %%n in (01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16) do (
  if not exist SalesMind_Ch%%n_*.mp4 (
    echo Chapter %%n is missing. All 16 SalesMind_ChXX files must be in this folder.
    pause
    exit /b 1
  )
)
if not exist SalesMind_soundtrack.m4a (
  echo SalesMind_soundtrack.m4a is missing from this folder.
  pause
  exit /b 1
)
(for %%n in (01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16) do @for %%f in (SalesMind_Ch%%n_*.mp4) do @echo file '%%f') > _list.txt
ffmpeg -v error -stats -y -f concat -safe 0 -i _list.txt -i SalesMind_soundtrack.m4a -i SalesMind_chapters.txt -map 0:v -map 1:a -map_metadata 2 -map_chapters 2 -c copy -movflags +faststart "SalesMind_The_RM_Operating_System.mp4"
set RESULT=%errorlevel%
del _list.txt
if not "%RESULT%"=="0" (
  echo Something went wrong. Your chapter files are unchanged.
  pause
  exit /b 1
)
echo.
echo Done. SalesMind_The_RM_Operating_System.mp4 is in this folder, with 16 chapters.
pause
