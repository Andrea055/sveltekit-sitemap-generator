import { PluginOption, Plugin, HmrContext, ModuleNode, ResolvedConfig, UserConfig  } from 'vite';
import { writeFile } from 'fs/promises'
import glob from 'glob';
import { existsSync, mkdirSync } from 'fs';

function sanify_path(path: string) {
  let path_array = path.split("/");
  path_array.pop(); // Remove +page.svelte
  if(path_array.join("/") == "")  // If path is index
    return `/${path_array.join("/")}`;  // Add a trailing slash
  else
    return `${path_array.join("/")}`; // Don't add anything
}

function gen_sitemap(paths, baseurl) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  for (let path of paths) { // Convert JS date to W3C date format
    xml += `
    <url>
      <loc>${baseurl + sanify_path(path)}</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    </url>
`;
  }

  xml += `</urlset>`;
  if(!existsSync("static")) // Put it in static
    mkdirSync("static");

  writeFile("static/sitemap.xml", xml);
}

function getDirectories(src, callback) {
  glob(src + '/**/*', callback);
};


function makeListFromDirectory(baseurl) {
  console.log("\x1b[32mGenerating sitemap...");
  getDirectories('./', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      let paths = Array.from(res);
      paths = paths.filter((path: string) => !path.includes("node")); // Filter node modules
      paths = paths.filter((path: string) => path.includes("+page.svelte"));  // Get only pages, not layouts
      paths = paths.map((path: string) => path.replace("./demo/", "").replace("./src/routes", "")); // Remove src/routes
      gen_sitemap(paths, baseurl);
    }
  });
}

type Config = {
  baseurl: string;
}

export function Sitemap({ baseurl }: Config): PluginOption {
  const plugin: Plugin = {
    name: 'vite-plugin-svelte-sitemap',
    // only apply during dev
    apply: 'serve',
    handleHotUpdate(ctx: HmrContext): void | Promise<Array<ModuleNode> | void> {
      if(ctx.file.split("/")[ctx.file.split("/").length - 1] == "sitemap.xml")
        return;

      makeListFromDirectory(baseurl);
    }
  }
  makeListFromDirectory(baseurl);
  return plugin;
}
