// shortcut: only handles [text](url) links; switch to a markdown renderer if cv.md needs more.
export function inlineMd(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="font-semibold text-accent underline">$1</a>');
}
