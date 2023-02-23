import { PluginOption, Plugin, HmrContext, ModuleNode, ResolvedConfig, UserConfig  } from 'vite';
import { writeFile } from 'fs/promises'
import glob from 'glob';
import { existsSync, mkdirSync } from 'fs';

function sanify_path(path: string) {
  let path_array = path.split("/");
  path_array.pop();
  if(path_array.join("/") == "")
    return `/${path_array.join("/")}`;
  else
    return `${path_array.join("/")}`;
}

function gen_sitemap(paths) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  for (let path of paths) {
    xml += `
    <url>
      <loc>${sanify_path(path)}</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    </url>
`;
  }

  xml += `</urlset>`;
  if(!existsSync("static"))
    mkdirSync("static");

  writeFile("static/sitemap.xml", xml);
}

function getDirectories(src, callback) {
  glob(src + '/**/*', callback);
};


function makeListFromDirectory() {
  console.log("\x1b[32mGenerating sitemap...");
  getDirectories('./', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      let paths = Array.from(res);
      paths = paths.filter(path => !path.includes("node"));
      paths = paths.filter(path => path.includes("+page.svelte"));
      paths = paths.map(path => path.replace("./demo/", "").replace("./src/routes", ""));
      gen_sitemap(paths);
    }
  });
}

export function Sitemap() {
  const plugin: Plugin = {
    name: 'vite-plugin-svelte-sitemap',
    // only apply during dev
    apply: 'serve',
    // handleHotUpdate() {
    //   makeListFromDirectory();
    // },

    handleHotUpdate(ctx: HmrContext): void | Promise<Array<ModuleNode> | void> {
      if(ctx.file.split("/")[ctx.file.split("/").length - 1] == "sitemap.xml")
        return;

      makeListFromDirectory();
    },
  }
  makeListFromDirectory();
  return plugin;
  }
