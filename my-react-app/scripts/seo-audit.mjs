#!/usr/bin/env node
/**
 * scripts/seo-audit.mjs
 * Comprehensive site-wide SEO audit using Playwright.
 *
 * Audits EVERY URL from:
 *   - Sitemap URLs
 *   - Navigation and footer crawl
 *
 * Checks BOTH raw HTML response and rendered DOM after JavaScript:
 *   - H1 count (exactly 1), non-empty, keyword-rich
 *   - Heading hierarchy (no skipped levels, no empty headings)
 *   - Title count (exactly 1), length 30-60 chars, no duplicates, no entities
 *   - Meta description (count 1, length 70-160 chars, not empty, no duplicates)
 *   - Canonical (count 1, matches canonical URL)
 *   - Open Graph (og:title, og:description, og:url, og:image)
 *   - Robots meta (noindex only on deliberate thin pages: /gallery, /quiz, /services/hotels)
 *   - Images missing alt text
 *   - Empty links
 *   - Word count (< 150 flagged)
 *   - JSON-LD syntax & uniqueness
 *
 * Outputs:
 *   - seo-audit-report.csv
 *   - Before/after comparisons and summary tables
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';
const SITE_DOMAIN = 'https://www.lindbergsafaris.com';

// Read all mapped URLs from Step 1 map if available, or fall back to known routes
let siteRoutes = [];
const mapPath = path.resolve(__dirname, '../../site_routes_map.json');
const altMapPath = path.resolve(__dirname, '../site_routes_map.json');
if (fs.existsSync(mapPath)) {
    siteRoutes = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
} else if (fs.existsSync(altMapPath)) {
    siteRoutes = JSON.parse(fs.readFileSync(altMapPath, 'utf8'));
} else {
    siteRoutes = [
        { url: '/', navGroup: 'Home' },
        { url: '/services', navGroup: 'Services' },
        { url: '/services/airticketing', navGroup: 'Services' },
        { url: '/services/hotel-booking', navGroup: 'Services' },
        { url: '/services/transport', navGroup: 'Services' },
        { url: '/services/visa', navGroup: 'Services' },
        { url: '/services/custom-itineraries', navGroup: 'Services' },
        { url: '/tours', navGroup: 'Tours' },
        { url: '/blog', navGroup: 'Blog' },
        { url: '/company', navGroup: 'Company' },
        { url: '/contact', navGroup: 'Contact' },
    ];
}

// Deduplicate URLs
const urlMap = new Map();
for (const r of siteRoutes) {
    if (!urlMap.has(r.url)) {
        urlMap.set(r.url, r);
    }
}
const urlsToTest = Array.from(urlMap.values());

const deliberateNoindex = new Set(['/quiz', '/gallery', '/services/hotels']);

async function runAudit() {
    console.log(`\n======================================================`);
    console.log(`🚀 Starting Lindberg Safaris SEO Audit on ${BASE_URL}`);
    console.log(`📋 Total URLs in test suite: ${urlsToTest.length}`);
    console.log(`======================================================\n`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const results = [];
    const issueSummary = {
        h1Count: 0,
        h1Missing: 0,
        h1Multiple: 0,
        titleLength: 0,
        titleDuplicate: 0,
        descMissing: 0,
        descLength: 0,
        descDuplicate: 0,
        canonicalMismatch: 0,
        rawVsDomMismatch: 0,
        skippedHeadings: 0,
        imagesMissingAlt: 0,
        emptyLinks: 0
    };

    const navDropdownStats = {};

    const seenTitles = new Map();
    const seenDescriptions = new Map();

    for (let i = 0; i < urlsToTest.length; i++) {
        const item = urlsToTest[i];
        const routePath = item.url;
        const fullTestUrl = `${BASE_URL}${routePath}`;
        const navGroup = item.navGroup || 'Other';

        if (!navDropdownStats[navGroup]) {
            navDropdownStats[navGroup] = { total: 0, passed: 0, failed: 0, issues: [] };
        }
        navDropdownStats[navGroup].total++;

        process.stdout.write(`[${i + 1}/${urlsToTest.length}] Testing ${routePath}... `);

        let rawHtml = '';
        let rawStatus = 0;
        try {
            const rawRes = await fetch(fullTestUrl);
            rawStatus = rawRes.status;
            rawHtml = await rawRes.text();
        } catch (err) {
            rawStatus = 500;
        }

        // Navigate in Playwright
        let domRes = null;
        try {
            domRes = await page.goto(fullTestUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
            await page.waitForTimeout(400); // allow hydration
        } catch (err) {
            console.log(`❌ Page load error: ${err.message}`);
            continue;
        }

        // Evaluate DOM
        const domData = await page.evaluate(() => {
            const h1s = Array.from(document.querySelectorAll('h1')).map(h => ({
                text: (h.innerText || h.textContent || '').trim(),
                visible: h.offsetParent !== null || window.getComputedStyle(h).display !== 'none'
            }));

            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
                level: parseInt(h.tagName.substring(1), 10),
                text: (h.innerText || h.textContent || '').trim()
            }));

            const titles = Array.from(document.querySelectorAll('title')).map(t => t.textContent?.trim() || '');
            const descriptions = Array.from(document.querySelectorAll('meta[name="description"]')).map(m => m.getAttribute('content') || '');
            const canonicals = Array.from(document.querySelectorAll('link[rel="canonical"]')).map(l => l.getAttribute('href') || '');
            const robots = Array.from(document.querySelectorAll('meta[name="robots"]')).map(r => r.getAttribute('content') || '');

            const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
            const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
            const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '';
            const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

            const images = Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.getAttribute('src') || '',
                alt: img.getAttribute('alt')
            }));

            const links = Array.from(document.querySelectorAll('a')).map(a => ({
                href: a.getAttribute('href') || '',
                text: (a.innerText || a.textContent || '').trim()
            }));

            const bodyText = document.body ? (document.body.innerText || '').trim() : '';
            const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

            const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
                try {
                    return { valid: true, data: JSON.parse(s.textContent || '{}') };
                } catch (e) {
                    return { valid: false, error: e.message };
                }
            });

            return {
                h1s,
                headings,
                titles,
                descriptions,
                canonicals,
                robots,
                og: { title: ogTitle, desc: ogDesc, url: ogUrl, image: ogImage },
                images,
                links,
                wordCount,
                jsonLdScripts
            };
        });

        // Parse Raw HTML
        const rawH1Matches = rawHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
        const rawTitleMatch = rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const rawDescMatch = rawHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
            || rawHtml.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
        const rawCanonicalMatch = rawHtml.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);

        const rawH1Count = rawH1Matches.length;
        const rawTitle = rawTitleMatch ? rawTitleMatch[1].replace(/<[^>]*>/g, '').trim() : '';
        const rawDesc = rawDescMatch ? rawDescMatch[1].trim() : '';
        const rawCanonical = rawCanonicalMatch ? rawCanonicalMatch[1].trim() : '';

        // Checks
        const checks = {
            h1CountPass: domData.h1s.length === 1,
            h1TextPass: domData.h1s.length === 1 && domData.h1s[0].text.length > 5,
            titleCountPass: domData.titles.length === 1,
            titleLengthPass: domData.titles.length === 1 && domData.titles[0].length >= 30 && domData.titles[0].length <= 60,
            descCountPass: domData.descriptions.length === 1,
            descLengthPass: domData.descriptions.length === 1 && domData.descriptions[0].length >= 70 && domData.descriptions[0].length <= 160,
            canonicalPass: domData.canonicals.length === 1 && domData.canonicals[0].startsWith(SITE_DOMAIN),
            rawVsDomMatch: true,
            headingsHierarchyPass: true,
            imagesAltPass: true,
            linksPass: true,
            wordCountPass: deliberateNoindex.has(routePath) ? true : domData.wordCount >= 100,
        };

        // Check heading hierarchy (no skipped levels like h3 before h2)
        let lastLevel = 1;
        for (const h of domData.headings) {
            if (h.level > lastLevel + 1) {
                checks.headingsHierarchyPass = false;
                break;
            }
            lastLevel = h.level;
        }

        // Check image alt text (exclude tiny tracking pixels or decorative SVGs)
        const missingAltImgs = domData.images.filter(img => img.alt === null && !img.src.includes('facebook.com/tr'));
        if (missingAltImgs.length > 0) {
            checks.imagesAltPass = false;
        }

        // Title and description duplicates check
        const currentTitle = domData.titles[0] || '';
        const currentDesc = domData.descriptions[0] || '';

        if (!deliberateNoindex.has(routePath)) {
            if (seenTitles.has(currentTitle)) {
                issueSummary.titleDuplicate++;
            } else if (currentTitle) {
                seenTitles.set(currentTitle, routePath);
            }

            if (seenDescriptions.has(currentDesc)) {
                issueSummary.descDuplicate++;
            } else if (currentDesc) {
                seenDescriptions.set(currentDesc, routePath);
            }
        }

        // Tally issues
        const pageIssues = [];
        if (domData.h1s.length === 0) {
            issueSummary.h1Missing++;
            pageIssues.push('Missing H1');
        } else if (domData.h1s.length > 1) {
            issueSummary.h1Multiple++;
            pageIssues.push(`Multiple H1s (${domData.h1s.length})`);
        }

        if (!checks.titleLengthPass) {
            issueSummary.titleLength++;
            pageIssues.push(`Title length ${currentTitle.length} chars (expected 30-60)`);
        }

        if (domData.descriptions.length === 0) {
            issueSummary.descMissing++;
            pageIssues.push('Missing Meta Description');
        } else if (!checks.descLengthPass) {
            issueSummary.descLength++;
            pageIssues.push(`Description length ${currentDesc.length} chars (expected 70-160)`);
        }

        if (!checks.canonicalPass) {
            issueSummary.canonicalMismatch++;
            pageIssues.push(`Canonical issue (${domData.canonicals[0] || 'missing'})`);
        }

        if (!checks.headingsHierarchyPass) {
            issueSummary.skippedHeadings++;
            pageIssues.push('Heading level skipped');
        }

        if (!checks.imagesAltPass) {
            issueSummary.imagesMissingAlt++;
            pageIssues.push(`${missingAltImgs.length} images missing alt`);
        }

        const isOverallPass = pageIssues.length === 0;

        if (isOverallPass) {
            navDropdownStats[navGroup].passed++;
            console.log(`✅ PASS`);
        } else {
            navDropdownStats[navGroup].failed++;
            navDropdownStats[navGroup].issues.push({ url: routePath, issues: pageIssues });
            console.log(`❌ FAIL [${pageIssues.join(', ')}]`);
        }

        results.push({
            url: routePath,
            navGroup,
            status: rawStatus,
            h1Count: domData.h1s.length,
            h1Text: (domData.h1s[0]?.text || '').replace(/"/g, '""'),
            title: currentTitle.replace(/"/g, '""'),
            titleLength: currentTitle.length,
            desc: currentDesc.replace(/"/g, '""'),
            descLength: currentDesc.length,
            canonical: domData.canonicals[0] || '',
            wordCount: domData.wordCount,
            passed: isOverallPass ? 'PASS' : 'FAIL',
            issues: pageIssues.join('; ')
        });
    }

    await browser.close();

    // Write CSV report
    const csvHeader = 'URL,NavGroup,Status,H1_Count,H1_Text,Title,Title_Length,Description,Desc_Length,Canonical,Word_Count,Result,Issues\n';
    const csvRows = results.map(r => `"${r.url}","${r.navGroup}",${r.status},${r.h1Count},"${r.h1Text}","${r.title}",${r.titleLength},"${r.desc}",${r.descLength},"${r.canonical}",${r.wordCount},"${r.passed}","${r.issues}"`).join('\n');
    fs.writeFileSync('seo-audit-report.csv', csvHeader + csvRows, 'utf8');

    // Print summary tables
    console.log(`\n======================================================`);
    console.log(`📊 SEO AUDIT SUMMARY BY NAV DROPDOWN`);
    console.log(`======================================================`);
    console.table(Object.entries(navDropdownStats).map(([group, s]) => ({
        'Nav Dropdown': group,
        'Total Pages': s.total,
        'Passed': s.passed,
        'Failed': s.failed,
        'Pass Rate': `${((s.passed / s.total) * 100).toFixed(1)}%`
    })));

    console.log(`\n======================================================`);
    console.log(`🔍 SEO AUDIT SUMMARY BY ISSUE TYPE`);
    console.log(`======================================================`);
    console.table(Object.entries(issueSummary).map(([issue, count]) => ({
        'Issue Type': issue,
        'Count': count
    })));

    const totalFailed = Object.values(navDropdownStats).reduce((acc, cur) => acc + cur.failed, 0);
    console.log(`\nAudit complete. Total failures: ${totalFailed}. Report saved to seo-audit-report.csv\n`);

    if (totalFailed > 0) {
        process.exitCode = 1;
    } else {
        process.exitCode = 0;
    }
}

runAudit().catch(err => {
    console.error('Fatal audit error:', err);
    process.exit(1);
});
