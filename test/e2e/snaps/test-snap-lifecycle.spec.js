const {
  defaultGanacheOptions,
  withFixtures,
  unlockWallet,
  switchToNotificationWindow,
  WINDOW_TITLES,
} = require('../helpers');
const FixtureBuilder = require('../fixture-builder');
const { TEST_SNAPS_WEBSITE_URL } = require('./enums');

describe('Test Snap Lifecycle Hooks', function () {
  it('can run lifecycle hook on connect', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder().build(),
        ganacheOptions: defaultGanacheOptions,
        title: this.test.fullTitle(),
      },
      async ({ driver }) => {
        await unlockWallet(driver);

        // navigate to test snaps page and connect to lifecycle-hooks snap
        await driver.openNewPage(TEST_SNAPS_WEBSITE_URL);

        // wait for page to load
        await driver.waitForSelector({
          text: 'Installed Snaps',
          tag: 'h2',
        });

        const snapButton = await driver.findElement('#connectlifecycle-hooks');
        await driver.scrollToElement(snapButton);
        await driver.delay(1000);
        await driver.clickElement('#connectlifecycle-hooks');

        // switch to metamask extension and click connect
        await switchToNotificationWindow(driver);
        await driver.clickElement({
          text: 'Connect',
          tag: 'button',
        });

        await driver.waitForSelector({ text: 'Confirm' });

        await driver.clickElement({
          text: 'Confirm',
          tag: 'button',
        });

        await driver.waitForSelector({ text: 'OK' });

        await driver.clickElement({
          text: 'OK',
          tag: 'button',
        });

        // click send inputs on test snap page
        await driver.switchToWindowWithTitle(WINDOW_TITLES.TestSnaps);

        // wait for npm installation success
        await driver.waitForSelector({
          css: '#connectlifecycle-hooks',
          text: 'Reconnect to Lifecycle Hooks Snap',
        });

        // switch to dialog popup
        await switchToNotificationWindow(driver);

        // check dialog contents
        const result = await driver.findElement('.snap-ui-renderer__panel');
        await driver.scrollToElement(result);
        await driver.waitForSelector({
          css: '.snap-ui-renderer__panel',
          text: 'The snap was installed successfully, and the "onInstall" handler was called.',
        });
      },
    );
  });
});
