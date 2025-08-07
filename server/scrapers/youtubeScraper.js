import puppeteer from 'puppeteer';

export async function scrapeComments(videoUrl, max = 20) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Setup for real-user-like browsing
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36');

  await page.goto(videoUrl, { waitUntil: 'domcontentloaded' });

  // Wait for comments section
  await page.waitForSelector('ytd-comments', { timeout: 15000 });

  // Scroll down a few times
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await page.waitForSelector('#content-text', { timeout: 15000 });

  // ✅ Pass `max` as 2nd param to $$eval
  const comments = await page.$$eval(
    '#content-text',
    (elements, limit) => elements.slice(0, limit).map(el => el.textContent.trim()),
    max
  );

  await browser.close();
  return comments;
}
