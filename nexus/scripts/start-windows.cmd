@echo off
REM Nexus Windows launcher — never hardcodes a cursor-agent version path.
REM Detection order is implemented in src/launcher/windows-cursor-agent.js:
REM   1) agent.cmd (shell: true)
REM   2) PATH (agent / cursor-agent)
REM   3) versioned installs that contain both node.exe and index.js
setlocal
cd /d "%~dp0"
if not defined NEXUS_RECOVERY_TOKEN set NEXUS_RECOVERY_TOKEN=nexus-recovery-dev-token
node src\index.js %*
