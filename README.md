# Text Editor

A simple, responsive, browser-based text editor built with plain HTML, CSS, and JavaScript. It supports multiple files, inline renaming, and saving to your local device.

## Features

- **Multiple Files**: Create and manage multiple text files within a single session using the tab bar.
- **Horizontal Scrolling Tabs**: The tab bar automatically scrolls horizontally when it contains too many files.
- **Inline Renaming**: Long press (or long click) on any file tab to rename it. Press `Enter` to confirm or `Escape` to cancel.
- **Smart Default Names**: New files are named using the current time in `HHMMSS` format by default (e.g., `143025.txt`). Duplicate names are automatically appended with a suffix (e.g., `143025-2.txt`).
- **Download/Save**: Click the Save button or use `Ctrl+S` / `Cmd+S` to download the active file. The downloaded file will use the current tab's name and automatically append `.txt` if missing.
- **Mobile Friendly**: Optimized touch interactions for long press and horizontal scrolling without triggering native text selection.
- **No External Dependencies**: Pure vanilla JavaScript, HTML, and CSS.

## Usage

1. Open `index.html` in any modern web browser.
2. Type or paste text into the textarea.
3. Click the `+` button to create a new file.
4. Long press (hold) on a file tab to rename it.
5. Click the Save button to download the current file as a `.txt` document.

## File Structure

- `index.html` - Page structure and layout.
- `style.css` - Page styling and responsive design.
- `script.js` - State management, file operations, and download logic.

## Notes

- All data is kept in the browser's memory. Refreshing the page will clear all files and content.
- No text is uploaded to any server. The save process is handled entirely client-side via Blob and Object URL.
