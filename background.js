//on browers_action click, open a new tab using the url stored under "site_url"
// then store a new url for the next browser click. 
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.sync.get('site_url', function(result) {
        if (!result) {
            chrome.tabs.create({
                "url": "http://www.google.ca"
            });
        } else {
            chrome.tabs.create({
                "url": result.site_url
            });
        }
        store_url()
    })

});

// on window open get a site url stored under the "site_url" key
chrome.windows.onCreated.addListener(function() {
    store_url();
})

//
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.add_site) {
		get_num_of_sites(function(num){
			var site_key = "site_" + (num+1).toString()
			var message ={}
			message[site_key] = request.add_site
			chrome.storage.sync.set(message, function(){
				chrome.storage.sync.set({'num_of_sites':num+1},function(){
					sendResponse({action_taken: "added"});
				});
				return true;
			});
			return true;
		});
		return true;
	}
}); 

chrome.runtime.onInstalled.addListener(function(details) {
    chrome.storage.sync.clear()
	var default_site = {}
    default_site['site_1'] = "https://google.ca";
    default_site['site_2'] = "https://stackoverflow.com";
    default_site['site_3'] = "https://wired.com";
    default_site['site_4'] = "https://github.com";

    chrome.storage.sync.set(default_site, function() {
		chrome.storage.sync.set({'num_of_sites':4}, function(){
			store_url()
		})
    })
});
// get the total number of "safe" sites that user has chosen
// google homepage is the default site
function get_num_of_sites(callback) {
    chrome.storage.sync.get('num_of_sites', function(num) {
        if (!num) {
            chrome.storage.sync.set({
                'num_of_sites': 1
            })
            chrome.storage.sync.set({
                'site_1': "https://www.google.ca"
            })
            num = 1
        }
        if (callback) {
            callback(num.num_of_sites)
        }
    })
};

// given the total number of site, get the url for one site randomly
// google homepage is default
function get_site_url(num_of_sites) {
    var site_number = Math.floor(Math.random() * num_of_sites) + 1;
    var site_key = "site_" + site_number.toString()
	console.log(site_key)
    var get_item = []
    get_item.push(site_key)
    chrome.storage.sync.get(get_item, function(result) {
        var keys = Object.keys(result);
        var key = keys[0];
		console.log(key)
        if (!result) {
            chrome.storage.sync.set({
                'site_url': "https://google.ca"
            })
        } else {
            chrome.storage.sync.set({
                'site_url': result[key]
            })
        }

    });
};

function store_url() {
    get_num_of_sites(get_site_url)
};
