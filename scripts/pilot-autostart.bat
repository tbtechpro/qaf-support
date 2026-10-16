@echo off
REM QAF Support pilot autostart: services + public tunnel. Runs at Windows logon.
cd /d "C:\Users\HomePC\Downloads\QAF Support Project"
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\pilot-local.ps1" > ".local-logs\autostart.log" 2>&1
start "" /min cloudflared tunnel --url http://localhost:3000 >> ".local-logs\autostart.log" 2>&1
