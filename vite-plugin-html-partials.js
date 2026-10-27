import fs from "node:fs";
import path from "node:path";

function loadPartial(name) {
  const file = path.resolve(process.cwd(), "src/partials", `${name}.html`);
  return fs.readFileSync(file, "utf8");
}

const re = /\{\{include:([a-z0-9-]+)\}\}/gi;

export function htmlPartials() {
  return {
    name: "khesht-html-partials",

    transformIndexHtml: {
      order: "pre",

      handler(html) {
        for (let i = 0; i < 4; i++) {
          re.lastIndex = 0;

          if (!re.test(html)) break;

          re.lastIndex = 0;
          html = html.replace(re, (_, name) => loadPartial(name.trim()));
        }

        re.lastIndex = 0;

        const base = process.env.VITE_BASE || "/";

        if (base !== "/") {
          html = html.replace(
            /\b(href|src|action)=(["'])\/(?!\/|src\/)([^"']*)\2/gi,
            (_, attr, quote, target) =>
              `${attr}=${quote}${base}${target}${quote}`
          );
        }

        return html;
      },
    },
  };
}
