//on browers_action click, open a new tab using the url stored under "site_url"
// then store a new url for the next browser click. 
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.sync.get('site_url', function(err, site) {
    if(err) return "https://www/google.ca"
  chrome.tabs.create({"url": site});
  store_url()
});

// on window open get a site url stored under the "site_url" key
chrome.windows.onCreated.addListener(function() {
    store_url();
})

// get the total number of "safe" sites that user has chosen
// google homepage is the default site
function get_num_of_site(){
  return chrome.storage.sync.get('num_of_sites', function(err, num) {
    if(err){
      chrome.storage.sync.set({'num_of_sites':1})
      chrome.storage.sync.set({'site_1':"https://www.google.ca"})
    }
    return num
}

// given the total number of site, get the url for one site randomly
// google homepage is default
function get_site_url(num_of_sites){
  site_number = Math.floor(Math.random() * num_of_sites);
  site_key = "site_"+site_number.toString()
  chrome.storage.sync.get(site_key, function(err, site_url) {
    if(err)return "https//www.google.ca"
      return site_url
  });
}

function store_url(){
  num = get_num_of_sites()
  chrome.storage.sync.set({'site_url':get_site_url(num)})
}
