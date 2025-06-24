import React from "react";

type IframeEmbedProps = {
  src: string;         // full iframe URL
  height?: string;     // e.g., "100vh" or "500px"
  width?: string;      // e.g., "100%" or "800px"
  title?: string;      // accessibility + SEO
};

const IframeEmbed: React.FC<IframeEmbedProps> = ({
  src,
  height = "100vh",
  width = "100%",
  title = "Embedded Content",
}) => {
  return (
    <div style={{ width, height }}>
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allow="clipboard-write"
        title={title}
      />
    </div>
  );
};

export default IframeEmbed;
