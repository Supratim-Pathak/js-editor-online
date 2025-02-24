"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  const [code, setCode] = useState(`console.log("Hello, Next.js!");\n\nsetTimeout(() => {\n  console.log("This runs after 1 second");\n}, 1000);`);
  const [output, setOutput] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "log") {
        setOutput((prev) => [...prev, event.data.message]);
      } else if (event.data.type === "error") {
        setOutput((prev) => [...prev, `Error: ${event.data.message}`]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const runCode = () => {
    setOutput([]); // Clear previous output
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.srcdoc = `
        <script>
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
        <\/script>
      `;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Next.js JavaScript Editor</h1>

      {/* Editor */}
      <div className="w-3/4 h-96 border border-gray-700 rounded-md overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
        />
      </div>

      {/* Run Button */}
      <button
        onClick={runCode}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Run Code
      </button>

      {/* Output */}
      <div className="mt-4 w-3/4 p-4 border border-gray-700 bg-gray-800 rounded-md h-40 overflow-auto">
        <h2 className="text-lg font-semibold">Output:</h2>
        <pre className="mt-2 text-green-400">{output.join("\n")}</pre>
      </div>

      {/* Hidden Iframe for code execution */}
      <iframe ref={iframeRef} className="hidden"></iframe>
    </div>
  );
}
