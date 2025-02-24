/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { Fragment, useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

import { Ghost, Loader2 } from "lucide-react";
export default function Home() {
  const [loader, setLoader] = useState<boolean>(false);
  const [code, setCode] = useState("//START CODEING");
  const [output, setOutput] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const execute = () => {
    setLoader(true);
    console.log(iframeRef.current);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = `<script>
         window.console = {
            log: function(...args) {
              parent.postMessage({ type: 'log', message: args.join(' ') }, '*');
            },
            error: function(...args) {
              parent.postMessage({ type: 'error', message: args.join(' ') }, '*');
            }
          };
          try {
            ${code} 
          } catch (error) {
            console.error(error);
          }
        </script>`;
    }
    setLoader(false);
    // setTimeout(() => {
    //   setLoader(false);
    // }, 2000);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        // Check the message type and update the output state
        if (event.data.type === "log") {
            console.log(event.data , "log");
          setOutput((prev) => prev + event.data.message + "\n"); // Append log messages
        } else if (event.data.type === "error") {
            console.log(event.data.message);
          setOutput((prev) => prev + "Error: " + event.data.message + "\n"); // Append errors
        }
      };

      // Set up the message listener
      window.addEventListener("message", handleMessage);
    // Clean up listener on component unmount
    return () => window.removeEventListener("message", handleMessage);
    
  });

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-900 text-white">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div>
            <span className="text-lg font-semibold">START CODEING USING JAVASCRIPT</span>
          </div>
          <div className="space-x-2">
            <Button variant={"ghost"} onClick={execute} disabled={loader}>
              {loader && (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              )}
              {!loader && <>Run code</>}
            </Button>
            <Button variant={"destructive"} onClick={()=>{ setOutput("")}} disabled={loader}>
              Clear
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}

          {/* Code Editor */}
          <div className="flex-1 p-4">
            <div className="bg-gray-800 h-full p-4 rounded">
              {/* <pre className="text-green-400">sjhsdgasdfjg</pre> */}
              <Editor
                theme="vs-dark"
                className="editor"
                height="90vh"
                defaultLanguage="javascript"
                defaultValue="// Start codeing"
                onChange={(value) => {
                  setCode(value || "");
                }}
              />
            </div>
          </div>
          {/* Output Panel */}
          <div className="w-1/3 px-4 border-l border-gray-700">
            {/* Output */}
            <div className="mt-4 w-full p-4 border min-h-lvh border-gray-700 bg-gray-800 rounded-md h-40 overflow-scroll">
              <h2 className="text-lg font-semibold  text-green-400">Output:</h2>
              <pre className="mt-2 text-green-400">{output}</pre>
            </div>
          </div>
        </div>
        {/* Hidden Iframe for JavaScript execution */}
        <iframe ref={iframeRef} className="hidden" title="sandbox"></iframe>
      </div>
    </>
  );
}

