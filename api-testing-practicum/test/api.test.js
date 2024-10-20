const request = require('supertest');
const {expect} = require('chai');
const app = require('../src/app');


describe('API Testing', () => {
  it('should return all items', (done) => {
    request(app)
      .get('/api/items')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1);
        done();
      });
  });

  it('should create a new item', (done) => {
    const newItem = { name: 'Item 3' };
    request(app)
      .post('/api/items')
      .send(newItem)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', 'Item 3');
        done();
    });
    });

    it('should delete an existing item', (done) => {
    const newItem = { name: 'Item to Delete' };
    request(app)
      .post('/api/items')
      .send(newItem)
      .end((err, res) => {
        const itemId = res.body.id;

        request(app)
          .delete(`/api/items/${itemId}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Item deleted successfully');

            request(app)
              .get('/api/items')
              .end((err, res) => {
                const deletedItem = res.body.find(item => item.id === itemId);
                expect(deletedItem).to.be.undefined; 
                done();
              });
          });
      });
  });
   
    
      it('should update an existing item', (done) => {
        const newItem = { name: 'Item to Update' };
        request(app)
          .post('/api/items')
          .send(newItem)
          .end((err, res) => {
            const itemId = res.body.id;
    
            const updatedItem = { name: 'Updated Item' };
            request(app)
              .put(`/api/items/${itemId}`)
              .send(updatedItem)
              .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.name).to.equal('Updated Item');
    
                request(app)
                  .get('/api/items')
                  .end((err, res) => {
                    const updatedItem = res.body.find(item => item.id === itemId);
                    expect(updatedItem.name).to.equal('Updated Item');
                    done();
                  });
              });
          });
      });


it('should return 404 when trying to delete a non-existent item', (done) => {
  const nonExistentId = 999; // Assume this ID does not exist

  request(app)
    .delete(`/api/items/${nonExistentId}`)
    .end((err, res) => {
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Item not found');
      done();
    });
});

it('should return 404 when trying to update a non-existent item', (done) => {
  const nonExistentId = 999; // Assume this ID does not exist
  const updatedItem = { name: 'Updated Item' };

  request(app)
    .put(`/api/items/${nonExistentId}`)
    .send(updatedItem)
    .end((err, res) => {
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Item not found');
      done();
    });
});

it('should ensure the item is removed after deletion', (done) => {
  const newItem = { name: 'Temporary Item' };
  request(app)
    .post('/api/items')
    .send(newItem)
    .end((err, res) => {
      const itemId = res.body.id;

      request(app)
        .delete(`/api/items/${itemId}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message', 'Item deleted successfully');

          request(app)
            .get('/api/items')
            .end((err, res) => {
              const deletedItem = res.body.find(item => item.id === itemId);
              expect(deletedItem).to.be.undefined;
              done();
            });
        });
    });
});

it('should ensure the item data is correctly updated after PUT', (done) => {
  const newItem = { name: 'Item to Update' };
  request(app)
    .post('/api/items')
    .send(newItem)
    .end((err, res) => {
      const itemId = res.body.id;

      const updatedItem = { name: 'Correctly Updated Item' };
      request(app)
        .put(`/api/items/${itemId}`)
        .send(updatedItem)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Correctly Updated Item');

          request(app)
            .get('/api/items')
            .end((err, res) => {
              const updatedItem = res.body.find(item => item.id === itemId);
              expect(updatedItem.name).to.equal('Correctly Updated Item');
              done();
            });
        });
    });
});

it('should generate a unique id for each new item', (done) => {
  const firstItem = { name: 'First Item' };
  const secondItem = { name: 'Second Item' };

  request(app)
    .post('/api/items')
    .send(firstItem)
    .end((err, res) => {
      const firstItemId = res.body.id;

      request(app)
        .post('/api/items')
        .send(secondItem)
        .end((err, res) => {
          const secondItemId = res.body.id;

          expect(firstItemId).to.not.equal(secondItemId); 
          done();
        });
    });
});

});
