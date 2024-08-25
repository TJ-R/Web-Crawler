import { crawlPage, fetchHTML } from './crawl.js'
import { printReport } from './report.js'
async function main() {
    if (process.argv.length < 3) {
        console.log("Error baseUrl needs to provided")
    } else if (process.argv.length > 3) {
        console.log("Error too many arguments")
    } else {
        const baseUrl = process.argv[2];
        console.log(`Crawler starting at ${baseUrl}`)

        const pages = await crawlPage(baseUrl)
        printReport(pages);
    }
}


main()


