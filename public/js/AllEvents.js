/* ******************************* For Tab Focusing ***************************** */

$(document).on("click", 'nav a', function(){
    $('nav a').removeClass('active');
    $(this).addClass('active');
});




var allEventsNode = firebase.database().ref('/MeetupPlanner/AllEvents');
var currentUser = JSON.parse(localStorage.getItem('currentUser'));
var goingEventNodes = firebase.database().ref(`/MeetupPlanner/${currentUser.uid}/${currentUser.displayName}${currentUser.uid}`);
var notGoingNode = firebase.database().ref(`/MeetupPlanner/${currentUser.uid}/notgoing${currentUser.displayName}${currentUser.uid}`);
var comeFromGoingEvent = [];
var comeFromNotGoingEvent = [];
var getElement = (id) => {
    return document.getElementById(id);
}
var ul = getElement('all-events');

notGoingNode.on('child_added', (dataSnapshot)=>{
    comeFromNotGoingEvent.push(dataSnapshot.val());
});

goingEventNodes.on('child_added', (dataSnapshot) => {

    comeFromGoingEvent.push(dataSnapshot.val());
    console.log(comeFromGoingEvent);
});


allEventsNode.on('child_added', (dataSnapshot) => {
    var flag = false;
    console.log(dataSnapshot.val());
    var userGoingEvents = JSON.parse(localStorage.getItem('goingEvent'));
    // console.log(userGoingEvents);
    // if (userGoingEvents !== null) {
    //     for (var i = 0; i < userGoingEvents.length; i++) {
    //         console.log(userGoingEvents[i].eventKey)
    //         if (userGoingEvents[i].eventKey == dataSnapshot.key) {
    //             flag = true;
    //         }
    //     }
    // }
    if (comeFromGoingEvent !== null) {
        for (let i = 0; i < comeFromGoingEvent.length; i++) {
            if ((comeFromGoingEvent[i].eventDate + comeFromGoingEvent[i].eventValue) == (" " + dataSnapshot.val().EventTime + dataSnapshot.val().event)) {
                flag = true;
            }
        }
    }
    if (comeFromNotGoingEvent !== null) {
        for (let i = 0; i < comeFromNotGoingEvent.length; i++) {
            if ((comeFromNotGoingEvent[i].eDate + comeFromNotGoingEvent[i].eValue) == (" " + dataSnapshot.val().EventTime + dataSnapshot.val().event)) {
                flag = true;
            }
        }
    }

    if (flag === false) {

        var li = `<li class="card event-li col-md-9 col-lg-9 mx-auto w-100 justify-content-center" id="${dataSnapshot.key}">
                    <div class="card-body">
                    <div class="card-text" style="font-weight: 700;">
                        
                        <span style="font-weight: 300;"> ${dataSnapshot.val().EventTime}</span>
                    </div>
                    <div class = "card-text event-div row">
                        <span class="col-md-8 col-lg-8">${dataSnapshot.val().event}</span>
                        <span class="pull-right col-md-4 col-lg-4 text-center">
                            <button class="btn btn-primary" onClick = "going(this, '${dataSnapshot.key}')" id="going-btn">Going</button>
                            <button class="btn btn-danger" onClick = "notGoing(this, '${dataSnapshot.key}')" id="not-going-btn">Not-Going</button>
                        </span>
                    </div>
                    <span class="card-text">Created By:</span>
                    <span class="card-text">${dataSnapshot.val().createdUser}</span>
                    </div>
                  </li>`
        ul.setAttribute('style', 'padding: 0px');
        ul.insertAdjacentHTML('beforeend', li);
    }
    // var dateObj = new Date(dataSnapshot.val().time);
    // var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // var theDay = dateObj.getDay();
    // var nameOfToday = dayNames[theDay];

    // var monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", 'August', 'Sep', 'Oct', 'Nov', 'Dec'];
    // var theDay = dateObj.getMonth();
    // var nameOfMonth = monthNames[theDay];
    // dateTextSpanInner = document.createTextNode(" " + nameOfToday + ' ' + nameOfMonth + ' ' + dateObj.getDate() + " " + dateObj.getFullYear() + " " + dateObj.getHours() + ":" + dateObj.getMinutes());
});

/* ************************************************************ Going Button Function ******************************************************* */
function going(element, key) {
    var eValue = element.parentNode.parentNode.children[0].innerHTML;
    var eDate = element.parentNode.parentNode.parentNode.children[0].children[0].innerHTML;
    var createdUser = element.parentNode.parentNode.parentNode.children[3].innerHTML;
    element.parentNode.parentNode.parentNode.parentNode.remove();
    var goingEvent = JSON.parse(localStorage.getItem('goingEvent'));
    var obj = {
        eventValue: eValue,
        eventDate: eDate,
        eventKey: key,
        createdUser
    }

    if (goingEvent === null) {
        goingEvent = [];
        console.log(goingEvent);
    }

    goingEvent.push(obj);
    goingEvent = JSON.stringify(goingEvent);
    localStorage.setItem('goingEvent', goingEvent);
    console.log(goingEvent);

    firebase.database().ref(`/MeetupPlanner/${currentUser.uid}/${currentUser.displayName}${currentUser.uid}`).push(obj);
    // localStorage.setItem('goingEvent', );
    // var eventValue = 

}

/* ************************************************************ Not Going Button Function ******************************************************* */

var notGoing = (element, key)=>{
    var eValue = element.parentNode.parentNode.children[0].innerHTML;
    var eDate = element.parentNode.parentNode.parentNode.children[0].children[0].innerHTML;
    element.parentNode.parentNode.parentNode.parentNode.remove();
    var obj ={
        eValue,
        eDate
    }
    firebase.database().ref(`/MeetupPlanner/${currentUser.uid}/notgoing${currentUser.displayName}${currentUser.uid}`).push(obj);
}

/* *************************************************** Logout function ********************************************************/

getElement('logout').addEventListener('click', () => {
    firebase.auth().signOut()
        .then((user) => {
            console.log(user);
        })
        .catch(e => {
            console.log(e.message);
        });

});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        // window.location.replace('login.html');

        // ...
    } else {
        window.location.replace('login.html');
        // User is signed out.
        // ...
    }
});