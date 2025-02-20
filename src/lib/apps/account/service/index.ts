import model from '$lib/apps/account/model';

const accountService = {
	getAccount: async (accountId: string) => {
		return await model.findAccount(accountId);
	}
};

export default accountService;