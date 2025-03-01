import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("electron", {
    getCommandLineArgs: () =>
        new Promise((resolve) => {
            ipcRenderer.once("command-line-args", (_, args) => resolve(args));
            ipcRenderer.send("get-command-line-args");
        }),
    getFileData: () => ipcRenderer.invoke('get-file-data'),
    setFileData: () => ipcRenderer.invoke('set-file-data'),
});
contextBridge.exposeInMainWorld("electronAPI", {
    setImagePngData: (content:string) => ipcRenderer.send('set-image-png-data', { content }),
    setImagePngDataReply: (callback:any) => ipcRenderer.once('set-image-png-data-reply', (_, response) => callback(response)),
    setImageSvgData: (content:string) => ipcRenderer.send('set-image-svg-data', { content }),
    setImageSvgDataReply: (callback:any) => ipcRenderer.once('set-image-svg-data-reply', (_, response) => callback(response)),
    setFileData: (content:string) => ipcRenderer.send('set-file-data',{ content }),
    setFileDataReply: (callback:any) => ipcRenderer.once('set-file-data-reply', (_, response) => callback(response)),
});
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },
})
