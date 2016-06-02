//on browers_action click, open a new tab using the url stored under "site_url"
// then store a new url for the next browser click. 
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.sync.get('site_url', function(err, site) {
        if (err){
             chrome.tabs.create({"url": "http://www.google.ca"
			});
        } 
        else{
			chrome.tabs.create({
            "url": site
        });
		}
        store_url()
    })
});

// on window open get a site url stored under the "site_url" key
chrome.windows.onCreated.addListener(function() {
    store_url();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	StorageArea.clear()
    if (request.add_site) {
        chrome.storage.sync.set({
				'site_url': request.add_site
			})
        sendResponse({
            action_taken: "added"
        });
    }

});

chrome.runtime.onInstalled.addListener(function(details){
	console.log("starting")
	 chrome.storage.sync.set({
				'site_1': "https://google.ca"
			}, function(){console.log("finished")});
	 chrome.storage.sync.set({
				'site_2': "https://stackoverflow.com"
			}, function(){console.log("finished")})
	 chrome.storage.sync.set({
				'site_1': "https://wired.com"
			}, function(){console.log("finished")})
	 chrome.storage.sync.set({
				'site_1': "https://github.com"
			}, function(){console.log("finished")})
	chrome.storage.sync.set({
				'num_of_sites': 4
			}, function(){console.log("finished")})
	
});
// get the total number of "safe" sites that user has chosen
// google homepage is the default site
function get_num_of_sites(callback) {
	console.log("called get_num_of_sites")
    chrome.storage.sync.get('num_of_sites', function(err, num) {
        if (err) {
            chrome.storage.sync.set({
                'num_of_sites': 1
            })
            chrome.storage.sync.set({
                'site_1': "https://www.google.ca"
            })
			console.log(1)
			num=1
		}
        
		console.log("not 1", num)
		if(callback){
			callback(num)
		}
		})
};

// given the total number of site, get the url for one site randomly
// google homepage is default
function get_site_url(num_of_sites) {
	console.log("called get_site_url")
    var site_number = Math.floor(Math.random() * num_of_sites);
    var site_key = "site_" + site_number.toString()
	console.log("site_key: ", site_key)
    chrome.storage.sync.get(site_key, function(err, site_url) {
        if (err){
			console.log(err);
			console.log("error")
			chrome.storage.sync.set({
				'site_url': "https://google.ca"
			})
		}
		else{
			console.log("not error")
			chrome.storage.sync.set({
			'site_url': site_url
			})
		}

    });
};

function store_url(url) {
	console.log("called store_url")
    get_num_of_sites(get_site_url)
};
