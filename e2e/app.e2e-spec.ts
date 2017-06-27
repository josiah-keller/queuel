import { QueuelPage } from './app.po';

describe('queuel App', () => {
  let page: QueuelPage;

  beforeEach(() => {
    page = new QueuelPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
