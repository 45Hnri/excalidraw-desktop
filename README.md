# Excalidraw-Desktop

[Excalidraw](https://github.com/excalidraw/excalidraw) as a standalone binary:
- offline
- command-line argument support
- image and file export shortcuts

![demo](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3IwdnZ1NnVjZXl5czdnbHluaWwzcjBobDF5eXBxMTNobXdpYmNmaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9p2wRLSSm2KPqXgnD5/giphy.gif)

> [!NOTE] 
> This **prototype** mainly exists because the Excalidraw-PWA does not integrate as well in my neovim workflow.

---

## Usage

```bash
excalidraw <PATH>
```

### Shortcuts

|   key   | action               |
|:-------:|----------------------|
| \<A-w\> | write file to path   |
| \<A-p\> | write image to path  |
| \<A-a\> | write image and file |
| \<A-P\> | switch image type    |
| \<A-m\> | toggle darkmode      |

---

## Installation

- clone this repo to your machine

### Linux

```bash
npm run build
mv release/0.0.0/excalidraw-Linux-0.0.0.AppImage ~/.local/bin/excalidraw
chmod u+x ~/.local/bin/excalidraw
```

> [!important] 
> this requires you to have ~/.local/bin/excalidraw in your $PATH

---

## Integration

### Neovim

My current keybinds:

```lua
-- usually [name](path) in markdown
-- open the next content in braces as a path in excalidraw
vim.keymap.set("n", "<leader>xo", function()
    vim.cmd("norm yib")
    local word = vim.fn.getreg('"')
    vim.fn.jobstart({'excalidraw',word})
end, { noremap = true, silent = true })

-- take a markdown link and convert the path to an svg image
vim.keymap.set("n", "<leader>xp", function()
    vim.cmd("norm Vy")
    local filename = string.match(vim.fn.getreg('"'),"^.+%.")
    vim.cmd("norm o!"..filename.."svg)")
end, { noremap = true, silent = true })
```

---

## Development

### Environment Variables

|           Key          | Functionality             |
|:----------------------:|---------------------------|
| VITE_TESTING_FILE_PATH | Argument for path of file |

### PNPM Support

For the time we are stuck with npm.
["Why no pnpm, electron?" JS-dev asked calmly](https://github.com/electron/forge/issues/2633#issuecomment-2642437325)
