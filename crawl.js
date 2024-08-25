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

async function crawlPage(baseUrl, currentUrl = baseUrl, pages = {}) {
    
    // Not on the same route as our base url skip and return 
    if (!currentUrl.includes(baseUrl)) {
        return pages;
    }

    let normalCurrentUrl = normalizeUrl(currentUrl);

    // Check links to see if we have already crawled our current page
    if (pages[normalCurrentUrl]) {
        pages[normalCurrentUrl] += 1;
        return pages;   
    } else {

        // Has not already been crawled so crawl it now and add it to list
        pages[normalCurrentUrl] = 1;

        console.log(`Crawling ${currentUrl}`);

        let html;
        html = await fetchHTML(currentUrl);

        let urls = getUrlsFromHTML(html, currentUrl);

        // Crawl all of the links that we found on the current page;
        for (const url of urls) {
            pages = await crawlPage(baseUrl, url, pages);
        }

        return pages;
    }
}

async function fetchHTML(currentUrl) {
    let resp;
    console.log(`\nFetching ${currentUrl}`);

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

    let html = await resp.text();

    return html;
}

export { normalizeUrl, getUrlsFromHTML, crawlPage, fetchHTML }
