import db from '$lib/server/database';
import { dimClients } from '$lib/server/database/schema';
import { parse } from "csv-parse/sync";
import { retrieveClientsItems } from '$lib/server/database/queries/clients';

export const POST = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || file.type !== "text/csv") {
            return new Response("Invalid file type. Only CSV files are allowed.", {
                status: 400,
            });
        }

        const content = await file.text(); // Read file content
        const records = parse(content, { columns: true }); // Parse CSV into JSON

        console.log("Parsed CSV Data:", records);

        // Process the data (e.g., save to DB, perform operations, etc.)
        return new Response(JSON.stringify({ success: true, records }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error processing file:", error);
        return new Response("Error processing file", { status: 500 });
    }
}

// export const GET = async () => {
//     try {
//         const clients = await db.select().from(dimClients);
//         return new Response(JSON.stringify(clients), {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//     } catch (error) {
//         console.error(error);
//     }
// }

export const GET = async() => {
    try {
        const clients = await retrieveClientsItems();
        return new Response(JSON.stringify(clients), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error(error);
    }
}