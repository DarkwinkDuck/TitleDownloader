chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
	suggest({ filename: '..', conflictAction: 'overwrite' });
});
const setArrayInStorage = async (tabs) => {
	await chrome.storage.session.set({ actualTabs: tabs });
}


chrome.runtime.onConnect.addListener(
	async function (sender) {



		sender.onMessage.addListener(async function (message, sender) {
			if (message === 'Tabs') {
				let audibleTabList = [];
				audibleTabList.push(...await chrome.tabs.query({ audible: true }));
				await setArrayInStorage(audibleTabList);
				await sender.postMessage('TabsDone');
			} else if (message.ExecutedFile) {
				await chrome.scripting.executeScript({
					target: { tabId: message.TabID },
					files: ['Global(local)script.js', message.ExecutedFile],
				});
				await sender.postMessage('ExecutionDone');
			}

		});
	}
)

