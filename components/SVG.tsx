"use client";

import React, { useEffect } from "react";

interface SVGRenderProps {
  code: string;
}

const SVGRender: React.FC<SVGRenderProps> = ({ code }) => {
  return (
    <div>
        <div dangerouslySetInnerHTML={{ __html: code }} className="max-w-full max-h-full" />
      </div>
  );
};

export default SVGRender;