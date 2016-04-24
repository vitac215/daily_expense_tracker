// Calendar Library
(function() {
	Date.prototype.deltaDays = function(c) {
		return new Date(this.getFullYear(), this.getMonth(), this.getDate()+c)
		}; 
		Date.prototype.getSunday = function() {
			return this.deltaDays(-1*this.getDay())
		}
}
)();

function Week(c) {
	this.sunday=c.getSunday(); 
	this.nextWeek = function() {
		return new Week(this.sunday.deltaDays(7))
	};
	this.prevWeek = function(){ 
		return new Week(this.sunday.deltaDays(-7))
	};
	this.contains = function(b) {
		return this.sunday.valueOf() === b.getSunday().valueOf()
	};
	this.getDates = function() {
		for(var b=[],a=0;7>a;a++)
			b.push(this.sunday.deltaDays(a));
			return b
	}
};

function Month(c,b){
	this.year=c;
	this.month=b;
	this.nextMonth = function() {
		return new Month(c+Math.floor((b+1)/12),(b+1)%12)
	};
	this.prevMonth = function() {
		return new Month(c+Math.floor((b-1)/12),(b+11)%12)
	};
	this.getDateObject = function(a) {
		return new Date(this.year,this.month,a)
	};
	this.getWeeks=function() {
		var a=this.getDateObject(1), b=this.nextMonth().getDateObject(0), c=[], a=new Week(a);
		for(c.push(a);!a.contains(b);)
			a=a.nextWeek(),c.push(a);
		return c;
	}
};





// Today's date
var today = new Date();
var todayDay = today.getDate(); // 22
var todayMonth = today.getMonth() + 1; // March = 3
var todayYear = today.getFullYear(); // 2016

// For security use, will be filled in the login phase
var token; 


