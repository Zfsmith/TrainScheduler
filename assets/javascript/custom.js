$(document).ready(function(){

	// Initialize Firebase
	var config = {
	    apiKey: "AIzaSyAnP3zb8Q2P5SC_I0a44JHx--bcKeFNpSk",
	    authDomain: "train-15e05.firebaseapp.com",
	    databaseURL: "https://train-15e05.firebaseio.com",
	    projectId: "train-15e05",
	    storageBucket: "train-15e05.appspot.com",
	    messagingSenderId: "475740395711"
	};
	firebase.initializeApp(config);
	var database = firebase.database();

	var name = "";
	var destination;
	var frequency;
	var firstTrain;
	var nextArrival;
	var minutesAway;
	var nextTrain;
	var tMinutesTillTrain;
	

	$("#submit").on("click", function(event){

		event.preventDefault();

		name = $("#name").val().trim();
		destination = $("#destination").val().trim();
		frequency = $("#frequency").val().trim();
		firstTrain = $("#train-time").val().trim();

		database.ref().push({
			name: name,
			destination: destination,
			frequency: frequency,
			firstTrain: firstTrain
		});


	})

	database.ref().on("child_added", function(snapshot){

		firstTrain = snapshot.val().firstTrain;
		frequency = snapshot.val().frequency;

		calcNextArrival();

		var tRow = $("<tr>");
		tRow.append("<td>" + snapshot.val().name + "</td>");
		tRow.append("<td>" + snapshot.val().destination + "</td>");
		tRow.append("<td>" + snapshot.val().frequency + "</td>");
		tRow.append("<td>" + moment(nextTrain).format("hh:mm") + "</td>");
		tRow.append("<td>" + tMinutesTillTrain + "</td>");
		$("#train-table").append(tRow);

	},
	function(errorObject){
		console.log("errors handled:" + errorObject.code);
	})

	function calcNextArrival(){
		console.log(firstTrain);
		var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
		console.log(firstTrainConverted);
		var currentTime = moment();
		console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
		var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
		console.log("DIFFERENCE IN TIME: " + diffTime);
		var tRemainder = diffTime % frequency;
		console.log(tRemainder);
		tMinutesTillTrain = frequency - tRemainder;
		console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
		nextTrain = moment().add(tMinutesTillTrain, "minutes");
		console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
	}

})