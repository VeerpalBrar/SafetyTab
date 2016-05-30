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

function check_url_valid(url){
  if(url.charAt(0) == "h") return true
  return false
}

function get_urls(){
  chrome.storage.sync.get(null, function(items){
    var all_values = Object.values(items)
    for(var i = 0; i < all_values.length;i++){
      var newsite = document.createElement('li');
      newsite.setAttribute('class',"site");
      newdiv.innerHTML = all_values[i]
    }
  })
}

document.addEventListener('DOMContentLoaded', get_urls);
