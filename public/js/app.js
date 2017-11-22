// function init() {
//     window.addEventListener('scroll', function(e){
//         var distanceY = window.pageYOffset || document.documentElement.scrollTop,
//             shrinkOn = 300,
//             header = document.querySelector("header");
//         if (distanceY > shrinkOn) {
//             classie.add(header,"smaller");
//         } else {
//             if (classie.has(header,"smaller")) {
//                 classie.remove(header,"smaller");
//             }
//         }
//     });
// }
// window.onload = init();

/* ********************************************* Formating Date And Time ************************************************************* */
/* ******************************* For Tab Focusing ***************************** */

$(document).on("click", 'nav a', function () {
    $('nav a').removeClass('active');
    $(this).addClass('active');
});





var setTime = function (hour) {
    var time = 0;
    var eventHour = hour.slice(11, 13);
    var eventMinutes = hour.slice(14)
    if (eventHour > 0 && eventHour < 13) {
        time = `${eventHour}:${eventMinutes} AM`;
    }
    else if (eventHour == 00) {
        time = `12:${eventMinutes} AM`
    }
    else {
        switch (eventHour) {
            case '13':
                time = `01:${eventMinutes} PM`;
                break;
            case '14':
                time = `02:${eventMinutes} PM`;
                break;
            case '15':
                time = `03:${eventMinutes} PM`;
                break;
            case '16':
                time = `04:${eventMinutes} PM`;
                break;
            case '17':
                time = `05:${eventMinutes} PM`;
                break;
            case '18':
                time = `06:${eventMinutes} PM`;
                break;
            case '19':
                time = `07:${eventMinutes} PM`;
                break;
            case '20':
                time = `08:${eventMinutes} PM`;
                break;
            case '21':
                time = `09:${eventMinutes} PM`;
                break;
            case '22':
                time = `10:${eventMinutes} PM`;
                break;
            case '23':
                time = `11:${eventMinutes} PM`;
                break;

        }
        // time = `${eventHour}:${eventMinutes} PM`;
    }
    return time;
}

var currentUser = JSON.parse(localStorage.getItem('currentUser'));
console.log(currentUser.uid);
var database = firebase.database().ref(`/MeetupPlanner/${currentUser.uid}/${currentUser.uid}`);
var allEventsNode = firebase.database().ref('/MeetupPlanner/AllEvents');
var ul = document.getElementById('my-events');
var createEventBtn = document.getElementById('create-event-btn');

createEventBtn.addEventListener('click', () => {
    var eventValue = document.getElementById('event-value');
    var EventDateTime = getElement('date-value').value;
    EventDateTime = `${EventDateTime.slice(8, 10)}-${EventDateTime.slice(5, 7)}-${EventDateTime.slice(0, 4)} ${setTime(EventDateTime)}`;

    var currentTime = new Date().getTime();

    var obj = {
        event: eventValue.value,
        createdTime: currentTime,
        EventTime: EventDateTime,
        createdUser : currentUser.displayName
    }
    database.push(obj);
    allEventsNode.push(obj);
    eventValue.value = "";
});
var getElement = id => { return document.getElementById(id) };


/* ************************************* Rendering Events ************************************* */


