import { createRoot } from "react-dom/client";
import StickyNote from "./notes/StickyNote";

(function injectStickyNote() {
  const container = document.createElement("div");
  container.id = "sticky-note-root";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<StickyNote />);
})();
