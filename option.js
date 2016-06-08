function add_site(){
	console.log("start")
  var site_url = $('#site_name').val();
  //site_url = format_url(site_url)
  console.log(site_url)
  if(!check_url_valid(site_url)){
    alert("Sorry, that is not a valid website!")
    return
  }
  chrome.runtime.sendMessage({add_site: site_url}, function(response) {
    if(response.action_taken == "added"){
	  remove_children('site_list')
	  get_urls();
    }
  });
}

// not complete. placeholder. 
function check_url_valid(url){
  if(url.charAt(0) == "h") return true
  return false
}

function get_urls(){
  chrome.storage.sync.get(null, function(items){
    var all_values = Object.keys(items)
	console.log(all_values)
    for(var i = 0; i < all_values.length;i++){
		if(all_values[i]!= 'num_of_sites' && all_values[i]!= 'site_url'){
		  var newsite = document.createElement('li');
		  newsite.setAttribute('class',"site");
		  newsite.appendChild(document.createTextNode(items[all_values[i]]))
		  $( ".sites" ).append( newsite );
		}
	}
  })
}

function remove_children(element_id){
	var myNode = document.getElementById(element_id);
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
}
document.addEventListener("DOMContentLoaded", function(){
	get_urls();
	document.getElementById('save').addEventListener('click',function(){
		console.log(1)
		add_site();
	});	
});
