//on browers_action click, open a new tab using the url stored under "site_url"
// then store a new url for the next browser click. 
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.sync.get('site_url', function(result) {
        if (chrome.runtime.lastError) {
            chrome.tabs.create({
                "url": "https://en.wikipedia.org/wiki/Year_Without_a_Summer"
            });
        } else {
            chrome.tabs.create({
                "url": result.site_url
            });
        }
        get_site_url();
    })
});

// on window open get a site url stored under the "site_url" key
chrome.windows.onCreated.addListener(function() {
    get_site_url();
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.add_site) {
        chrome.storage.sync.get('sites', function(result) {
			if (chrome.runtime.lastError){
				sendResponse({action_taken: "error"});
				return false
			}
            var site_list = result.sites
            site_list.push(request.add_site)
            chrome.storage.sync.set({'sites': site_list}, function() {
                sendResponse({action_taken: "added"});
            })
            return true;
        });
        return true;
    }
	if (request.remove_site) {
		console.log("h")
        chrome.storage.sync.get('sites', function(result) {
			if (chrome.runtime.lastError){
				sendResponse({action_taken: "error"});
				return false
			}
            var site_list = result.sites
			console.log(request.remove_site)
			site_list.splice(request.remove_site, 1);
            chrome.storage.sync.set({'sites': site_list}, function() {
                sendResponse({action_taken: "removed"});
            })
            return true;
        });
        return true;
    }
});

chrome.runtime.onInstalled.addListener(function(details) {
    var default_site = []
    default_site.push('https://google.ca')
    default_site.push('https://stackoverflow.com')
    default_site.push('https://wired.com')
    default_site.push('https://github.com')
    chrome.storage.sync.set({'sites': default_site}, get_site_url)
});

// given the total number of site, get the url for one site randomly
// google homepage is default
function get_site_url() {
    chrome.storage.sync.get('sites', function(result) {
        var site_list = result.sites
        var num_of_sites = site_list.length
        var site_number = Math.floor(Math.random() * num_of_sites);
        chrome.storage.sync.set({'site_url': site_list[site_number]});
    });
};
