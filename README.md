# StudyDone

A small desktop app for a daily log of what you learned today.

Choose a subject, write what you learned, press Enter. Notes are grouped by day.

![StudyDone](docs/screenshot.png)

## Download

Latest builds: **[Releases](https://github.com/cdmorozov/studydone/releases/latest)**

| File | For |
| --- | --- |
| `StudyDone_*.deb` | Ubuntu, Debian, Mint |
| `StudyDone-*.rpm` | Fedora, RHEL, openSUSE |
| `StudyDone_*.AppImage` | Any Linux |

AppImage is larger (~100 MB) because it ships WebKit.  
The `.rpm` / `.deb` are ~5 MB and use the system WebKit.

## Stack

Desktop shell is **Tauri 2** (Rust + system WebKit). The UI is **React 19**, **TypeScript**, **Vite 7**, and **Tailwind CSS 4**. Package manager is **Bun**.

## Develop

```bash
bun install
bun tauri dev
```
