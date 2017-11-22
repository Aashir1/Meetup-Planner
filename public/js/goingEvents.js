/* ******************************* For Tab Focusing ***************************** */

$(document).on("click", 'nav a', function(){
    $('nav a').removeClass('active');
    $(this).addClass('active');
});







var currentUser = JSON.parse(localStorage.getItem('currentUser'));
var database = firebase.database().ref(`/MeetupPlanner/${currentUser.uid}/${currentUser.displayName}${currentUser.uid}`);
var sortingArray = [];
var getElement = (id) => {
    return document.getElementById(id);
}
database.on('child_added', (dataSnapshot) => {
    var date = dataSnapshot.val().eventDate.slice(0, 10).split('-').join('');
    sortingArray.push(dataSnapshot.val());
    var ul = document.getElementById('going-events');
    var li = `<li class="card event-li col-md-9 col-lg-9 mx-auto w-100 justify-content-center" id="${dataSnapshot.key}">
    <div class="card-body">
    <div class="card-text" style="font-weight: 700;">
        
        <span style="font-weight: 300;"> ${dataSnapshot.val().eventDate}</span>
    </div>
    <div class = "card-text event-div row">
        <span class="col-md-8 col-lg-8">${dataSnapshot.val().eventValue}</span>
        <span class="pull-right col-md-4 col-lg-4 text-center">
            <button class="btn btn-primary" onClick = "deleteEvent('${dataSnapshot.key}')" id="going-btn">Delete</button>
            
        </span>
    </div>
    <div class="card-text">Created By: ${dataSnapshot.val().createdUser}</div>
    </div>
  </li>`
    ul.setAttribute('style', 'padding: 0px');
    ul.insertAdjacentHTML('beforeend', li);
});
// console.log(insertionSort(sortingArray));
// /* ********************************************** Merge Sort *************************************************** */
// function insertionSort (items) {
//     for (var i = 0; i < items.length; i++) {
//       let value = parseInt(items[i].eventDate.slice(0,10).split('-').join(''));
//       console.log(value);
//       // store the current item value so it can be placed right
//       for (var j = i - 1; j > -1 && parseInt(items[j].eventDate.slice(0,10).split('-').join('')) > value; j--) {
//         // loop through the items in the sorted array (the items from the current to the beginning)
//         // copy each item to the next one
//         items[j + 1] = items[j]
//         console.log(items[j + 1] ,items[j]);
//       }
//       // the last item we've reached should now hold the value of the currently sorted item
//       items[j + 1] = value
//     }

//     return items;
//   }
//   console.log(insertionSort(sortingArray));
//   if (left[indexLeft].eventDate.slice(0,10).split('-').join('') < right[indexRight].eventDate.slice(0,10).split('-').join('')){




function deleteEvent(key) {
    database.child(key).remove();
    var tempArray = [];
    let goingEvents = JSON.parse(localStorage.getItem('goingEvent'));

    for (var i = 0; i < goingEvents.length; i++) {
        if (goingEvents[i].eventKey == key) {
        }
        else {
            tempArray.push(goingEvents[i]);
        }
    }
    localStorage.setItem('goingEvent', JSON.stringify(tempArray))
}

database.on('child_removed', (dataSnapshot) => {
    var li = document.getElementById(dataSnapshot.key);
    li.remove();
});

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