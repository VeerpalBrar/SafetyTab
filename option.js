function add_site() {
    console.log("start")
    var site_url = $('#site_name').val();
    //site_url = format_url(site_url)
    console.log(site_url)
    if (!check_url_valid(site_url)) {
        alert("Sorry, that is not a valid website!")
        return
    }
    chrome.runtime.sendMessage({
        add_site: site_url
    }, function(response) {
        if (response.action_taken == "added") {
            remove_children('site_list')
            get_urls(add_button_listeners);
        }
    });
    document.getElementById('site_name').value = "";
}

// not complete. placeholder. 
function check_url_valid(url) {
    if (url.charAt(0) == "h") return true
    return false
}

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

function remove_children(element_id) {
    var myNode = document.getElementById(element_id);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function remove_site() {
    key = this.id
    chrome.storage.sync.get('sites', function(items) {
        var listOfSites = items.sites;
        listOfSites.splice(key, 1);
        chrome.storage.sync.set({
            'sites': listOfSites
        }, function() {
            remove_children('site_list');
            get_urls(add_button_listeners);
        });
    });
};

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
});
