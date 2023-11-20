import { ElementHandle, Page } from 'puppeteer';

export async function getAttributeFromElement(
  page: Page,
  element: ElementHandle<Node>,
  attribute: string,
) {
  return await page.evaluate(
    (el: HTMLElement, attr) => el.getAttribute(attr),
    element,
    attribute,
  );
}
