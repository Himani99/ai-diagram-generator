"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  mode: "mermaid" | "svg";
}

const DiagramModalView: React.FC<Props> = ({ isOpen, onClose, code, mode }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    const renderMermaid = async () => {
      if (mode === "mermaid" && code && mermaidRef.current) {
        mermaid.initialize({ startOnLoad: false });
        try {
          const { svg } = await mermaid.render("theGraph", code);
          mermaidRef.current.innerHTML = svg;
        } catch (err) {
          mermaidRef.current.innerHTML = `<pre class='text-red-500'>Invalid Mermaid syntax</pre>`;
        }
      }
    };
    renderMermaid();
  }, [code, isOpen, mode]); // ✅ fixed here

  // ✅ placeholder for download
  const handleDownload = () => {
    alert("Download feature coming soon!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Diagram Preview</DialogTitle>
        </DialogHeader>

        {/* Preview area */}
        {previewVisible && (
          <div className="p-4 border rounded bg-white overflow-auto max-h-[70vh]">
            {mode === "svg" ? (
              <div
                dangerouslySetInnerHTML={{ __html: code }}
                className="w-full"
              />
            ) : (
              <div ref={mermaidRef} className="mermaid" />
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="violet" onClick={handleDownload}>
            Download
          </Button>
          <Button variant="default" onClick={() => setPreviewVisible(true)}>
            Preview
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiagramModalView;
