describe('angularjs navigation test roadguard', function() {
    
    // navigation test 1
    it('should be in track record', function() {
      browser.get('http://localhost:8100/#/app/trackrecord');
      expect(browser.getTitle()).toEqual('TRACK RECORD');
    });

    // navigation test 2
    it('should be in track history', function() {
      browser.get('http://localhost:8100/#/app/trackhistory');
      expect(browser.getTitle()).toEqual('TRACK HISTORY');
    });

    // navigation test 3
    it('should be in track player', function() {
      browser.get('http://localhost:8100/#/app/trackplayer');
      expect(browser.getTitle()).toEqual('TRACK PLAYER');
    });

    // navigation test 4
    it('should be in configuration', function() {
      browser.get('http://localhost:8100/#/app/configuration');
      expect(browser.getTitle()).toEqual('CONFIGURATION');
    });

    // navigation test 5
    it('should be in faqs', function() {
      browser.get('http://localhost:8100/#/app/faqs');
      expect(browser.getTitle()).toEqual('FAQs');
    });

    // navigation test 6
    it('should be in permissions', function() {
      browser.get('http://localhost:8100/#/app/permissions');
      expect(browser.getTitle()).toEqual('PERMISSIONS');
    });
  });