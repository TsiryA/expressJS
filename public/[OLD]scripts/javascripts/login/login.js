$(document).ready(function () {
    $('#masterLogin').on('click', master);
    $('#employeeLogin').on('click', employee);
    $('#externalLogin').on('click', guest);
});

// Getting Acces =============================================================
/*There is 3 types of acces
    1 - Master
    2 - Employee
    3 - Guest
*/

/*
1 - Master: the master have a full acces to the DB of the corporation
    he is register as a formal user in the DB
*/
function master(event) {
	event.preventDefault();
	location.href = '/users/addAcces/user/' + $('input#inputUserName').val();
};


/*

2 - Employee: it's the acces of an employee as an user.
    he can access to an account which is provided by the master.
    Généralement il n'accede qu'aux documents qui le concerne directement
*/
function employee(event) {
	event.preventDefault();
	location.href = '/users/addAcces/employee/' + $('input#inputUserName').val();
};

/*

3 - Guest: c'est l'acces externe. Une sorte de sous affichage de la classe emplyée.
    ce type d'acces permet uniquement de consulter des documents que l'employee autorise
*/
function guest(event) {
    event.preventDefault();
    location.href = '/users/addAcces/guest/' + $('input#inputUserName').val();
};
