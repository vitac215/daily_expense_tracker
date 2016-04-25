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
		displayItem();
		showdash();
	});

	// When the previous button is pressed...
	$("#btn_date_previous").click( function(event) {
		updatePreviousDate();
		// Display new days
		updateDate();
		displayItem();
		showdash();
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


	// Helper function to create a fake item on index.html to ensure search works properly
	function fake() {
		$('.itemlog').append(
			'<li id="fake"> <div class="inline item_name"></div> <div class="inline item_amt"> <div class="inline currency"></div> </div> <div class="inline item_category"></div> <div class="inline item_note"></div> </li>'
		);
	}



	// Update and display the itemlog  ##need modify
	function displayItem() {
		// Check login status
		if ($("#loginstatus").html() != "Guest") {
			// Post data to php
			$.ajax({
				method: "POST",
				url: "displayItem.php",
				data: {token_post:token}
			})
			.done(function(data){
				// If there's illegal access
				if (data.success == false) {
					// Clear the itemlog  
					$('.itemlog').empty();
					fake();
				}
				else {
					console.log(data);
					
					// Clear the itemlog and make the fake item 
					$('.itemlog').empty(); 
					fake();

					// Income: success
					// Expense: warning
					// Debt: info
					// Credit: default

					// Prepare the insert div
					$success = '<li class="list-group-item list-group-item-success"'; // add item_id
					$warning = '<li class="list-group-item list-group-item-warning"'; // add item_id
					$info = '<li class="list-group-item list-group-item-info"'; // add item_id
					$default = '<li class="list-group-item list-group-item-default"'; // add item_id
					$name = '<div class="inline item_name">'; 
					$name_debt = '<div class="inline item_name">Debt to: '; 
					$name_credit = '<div class="inline item_name">Credit from: '; 
					$amt = '<div class="inline item_amt">$ ';
					$category = '<div class="inline item_category">Category: ';
					$note = '<div class="inline item_note">Note: ';

					// Run through the item array
					for (var i=0; i<data.length; i++) {
						// Check the date 
						if (data[i].item_date == $("#current_date").html()) {
							// If the category selected is all, or matches the item category
							if ($("#display_option option:selected").val() == "all" || $("#display_option option:selected" ).val()== data[i].item_category.toLowerCase()) {
									if (data[i].item_type == "income") {
									$('.itemlog').append($success + 'id ="' + data[i].item_id + '">' + $name + data[i].item_name + '</div>' + $amt + data[i].item_amt + '</div>' + $category + data[i].item_category + '</div>' + $note + data[i].item_note + '</div></li>');
								}
								if (data[i].item_type == "expense") {
									$('.itemlog').append($warning + 'id ="' + data[i].item_id + '">' + $name + data[i].item_name + '</div>' + $amt + data[i].item_amt + '</div>' + $category + data[i].item_category + '</div>' + $note + data[i].item_note + '</div></li>');
								}
								if (data[i].item_type == "debt") {
									$('.itemlog').append($info + 'id ="' + data[i].item_id + '">' + $name_debt + data[i].item_name + '</div>' + $amt + data[i].item_amt + '</div>' + $category + data[i].item_category + '</div>' + $note + data[i].item_note + '</div></li>');
								}
								if (data[i].item_type == "credit") {
									$('.itemlog').append($default + 'id ="' + data[i].item_id + '">' + $name_credit + data[i].item_name + '</div>' + $amt + data[i].item_amt + '</div>' + $category + data[i].item_category + '</div>' + $note + data[i].item_note + '</div></div>');
								}						
							} // End of category check
							else {
								// do nothing
							}
						} // End of date check
						else {
							// do nothing
						}
					} // End of for loop
				} // End of else
			});	// End of done
		} // End of if

		// Call the search function
		search();
	} // End of displayItem function
	$("#display_option").change(displayItem);


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
				alert(data.message);
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

				// Hide the login_btn
				$("#login_btn").hide();

				// Display the search_btn
				$("#search_btn").show();

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

			// Clear the itemlog  
			$('.itemlog').empty();
			fake();

			// Display the login_btn
			$("#login_btn").show();

			// Hide the search_btn
			$("#search_btn").hide();

			}
		});
	} // end of logoutAjax function
	// When the logout button on the form is clicked, call the logoutAjax function
	$("#logout_btn").click(logoutAjax);	


	// Add expense 
	$("#addExpenseOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			var expense_name = $('#addexpense_name').val();
			var expense_amt = $('#addexpense_amt').val(); 
			var date = $("#current_date").html();

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
					data: {expense_name: expense_name, expense_amt: expense_amt, expense_category: expense_category, expense_note:expense_note, date: date, token_post: token}
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

						// Clear the form
						$("#addexpense_name").val("");
						$("#addexpense_amt").val("");
						$("#addexpense_note").val("");
					}
				});

			}
		}
	}); // End of addExpense function


	// Add income
	$("#addIncomeOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			var income_name = $('#addincome_name').val();
			var income_amt = $('#addincome_amt').val(); 
			var date = $("#current_date").html();

			// Check if the input fields are empty
			if (income_name == "" || income_amt == "") {
				alert("Please enter the item name and amount");
			}
			else {
				var income_category = $("#addIncome_category_option option:selected" ).val();
				var income_note = $('#addincome_note').val();  

				// Post data to php
				$.ajax({
					method: "POST",
					url: "addIncome.php",
					data: {income_name: income_name, income_amt: income_amt, income_category: income_category, income_note: income_note, date: date, token_post: token}
				})
				.done(function(data){
					if (data.success==false) {
						alert(data.message);
					}
					else {
						// If success...
						alert(data.message); // "Income added successfully"
						
						// Close the modal
						$("#addIncomeModal").modal('hide');

						// Update the itemlog
						displayItem();

						// Clear the form
						$("#addincome_name").val("");
						$("#addincome_amt").val("");
						$("#addincome_note").val("");
					}
				});

			}
		}
	}); // End of addIncome function


	// Add debt
	$("#addDebtOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			var debt_name = $('#adddebt_name').val(); // this is a username
			var debt_amt = $('#adddebt_amt').val(); 
			var date = $("#current_date").html();

			// Check if the input fields are empty
			if (debt_name == "" || debt_amt == "") {
				alert("Please enter the username and amount");
			}
			else if (debt_name == $("#loginstatus").html()) {
				alert("Username cannot be yourself");
			}
			else {
				// Category is default to be debt
				var debt_note = $('#adddebt_note').val();  

				// Post data to php
				$.ajax({
					method: "POST",
					url: "addDebt.php",
					data: {debt_name: debt_name, debt_amt: debt_amt, debt_note: debt_note, date: date, token_post: token}
				})
				.done(function(data){
					if (data.success==false) {
						alert(data.message);
					}
					else {
						// If success...
						alert(data.message); // "Income added successfully"
						
						// Close the modal
						$("#addDebtModal").modal('hide');

						// Update the itemlog
						displayItem();

						// Clear the form
						$("#adddebt_name").val("");
						$("#adddebt_amt").val("");
						$("#adddebt_note").val("");
					}
				});
			}
		}
	}); // End of the addDebt function



	// Add credit
	$("#addCreditOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			var credit_name = $('#addcredit_name').val(); // this is a username
			var credit_amt = $('#addcredit_amt').val(); 
			var date = $("#current_date").html();

			// Check if the input fields are empty
			if (credit_name == "" || credit_amt == "") {
				alert("Please enter the username and amount");
			}
			else if (credit_name == $("#loginstatus").html()) {
				alert("Username cannot be yourself");
			}
			else {
				// Category is default to be debt
				var credit_note = $('#addcredit_note').val();  

				// Post data to php
				$.ajax({
					method: "POST",
					url: "addCredit.php",
					data: {credit_name: credit_name, credit_amt: credit_amt, credit_note: credit_note, date: date, token_post: token}
				})
				.done(function(data){
					if (data.success==false) {
						alert(data.message);
					}
					else {
						// If success...
						alert(data.message); // "Income added successfully"
						
						// Close the modal
						$("#addCreditModal").modal('hide');

						// Update the itemlog
						displayItem();

						// Clear the form
						$("#addcredit_name").val("");
						$("#addcredit_amt").val("");
						$("#addcredit_note").val("");
					}
				});
			}
		}
	}); // End of the addDebt function



	// Open the edit expense modal when the item is clicked
	$(document).on('click', '.list-group-item.list-group-item-warning', function(e) {
		// // Put the original content into the editbox
		// foreditexpense_name = $(this).attr('expense_name');
		// foreditexpense_amt = $(this).attr('expense_amt');
		// foreditexpense_note = $(this).attr('expense_note');

		// $('#editexpense_name').attr('placeholder', foreditexpense_name);
		// $('#editexpense_amt').attr('placeholder', foreditexpense_amt);
		// $('#editexpense_note').attr('placeholder', foreditexpense_note);

		// Get the expense id
		editexpense_id = $(this).attr('id');

		// Open the modal
		$("#editExpenseModal").modal();

	});

	// Edit expense
	$("#editExpenseOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			var editexpense_name = $('#editexpense_name').val();
			var editexpense_amt = $('#editexpense_amt').val(); 
			// console.log(editexpense_id);

			// Check if the input fields are empty
			if (editexpense_name == "" || editexpense_amt == "") {
				alert("Please enter the item name and amount");
			}
			else {
				var editexpense_category = $("#editExpense_category_option option:selected" ).val();
				var editexpense_note = $('#editexpense_note').val();  

				// console.log(expense_name);
				// console.log(expense_amt);
				// console.log(expense_category);
				// console.log(expense_note);

				// Post data to php
				$.ajax({
					method: "POST",
					url: "editExpense.php",
					data: {expense_id: editexpense_id, expense_name: editexpense_name, expense_amt: editexpense_amt, expense_category: editexpense_category, expense_note:editexpense_note, token_post: token}
				})
				.done(function(data){
					if (data.success==false) {
						alert(data.message);
					}
					else {
						// If success...
						alert(data.message); // "Expense edited successfully"
						
						// Close the modal
						$("#editExpenseModal").modal('hide');

						// Update the itemlog
						displayItem();
					}
				});

			}
		}
	}); // End of editExpense function

	// Delete expense
	$("#deleteExpenseOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			// console.log(editexpense_id);

			// Post data to php
			$.ajax({
				method: "POST",
				url: "deleteExpense.php",
				data: {expense_id: editexpense_id, token_post: token}
			})
			.done(function(data){
				if (data.success==false) {
					alert(data.message);
				}
				else {
					// If success...
					alert(data.message); // "Expense edited successfully"
						
					// Close the modal
					$("#editExpenseModal").modal('hide');
					
					// Update the itemlog
					displayItem();
				}
			});

		}
	}); // End of deleteExpense function


	// Open the edit income modal when the item is clicked
	$(document).on('click', '.list-group-item.list-group-item-success', function(e) {
		// Get the income id
		editincome_id = $(this).attr('id');

		// Open the modal
		$("#editIncomeModal").modal();

	});

	// Edit income
	$("#editIncomeOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			var editincome_name = $('#editincome_name').val();
			var editincome_amt = $('#editincome_amt').val(); 
			// console.log(editincome_id);

			// Check if the input fields are empty
			if (editincome_name == "" || editincome_amt == "") {
				alert("Please enter the item name and amount");
			}
			else {
				var editincome_category = $("#editIncome_category_option option:selected" ).val();
				var editincome_note = $('#editincome_note').val();  

				// Post data to php
				$.ajax({
					method: "POST",
					url: "editIncome.php",
					data: {income_id: editincome_id, income_name: editincome_name, income_amt: editincome_amt, income_category: editincome_category, income_note:editincome_note, token_post: token}
				})
				.done(function(data){
					if (data.success==false) {
						alert(data.message);
					}
					else {
						// If success...
						alert(data.message); // "Expense edited successfully"
						
						// Close the modal
						$("#editIncomeModal").modal('hide');

						// Update the itemlog
						displayItem();
					}
				});

			}
		}
	}); // End of editIncome function

	// Delete income
	$("#deleteIncomeOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			// console.log(editincome_id);

			// Post data to php
			$.ajax({
				method: "POST",
				url: "deleteIncome.php",
				data: {income_id: editincome_id, token_post: token}
			})
			.done(function(data){
				if (data.success==false) {
					alert(data.message);
				}
				else {
					// If success...
					alert(data.message); // "Expense edited successfully"
						
					// Close the modal
					$("#editIncomeModal").modal('hide');
					
					// Update the itemlog
					displayItem();
				}
			});

		}
	}); // End of deleteExpense function


	// Open the edit debt modal when the item is clicked
	$(document).on('click', '.list-group-item.list-group-item-info', function(e) {
		// Get the debt id
		editdebt_id = $(this).attr('id');
		debt_username = $(this).children(".item_name").html();   // Debt to: Username

		$("#editdebt_username").html(debt_username);

		// Open the modal
		$("#editDebtModal").modal();

	});
	// Edit debt
	$("#editDebtOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			var editdebt_amt = $('#editdebt_amt').val(); 
			// console.log(editdebt_id);

			// Check if the input fields are empty
			if (editdebt_amt == "") {
				alert("Please enter the amount");
			}
			else {
				var editdebt_note = $('#editdebt_note').val();  

				// Post data to php
				$.ajax({
					method: "POST",
					url: "editDebt.php",
					data: {debt_id: editdebt_id, debt_amt: editdebt_amt, debt_note: editdebt_note, token_post: token}
				})
				.done(function(data){
					if (data.success==false) {
						alert(data.message);
					}
					else {
						// If success...
						alert(data.message); // "Expense edited successfully"
						
						// Close the modal
						$("#editDebtModal").modal('hide');

						// Update the itemlog
						displayItem();
					}
				});

			}
		}
	}); // End of editDebt function

	// Delete debt
	$("#deleteDebtOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {

			// Post data to php
			$.ajax({
				method: "POST",
				url: "deleteDebt.php",
				data: {debt_id: editdebt_id, token_post: token}
			})
			.done(function(data){
				if (data.success==false) {
					alert(data.message);
				}
				else {
					// If success...
					alert(data.message); // "Expense edited successfully"
						
					// Close the modal
					$("#editDebtModal").modal('hide');
					
					// Update the itemlog
					displayItem();
				}
			});

		}
	}); // End of deleteDebt function




	// Open the edit credit modal when the item is clicked
	$(document).on('click', '.list-group-item.list-group-item-default', function(e) {
		// Get the credit id
		editcredit_id = $(this).attr('id');
		credit_username = $(this).children(".item_name").html();   // Debt to: Username

		$("#editcredit_username").html(credit_username);

		// Open the modal
		$("#editCreditModal").modal();

	});
	// Edit credit
	$("#editCreditOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {
			var editcredit_amt = $('#editcredit_amt').val(); 
			// console.log(editcredit_id);

			// Check if the input fields are empty
			if (editdebt_amt == "") {
				alert("Please enter the amount");
			}
			else {
				var editcredit_note = $('#editcredit_note').val();  

				// Post data to php
				$.ajax({
					method: "POST",
					url: "editCredit.php",
					data: {credit_id: editcredit_id, credit_amt: editcredit_amt, credit_note: editcredit_note, token_post: token}
				})
				.done(function(data){
					if (data.success==false) {
						alert(data.message);
					}
					else {
						// If success...
						alert(data.message); // "Expense edited successfully"
						
						// Close the modal
						$("#editCreditModal").modal('hide');

						// Update the itemlog
						displayItem();
					}
				});

			}
		}
	}); // End of editCredit function

	// Delete debt
	$("#deleteCreditOn_btn").on('click', function(){
		// Check login status
		if ($("#loginstatus").html() == "Guest") {
			alert("Please log in first!");
		}
	 	else {

			// Post data to php
			$.ajax({
				method: "POST",
				url: "deleteCredit.php",
				data: {credit_id: editcredit_id, token_post: token}
			})
			.done(function(data){
				if (data.success==false) {
					alert(data.message);
				}
				else {
					// If success...
					alert(data.message); // "Expense edited successfully"
						
					// Close the modal
					$("#editCreditModal").modal('hide');
					
					// Update the itemlog
					displayItem();
				}
			});

		}
	}); // End of deleteCredit function



	// Summary function
	function summary() {
		// Clear the log
		$("#totalexpense").empty();
		$("#totalincome").empty();
		$("#net").empty();

		// Get the num strings for expense
		var rawnums_expense = [];
		$(".list-group-item.list-group-item-warning").children(".item_amt").each( function(i,e) {
			rawnums_expense.push($(e).html());
		});
		// Parse the string to get ints
		var totalexpense = 0;
		for (var i=0; i<rawnums_expense.length; i++) {
			rawnums_expense[i] = parseInt(rawnums_expense[i].replace(/[^0-9\.]/g, ''), 10); // gives the int part
			totalexpense = totalexpense + rawnums_expense[i];
		}


		// Get the num strings for income
		var rawnums_income = [];
		$(".list-group-item.list-group-item-success").children(".item_amt").each( function(i,e) {
			rawnums_income.push($(e).html());
		});
		// Parse the string to get ints
		var totalincome = 0;
		for (var i=0; i<rawnums_income.length; i++) {
			rawnums_income[i] = parseInt(rawnums_income[i].replace(/[^0-9\.]/g, ''), 10); // gives the int part
			totalincome = totalincome + rawnums_income[i];
		}

		var totalnet = totalincome - totalexpense;


		// Hide the dashlog
		$(".dashlog").hide();
		// Display the summarylogs
		$(".summarylog").show();


		// Do the math
		$("#totalexpense").html(totalexpense);
		$("#totalincome").html(totalincome);
		$("#net").html(totalnet);
	}
	$("#summary_btn").click(summary);	




	// Change background color function
	function changeBackColor() {
		if($("#backcolor_option option:selected").val() == "White"){
	       $('#page-wrapper').css('background-color', '#fff');
	       $('body').css('background-color', '#fff');
		}

		if($("#backcolor_option option:selected").val() == "Red"){
	       $('#page-wrapper').css('background-color', '#ffe6e6');
	       $('body').css('background-color', '#ffe6e6');
		}

		if($("#backcolor_option option:selected").val() == "Orange"){
	       $('#page-wrapper').css('background-color', '#fff0e6');
	       $('body').css('background-color', '#fff0e6');
		}

		if($("#backcolor_option option:selected").val() == "Yellow"){
	       $('#page-wrapper').css('background-color', '#ffffe6');
	       $('body').css('background-color', '#ffffe6');
		}

		if($("#backcolor_option option:selected").val() == "Green"){
	       $('#page-wrapper').css('background-color', '#eeffe6');
	       $('body').css('background-color', '#eeffe6');
		}

		if($("#backcolor_option option:selected").val() == "Blue"){
	       $('#page-wrapper').css('background-color', '#e6ebff');
	       $('body').css('background-color', '#e6ebff');
		}

		if($("#backcolor_option option:selected").val() == "Pink"){
	       $('#page-wrapper').css('background-color', '#ffe6ff');
	       $('body').css('background-color', '#ffe6ff');
		}
	}
	$("#backcolor_option").change(changeBackColor);



	// Real time search
    function search() {
		var options = {
			valueNames: ['item_name', 'item_amt' , 'item_category', 'item_note']
		};
		var docs =  new List('search', options);   	
    }
    $("#search_content").click(search);



	// Helper function to hide the summarylog and display the dashlog
	function showdash() {
		// Display the itemlog
		$(".dashlog").show();
		displayItem();
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


	$("#dash_btn").on('click', function() {
		// Display the itemlog
		$(".dashlog").show();
		// Hide the summarylogs
		$(".summarylog").hide();
	});



}); // End of JQuey