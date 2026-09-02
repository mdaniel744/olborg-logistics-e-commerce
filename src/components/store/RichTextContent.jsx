"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "isomorphic-dompurify";

const HTML_CONTENT_PATTERN = /<(?:p|div|section|h[1-6]|ul|ol|li|strong|b|em|i|blockquote|table|thead|tbody|tr|th|td|a|img|br|hr)\b/i;

export default function RichTextContent({ content, className = "" }) {
  const source = typeof content === "string" ? content.trim() : "";
  if (!source) return null;

  const classes = `long-form-content product-rich-text ${className}`.trim();

  if (HTML_CONTENT_PATTERN.test(source)) {
    const sanitizedHtml = DOMPurify.sanitize(source, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["target", "rel"],
    });

    return <div className={classes} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  }

  return (
    <div className={classes}>
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
}
