import { TumacredoFrontendPage } from './app.po';

describe('tumacredo-frontend App', function() {
  let page: TumacredoFrontendPage;

  beforeEach(() => {
    page = new TumacredoFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
