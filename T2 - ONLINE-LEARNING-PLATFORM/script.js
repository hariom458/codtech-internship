document.addEventListener('DOMContentLoaded', function() {
    // Check login status on every page load
    checkLoginState();

    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', handleQuizSubmit);
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
});

function checkLoginState() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const logoutLink = document.getElementById('logout-link');

    if (loggedInUser) {
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        logoutLink.style.display = 'inline-block';
    } else {
        loginLink.style.display = 'inline-block';
        signupLink.style.display = 'inline-block';
        logoutLink.style.display = 'none';
    }
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('loggedInUser');
    // alert('You have been logged out.');
    window.location.reload(); // Reload the page to update the UI
}

function handleQuizSubmit(e) {
    e.preventDefault();

    // Reset styles before scoring
    document.querySelectorAll('.quiz-question label').forEach(label => label.style.color = '#f0f0f0');
    document.querySelectorAll('.quiz-question p').forEach(p => p.style.color = '#c77dff');

    const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];
    let score = 0;
    let total = questions.length;

    questions.forEach(q => {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected) {
            const questionDiv = selected.closest('.quiz-question');
            const correctLabel = questionDiv.querySelector('input[value="correct"]').parentElement;

            if (selected.value === 'correct') {
                score++;
                selected.parentElement.style.color = '#28a745'; // Green for correct
            } else {
                selected.parentElement.style.color = '#dc3545'; // Red for incorrect
                correctLabel.style.color = '#28a745'; // Highlight correct answer
            }
        } else {
            // Mark unanswered questions
            const questionDiv = document.querySelector(`input[name="${q}"]`).closest('.quiz-question');
            if(questionDiv) {
                questionDiv.querySelector('p').style.color = '#dc3545'; // Red
            }
        }
    });

    const resultDiv = document.getElementById('quiz-result');
    resultDiv.innerHTML = `Your Score: ${score} / ${total}`;
    resultDiv.style.color = score > total / 2 ? '#28a745' : '#e94560';
}