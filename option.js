function add_site(){
  var site_url = $('#site_name').val();
  site_url = format_url(site_url)
  if(!check_url_valid(site_url)){
    alert("Sorry, that is not a valid website!")
    return
  }
  chrome.runtime.sendMessage({add_site: site_url}, function(response) {
    if(response.action_taken == "added"){
      alert("Added!");
    }
  });
}
