const ASSETS_DIRECTORY = "./public/"
const ASSET_HTML = "index.html"
const ASSET_BACKTIME_HTML = "backtime.html"
const ASSET_CANCEL_SNIPE_HTML = "cancelsnipe.html"
const ASSET_CSS = "main.css"
const ASSET_JS = "index.js"
const ASSET_BACKTIME_JS = "backtime.js"
const ASSET_CANCEL_SNIPE_JS = "cancelsnipe.js"

Deno.serve({ port: 5000 }, async (request) => {
  const lastSegment = request.url.split("/").pop();

  switch (lastSegment) {
    case  "":
    case ASSET_HTML: {
      const htmlContent = await Deno.readTextFile(`${ASSETS_DIRECTORY}${ASSET_HTML}`);

      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" },
      });
    }

    case ASSET_BACKTIME_HTML: {
      const htmlContent = await Deno.readTextFile(`${ASSETS_DIRECTORY}${ASSET_BACKTIME_HTML}`);

      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" },
      });
    }

    case ASSET_CANCEL_SNIPE_HTML: {
      const htmlContent = await Deno.readTextFile(`${ASSETS_DIRECTORY}${ASSET_CANCEL_SNIPE_HTML}`);

      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" },
      });
    }

    case ASSET_JS: {
      const jsContent = await Deno.readTextFile(`${ASSETS_DIRECTORY}${ASSET_JS}`);

      return new Response(jsContent, {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    case ASSET_BACKTIME_JS: {
      const jsContent = await Deno.readTextFile(`${ASSETS_DIRECTORY}${ASSET_BACKTIME_JS}`);

      return new Response(jsContent, {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    case ASSET_CANCEL_SNIPE_JS: {
      const jsContent = await Deno.readTextFile(`${ASSETS_DIRECTORY}${ASSET_CANCEL_SNIPE_JS}`);

      return new Response(jsContent, {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    case ASSET_CSS: {
      const cssContent = await Deno.readTextFile(`${ASSETS_DIRECTORY}${ASSET_CSS}`);

      return new Response(cssContent, {
        headers: { "Content-Type": "text/css" },
      });
    }

    default:
      return new Response("Page non trouvée", { status: 404 });
  }
});
