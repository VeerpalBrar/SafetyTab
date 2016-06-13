
//add a site to the list of safety sites
function add_site() {
    var site_url = $('#site_name').val();
    //site_url = format_url(site_url)
	document.getElementById('site_name').value = "";
	document.getElementById('error').innerHTML = "";
	document.getElementById('js_error').innerHTML = ""
    if (!check_url_valid(site_url)) {
        console.log("Sorry, that is not a valid website!")
        return
    }
    chrome.runtime.sendMessage({
        add_site: site_url
    }, function(response) {
        if (response.action_taken == "added") {
            remove_children('site_list')
            get_urls(add_button_listeners);
        }
		if (response.action_taken == "error") {
            document.getElementById('js_error').innerHTML = "Sorry, that site could not be added."
        }
    });
}

// very basic URL validator. Only makes sure that url starts with "https://www." or "http://www."
function check_url_valid(url) {
    if (url.substring(0,8) != "https://" && url.substring(0,7)!="http://" ){
		document.getElementById('error').innerHTML = "Error: Please begin your url with 'https://' or 'http://'.";
		return false;
	} 
	if (url.substring(8,12)!="www." && url.substring(7, 11)!="www."){
		document.getElementById('error').innerHTML = "Error: Please include 'www.' in your url.";
		return false;
	}
    return true
}

//gets the list of saved urls and displays them to the user
function get_urls(callback) {
    chrome.storage.sync.get('sites', function(items) {
        var listOfSites = items.sites
        console.log(listOfSites)
        for (i = 0; i < listOfSites.length; i++) {
            $("#site_list").append("<li><button class='delete' id='" +
                i + "'><b>X</b></button>" + listOfSites[i] +
                "</li>")
        }
        if (callback) {
            callback()
        }

    })
}

//remove every node from the list of sites
function remove_children(element_id) {
    var myNode = document.getElementById(element_id);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

//remove a site from the list of safety sites
function remove_site() {
	document.getElementById('error').innerHTML = "";
	document.getElementById('js_error').innerHTML = ""
    key = this.id
    chrome.runtime.sendMessage({
        remove_site: key
    }, function(response) {
        if (response.action_taken == "removed") {
            remove_children('site_list')
            get_urls(add_button_listeners);
        }
		if (response.action_taken == "error") {
            document.getElementById('js_error').innerHTML = "Sorry, that site could not be removed."
        }
    });
};

// add a click listener for all 'delete' site buttons. 
function add_button_listeners() {
    var del_buttons = document.querySelectorAll('.delete');
    for (i = 0; i < del_buttons.length; i++) {
        console.log(i)
        del_buttons[i].addEventListener('click', remove_site)
    }
}
document.addEventListener("DOMContentLoaded", function() {
    get_urls(add_button_listeners);
    document.getElementById('save').addEventListener('click', add_site);
	$("#site_name").keypress(function(event){
		if(event.keyCode == 13){
			event.preventDefault();
			$("#save").click();
		}
	});
});
