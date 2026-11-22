// This file runs the two practice activities.

// Appointment booking activity
var bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    var currentStep = 1;
    var guideTitles = ['Choose a service', 'Enter a practice name', 'Choose a date and time', 'Check your details'];
    var guideTexts = [
        'Select the type of appointment you want to practice booking.',
        'Type a made-up name. You do not need to use your real name.',
        'Choose a date and an available time from the list.',
        'Read your details and press Confirm to finish the practice.'
    ];

    function bookingDetails(targetId) {
        var box = document.getElementById(targetId);
        box.textContent = '';
        var labels = ['Service', 'Name', 'Date', 'Time'];
        var values = [
            document.getElementById('service').value,
            document.getElementById('customerName').value.trim(),
            document.getElementById('bookingDate').value,
            document.getElementById('bookingTime').value
        ];
        for (var i = 0; i < labels.length; i++) {
            var line = document.createElement('p');
            var title = document.createElement('strong');
            title.textContent = labels[i] + ': ';
            line.appendChild(title);
            line.appendChild(document.createTextNode(values[i]));
            box.appendChild(line);
        }
    }

    function showBookingStep() {
        var steps = document.querySelectorAll('.booking-step');
        for (var i = 0; i < steps.length; i++) {
            steps[i].classList.add('d-none');
        }
        document.querySelector('.booking-step[data-step="' + currentStep + '"]').classList.remove('d-none');
        document.getElementById('bookingError').classList.add('d-none');
        document.getElementById('bookingStepText').textContent = 'STEP ' + currentStep + ' OF 4';
        document.getElementById('bookingProgress').style.width = (currentStep * 25) + '%';
        document.getElementById('bookingGuideTitle').textContent = 'Step ' + currentStep + ': ' + guideTitles[currentStep - 1];
        document.getElementById('bookingGuideText').textContent = guideTexts[currentStep - 1];
        document.getElementById('backBtn').classList.toggle('d-none', currentStep === 1);
        document.getElementById('nextBtn').textContent = currentStep === 4 ? 'Confirm' : 'Next';
        if (currentStep === 4) bookingDetails('bookingSummary');
    }

    function showBookingError(message) {
        var error = document.getElementById('bookingError');
        error.textContent = message;
        error.classList.remove('d-none');
    }

    document.getElementById('nextBtn').addEventListener('click', function () {
        if (currentStep === 1 && document.getElementById('service').value === '') {
            showBookingError('Please choose a service.');
            return;
        }
        if (currentStep === 2 && document.getElementById('customerName').value.trim() === '') {
            showBookingError('Please enter a practice name.');
            return;
        }
        if (currentStep === 3) {
            var date = document.getElementById('bookingDate').value;
            var time = document.getElementById('bookingTime').value;
            if (date === '' || time === '') {
                showBookingError('Please choose both a date and a time.');
                return;
            }
            var chosenDate = new Date(date + 'T00:00:00');
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            if (chosenDate < today) {
                showBookingError('Please choose today or a future date.');
                return;
            }
        }
        if (currentStep === 4) {
            bookingDetails('confirmedDetails');
            bookingForm.classList.add('d-none');
            document.getElementById('bookingSuccess').classList.remove('d-none');
            document.getElementById('bookingStepText').classList.add('d-none');
            return;
        }
        currentStep++;
        showBookingStep();
    });

    document.getElementById('backBtn').addEventListener('click', function () {
        if (currentStep > 1) currentStep--;
        showBookingStep();
    });

    document.getElementById('restartBooking').addEventListener('click', function () {
        bookingForm.reset();
        currentStep = 1;
        bookingForm.classList.remove('d-none');
        document.getElementById('bookingSuccess').classList.add('d-none');
        document.getElementById('bookingStepText').classList.remove('d-none');
        showBookingStep();
    });
    showBookingStep();
}

// Online safety quiz
var quizGame = document.getElementById('quizGame');

