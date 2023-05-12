const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ChatInteraction {
  constructor(page) {
    this.page = page;
  }

  async clickButton(selector) {
    await this.page.click(selector);
  }

  async waitForSelector(selector, options = {}) {
    return this.page.waitForSelector(selector, options);
  }

  async type(selector, message) {
    await this.page.type(selector, message);
  }

  async fetchAnswer(responseSelector) {
    const elements = await this.page.$$(responseSelector);

    if (elements.length === 0) {
      return '';
    }

    const lastElementIndex = elements.length - 1;
    const text = await this.page.evaluate((el) => {
      return el.textContent;
    }, elements[lastElementIndex]);

    return text;
  }
}

let browser;
let chatPage;

async function clickButtonWithRetry(page, buttonSelector, maxRetries = 5) {
  let retries = 0;
  let buttonClicked = false;

  while (!buttonClicked && retries < maxRetries) {
    try {
      await page.waitForSelector(buttonSelector, { timeout: 5000 });
      await page.click(buttonSelector);
      buttonClicked = true;
    } catch (error) {
      console.log(`Button with selector '${buttonSelector}' not found. Retrying...`);
      retries++;
    }
  }

  if (!buttonClicked) {
    throw new Error(`Failed to click button with selector '${buttonSelector}' after ${maxRetries} retries.`);
  }
}

const logincookiesOPEN = async () => {
  browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-web-security',
      '--disable-infobars',
      '--window-size=1920,1080',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  const readCookie = fs.readFileSync('cookies.txt', 'utf8');
  const parseCookie = JSON.parse(readCookie);
  await page.setCookie(...parseCookie);
  await page.goto('https://chat.openai.com/chat');
  const nextButtonSelector = '.btn.relative.btn-neutral.ml-auto';
  await clickButtonWithRetry(page, nextButtonSelector);
  const doneButtonSelector = '.btn.relative.btn-primary.ml-auto';
  await clickButtonWithRetry(page, doneButtonSelector);
  chatPage = await browser.newPage();
  await chatPage.goto('https://chat.openai.com/chat/eb60311a-ee5e-45cc-b814-aaea0f8733c8');
};


async function compareAnswers(chatInteraction, responseSelector) {
  let answer1, answer2;
  let areAnswersSame = false;

  do {
    answer1 = await chatInteraction.fetchAnswer(responseSelector);
    await sleep(Math.random() * 1500 + 500);
    answer2 = await chatInteraction.fetchAnswer(responseSelector);

    if (answer1 === answer2) {
      areAnswersSame = true;
    }
  } while (!areAnswersSame);

  return answer1;
}

const sendMessageAndGetResponse = async (chatInteraction, message) => {
  await sleep(Math.random() * 1500 + 500);

  const textareaSelector = 'textarea[placeholder="Send a message..."]';
  try {
    await chatInteraction.waitForSelector(textareaSelector, { timeout: 10000 });
    await chatInteraction.type(textareaSelector, message);
  } catch (error) {
    console.error('Error al encontrar el elemento:', error);
    process.exit(1);
  }

  await sleep(Math.random() * 1500 + 500);

  const buttonSelector = 'button.absolute.text-gray-500';
  await chatInteraction.clickButton(buttonSelector);
  await sleep(Math.random() * 1500 + 500);
  await sleep(3000);

  const responseSelector = 'div.markdown.prose.w-full.break-words.dark\\:prose-invert.light';
  const response = await compareAnswers(chatInteraction, responseSelector);
  return response;
};

module.exports = sendMessageAndGetResponse;
module.exports = logincookiesOPEN;
