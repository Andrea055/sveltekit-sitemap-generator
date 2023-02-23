import { PluginOption, Plugin } from 'vite';
import { writeFile } from 'fs/promises'
import glob from 'glob';
import { existsSync, mkdirSync } from 'fs';

function sanify_path(path: string) {
  let path_array = path.split("/");
  path_array.pop();
  return `/${path_array.join("/")}`;
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
      paths = paths.map(path => path.replace("./demo/", "").replace("./src/", ""));
      gen_sitemap(paths);
    }
  });
}

type PluginArgs = {
  baseDir: string
  filterList?: string[]
}

export function Sitemap() {
  console.log("OKOKOKOK")
  const plugin: Plugin = {
    name: 'vite-plugin-svelte-sitemap',
    // only apply during dev
    apply: 'serve',
    handleHotUpdate() {
      makeListFromDirectory();
    },
  }
  makeListFromDirectory();
  return plugin;
}