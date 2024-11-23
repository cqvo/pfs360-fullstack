import model from '$lib/apps/clients/model';

const clientController = {
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