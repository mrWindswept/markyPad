import {
  Download,
  Eye,
  FileJson,
  Globe,
  Link,
  NotebookPen,
  Pencil,
  X,
} from "lucide-react";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import TurndownService from "turndown";
import { Button } from "../components/Button";
import "../index.css";

const STORAGE_KEY = "sticky_notes_by_url";

const StickyNote = () => {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState(false);
  const [hideNote, setHideNote] = useState(false);
  const [scope, setScope] = useState("url"); // or 'domain'
  const [currentKey, setCurrentKey] = useState("");

  useEffect(() => {
    const key =
      scope === "domain"
        ? location.origin
        : location.origin + location.pathname;
    setCurrentKey(key);

    chrome.storage.local.get([STORAGE_KEY], (data) => {
      const allNotes = data[STORAGE_KEY] || {};
      setText(allNotes[key] || "");
    });
  }, [scope]);

  useEffect(() => {
    if (!currentKey) return;
    const timeout = setTimeout(() => {
      chrome.storage.local.get([STORAGE_KEY], (data) => {
        const allNotes = data[STORAGE_KEY] || {};
        allNotes[currentKey] = text;
        chrome.storage.local.set({ [STORAGE_KEY]: allNotes });
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [text, currentKey]);

  const htmlContentToMarkdownHandler = (
    newContent,
    enableBulletMarker = false
  ) => {
    const turndownService = new TurndownService({
      bulletListMarker: enableBulletMarker ? "-" : "",
    });
    return turndownService.turndown(newContent);
  };

  const exportNotes = (mode = "page") => {
    const currentUrl = window.location.href;
    const currentDomain = window.location.hostname;
    const fileName = `${currentDomain}_notes`;

    chrome.storage.local.get([STORAGE_KEY], (data) => {
      const allNotes = data[STORAGE_KEY] || {};
      const entries = Object.entries(allNotes).filter(([key]) => {
        if (mode === "all") return true;
        return key === currentUrl || key === currentDomain;
      });

      if (entries.length === 0) {
        alert("No notes found for this mode.");
        return;
      }

      const mdContent = entries
        .map(([scope, rawHtml]) => {
          const md = htmlContentToMarkdownHandler(rawHtml, true);
          return `## 📝 Notes for ${scope}\n\n${md}`;
        })
        .join("\n\n---\n\n");

      const blob = new Blob([mdContent], {
        type: "text/markdown",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <>
      {hideNote && (
        <div className="fixed bottom-4 right-4 z-[999999]">
          <Button
            onClick={() => setHideNote(false)}
            variant="solid"
            tippyContent={"Add notes"}
            className="animate-bounce"
          >
            <NotebookPen className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!hideNote && (
        <div className="fixed bottom-4 right-4 w-[300px] h-[350px] z-[999999] resize">
          <div className="w-full h-full bg-white text-zinc-900 border border-zinc-300 rounded-2xl shadow-xl !p-3 flex flex-col gap-2.5 overflow-hidden">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-zinc-800 flex items-center gap-2">
                  <NotebookPen className="text-amber-600" /> Sticky Note
                </h3>
                <Button onClick={() => setHideNote(true)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-around text-xs">
                <Button
                  onClick={() =>
                    setScope((s) => (s === "url" ? "domain" : "url"))
                  }
                  tippyContent={
                    scope === "url"
                      ? "Save notes page-wise"
                      : "Save notes domain-wise"
                  }
                >
                  {scope === "url" ? (
                    <>
                      <Link className="h-4 w-4" /> Page
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" /> Domain
                    </>
                  )}
                </Button>
                <Button onClick={() => setPreview((p) => !p)}>
                  {preview ? (
                    <>
                      <Pencil className="h-4 w-4" /> Edit
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" /> Preview
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => exportNotes("page")}
                  tippyContent={
                    "Only notes from this page/session will be included in the download"
                  }
                >
                  <FileJson className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => exportNotes("all")}
                  tippyContent={"Download all pages/sessions notes"}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div
              className={`flex-1 text-black rounded-xl bg-zinc-50 !p-2 ${
                preview ? "overflow-auto" : "overflow-hidden"
              }`}
            >
              {preview ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-black">
                  <Markdown
                    options={{
                      overrides: {
                        ul: { props: { className: "list-inside" } },
                      },
                    }}
                  >
                    {text || "_Nothing yet..._"}
                  </Markdown>
                </div>
              ) : (
                <textarea
                  className="w-full h-full bg-transparent resize-none outline-none text-sm placeholder-zinc-400 text-black"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write markdown notes here..."
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StickyNote;
