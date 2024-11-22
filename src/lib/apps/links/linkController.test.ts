import { assertEquals } from "jsr:@std/assert";
import linkController from './linkController.ts';
import service from './linkService.ts';
import model from './linkModel.ts';
import plaid from '../../server/plaid.ts';

Deno.test("linkController.itemAddResult - success", async () => {
    const payload = {
        link_token: "test_link_token",
        public_token: "test_public_token"
    };

    // Mocking the model and service methods
    model.updateLinkRequest = async (linkToken: string) => ({ clientId: 1 });
    plaid.itemPublicTokenExchange = async (tokenRequest: { public_token: string }) => ({
        data: {
            access_token: "test_access_token",
            item_id: "test_item_id"
        }
    });
    plaid.itemGet = async (accessToken: { access_token: string }) => ({
        data: {
            item: {
                institution_id: "test_institution_id"
            }
        }
    });
    service.getInstitutionFromItem = async (plaidInstitutionId: string) => ({
        id: "test_institution_id",
        name: "Test Institution"
    });
    model.upsertInstitution = async (institution: any) => {};
    model.upsertItem = async (itemPayload: any) => {};

    await linkController.itemAddResult(payload);

    // Add assertions as needed
    // For example, you can check if certain methods were called with expected arguments
});

Deno.test("linkController.itemAddResult - failure", async () => {
    const payload = {
        link_token: "test_link_token",
        public_token: "test_public_token"
    };

    // Mocking the model and service methods to throw an error
    model.updateLinkRequest = async (linkToken: string) => { throw new Error("Update link request failed"); };

    await assertThrowsAsync(
        async () => {
            await linkController.itemAddResult(payload);
        },
        Error,
        "Update link request failed"
    );
});