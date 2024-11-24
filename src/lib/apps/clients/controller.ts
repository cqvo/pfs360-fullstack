import model from '$lib/apps/clients/model';
import service from '$lib/apps/clients/service';

const clientController = {
    uploadClients: async (file: File) => {
        const records = await service.processClientsCsv(file);
        const clients = await model.upsertClients(records);
        return clients;
    },
    retrieveClients: async () => {
        const clients = await model.retrieveClients();
        return clients;
    },
    retrieveClientById: async (clientId: number) => {
        const client = await model.retrieveClientById(clientId);
        return client;
    },
    retrieveItems: async () => {
        const clients = await model.retrieveItems();
        return clients;
    },
    retrieveItemsByClientId: async (clientId: number) => {
        const items = await model.retrieveItemsByClientId(clientId);
        return items;
    },
}

export default clientController;