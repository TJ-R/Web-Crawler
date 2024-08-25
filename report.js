function printReport(pages) {
    console.log("Report is starting....");

    let sortedPages = []

    for (const page in pages) {
       sortedPages.push([page, pages[page]]) 
    }

    console.log(sortedPages.sort(function(a, b) {
        return b[1] - a[1];
    }));

    for (const page of sortedPages) {
        console.log(`Found ${page[1]} internal links to ${page[0]}`);
    }
}
export {printReport}
