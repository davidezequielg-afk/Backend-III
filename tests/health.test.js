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
