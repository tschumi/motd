"""
This script will build the executables.

Usage: python pyinstaller.py

"""
import platform
import PyInstaller.__main__

os = platform.system()

if os == "Darwin":
    PyInstaller.__main__.run([
        'src/backend/main.py',
        '--name=motd',
        '--icon=src/assets/icons/mac/icon.icns',
        '--onefile',
        '--windowed',
        '--add-data=gui:gui'
    ])

if os == "Windows":
    PyInstaller.__main__.run([
        'src/backend/main.py',
        '--name=motd',
        '--icon=src/assets/icons/win/icon.ico',
        '--onefile',
        '--windowed',
        '--add-data=gui;gui'
    ])