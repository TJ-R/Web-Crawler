function normalizeUrl(url) {
    const urlObj = new URL(url);

    let path = `${urlObj.host}${urlObj.pathname}`

    if (path.slice(-1) === '/') {
        path = path.slice(0, -1)
    }

    return path
} 

export { normalizeUrl }
