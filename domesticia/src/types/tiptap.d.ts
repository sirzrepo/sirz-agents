import '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    /**
     * Customize line height for paragraphs and headings
     */
    customLineHeight: {
      setLineHeight: (lineHeight: string | number) => ReturnType;
    };
    /**
     * Customize font size for text
     */
    customFontSize: {
      setFontSize: (fontSize: string | number) => ReturnType;
    };
  }
}
