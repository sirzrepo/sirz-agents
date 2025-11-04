

import React from "react";

const RichTextDisplay: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div>
      {/* <h2>Rich Text Preview</h2> */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default RichTextDisplay;

