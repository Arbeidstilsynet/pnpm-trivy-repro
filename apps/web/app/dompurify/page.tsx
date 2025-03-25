"use client";

import DOMPurify from "dompurify";

export default function DOMPurifyPage() {
  const dirtyHTML = "<h2>Hello, <b>world</b>!</h2>";
  const cleanHTML = DOMPurify.sanitize(dirtyHTML);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">DOMPurify Example</h1>
      <p className="mb-4">
        This is a simple demonstration of DOMPurify sanitization.
      </p>

      <div className="mb-4">
        <h2 className="text-lg font-medium">Original HTML:</h2>
        <pre className="p-2 bg-gray-100 rounded">{dirtyHTML}</pre>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-medium">Sanitized HTML:</h2>
        <pre className="p-2 bg-gray-100 rounded">{cleanHTML}</pre>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-medium">Rendered Result:</h2>
        <div
          className="p-2 border rounded"
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />
      </div>
    </div>
  );
}