database.on('child_added', (dataSnapshot) => {
    var li = document.createElement('LI'),
        dateDiv = document.createElement('DIV'),
        beforDateText = document.createTextNode(''),
        dateTextSpan = document.createElement('SPAN'),
        eventTextNode = document.createTextNode(`${dataSnapshot.val().event}`);
    eventDiv = document.createElement('DIV'),
        spanBtns = document.createElement('SPAN'),
        eventWrapper = document.createElement("DIV"),
        updateBtn = document.createElement('BUTTON'),
        updateBtnText = document.createTextNode(`Update`),
        deleteBtn = document.createElement('BUTTON'),
        deleteBtnText = document.createTextNode('Delete'),
        dateTimeText = document.createTextNode(`${dataSnapshot.val().EventTime}`),
        userNameDiv = document.createElement('DIV'),
        beforeUserName = document.createTextNode('Created By: '),
        currentUserName = document.createTextNode(`${dataSnapshot.val().createdUser}`);
console.log(dataSnapshot.val().createdUser);
    // dateTimeEventTextNode = ;




    li.setAttribute('class', 'card event-li');
    li.setAttribute('id', dataSnapshot.key);
    // var dateObj = new Date(dataSnapshot.val().createdTime);
    // var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // var theDay = dateObj.getDay();
    // var nameOfToday = dayNames[theDay];

    // var monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", 'August', 'Sep', 'Oct', 'Nov', 'Dec'];
    // var theDay = dateObj.getMonth();
    // var nameOfMonth = monthNames[theDay];
    // dateTextSpanInner = document.createTextNode(" " + nameOfToday + ' ' + nameOfMonth + ' ' + dateObj.getDate() + " " + dateObj.getFullYear() + " " + dateObj.getHours() + ":" + dateObj.getMinutes());
    dateDiv.appendChild(beforDateText);
    dateTextSpan.appendChild(dateTimeText);
    dateTextSpan.style.fontWeight = "300";
    dateDiv.appendChild(dateTextSpan);
    updateBtn.setAttribute('class', 'btn btn-primary ');
    deleteBtn.setAttribute('class', 'btn btn-danger ');
    updateBtn.appendChild(updateBtnText);
    deleteBtn.appendChild(deleteBtnText);
    deleteBtn.setAttribute('id', 'delete-btn');
    updateBtn.setAttribute('id', 'update-btn');
    updateBtn.setAttribute('data-toggle', 'modal');
    updateBtn.setAttribute('data-target', '#updateModal')
    spanBtns.setAttribute('class', 'pull-right col-md-4 col-lg-4 text-center');
    spanBtns.appendChild(updateBtn);
    spanBtns.appendChild(deleteBtn);
    var eventTextNodeWrapper = document.createElement('SPAN');
    eventTextNodeWrapper.setAttribute('class', 'col-md-8 col-lg-8');
    eventTextNodeWrapper.appendChild(eventTextNode);
    eventDiv.appendChild(eventTextNodeWrapper);
    eventDiv.appendChild(spanBtns);
    dateDiv.setAttribute('class', 'card-text');
    dateDiv.style.fontWeight = "700";
    eventDiv.setAttribute('class', 'card-text event-div row');

    eventWrapper.setAttribute('class', 'card-body');
    eventWrapper.appendChild(dateDiv);


    userNameDiv.appendChild(beforeUserName);
    userNameDiv.appendChild(currentUserName);
    userNameDiv.setAttribute('class', 'card-text');

    eventWrapper.appendChild(eventDiv);
    eventWrapper.appendChild(userNameDiv);

    li.appendChild(eventWrapper);

    ul.setAttribute('class', 'col-md-9 col-lg-9 mx-auto w-100 justify-content-center')
    ul.appendChild(li);

    updateBtn.setAttribute('onClick', "setCurrentText(this, '" + dataSnapshot.key + "' );");
    // updateBtn.addEventListener('click', () => { setCurrentText(updateBtn, dataSnapshot.key) });

    deleteBtn.setAttribute('onClick', "deleteEvent('" + dataSnapshot.key + "' );");


    /* All created events node */
    // var obj = {
    //     event: dataSnapshot.val().event,
    //     time: dataSnapshot.val().time
    // }
    // allEventsNode.push(obj);
    /* All created events node End */
});

/* set current event value for updation */
function setCurrentText(element, key) {
    var userUpdatedValue = getElement('event-updated-value')
    userUpdatedValue.value = element.parentNode.previousSibling.innerHTML;
    var updatedBtn = getElement('update-event-btn');
    var flag = true;
    updatedBtn.addEventListener('click', function () {
        if (flag) {
            getUpdatedValue(updatedBtn, key);
            flag = false;
        }
    });
}
/* set current event value for updation end */



/* update value in database */
function getUpdatedValue(element, key) {
    var updatedValue = getElement('event-updated-value').value;
    database.child(key).update({ event: updatedValue });
}

// getElement('update-event-btn').addEventListener('click', () => {
//     var updatedValue = getElement('event-updated-value').value;
//     console.log(updatedValue)
//     console.log(45)
// });

/* update value in database end */


/* child changed Event */
database.on('child_changed', (dataSnapshot) => {
    var li = getElement(dataSnapshot.key);
    li.children[0].children[1].children[0].innerHTML = dataSnapshot.val().event;
});
/* child changed Event end */



/* delete event from list */
database.on('child_removed', (dataSnapshot) => {
    var li = getElement(dataSnapshot.key);
    li.remove();
});
/* delete event from list end */

/* delete event from database */
function deleteEvent(elementKey) {
    // currElement.parentNode.parentNode.parentNode.parentNode.remove();
    database.child(elementKey).remove();
}
/* delete event from database end */


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
        //   window.location.replace('login.html');

        // ...
    } else {
        window.location.replace('login.html');
        // User is signed out.
        // ...
    }
});