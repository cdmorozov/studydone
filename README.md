# StudyDone

A small desktop app to log what you learned, by subject.

Pick a subject, type what you covered, press Enter. Entries are grouped by day.

## Download

Latest builds: **[Releases](https://github.com/cdmorozov/studydone/releases/latest)**

| File | For |
|---|---|
| `StudyDone_*.AppImage` | Any Linux — download, make executable, run |
| `StudyDone-*.rpm` | Fedora, RHEL, openSUSE |
| `StudyDone_*.deb` | Ubuntu, Debian, Mint |

```bash
# AppImage
chmod +x StudyDone_0.1.0_amd64.AppImage
./StudyDone_0.1.0_amd64.AppImage

# Fedora
sudo dnf install ./StudyDone-0.1.0-1.x86_64.rpm

# Ubuntu / Debian
sudo apt install ./StudyDone_0.1.0_amd64.deb
```

AppImage is larger (~100 MB) because it ships WebKit. The `.rpm` / `.deb` are ~5 MB and use the system WebKit.

## Develop

```bash
bun install
bun tauri dev
```

```bash
bun tauri build
```
