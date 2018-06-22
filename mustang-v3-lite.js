
var contactURLArray = [];
var contactArray = [];
var loadingContact = 0;
var currentContactIndex = 0; 


// Functions
function importContacts() {
    console.log("importContacts()");
    loadIndexAndContacts();
}

function loadContacts() {
    console.log("loadContacts()");
}

function saveContacts() {
    console.log("saveContacts()");
}

function viewCurrentContact() {
    currentContact = contactArray[currentContactIndex];
    console.log(currentContact);
    document.getElementById("nameID").value = currentContact.preferredName;   
    document.getElementById("emailID").value = currentContact.email;   
    document.getElementById("cityID").value = currentContact.city;   
    document.getElementById("stateID").value = currentContact.state;
    document.getElementById("zipID").value = currentContact.zip;  

    // Todo: Add additional fields.
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + contactArray.length;
}

function previous() {
    if (currentContactIndex > 0) {
        currentContactIndex--;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();

    // Todo: Disable previous button when currentContactIndex equal to 0.
}

function next() {
    if (currentContactIndex < (contactArray.length-1)) {
        currentContactIndex++;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
    console.log('next()'); 
    
    // Todo: Disable next button when there is no next item.
    // Todo: Save changed items to contacts array and resort array.
}

function add() {
    console.log('add()**');

    obj = contactArray;
    dbParam = JSON.stringify(obj);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('**Output**:' + this.responseText);
            console.log('**Output done**:');

            var testContacts = JSON.parse(this.responseText);
            console.log(testContacts);
        }
    };
    //xmlhttp.open("POST", "test-php-json.php", true);
    xmlhttp.open("POST", "save-contacts.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("contacts=" + dbParam);   

    // Todo: Implement add functionality by inserting new element into array.
}

function loadContactsFromPHP() {
    console.log('loadContactsFromPHP()**');

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            console.log("Response: " + this.responseText);
            contactArray = JSON.parse(this.responseText);
            console.log(contactArray);
        }
    };

    xmlhttp.open("GET", "load-contacts.php", true);
    xmlhttp.send();   
}

function remove() {
    console.log('remove()');

    loadContactsFromPHP();
    // Todo: Implement delete functionality by deleting element from array.
}

function zipFocusFunction() {
    console.log('focusFunction()');

    // Todo: Remove the function as it is not needed.
}

function zipBlurFunction() {
    getPlace();
}

function keyPressed() {
    console.log('keyPressed()');

    // This type of function should be useful in search as it implements keyPressed.
}

function getPlace() {
    var zip = document.getElementById("zipID").value
    console.log("zip:"+zip);

    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();

    // Register the embedded handler function
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            if (document.getElementById("cityID").value == "")
                document.getElementById("cityID").value = place[0];
            if (document.getElementById("stateID").value == "")
                document.getElementById("stateID").value = place[1];
        }
    }
    xhr.open("GET", "zip-to-city-state.php?zip=" + zip);
    xhr.send(null);

    calltfile();
}

function calltfile() {
    console.log("Calling calltfile!");
    var tfileRequest = new XMLHttpRequest();
    tfileRequest.onload = function() {
        console.log("tfile-result:" + tfileRequest.responseText);
    }
    tfileRequest.open("GET", "tfile.php");
    tfileRequest.send();
}

function initApplication() {
    console.log('Mustang Lite - Starting!'); 
    //loadIndex();
    //loadContactsFromPHP();
}

function loadIndexAndContacts() {
    // Load the Mustang index file.
    var indexRequest = new XMLHttpRequest();
    indexRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
    indexRequest.onload = function() {
        console.log("Index JSON:" + indexRequest.responseText);
        document.getElementById("indexID").innerHTML = indexRequest.responseText;
        contactIndex = JSON.parse(indexRequest.responseText);
        for (i=0; i<contactIndex.length; i++) {
            contactURLArray.push(contactIndex[i].ContactURL);
        }
        console.log("ContactURLArray: " + JSON.stringify(contactURLArray));
        loadContacts();
    }
    indexRequest.send();
}

function loadContacts() {
    // Clear the current contactArray.
    contactArray.length = 0;
    loadingContact = 0;

    // Note that W3C documentation and my experimentation indicate that each XMLHttpRequest callback function must be a 
    // unique instance of a function. A better implmentation would have had an array of callback functions instead of a 
    // recursive call to load
    if (contactURLArray.length > loadingContact) {
        loadNextContact(contactURLArray[loadingContact]);
    }
}

function loadNextContact(URL) {
    console.log("URL: " + URL);
    contactRequest = new XMLHttpRequest();
    contactRequest.open('GET', URL);
    contactRequest.onload = function() {
        console.log(contactRequest.responseText);
        var contact;
        contact = JSON.parse(contactRequest.responseText);
        console.log("Contact: " + contact.firstName);
        contactArray.push(contact);

        document.getElementById("contactsID").innerHTML = JSON.stringify(contactArray);

        document.getElementById("statusID").innerHTML = "Status: Loading " + contact.firstName + " " + contact.lastName;

        loadingContact++;
        if (contactURLArray.length > loadingContact) {
            loadNextContact(contactURLArray[loadingContact]);
        }
        else {
            document.getElementById("statusID").innerHTML = "Status: Contacts Loaded (" + contactURLArray.length + ")";
            viewCurrentContact()
            console.log(contactArray);

            //Todo: Sort contacts array.
        }
    }

    contactRequest.send();
}

function executeAjaxAndPhp() {
    var request = new XMLHttpRequest();
    request.open('GET', 'hello-world.php');
    request.onload = function() {
        console.log("Response:" + request.responseText);

        var responseObject = JSON.parse(request.responseText);
        if (responseObject.firstWord != "Hello") {
            document.getElementById("id-ajaxandphp").innerHTML = "Error: " + request.responseText;
        }
        else {
            document.getElementById("id-ajaxandphp").innerHTML = "<em>Success:</em> " + responseObject.firstWord + " " + responseObject.secondWord + "<br><br>Data:" + request.responseText;
        }
    }
    request.send();
}
