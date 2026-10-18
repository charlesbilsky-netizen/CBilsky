@echo off
setlocal enabledelayedexpansion
rem SalesMind film builder. Put this file in the SAME folder as the downloaded
rem SalesMind files (normally your Downloads folder) and double-click it.
rem It finds the newest copy of every piece, builds the film, and puts
rem SalesMind_The_RM_Operating_System.mp4 into your Videos folder.
cd /d "%~dp0"
echo.
echo  SalesMind film builder
echo  ----------------------
echo.

rem --- find ffmpeg: on PATH, in WinGet packages, or install it ---
set "FF="
where ffmpeg >nul 2>nul && set "FF=ffmpeg"
if not defined FF (
  for /f "delims=" %%f in ('dir /b /s "%LOCALAPPDATA%\Microsoft\WinGet\Packages\ffmpeg.exe" 2^>nul') do if not defined FF set "FF=%%f"
)
if not defined FF (
  echo  FFmpeg is not installed yet. Installing it now with winget...
  echo  If Windows asks for permission, click Yes.
  winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
  for /f "delims=" %%f in ('dir /b /s "%LOCALAPPDATA%\Microsoft\WinGet\Packages\ffmpeg.exe" 2^>nul') do if not defined FF set "FF=%%f"
)
if not defined FF (
  echo.
  echo  Could not find or install FFmpeg. Close this window, then run this
  echo  file again. If it still fails, install FFmpeg once with:
  echo      winget install --id Gyan.FFmpeg -e
  pause
  exit /b 1
)

rem --- collect the newest copy of every piece (handles "name (1).mp4" downloads) ---
set "MISSING="
if exist _list.txt del _list.txt
for %%n in (01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17) do (
  set "F="
  for /f "delims=" %%f in ('dir /b /o-d "SalesMind_Ch%%n_*.mp4" 2^>nul') do if not defined F set "F=%%f"
  if defined F (
    echo file '!F!'>>_list.txt
  ) else (
    set "MISSING=!MISSING! %%n"
  )
)
if defined MISSING (
  echo  These chapters are missing from this folder:%MISSING%
  echo  Download them from the chat into this folder, then run this file again.
  if exist _list.txt del _list.txt
  pause
  exit /b 1
)
set "SND="
for /f "delims=" %%f in ('dir /b /o-d "SalesMind_soundtrack*.m4a" 2^>nul') do if not defined SND set "SND=%%f"
if not defined SND (
  echo  SalesMind_soundtrack.m4a is missing. Download it into this folder and run again.
  del _list.txt
  pause
  exit /b 1
)
set "CHP="
for /f "delims=" %%f in ('dir /b /o-d "SalesMind_chapters*.txt" 2^>nul') do if not defined CHP set "CHP=%%f"
if not defined CHP (
  echo  SalesMind_chapters.txt is missing. Download it into this folder and run again.
  del _list.txt
  pause
  exit /b 1
)
set "COV="
for /f "delims=" %%f in ('dir /b /o-d "SalesMind_thumbnail*.jpg" 2^>nul') do if not defined COV set "COV=%%f"

rem --- build ---
echo  Building the film. This takes under a minute...
set "OUT=%USERPROFILE%\Videos\SalesMind_The_RM_Operating_System.mp4"
if defined COV (
  "%FF%" -v error -stats -y -f concat -safe 0 -i _list.txt -i "%SND%" -i "%CHP%" -i "%COV%" -map 0:v -map 1:a -map 3 -disposition:v:1 attached_pic -map_metadata 2 -map_chapters 2 -c copy -movflags +faststart "%OUT%"
) else (
  "%FF%" -v error -stats -y -f concat -safe 0 -i _list.txt -i "%SND%" -i "%CHP%" -map 0:v -map 1:a -map_metadata 2 -map_chapters 2 -c copy -movflags +faststart "%OUT%"
)
set "RESULT=%errorlevel%"
del _list.txt
if not "%RESULT%"=="0" (
  echo.
  echo  Something went wrong. Your downloaded files are unchanged.
  echo  Run this file again, or send a screenshot of this window to Claude.
  pause
  exit /b 1
)
set "SRT="
for /f "delims=" %%f in ('dir /b /o-d "SalesMind_The_RM_Operating_System*.srt" 2^>nul') do if not defined SRT set "SRT=%%f"
if defined SRT copy /y "%SRT%" "%USERPROFILE%\Videos\SalesMind_The_RM_Operating_System.srt" >nul

echo.
echo  Done. The film is in your Videos folder:
echo  %OUT%
echo  17 chapters, about 19 minutes, cover image included.
echo.
start "" explorer /select,"%OUT%"
pause
