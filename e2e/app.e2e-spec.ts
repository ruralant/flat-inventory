import { FlatInventoryPage } from './app.po';

describe('flat-inventory App', () => {
  let page: FlatInventoryPage;

  beforeEach(() => {
    page = new FlatInventoryPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
