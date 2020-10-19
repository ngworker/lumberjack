import { browser, logging } from 'protractor';

import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', async () => {
    await page.navigateTo();
    await expect(await page.getTitleText()).toEqual('lumberjack app is running!');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    const filteredLogs = logs.filter(
      (log) =>
        !log.message.includes('[AppComponent]') &&
        !log.message.includes('/api/logs') &&
        !log.message.includes('polyfills.js')
    );

    await expect(filteredLogs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
