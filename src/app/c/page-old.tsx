/* eslint-disable @typescript-eslint/no-unused-vars */
// import Image from "next/image";
"use client";
import React, { Fragment, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { getRuntimes } from "@/lib/compilerServices";
import { Button } from "@/components/ui/button";
interface Runtime {
  language: string;
  version: string;
}
import { Ghost, Loader2 } from "lucide-react";
import axios from "axios";
export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [output, setOutput] = useState<string>(
    "Try programiz.pro\n=== Code Execution Successful ==="
  );
  const [runtimeList, setRuntimeList] = useState([]);
  const [lang, setLang] = useState<string | null>();
  const [loader, setLoader] = useState<boolean>(false);
  const [version, setVersion] = useState<string | null>(null);
  const [code, setCode] = useState<string>("// Start coding...");

  useEffect(() => {
    async function runtimeList() {
      try {
        const data = await getRuntimes();
        console.log(data, "===========>");
        setRuntimeList(data);
      } catch (error) {
        console.log(error);
      }
    }
    runtimeList();
  }, []);

  // const execute = () => {
  //   setLoader(true);
  //   setTimeout(() => {
  //     setLoader(false);
  //   }, 2000);
  // };

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const executeCode = async () => {
    console.log("=================>>>>>>")
    if (!lang || !version) {
      setOutput("⚠️ Please select a language.");
      return;
    }

    setLoader(true);
    setOutput("Executing...");

    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: lang,
          version: version,
          files: [{ content: code }],
        }
      );

      setOutput(
        response.data.run.stdout || response.data.run.stderr || "No output"
      );
    } catch (error) {
      setOutput("⚠️ Error executing code.");
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-900 text-white">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div>
            <span className="text-lg font-semibold">
              START CODEING WITH {lang ? lang.toUpperCase() : ""}
            </span>
          </div>
          <div className="space-x-2">
            <Button variant={"ghost"} onClick={executeCode} disabled={loader}>
              {loader && (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              )}
              {!loader && <>Run code</>}
            </Button>
            <Button variant={"destructive"} disabled={loader}>
              Clear
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className="w-[150px] bg-gray-800 flex flex-col items-center py-4 space-y-4 overflow-scroll"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {runtimeList.map((data: Runtime, index) => {
              return (
                <React.Fragment key={index}>
                  <button
                    className={`flex text-xs w-full p-0 flex-col items-center  hover:text-white ${
                      lang == data?.language
                        ? "text-white-400 text-lg font-semibold"
                        : "text-gray-400"
                    }`}
                    onClick={() => {
                      setLang(data?.language);
                      setVersion(data?.version);
                    }}
                  >
                    <span className="text-l ">
                      {data?.language.toUpperCase()} ({data?.version})
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

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
                onChange={handleEditorChange}
              />
            </div>
          </div>
          {/* Output Panel */}
          <div className="w-1/3 p-4 border-l border-gray-700">
            <div className="bg-gray-800 h-full p-4 rounded">
              <pre className="text-gray-300">{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
// https://emkc.org/api/v2/runtimes/
