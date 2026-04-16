import puppeteer from 'puppeteer';

export async function scrapeComments(videoUrl, max = 20) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      ...(isProduction ? [
        '--single-process',
        '--no-zygote',
        '--disable-gpu'
      ] : [])
    ],
    ...(isProduction && {
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    })
  });

  try {
    const page = await browser.newPage();

    // Mask automation fingerprints
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );

    console.log(`[Scraper] Targeted URL: ${videoUrl}`);
    await page.goto(videoUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Handle consent dialog
    try {
      const consentSelectors = [
        'button[aria-label="Accept all"]',
        'button[aria-label="I agree"]',
      ];
      for (const sel of consentSelectors) {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click();
          await new Promise(r => setTimeout(r, 2000));
          break;
        }
      }
    } catch (_) {}

    const isShort = videoUrl.includes('/shorts/');

    if (!isShort) {
      console.log('[Scraper] Triggering comment section...');

      // Scroll down past the video to trigger comment lazy-loading
      await page.evaluate(() => window.scrollTo(0, 600));
      await new Promise(r => setTimeout(r, 2000));

      // Wait for the comments container
      try {
        await page.waitForSelector('ytd-comments', { timeout: 15000 });
      } catch (_) {
        console.warn('[Scraper] ytd-comments not found, proceeding anyway...');
      }

      console.log('[Scraper] Scrolling to populate comments...');
      // Scroll multiple times with pauses to trigger comment rendering
      for (let i = 0; i < 8; i++) {
        await page.evaluate(() => window.scrollBy(0, 800));
        await new Promise(r => setTimeout(r, 1800));
      }
    } else {
      // Shorts: click the comment button
      const shortsSelectors = [
        'button[aria-label="Comments"]',
        '#comments-button button',
      ];
      for (const sel of shortsSelectors) {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click();
          await new Promise(r => setTimeout(r, 2500));
          break;
        }
      }
    }

    // Try multiple selectors — YouTube's DOM varies
    const commentSelectors = [
      'ytd-comment-thread-renderer #content-text',
      '#content-text',
      'yt-attributed-string.ytd-comment-renderer',
    ];

    let comments = [];
    for (const selector of commentSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 15000 });
        comments = await page.$$eval(
          selector,
          (els, limit) =>
            els
              .slice(0, limit)
              .map(el => el.textContent.trim())
              .filter(t => t.length > 0),
          max
        );
        if (comments.length > 0) {
          console.log(`[Scraper] Extraction successful. Found ${comments.length} comments.`);
          break;
        }
      } catch (_) {
        console.warn(`[Scraper] Selector failed: ${selector}`);
      }
    }

    if (comments.length === 0) {
      throw new Error('No comments found — YouTube may be blocking the scraper or comments are disabled.');
    }

    return comments;
  } finally {
    await browser.close();
  }
}