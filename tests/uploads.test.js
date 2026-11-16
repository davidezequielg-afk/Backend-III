import fs from "fs";
import path from "path";
import { expect } from "chai";
import { api, connectTestDB, clearDB, disconnectTestDB, clearUploads, countUploads } from "./helpers.js";

describe('Uploads', () => {
    before(connectTestDB);
    beforeEach(async () => {
        await clearDB();
        clearUploads();
    });
    after(async () => {
        await clearDB();
        clearUploads();
        await disconnectTestDB();
    });

    const NON_EXISTENT_ID = '64b7f0c2a1b2c3d4e5f60718';
    const pdf = Buffer.from('%PDF-1.4 contenido de prueba');
    const pdfFile = { filename: 'documento.pdf', contentType: 'application/pdf' };

    const createUser = async () => {
        const res = await api.post('/api/users').send({ name: 'Cliente', email: 'cliente@test.com', role: 'user' });
        return res.body.data;
    };

    const createDelivery = async () => {
        await api.post('/api/mocks/seed?qty=1');
        const res = await api.get('/api/deliveries');
        return res.body.data[0];
    };

    describe('POST /api/users/:id/documents', () => {
        it('sube un documento y registra sus metadatos', async () => {
            const user = await createUser();
            const res = await api.post(`/api/users/${user._id}/documents`)
                .field('documentType', 'dni')
                .attach('file', pdf, pdfFile);
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data.documents).to.be.an('array').with.lengthOf(1);
            const doc = res.body.data.documents[0];
            expect(doc).to.include({ originalName: 'documento.pdf', mimeType: 'application/pdf', documentType: 'dni', size: pdf.length });
            expect(doc).to.have.all.keys('_id', 'originalName', 'fileName', 'path', 'mimeType', 'size', 'documentType', 'uploadedAt');
            expect(doc.fileName).to.not.equal('documento.pdf');
            expect(doc.path).to.include('documents/');
        });

        it('guarda el archivo en el disco y los metadatos en la base', async () => {
            const user = await createUser();
            const res = await api.post(`/api/users/${user._id}/documents`)
                .field('documentType', 'license')
                .attach('file', pdf, pdfFile);
            const doc = res.body.data.documents[0];
            expect(fs.existsSync(path.resolve(doc.path))).to.equal(true);
            expect(countUploads('documents')).to.equal(1);
            const saved = await api.get(`/api/users/${user._id}`);
            expect(saved.body.data.documents).to.have.lengthOf(1);
            expect(saved.body.data.documents[0]).to.have.property('documentType', 'license');
        });

        it('devuelve 400 FILE_REQUIRED si no se envía el archivo', async () => {
            const user = await createUser();
            const res = await api.post(`/api/users/${user._id}/documents`).field('documentType', 'dni');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'FILE_REQUIRED');
            expect(res.body).to.have.property('message');
        });

        it('devuelve 400 INVALID_DOCUMENT_TYPE si el tipo de documento no es válido', async () => {
            const user = await createUser();
            const res = await api.post(`/api/users/${user._id}/documents`)
                .field('documentType', 'inventado')
                .attach('file', pdf, pdfFile);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_DOCUMENT_TYPE');
            expect(countUploads('documents')).to.equal(0);
        });

        it('devuelve 400 INVALID_DOCUMENT_TYPE si falta el tipo de documento', async () => {
            const user = await createUser();
            const res = await api.post(`/api/users/${user._id}/documents`).attach('file', pdf, pdfFile);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_DOCUMENT_TYPE');
            expect(countUploads('documents')).to.equal(0);
        });

        it('devuelve 400 INVALID_FILE_TYPE si el archivo no es PDF, JPG ni PNG', async () => {
            const user = await createUser();
            const res = await api.post(`/api/users/${user._id}/documents`)
                .field('documentType', 'dni')
                .attach('file', Buffer.from('texto'), { filename: 'nota.txt', contentType: 'text/plain' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_FILE_TYPE');
            expect(countUploads('documents')).to.equal(0);
        });

        it('devuelve 400 INVALID_FILE_FIELD si el archivo no viene en el campo file', async () => {
            const user = await createUser();
            const res = await api.post(`/api/users/${user._id}/documents`)
                .field('documentType', 'dni')
                .attach('archivo', pdf, pdfFile);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_FILE_FIELD');
            expect(countUploads('documents')).to.equal(0);
        });

        it('devuelve 413 FILE_TOO_LARGE si el archivo supera los 2 MB', async () => {
            const user = await createUser();
            const res = await api.post(`/api/users/${user._id}/documents`)
                .field('documentType', 'dni')
                .attach('file', Buffer.alloc(3 * 1024 * 1024), pdfFile);
            expect(res.status).to.equal(413);
            expect(res.body).to.have.property('code', 'FILE_TOO_LARGE');
            expect(countUploads('documents')).to.equal(0);
        });

        it('devuelve 404 USER_NOT_FOUND si el usuario no existe y no deja el archivo', async () => {
            const res = await api.post(`/api/users/${NON_EXISTENT_ID}/documents`)
                .field('documentType', 'dni')
                .attach('file', pdf, pdfFile);
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code', 'USER_NOT_FOUND');
            expect(countUploads('documents')).to.equal(0);
        });

        it('devuelve 400 INVALID_ID si el ID del usuario no es válido', async () => {
            const res = await api.post('/api/users/123/documents')
                .field('documentType', 'dni')
                .attach('file', pdf, pdfFile);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_ID');
            expect(countUploads('documents')).to.equal(0);
        });
    });

    describe('POST /api/deliveries/:id/receipts', () => {
        it('sube un comprobante y lo asocia a la entrega', async () => {
            const delivery = await createDelivery();
            const res = await api.post(`/api/deliveries/${delivery._id}/receipts`).attach('file', pdf, pdfFile);
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('_id', delivery._id);
            expect(res.body.data.receipts).to.be.an('array').with.lengthOf(1);
            expect(res.body.data.receipts[0]).to.include({ documentType: 'receipt', mimeType: 'application/pdf' });
            expect(countUploads('receipts')).to.equal(1);
        });

        it('devuelve 400 FILE_REQUIRED si no se envía el archivo', async () => {
            const delivery = await createDelivery();
            const res = await api.post(`/api/deliveries/${delivery._id}/receipts`);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'FILE_REQUIRED');
        });

        it('devuelve 404 DELIVERY_NOT_FOUND si la entrega no existe y no deja el archivo', async () => {
            const res = await api.post(`/api/deliveries/${NON_EXISTENT_ID}/receipts`).attach('file', pdf, pdfFile);
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code', 'DELIVERY_NOT_FOUND');
            expect(countUploads('receipts')).to.equal(0);
        });

        it('devuelve 400 INVALID_FILE_TYPE si el archivo no está permitido', async () => {
            const delivery = await createDelivery();
            const res = await api.post(`/api/deliveries/${delivery._id}/receipts`)
                .attach('file', Buffer.from('texto'), { filename: 'nota.txt', contentType: 'text/plain' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_FILE_TYPE');
            expect(countUploads('receipts')).to.equal(0);
        });
    });
});
