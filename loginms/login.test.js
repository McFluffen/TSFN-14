const request = require('supertest');
const { app } = require('./loginms');
const mockRabbitMQ = require('./mockRabbitMQ');

jest.mock('amqplib'); // Mocka amqplib-modulen

describe('Login Microservice Tests', () => {
  let server; // Variabel för att hålla servern

  beforeAll(() => {
    // Starta mock-server för RabbitMQ innan testerna körs
    server = mockRabbitMQ.listen(3005);
  });

  afterAll(async () => {
    // Stoppa mock-servern för RabbitMQ efter testerna har körts
    await server.close();
  });

  test('Login with correct credentials', async () => {
    // Mocka anslutningen till RabbitMQ
    mockRabbitMQ.connectToRabbitMQ.mockResolvedValue(/* Mockad kanal */);
    // Mocka konsumtionen av meddelande
    mockRabbitMQ.ConsumeMessage.mockResolvedValue(/* Mockat meddelande */);

    // Skicka en testförfrågan till login-microservicen
    const response = await request(app)
      .post('/')
      .send({ email: 'test@example.com', password: 'password123' });

    // Förvänta dig ett lyckat svar
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Successfully logged in!');
    expect(response.body).toHaveProperty('token');
  });

  // Andra testfall kan läggas till här för att täcka andra scenarier
});