// JQuery 
$(function(){

	// Display the current date, month and year immediately when the page is loaded
	updateDate();

	// When the next button is pressed...
	$("#btn_date_next").click( function(event) {
		updateNextDate();
		// Display new days
		updateDate();
	});

	// When the previous button is pressed...
	$("#btn_date_previous").click( function(event) {
		updatePreviousDate();
		// Display new days
		updateDate();
	});


	// A function to get the number of days the input month has
	function monthNumDates(month, year) {
		if (month == 1) { // Jan
			return 31;
		}
		if (month == 2 && year%4 != 0) {  // Feb in a common year
			return 29;
		}
		if (month == 2 && year%4 == 0) {  // Feb in a leap year
			return 29;
		}
		if (month == 3) { // Mar
			return 31;
		}
		if (month == 4) { // Apr
			return 30;
		}
		if (month == 5) { // May
			return 31;
		}
		if (month == 6) { // Jun
			return 30;
		}
		if (month == 7) { // Jul
			return 31;
		}
		if (month == 8) { // Aug
			return 31;
		}
		if (month == 9) { // Sep
			return 30;
		}
		if (month == 10) { // Oct
			return 31;
		}
		if (month == 11) { // Nov
			return 30;
		}
		if (month == 12) { // Dec
			return 31;
		}

	}



	function updateNextDate() {
		// Check if it's the last of the year
		if (todayDay == 31 && todayMonth == 12) {
			todayDay = 1;
			todayMonth = 1;
			todayYear = todayYear + 1;
		}
		else {
			var numDates = monthNumDates(todayMonth, todayYear);
			if (todayDay != numDates) {
				// if today is not the last day of the month
				todayDay = todayDay + 1;
			}
			else {
				// if today is the last day of the month
				todayDay = 1;
				todayMonth = todayMonth + 1;
			}
		}
	}

	function updatePreviousDate() {
		// Check if it's the first day of the year
		if (todayDay == 1 && todayMonth == 1) {
			todayDay = 31;
			todayMonth = 12;
			todayYear = todayYear - 1;
		}
		else {
			var numDates = monthNumDates(todayMonth-1, todayYear);
			if (todayDay != 1) {
				// if today is not the first day of a month
				todayDay = todayDay - 1;
			}
			else {
				// if today is the first day of the month
				todayDay = numDates;
				todayMonth = todayMonth - 1;
			}
		}	
	}


	// Update the date
	function updateDate() {
		// Display the current month and year
		$("#current_date").html(todayMonth + "/" + todayDay + "/" + todayYear);
	} // End of updateDate function



	// Update and display the itemlog  ##need modify
	function displayItem() {
		// Check login status
		if (loginstatus.innerHTML != "Guest") {
			// Post data to php
			$.ajax({
				method: "POST",
				url: "displayItem.php",
				data: {token_post:token}
			})
			.done(function(data){
				// If there's illegal access
				if (data.success == false) {
					console.log(data.message);
				}
				else {
					console.log(data);
				}
				// else {
				// 	// If the user is logined
				// 	// Run through the event array
				// 	for(var k=0; k<data.length; ++k) {
				// 		// If the tag selected is all, or matches the event tag
				// 		if ($('#eventTag').val() == "All" || $('#eventTag').val() == data[k].etag) {
				// 			contentForEdit = data[k].econtent;
				// 			titleForEdit = data[k].etitle;
				// 			tagForEdit = data[k].etag;
				// 			var  thisDate = parseInt(data[k].eday);
				// 			$('#'+thisDate).append('<div class="eventDay" event-id="' + data[k].eid + '"' + 'event-content="' + contentForEdit + '"' + 'event-title="' + titleForEdit + '"' + 'event-tag="' + tagForEdit + '">' + data[k].etime + ' ' + data[k].etitle + '</div>');
				// 		}
				// 		// else, display nothing
				// 	}
				// }
			});	
		}
	}


	// Register
	function registerAjax(event) {
		var username = $('#register_username').val(); // Get the username from the form
		var password = $('#register_pwd').val(); // Get the password from the form

		// Post data to php
		$.ajax({
			method: "POST",
			url: "register.php",
			data: {username: username, password: password}
		})
		.done(function(data){
			if (data.success==false) {
				alert(data.message);
			}
			else {
				// If success...
				// Close the modal
				$("#registerModal").modal('hide');
			}
		});
		// Clear the form
		$("#registerForm").val("");
	} // end of registerAjax function
	// When the register button on the form is clicked, call the registerAjax function
	$("#registeron_btn").click(registerAjax);



	// Login
	function loginAjax(event) {
		var username = $('#login_username').val(); // Get the username from the form
		var password = $('#login_pwd').val(); // Get the password from the form

		// Post data to php
		$.ajax({
			method: "POST",
			url: "login.php",
			data: {username: username, password: password}
		})
		.done(function(data){
			if (data.success==false) {
				alert(data.message);
			}
			else {
				// If success...
				alert("You've been logged in successfully!");
				// Get the passed token
				token = data.token;
				// Change the login status
				$("#loginstatus").html(username);

				// Close the modal
				$("#loginModal").modal('hide');

				// Display the logout_btn
				$("#logout_btn").show();

				// Update the itemlog
				displayItem();
			}
		});
		// Clear the form
		$("#loginForm").val("");
	} // end of logoutAjax function
	// When the login button on the form is clicked, call the loginAjax function
	$("#loginon_btn").click(loginAjax);	


	// Logout
	function logoutAjax(event) {
		var username = $('#login_username').val(); // Get the username from the form
		var password = $('#login_pwd').val(); // Get the password from the form

		// Post data to php
		$.ajax({
			method: "POST",
			url: "logout.php",
			data: {username: username, password: password}
		})
		.done(function(data){
			if (data.success==true) {
				alert(data.message);

			// Change the login status
			$("#loginstatus").html("Guest");

			// // Update the itemlog
			displayItem();
			}
		});
	} // end of logoutAjax function
	// When the logout button on the form is clicked, call the logoutAjax function
	$("#logout_btn").click(logoutAjax);	


	// Add expense 
	$("#addExpenseOn_btn").on('click', function(){
		// Check login status
		if (loginstatus.innerHTML == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			var expense_name = $('#addexpense_name').val();
			var expense_amt = $('#addexpense_amt').val();  

			// Check if the input fields are empty
			if (expense_name == "" || expense_amt == "") {
				alert("Please enter the item name and amount");
			}
			else {
				var expense_category = $("#addExpense_category_option option:selected" ).val();
				var expense_note = $('#addexpense_note').val();  

				// console.log(expense_name);
				// console.log(expense_amt);
				// console.log(expense_category);
				// console.log(expense_note);

				// Post data to php
				$.ajax({
					method: "POST",
					url: "addExpense.php",
					data: {expense_name: expense_name, expense_amt: expense_amt, expense_category: expense_category, expense_note:expense_note, token_post: token}
				})
				.done(function(data){
					if (data.success==false) {
						alert(data.message);
					}
					else {
						// If success...
						alert(data.message); // "Expense added successfully"
						
						// Close the modal
						$("#addExpenseModal").modal('hide');

						// Update the itemlog
						displayItem();
					}
				});
				// Clear the form
				$("#addexpense_name").val("");
				$("#addexpense_amt").val("");
				$("#addexpense_note").val("");
			}
		}
	});






	// Helper function to hide the summarylog and display the dashlog
	function showdash() {
		// Display the itemlog
		$(".dashlog").show();
		// Hide the summarylogs
		$(".summarylog").hide();
	}
	
	// Bind the button and open the modal
	$("#register_btn").on('click', function() {
		$("#registerModal").modal();
	});

	$("#login_btn").on('click', function() {
		$("#loginModal").modal();
	});

	$("#expense_btn").on('click', function() {
		$("#addExpenseModal").modal();
		showdash();
	});

	$("#income_btn").on('click', function() {
		$("#addIncomeModal").modal();
		showdash();
	});

	$("#debt_btn").on('click', function() {
		$("#addDebtModal").modal();
		showdash();
	});

	$("#credit_btn").on('click', function() {
		$("#addCreditModal").modal();
		showdash();
	});

	// Bind the summary button, if pressed, hide the itemlog and display the summarylog
	$("#summary_btn").on('click', function() {
		// Hide the dashlog
		$(".dashlog").hide();
		// Display the summarylogs
		$(".summarylog").show();
	});

	$("#dash_btn").on('click', function() {
		// Display the itemlog
		$(".dashlog").show();
		// Hide the summarylogs
		$(".summarylog").hide();
	});



}); // End of JQuey