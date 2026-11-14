import { expect } from "chai";
import { api, connectTestDB, clearDB, disconnectTestDB } from "./helpers.js";

describe('Users', () => {
    before(connectTestDB);
    beforeEach(clearDB);
    after(async () => {
        await clearDB();
        await disconnectTestDB();
    });
    

    const validUser = {
        name: "Test User",
        email: "test@example.com",
        role: "user"
    };

    describe('POST /api/users', () => {
        it('crea un usuario válido', async () => {
            const res = await api.post('/api/users').send(validUser);
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('email', validUser.email);
        });
        it('devuelve 409 USER_ALREADY_EXISTS si el mail esta duplicado', async () => {
            await api.post('/api/users').send(validUser);
            const res = await api.post('/api/users').send(validUser);
            expect(res.status).to.equal(409);
            expect(res.body).to.have.property('code', 'USER_ALREADY_EXISTS');
        });
        it('devuelve 400 EMAIL_REQUIRED si falta el email', async () => {
            const res = await api.post('/api/users').send({ name: 'Sin email' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'EMAIL_REQUIRED');
            expect(res.body).to.have.property('message');
        });

    });

    describe('GET /api/users', () => {
        it('lista todos los usuarios', async () => {
            await api.post('/api/users').send(validUser);
            const res = await api.get('/api/users');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array').with.lengthOf(1);
            expect(res.body.data[0]).to.have.property('email', validUser.email);
        });
    });

    describe('GET /api/users/:id', () => {
        it('devuelve el usuario si existe', async () => {
            const created = await api.post('/api/users').send(validUser);
            const res = await api.get(`/api/users/${created.body.data._id}`);
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.property('email', validUser.email);
        });
        it('devuelve 404 USER_NOT_FOUND si no existe', async () => {
            const res = await api.get('/api/users/123456789012345678901234');
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code', 'USER_NOT_FOUND');
        });
        it('devuelve 400 INVALID_ID si el id no es válido', async () => {
            const res = await api.get('/api/users/123');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_ID');
        });
    });
});
