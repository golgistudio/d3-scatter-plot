import dataStoreManager from '../dataStoreManager/dataStoreManager'

describe('dataStoreManager.js', function() {

  it('singleton instance should be the same', function() {
    var dataStore1 = dataStoreManager.getInstance();
    var dataStore2 = dataStoreManager.getInstance();
    dataStore1.should.equal(dataStore1)
  });
});