if (quizGame) {
    var questions = [
        {
            question: 'You get a text saying your bank account is blocked. It asks you to click a link and enter your password. What should you do?',
            answers: ['Click the link immediately', 'Open your bank app directly or call the official number', 'Reply with your password'],
            correct: 1,
            explanation: 'Do not use unexpected links to enter banking details. Contact the bank through its official app or number.'
        },
        {
            question: 'A link says secure-bank.example.com.fake-site.test. Is it safe just because it includes the word bank?',
            answers: ['Yes, it says bank', 'Yes, all long links are safe', 'No, the full website address matters'],
            correct: 2,
            explanation: 'Scammers can put familiar words inside a fake website address. Check the full domain carefully.'
        },
        {
            question: 'A message says you won a free phone, but you must pay a fee first. What is the safest choice?',
            answers: ['Ignore the unexpected prize message', 'Pay quickly', 'Send your card details'],
            correct: 0,
            explanation: 'Unexpected prizes that require payment are a common scam warning sign.'
        },
        {
            question: 'Someone calls and asks for the one-time code sent to your phone. What should you do?',
            answers: ['Read out the code', 'Keep the code private and end the call', 'Send a screenshot of the code'],
            correct: 1,
            explanation: 'One-time verification codes are private. Never share them with callers or message senders.'
        },
        {
            question: 'You receive a delivery message with a strange link, but you are not expecting a parcel. What should you do?',
            answers: ['Open the link', 'Pay the requested fee', 'Ignore the link and check with the delivery company directly if needed'],
            correct: 2,
            explanation: 'Unexpected delivery messages can be phishing attempts. Use the company’s official website instead.'
        }
    ];

    var questionNumber = 0;
    var selectedAnswer = -1;
    var score = 0;
    var checked = false;
    var chosenAnswers = [];

    function showQuestion() {
        var question = questions[questionNumber];
        selectedAnswer = -1;
        checked = false;
        document.getElementById('questionCounter').textContent = 'QUESTION ' + (questionNumber + 1) + ' OF ' + questions.length;
        document.getElementById('quizProgress').style.width = ((questionNumber + 1) / questions.length * 100) + '%';
        document.getElementById('quizQuestion').textContent = question.question;
        document.getElementById('quizFeedback').classList.add('d-none');
        var options = document.getElementById('quizOptions');
        options.textContent = '';
        for (var i = 0; i < question.answers.length; i++) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'quiz-option';
            button.textContent = question.answers[i];
            button.setAttribute('data-answer', i);
            button.addEventListener('click', function () {
                if (checked) return;
                selectedAnswer = Number(this.getAttribute('data-answer'));
                var buttons = document.querySelectorAll('.quiz-option');
                for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('selected');
                this.classList.add('selected');
                document.getElementById('quizNext').disabled = false;
            });
            options.appendChild(button);
        }
        var next = document.getElementById('quizNext');
        next.textContent = 'Check answer';
        next.disabled = true;
    }

    function showResults() {
        document.getElementById('quizGame').classList.add('d-none');
        document.getElementById('quizResults').classList.remove('d-none');
        document.getElementById('scoreText').textContent = 'Your score: ' + score + ' / ' + questions.length;
        document.getElementById('scoreMessage').textContent = score === questions.length ? 'Excellent! You spotted every warning sign.' : 'Good practice! Read the explanations below and try again.';
        var review = document.getElementById('answerReview');
        review.textContent = '';
        for (var i = 0; i < questions.length; i++) {
            var item = document.createElement('div');
            item.className = 'review-item';
            var title = document.createElement('strong');
            title.textContent = 'Question ' + (i + 1) + ': ' + (chosenAnswers[i] === questions[i].correct ? 'Correct' : 'Incorrect');
            var answer = document.createElement('p');
            answer.textContent = 'Correct answer: ' + questions[i].answers[questions[i].correct];
            var reason = document.createElement('p');
            reason.textContent = questions[i].explanation;
            item.appendChild(title);
            item.appendChild(answer);
            item.appendChild(reason);
            review.appendChild(item);
        }
    }

    document.getElementById('quizNext').addEventListener('click', function () {
        if (!checked) {
            if (selectedAnswer === -1) return;
            checked = true;
            chosenAnswers.push(selectedAnswer);
            var correct = selectedAnswer === questions[questionNumber].correct;
            if (correct) score++;
            var feedback = document.getElementById('quizFeedback');
            feedback.textContent = (correct ? 'Correct! ' : 'Not quite. ') + questions[questionNumber].explanation;
            feedback.classList.remove('d-none');
            var buttons = document.querySelectorAll('.quiz-option');
            for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
            this.textContent = questionNumber === questions.length - 1 ? 'See results' : 'Next question';
        } else {
            questionNumber++;
            if (questionNumber === questions.length) showResults();
            else showQuestion();
        }
    });

    document.getElementById('retryQuiz').addEventListener('click', function () {
        questionNumber = 0;
        selectedAnswer = -1;
        score = 0;
        checked = false;
        chosenAnswers = [];
        document.getElementById('quizGame').classList.remove('d-none');
        document.getElementById('quizResults').classList.add('d-none');
        showQuestion();
    });
    showQuestion();
}

