const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('Test POST /launches', () => {
  const completeLaunchData = {
    mission: 'Nombre mision',
    rocket: 'Nombre cohete',
    target: 'Planeta destion',
    launchDate: 'January 4, 2028',
  };

  const launchDataWithoutDate = {
    mission: 'Nombre mision',
    rocket: 'Nombre cohete',
    target: 'Planeta destion',
  };

  const launchDataWithInvalidDate = {
    mission: 'Nombre mision',
    rocket: 'Nombre cohete',
    target: 'Planeta destion',
    launchDate: 'NotADate',
  };

  test('It should respond with 201 created', async () => {
    const response = await request(app)
      .post('/launches')
      .send(completeLaunchData)
      .expect('Content-Type', /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(requestDate).toBe(responseDate);

    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test('It should catch missing required properties', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchDataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: 'Missing required launch property',
    });
  });

  test('It should catch invalid dates', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchDataWithInvalidDate)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: 'Invalid date format',
    });
  });
});
