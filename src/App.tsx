import { Excalidraw, exportToBlob, exportToSvg, Footer, serializeAsJSON } from '@excalidraw/excalidraw'
import { useLayoutEffect, useRef, useState } from 'react';
import { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { ResolvablePromise } from '@excalidraw/excalidraw/types/utils';
import { Theme } from '@excalidraw/excalidraw/types/element/types';
import { ImageDown, Moon, Save, Sun } from 'lucide-react';
import { FooterButton } from './components/footer-button';
import { toast, Toaster } from 'sonner';
import { cn, resolvablePromise } from './lib/utils';
function App() {
    const initialStatePromiseRef = useRef<{
        promise: ResolvablePromise<ExcalidrawInitialDataState | null>;
    }>({ promise: null! });
    if (!initialStatePromiseRef.current.promise) {
        // @ts-expect-error needlessly hard type 
        initialStatePromiseRef.current.promise = resolvablePromise<ExcalidrawInitialDataState | null>();
    }
    const [theme, setTheme] = useState<Theme>("dark");
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
    const [hasFile, setHasFile] = useState(false);
    const [exportFormat, setExportFormat] = useState<"svg"|"png">("svg")
    useLayoutEffect(() => {
        async function fetchFileData() {
            // @ts-expect-error electronApi not in default type
            if (window.electron) {
                // @ts-expect-error electronApi not in default type
                const result = await window.electron.getFileData();
                if (result?.error || !result?.path) console.error("Error loading file:", result?.error||"no data");
                if (result.path) {
                    setHasFile(true)
                    if(result.content) {
                        initialStatePromiseRef.current.promise.resolve( await JSON.parse(result.content))
                        return
                    }
                }
                initialStatePromiseRef.current.promise.resolve({})
            }
        }
        fetchFileData();
    }, []);

    async function handleExportJSON() {
        if(!excalidrawAPI || !hasFile) return

        const elements = excalidrawAPI.getSceneElements();
        const appState = excalidrawAPI.getAppState();

        try {
            const scene = serializeAsJSON(
                elements,
                appState,
                null,
                "local"
            )
            // @ts-expect-error electronApi not in default type
            window.electronAPI.setFileData(scene);
            // @ts-expect-error electronApi not in default type
            window.electronAPI.setFileDataReply((response:any) => {
                if (response.success) {
                    toast.success("file saved",{duration:2500})
                } else {
                    toast.error("error saving file")
                }
            })
        } catch (error) {
            console.error("Export failed", error);
        }
    }


    async function handleExportPNG() {
        if(!excalidrawAPI || !hasFile) return

        const elements = excalidrawAPI.getSceneElements();
        const appState = excalidrawAPI.getAppState();

        try {
            const png = await exportToBlob({
                elements,
                appState: {
                    ...appState,
                    exportWithDarkMode:theme==="dark",
                    exportBackground: theme!=="dark"
                },
                files: null,
                exportPadding: 20
            })
            // @ts-expect-error electronApi not in default type
            window.electronAPI.setImagePngData(await png.arrayBuffer());
            // @ts-expect-error electronApi not in default type
            window.electronAPI.setImagePngDataReply((response:any) => {
                if (response.success) {
                    toast.success("png saved",{duration:2500})
                } else {
                    toast.error("error saving png")
                }
            });
        } catch (error) {
            console.error("Export failed", error);
        }
    }

    function handleExportFormat(){
        exportFormat === "svg"? handleExportSVG() : handleExportPNG()
    }

    async function handleExportSVG() {
        if(!excalidrawAPI || !hasFile) return

        const elements = excalidrawAPI.getSceneElements();
        const appState = excalidrawAPI.getAppState();

        try {
            const svg = await exportToSvg({
                elements,
                appState: {...appState,exportWithDarkMode:theme==="dark"},
                files: null,
                exportPadding: 20
            })
            const svgString = new XMLSerializer().serializeToString(svg);
            // @ts-expect-error electronApi not in default type
            window.electronAPI.setImageSvgData(svgString);
            // @ts-expect-error electronApi not in default type
            window.electronAPI.setImageSvgDataReply((response:any) => {
                if (response.success) {
                    toast.success("svg saved",{duration:2500})
                } else {
                    toast.error("error saving svg")
                }
            });
        } catch (error) {
            console.error("Export failed", error);
        }
    }
    return (
        <div className="h-screen w-screen" onKeyDown={(e)=>{
            if(!e.altKey && e.key === "E") handleExportFormat()
            if(e.altKey && e.key === "E") setExportFormat(prev=>prev==="svg"?"png":"svg")
            if(e.key === "W") handleExportJSON()
            if(e.key === "A") handleExportFormat(),handleExportJSON()
            if(e.key === "M") setTheme(prev=>prev==="dark"?"light":"dark")
        }}>
            <Excalidraw 
                initialData={initialStatePromiseRef.current.promise}
                theme={theme}
                excalidrawAPI={(api)=>setExcalidrawAPI(api)}
            >
                <Footer>
                    <div className="flex justify-end gap-2.5 pl-2.5 w-full">
                        {
                            hasFile &&
                                <>
                                    <FooterButton
                                        theme={theme}
                                        tooltip={ "save file" }
                                        onClick={handleExportJSON}
                                    >
                                        <Save/>
                                    </FooterButton>
                                    <FooterButton
                                        theme={theme}
                                        tooltip={ `save as ${exportFormat}` }
                                        onClick={handleExportPNG}
                                    >
                                        <ImageDown/>
                                    </FooterButton>

                                    <div
                                        className="flex theme--dark bg-[var(--color-surface-low)] rounded-[var(--border-radius-lg)]"
                                    >
                                        <FooterButton
                                            theme={theme}
                                            className={cn("border-0 text-[10px] font-normal font-mono", {
                                                "underline font-semibold": exportFormat === "svg"                
                                            })}
                                            tooltip={ "set format svg" }
                                            onClick={() => setExportFormat("svg")}
                                            style={{boxShadow:"none"}}
                                        >
                                            svg
                                        </FooterButton>
                                        <FooterButton
                                            className={cn("border-0 text-[10px] font-normal font-mono", {
                                                "underline font-semibold": exportFormat === "png"                
                                            })}
                                            theme={theme}
                                            tooltip={ "set format png" }
                                            onClick={() => setExportFormat("png")}
                                            style={{boxShadow:"none"}}
                                        >
                                            png
                                        </FooterButton>
                                    </div>
                                </>
                        }
                        <FooterButton
                            theme={theme}
                            tooltip={`${theme==="light"?"light":"dark"}-mode`}
                            onClick={() => setTheme(prev=>prev==="light"?"dark":"light")}
                        >
                            {theme === "light"
                                ? <Sun/>
                                : <Moon/>
                            }
                        </FooterButton>
                    </div>
                </Footer>
            </Excalidraw>
            <Toaster theme={theme} position="bottom-center"/>
        </div>
    )
}

export default App
