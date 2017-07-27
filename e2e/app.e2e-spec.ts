import { UwiAdmissionsDataUploadPage } from './app.po';

describe('uwi-admissions-data-upload App', () => {
  let page: UwiAdmissionsDataUploadPage;

  beforeEach(() => {
    page = new UwiAdmissionsDataUploadPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
