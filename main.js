import { crawlPage } from './crawl.js'
function main() {
    if (process.argv.length < 3) {
        console.log("Error baseUrl needs to provided")
    } else if (process.argv.length > 3) {
        console.log("Error too many arguments")
    } else {
        const baseUrl = process.argv[2];
        console.log(`Crawler starting at ${baseUrl}`)

        crawlPage(baseUrl)
    }
}


main()

