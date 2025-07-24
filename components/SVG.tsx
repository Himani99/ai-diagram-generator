"use client";

import React, { useEffect, useRef } from "react";
import { Copy, Download } from "lucide-react";

interface SVGRenderProps {
  code: string;
}

const SVGRender: React.FC<SVGRenderProps> = ({ code }) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Inject the SVG code
  useEffect(() => {
    if (svgContainerRef.current) {
      svgContainerRef.current.innerHTML = code;
    }
  }, [code]);

  const downloadAsSVG = () => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector("svg");
    if (!svgEl) return;

    const svgData = svgEl.outerHTML;
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "diagram.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAsPNG = () => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector("svg");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "diagram.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    };
    image.src = url;
  };

  return (
    <div className="w-full relative">
      <div className="absolute right-0 top-0 flex gap-2 p-2 z-10">
        <button onClick={downloadAsSVG} className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">
          <Download className="h-4 w-4" />
          SVG
        </button>
        <button onClick={downloadAsPNG} className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm">
          <Download className="h-4 w-4" />
          PNG
        </button>
      </div>

      <div ref={svgContainerRef} className="max-w-full max-h-full mt-10" />
    </div>
  );
};

export default SVGRender;
