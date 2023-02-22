chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
	suggest({ filename: '..', conflictAction: 'overwrite' });
});

chrome.runtime.onConnect.addListener(
	async function (sender) {

		sender.onMessage.addListener(async function (message, sender) {
			if (message === 'Tabs') {
				let audibleTabList = [];
				audibleTabList.push(...await chrome.tabs.query({ audible: true }));
				await chrome.storage.local.set({ actualTabs: audibleTabList });
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

