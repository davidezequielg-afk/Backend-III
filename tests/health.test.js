import { expect } from "chai";
import { api, connectTestDB, clearDB, disconnectTestDB } from "./helpers.js";

describe('Configuracion de test', () => {
    before(connectTestDB);
    after(async () => {
        await clearDB();
        await disconnectTestDB();
    });

    it('responde con 404 con el formato de error en una ruta que no existe', async () => {
        const res = await api.get('/api/no-existente');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('code', 'ROUTE_NOT_FOUND');
    });
});
describe('GET /api/health', () => {
    it('responde 200 con status, environment, uptime y timestamp', async () => {
        const res = await api.get('/api/health');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'ok');
        expect(res.body).to.have.property('environment');
        expect(res.body).to.have.property('uptime');
        expect(res.body).to.have.property('timestamp');
    });

    it('devuelve uptime numerico y timestamp en formato ISO', async () => {
        const res = await api.get('/api/health');
        expect(res.body.uptime).to.be.a('number').and.to.be.at.least(0);
        expect(new Date(res.body.timestamp).toISOString()).to.equal(res.body.timestamp);
    });

    it('informa el entorno de ejecucion', async () => {
        const res = await api.get('/api/health');
        expect(res.body).to.have.property('environment', 'test');
    });

    it('no expone datos sensibles ni campos de mas', async () => {
        const res = await api.get('/api/health');
        expect(Object.keys(res.body)).to.have.members(['status', 'environment', 'uptime', 'timestamp']);
        expect(res.text).to.not.include('mongodb://');
    });
});