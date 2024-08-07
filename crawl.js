import { JSDOM } from 'jsdom'

function normalizeUrl(url) {
    const urlObj = new URL(url);

    let path = `${urlObj.host}${urlObj.pathname}`

    if (path.slice(-1) === '/') {
        path = path.slice(0, -1)
    }

    return path
} 

function getUrlsFromHTML(htmlBody, baseURL) {
    let fullPaths = [];
    const dom = new JSDOM(htmlBody);
    dom.window.document.querySelectorAll('a').forEach(anchor => {
        if (anchor.hasAttribute('href')) {
            try {
                let path = new URL(anchor.href, baseURL).href
                fullPaths.push(path)
            } catch(err) {
                console.log(`${err.message}: ${anchor.href}`)
            }
        }
    })

    return fullPaths
}

async function crawlPage(currentUrl) {
    console.log(`Crawling ${currentUrl}`);

    let resp;

    try {
        resp = await fetch(currentUrl)
    } catch (err) {
        throw new Error(`Network error has occured ${err.message}...`)
    }

    if (resp.status > 399) {
        console.log(`HTTP Error has occurred...}`);
        return;
    }

    if (!resp.headers.get('content-type').includes('text/html')) {
        console.log('Error recieved non-HTML response...');
        return;
    }

    const html = await resp.text()

    console.log(html)
}

export { normalizeUrl, getUrlsFromHTML, crawlPage }
