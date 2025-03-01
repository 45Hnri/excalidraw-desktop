import { Theme } from "@excalidraw/excalidraw/types/element/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode } from "react";

export function FooterButton({theme, onClick, children, tooltip, className, style}:{style?:CSSProperties ,className?:string,theme:Theme, onClick:(args:any)=>void, tooltip: ReactNode, children: ReactNode}){
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size={"icon"}
                    className={cn("excalidraw help-icon",{
                        "theme--dark": theme === "dark",
                    },className)}
                    variant={"outline"}
                    onClick={onClick}
                    style={style}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent className="excalidraw p-3 text-[13px] py-2 mb-1 excalidraw-tooltip animate-none data-[state=closed]:animate-none text-white">
                <span className="text-white">
                    {tooltip}
                </span>
            </TooltipContent>
        </Tooltip>
    )
}
