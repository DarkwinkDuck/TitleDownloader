chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
	suggest({ filename: '..', conflictAction: 'overwrite' });
});
const setArrayInStorage = async (tabs) => {
	await chrome.storage.session.set({ actualTabs: tabs });
  }

chrome.runtime.onMessage.addListener(
	async function (request, sender, sendResponse) {
		let audibleTabList = [];
		audibleTabList.push(...await chrome.tabs.query({audible: true}));
		await setArrayInStorage(audibleTabList);
		sendResponse('Done');
	}
);   
	
  