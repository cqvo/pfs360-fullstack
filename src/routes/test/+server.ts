import { retrieveItemsAccountsByClientId } from "$lib/server/database/queries/items";

export const GET = async() => {
    try {
        const clients = await retrieveItemsAccountsByClientId(2);
        return new Response(JSON.stringify(clients), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }));
    }
} 