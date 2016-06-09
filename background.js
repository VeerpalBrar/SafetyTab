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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.add_site) {
        chrome.storage.sync.get('sites', function(result) {
            var site_list = result.sites
            site_list.push(request.add_site)
            chrome.storage.sync.set({
                'sites': site_list
            }, function() {
                sendResponse({
                    action_taken: "added"
                });
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
    console.log(default_site)
    chrome.storage.sync.set({
        'sites': default_site
    }, function() {
        chrome.storage.sync.set({
            'num_of_sites': 4
        }, function() {
            store_url()
        })
    })
});
// get the total number of "safe" sites that user has chosen
// google homepage is the default site
function get_num_of_sites(callback) {
    chrome.storage.sync.get('num_of_sites', function(result) {
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
            callback(result.num_of_sites)
        }
    })
};

// given the total number of site, get the url for one site randomly
// google homepage is default
function get_site_url() {
    chrome.storage.sync.get('sites', function(result) {
        var site_list = result.sites
        console.log(1, site_list)
        var num_of_sites = site_list.length
        var site_number = Math.floor(Math.random() * num_of_sites);
        chrome.storage.sync.set({
            'site_url': site_list[site_number]
        });
    });
};

function store_url() {
    get_site_url()
}

function get_sites() {
    chrome.storage.sync.get('sites', function(result) {
        var site_list = result.sites

    });
}
