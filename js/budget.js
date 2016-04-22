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

// // Current month and date	
// var currentmos = new Month(todayYear, todayMonth);  // currenmos = Month {year: 2016, month: 4}

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



	// Register
	




}); // End of JQuey