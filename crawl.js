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

async function crawlPage(baseUrl, currentUrl = baseUrl, pages = {links: [], count: 0}) {

    console.log(`Crawling ${currentUrl}`);

    // Not on the same route as our base url skip and return 
    if (!currentUrl.includes(baseUrl)) {
        return pages;
    }

    let normalCurrentUrl = normalizeUrl(currentUrl);

    // Check links to see if we have already crawled our current page
    if (pages.links.includes(normalCurrentUrl)) {
            pages.count += 1;
            return pages;   
    }

    // Has not already been crawled so crawl it now and add it to list
    pages.links.push(normalCurrentUrl);
    pages.count = 1;

    let html;
    html = await fetchHTML(currentUrl)

    let urls = getUrlsFromHTML(html, currentUrl)

    // Crawl all of the links that we found on the current page;
    
    // TODO NEED TO FIX LOGIC SO WE AGGREGATE A COUNT AND PAGES FROM ALL OF THE RECURSIVE CALLS
    // AND INSURE THAT THE COUNT IS CORRECT WITH THE AMOUNT OF PAGES
    for (const url of urls) {
        let new_pages = await crawlPage(baseUrl, url, pages);
        pages.links.push(...new_pages.links)
        pages.count += new_pages.count;
    }

    console.log('Final Pages');
    pages.links.forEach(link => console.log(link));
    console.log(pages.count)
    return pages;
}

async function fetchHTML(currentUrl) {
    let resp;
    console.log(`Fetching ${currentUrl}`);

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

    return await resp.text()
}

export { normalizeUrl, getUrlsFromHTML, crawlPage, fetchHTML }
