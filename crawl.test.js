import { test, expect } from "@jest/globals";
import { getUrlsFromHTML, normalizeUrl } from "./crawl";

test('normlizes https url slash at end', () => {
    expect(normalizeUrl('https://google.com/test/')).toBe('google.com/test');
});

test('normalizes https url', () => {
   expect(normalizeUrl('https://google.com/test')).toBe('google.com/test');
});

test('normalizes http url slash at end', () => {
    expect(normalizeUrl('http://google.com/test/')).toBe('google.com/test');
});

test('normalize http url', () => {
    expect(normalizeUrl('http://google.com/test')).toBe('google.com/test');
});


test('getUrlsFromHTML relative', () => {
    const url = 'https://google.com'
    const htmlBody = '<html><body><a href="/test">This is a test</a></body></html>'
    const expected = ['https://google.com/test']
    const result = getUrlsFromHTML(htmlBody, url)

    expect(result).toEqual(expected)
});

test('getUrlsFromHTML absolute', () => {
    const url = 'https://google.com'
    const htmlBody = '<html><body><a href="https://google.com/test">This is a test</a></body></html>'
    const expected = ['https://google.com/test']
    const result = getUrlsFromHTML(htmlBody, url)

    expect(result).toEqual(expected)
});

test('getUrlFromHTML Relative and Absolute', () => {
    const url = 'https://google.com';
    const htmlBody = '<html><body><a href="/test">This is a test</a><a href="https://google.com/absolute">This is a test</a></body></html>';
    const expected = ['https://google.com/test', 'https://google.com/absolute'];
    const result = getUrlsFromHTML(htmlBody, url)

    expect(result).toEqual(expected)
});
