(function () {

	var numberOfQuestion = 5;
	var randomQuestionList = [];
	var playerAnsweredList = {};
	// An array json for a list of question 
	var questionList = [
		{	
			type: 'single',
			question: 'What areas in the Excel window allow values ​​and formulas to be entered?',
			answer: {
				a: 'Title Bar',
				b: 'Formual Bar',
				c: 'Standard Tool Bar',
				d: 'Menu Bar'
			},
			correct: 'c'
		}, {
			type: 'single',
			question: 'What keyboard shortcuts are used to edit the contents of a cell?',
			answer: {
				a: 'F1',
				b: 'F2',
				c: 'F3',
				d: 'F4'
			},
			correct: 'd'
		}, {
			type: 'single',
			question: 'which keystrokes allow the cursor to be returned to the first cell (A1) of the worksheet immediately?',
			answer: {
				a: 'Shift + Home',
				b: 'Ctrl + Home',
				c: 'Alt + Home',
				d: 'Shift + Alt + Home'
			},
			correct: 'a'
		}, {
			type: 'single',
			question: 'What areas in the Excel window allow values ​​and formulas to be entered?',
			answer: {
				a: '',
				b: '',
				c: '',
				d: ''
			},
			correct: 'a'
		}, {
			type: 'input',
			question: 'What areas in the Excel window allow values ​​and formulas to be entered input yes?',
			correct: ['yes','YES']
		}, {
			type: 'input',
			question: 'What areas in the Excel window allow values ​​and formulas to be entered input no?',
			correct: ['No','no']
		}, {
			type: 'multiple',
			question: 'What areas in the Excel window allow values ​​and formulas to be entered?',
			answer: {
				a: '',
				b: '',
				c: '',
				d: ''
			},
			correct: ['a','b','c']
		}, {
			type: 'multiple',
			question: 'What areas in the Excel window allow values ​​and formulas to be entered?',
			answer: {
				a: '',
				b: '',
				c: '',
				d: ''
			},
			correct: ['c','d']
		},
	]

	function init() {
		var newQuestion = generate_questionList();
		document.getElementById("question-container").innerHTML = newQuestion;
		document.getElementById("pre").addEventListener("click", pre); 
		document.getElementById("next").addEventListener("click", next); 
		document.getElementById("submit").addEventListener("click", onSubmit); 
	}

	// Simple ramdon function for getting question not duplicate
	function getRandomInt(numberOfQuestion) {
		var outputArr = [];
		var currentRandom = 0;
		while (currentRandom < numberOfQuestion ) {
			var indexQuestion = Math.floor(Math.random() * questionList.length);
			if (!outputArr.includes(indexQuestion)) {
				outputArr.push(indexQuestion);
				currentRandom++;
			}
		}
		return outputArr;
	}

	function generate_questionList(cmd) {
		// Run when player hit start button
		var index;
		if (randomQuestionList.length < 1) {
			randomQuestionList = getRandomInt(numberOfQuestion);
			return getQuestionAndAnswer(0);
		} else {
			var questionEle = document.querySelector("#current");
			var questionIndex = questionEle.dataset.index;
			if (questionIndex < numberOfQuestion -1 && cmd === 'next') {
				index = ++questionIndex;
			} else if (questionIndex >= 1 && cmd === 'pre') {
				index = --questionIndex;
			} else {
				index = questionIndex;
			}
		}
		return getQuestionAndAnswer(index)
	}

	function getQuestionAndAnswer(index) {
		var firstQuestion = questionList[randomQuestionList[index]];
		var questionTilte = `<label class="question">Q: ${firstQuestion.question}</label>`;
		var questionType =firstQuestion.type;
		var answers = generateTypeOfAnswer(questionType,firstQuestion)	
		return `<div id="current" data-index="${index}" data-type="${questionType}" >` + questionTilte + answers + '</div>';
	}

	function generateTypeOfAnswer(type,question){
		var answers ='';
		switch(type){
			case 'single' :{
				for (var key in question.answer) {
					answers += `<div class="form-inline">
									<input type="radio" name="answer" value="${key}">
									<label>${key.toUpperCase()} . ${question.answer[key]}</label>
								</div>`;
				}
				break;	
			}
			case 'multiple' :{
				for (var key in question.answer) {
					answers += `<div class="form-inline">
									<input type="checkbox" name="answer" value="${key}">
									<label>${key.toUpperCase()} . ${question.answer[key]}</label>
								</div>`;
				}
				break;
			}
			case 'input' : {
				answers = `<div class="form-inline"><label>Your answer: </label><input type="text" name="text" ></div>`
				break;
			}
			default: break;
		}
		return answers;
	}

	function next() {
		onChangeQuestion();
		var newQuestion = generate_questionList("next");
		document.getElementById("question-container").innerHTML = newQuestion;
		restoreCheckedQuestion();
	}

	function pre() {
		onChangeQuestion()
		var newQuestion = generate_questionList("pre");
		document.getElementById("question-container").innerHTML = newQuestion;
		restoreCheckedQuestion();
	}


	function onChangeQuestion() {
		var currentQuestion = document.querySelector("#current").dataset.index;
		var questionType = document.querySelector("#current").dataset.type;
		
		if(questionType !== "input") {	
			var playerAnswer = document.querySelectorAll("input[name='answer']:checked");
			var valueChecked = '';
			if (playerAnswer.length > 1) {
				playerAnswer.forEach(function (v, i) {
					valueChecked += v.value + ',';
				});
			} else if (playerAnswer.length === 1) {
				valueChecked = playerAnswer[0].value;
			}
			playerAnsweredList[currentQuestion] = valueChecked;
		}else{
			playerAnsweredList[currentQuestion] = document.querySelector("input[name='text']").value;
		}
	}

	function restoreCheckedQuestion() {
		var currentQuestion = document.querySelector("#current").dataset.index;
		var questionType = document.querySelector("#current").dataset.type;
		var playerAnswer = playerAnsweredList[currentQuestion];
		if(questionType !== "input") {
			if (playerAnswer && playerAnswer !== '') {
				if (playerAnswer.includes(',')) {
					var listAnswer = playerAnswer.split(',');
					listAnswer.forEach(function (v, i) {
						if (v !== '') {
							document.querySelector(`input[value='${v}']`).checked = true;
						}
					});
				} else {
					document.querySelector(`input[value='${playerAnswer}']`).checked = true;
				}
			}
		}else{
			if(playerAnswer && playerAnswer !== ''){
				document.querySelector(`input[type='text']`).value = playerAnswer;
			}
			
		}
	}


	function onSubmit() {
		var correct = 0;
		if(Object.keys(playerAnsweredList).length > 0) {
			for(var answer in playerAnsweredList){
				if(playerAnsweredList[answer]&& playerAnsweredList[answer] !== ""){
					var playerAnswered = playerAnsweredList[answer];
					var questionNo = randomQuestionList[answer];
					var questionJson = questionList[questionNo];
					var questionType = questionJson.type;
					var questionAnswer = questionJson.correct;
					switch(questionType)
					{
						case 'single' :{
							if(questionJson.correct === playerAnswered){
								correct++
								
							}
							break;	
						}
						case 'multiple' :{
							var listAnswerd= playerAnswered.split(",");
							if(listAnswerd.length < questionJson.correct || listAnswerd.length > questionJson.correct){
								break;	
							}
							
							var numberOfCorrect = 0; 
							listAnswerd.forEach(function(v,i){
								if(questionAnswer.includes(v)){
									numberOfCorrect ++;
								}
							});
							if(numberOfCorrect === questionAnswer.length){
								correct++
							}
							break;
						}
						case 'input' : {
							// Ignore case
							var answerTLC = questionAnswer.map(function(v){
								return v.toLowerCase();
							})
							if(answerTLC.includes(playerAnswered.toLowerCase())){
								correct++;
							}
						}
						default: return;
					}
				}
			}
		}

		var pictures = ["img/win1.gif", "img/meh1.gif", "img/lose1.gif"];
		var messages = ["Great job!", "That's just okay", "You really need to do better"];
		var score;

		if (correct == 0) {
			score = 2;
		}else if (correct > 0 && correct < 3) {
			score = 1;
		}else if (correct == 3) {
			score = 0;
		}

		document.getElementById("after_submit").style.visibility = "visible";
		document.getElementById("message").innerHTML = messages[score];
		document.getElementById("number_correct").innerHTML = "You got " + correct + " correct.";
		document.getElementById("picture").src = pictures[score];
	}

	init();
})();
