import { test, expect } from "@jest/globals";
import { normalizeUrl } from "./crawl";

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
