/* ******************************* For Styling ******************************** */

$(function () {
    $('.field-input').focus(function () {
        $(this).parent().addClass('is-focused has-label');
    });

    $('.field-input').blur(function () {
        $parent = $(this).parent();


        if ($(this).val().length === 0) {
            $parent.removeClass('has-label');
        }
        $parent.removeClass('is-focused');
    });
});
/* **************************************** Signup Function ********************************************** */
var getElement = (id) =>{return document.getElementById(id)};
var auth = firebase.auth();
function signUp(){
    var name = getElement('user-name').value;
    var email = getElement('email').value;
    var password = getElement('password').value;
    var createdUser;

    auth.createUserWithEmailAndPassword(email, password)
        .then((user)=>{
            createdUser = user;
            return user.updateProfile({
                displayName :name
            })
            .then(()=>{
                localStorage.setItem('currentUser', JSON.stringify(createdUser));
                    getElement('user-name').value = "";
                    getElement('email').value = "";
                    getElement('password').value = "";
                    window.location.replace('createEvent.html');
                });
        })
        .catch((e)=>{
            alert(e.message);
        })

}


function signIn(){
    var email = getElement('email').value;
    var password = getElement('password').value;
    console.log(email, password);
    auth.signInWithEmailAndPassword(email, password)
        .then((user)=>{
            console.log(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            getElement('email').value = "";
            getElement('password').value = "";
            window.location.replace('createEvent.html');
        })
        .catch((e)=>{
            alert(e);
        });


}