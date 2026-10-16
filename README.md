# VLC 11 Player — Windows Desktop Application

A modern, high-performance Windows x64 desktop media player built with **React**, **TypeScript**, **Vite**, **Electron**, and **electron-builder**. Features a sleek dark cinematic user interface inspired by modern media design, 10-band graphic equalizer, real-time audio visualizer, synchronized SRT/WebVTT subtitles, playlist management, and automated GitHub Actions CI/CD workflows producing a native Windows NSIS installer (`VLC-11-Player-Setup.exe`).

---

## Key Features

- **Windows Desktop Experience**: Runs natively on Windows 10 & 11 x64 with native file pickers, window controls, and safe local file streaming.
- **Hardware-Accelerated Playback**: Instant GPU-powered decoding for MP4, WebM, MP3, WAV, OGG, M4A, and FLAC.
- **10-Band Graphic Audio Equalizer**: Real-time frequency control (32Hz to 16kHz) with built-in presets (Rock, Pop, Jazz, Electronic, Bass Boost, Vocal, Classical).
- **Audio Frequency Visualizer**: Live animated frequency bars rendered over audio and video tracks via the Web Audio API.
- **Subtitle Engine**: Synchronized SubRip (`.srt`) and WebVTT (`.vtt`) subtitle parsing with adjustable synchronization offset (-5.0s to +5.0s).
- **Video Color Grading & Effects**: Dynamic brightness, contrast, saturation, hue rotation, sepia, invert, and blur adjustments.
- **Playlist & Library Management**: Create custom playlists, queue tracks, reorder items, and scan local folders.
- **Automated Windows Builds**: GitHub Actions workflow builds and uploads `VLC-11-Player-Setup.exe` on every push to `main`.

---

## Beginner-Friendly Guide: How to Build & Download the Windows Installer

Follow these straightforward steps to generate your ready-to-run Windows installer (`VLC-11-Player-Setup.exe`) using GitHub Actions:

### Step 1: Download the Project from Google AI Studio
1. In Google AI Studio, locate the file tree or export button.
2. Download or export the full project as a `.zip` archive to your computer.
3. Extract the ZIP file into a folder on your computer (e.g., `C:\Projects\vlc-11-player`).

### Step 2: Create a New GitHub Repository
1. Open your web browser and go to [github.com](https://github.com).
2. Log in and click the **+** (plus icon) in the top right, then select **New repository**.
3. Name your repository (e.g., `vlc-11-player`).
4. Set the repository visibility to **Public** (or **Private**).
5. **Do not** initialize with a README, .gitignore, or license (these are already included in the project files).
6. Click **Create repository**.

### Step 3: Ensure Default Branch is Named "main"
GitHub defaults to `main`. If your Git configuration defaults to `master`, rename it using:
```bash
git branch -M main
```

### Step 4: Commit and Push All Project Files
Open your terminal (Command Prompt, PowerShell, or Git Bash) in your extracted project folder and run:
```bash
# Initialize git repository
git init

# Set default branch to main
git branch -M main

# Stage all files (including hidden folders like .github)
git add .

# Create initial commit
git commit -m "Initial commit of VLC 11 Player"

# Link to your new GitHub repository (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/vlc-11-player.git

# Push the code to GitHub
git push -u origin main
```

> **Important**: Ensure the `.github` folder is included in the commit. It contains `.github/workflows/build.yml` which triggers the automated Windows build.

---

### Step 5: Open the Actions Tab in GitHub
1. Open your repository on GitHub.
2. In the top navigation bar, click the **Actions** tab.
3. You will see a workflow named **Build Windows Desktop Installer** running automatically!

---

### Step 6: Monitor the Build
1. Click on the active workflow run to watch the build progress.
2. The workflow will:
   - Check out code on a fresh `windows-latest` virtual machine.
   - Install dependencies using `npm ci`.
   - Run the TypeScript typecheck (`npm run lint`).
   - Compile the Vite frontend (`npm run build`).
   - Package the Electron desktop app with NSIS (`npm run dist:win`).
   - Validate and upload the resulting `VLC-11-Player-Setup.exe`.
3. When complete, a **green checkmark** indicates a successful build.

---

### Step 7: Download the Windows Installer Artifact
1. Click on the completed workflow run.
2. Scroll down to the bottom of the page to the **Artifacts** section.
3. Click on **VLC-11-Player-Windows-Installer**.
4. GitHub will download a ZIP archive containing the installer.

---

### Step 8: Extract the ZIP
1. Locate the downloaded file (e.g., `VLC-11-Player-Windows-Installer.zip`) in your `Downloads` folder.
2. Right-click the ZIP file and select **Extract All...**.
3. Inside the extracted folder, you will find `VLC-11-Player-Setup.exe`.

---

### Step 9: Install and Run VLC 11 Player on Windows
1. Double-click `VLC-11-Player-Setup.exe`.
2. Follow the setup wizard to choose your installation directory and create desktop / start menu shortcuts.
3. Once installation completes, check "Run VLC 11 Player" and click **Finish**.
4. Enjoy smooth, high-fidelity media playback directly on your Windows desktop!

---

### Step 10: Troubleshooting Builds & Releases

| Problem | Root Cause | Solution |
| :--- | :--- | :--- |
| **Workflow doesn't run** | Repository pushed to branch other than `main` | Push to `main` or trigger manually under **Actions** > **Build Windows Desktop Installer** > **Run workflow**. |
| **Missing installer error** | Electron builder failed to package | Check the workflow run logs under the step `Build Electron NSIS Windows Installer`. |
| **Release workflow fails** | GitHub Actions lacks write permissions | Go to repository **Settings** > **Actions** > **General** > **Workflow permissions** and select **Read and write permissions**. |

---

## Local Development & Testing

### Running the Web Dev Server
```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```

### Running the Electron Desktop App Locally
```bash
# Start Vite and launch Electron
npm run electron:dev
```

### Building the Windows Installer Locally (Windows machine)
```bash
npm run dist:win
```
The output installer will be generated in the `release/` folder as `VLC-11-Player-Setup.exe`.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` | Play / Pause |
| `S` | Stop playback |
| `Left / Right` | Step backward / forward 5 seconds |
| `Up / Down` | Volume up / down 5% |
| `M` | Mute / Unmute |
| `F` or `F11` | Toggle Full Screen |
| `P` / `N` | Previous / Next track |
| `[` / `]` | Decrease / Increase playback speed |
| `=` | Reset playback speed to 1.0x |
| `Ctrl + O` | Open media file |
| `Ctrl + Shift + O` | Open folder / media directory |
| `Ctrl + S` | Load subtitle file (`.srt`, `.vtt`) |
| `Ctrl + E` | Toggle 10-band audio equalizer |
| `Ctrl + V` | Toggle video color grading & effects |
| `Ctrl + L` | Toggle playlist queue drawer |
| `Escape` | Exit full screen / Close open dialogs |

---

## Codec & Architecture Notice

VLC 11 Player uses Chromium's native hardware-accelerated playback pipeline combined with the Web Audio DSP filter engine. It natively decodes H.264, VP8, VP9, AV1, AAC, MP3, WAV, FLAC, and Opus. For legacy proprietary codecs (such as HEVC/H.265 without OS licensing or AC-3 surround), transcode files using Handbrake or ffmpeg.

*Disclaimer: VLC 11 Player is an independent open-source desktop media player project and is not affiliated with, maintained by, or endorsed by the VideoLAN organization.*
