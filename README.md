# Text Editor

A simple browser-based text editor built with plain HTML, CSS, and JavaScript.

## Features

- Editable textarea for free-form typing
- Save button that downloads the current content as a text file
- File name pattern: `untitled${HHMMSS}.txt`
- Timestamp is based on the local time in HHMMSS format
- Keyboard shortcut: `Ctrl+S` or `Cmd+S` to save
- No external dependencies or build tools required

## Usage

1. Open `index.html` in a web browser.
2. Type or paste text into the textarea.
3. Click the Save button to download the file.
4. The downloaded file will be named like `untitled143025.txt`.

## File Structure

- `index.html` - page structure
- `style.css` - page styling
- `script.js` - save logic and file name generation

## Notes

- The saved file is generated entirely in the browser.
- No text is uploaded to any server.
- The timestamp uses the local time of the user's device.
