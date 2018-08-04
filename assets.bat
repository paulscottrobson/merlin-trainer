rem
rem	Script to rebuild and update sound, graphics and fonts in application.
rem
@echo off

echo "Making Graphics"
cd graphics
python makecurves.py
python makeframes.py
python makeatlas.py

echo "Copying to assets"
copy sprites.* ..\app\assets\sprites 1>NUL
copy loader.png ..\app\assets\sprites 1>NUL
cd ..
copy fonts\*.png app\assets\fonts  1>NUL
copy fonts\*.fnt app\assets\fonts 1>NUL

echo "Updating .ogg files"
del  /Q app\assets\sounds\*.ogg app\assets\sounds\*.mp3 
copy /Y notes\sounds\*.ogg  app\assets\sounds 1>NUL

echo "Converting OGG to MP3"
cd app\assets\sounds
for %%f in (*.ogg) do (
	ffmpeg -v 0 -i "%%f" -c:a libmp3lame -q:a 2 "%%~nf.mp3"
    rem echo %%~nf
)
cd ..\..\..
echo "Done."
