
import {
  Component,
  input,
  output,
  inject,
  OnInit
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

// QUESTION MODEL
interface Question {
  question: string;
  options: string[];
  answer: string;
}

// QUESTION COMPONENT
@Component({
  selector: 'app-question',
  standalone: true,

  template: `
    <div class="question-box">
      <h2>{{ question().question }}</h2>

      <div class="options">
        @for (option of question().options; track option) {
          <button
            type="button"
            [class.selected]="selectedAnswer === option"
            (click)="selectAnswer(option)">
            {{ option }}
          </button>
        }
      </div>

      <button
        type="button"
        class="submit-btn"
        [disabled]="!selectedAnswer"
        (click)="submitAnswer()">
        Submit Answer
      </button>
    </div>
  `,

  styles: [`
    .question-box h2 {
      color: #222;
      margin-bottom: 20px;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .options button {
      padding: 15px;
      text-align: left;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }

    .options button:hover {
      border-color: #6366f1;
      background: #f5f5ff;
    }

    .options button.selected {
      background: #6366f1;
      color: white;
      border-color: #6366f1;
    }

    .submit-btn {
      width: 100%;
      padding: 14px;
      margin-top: 25px;
      border: none;
      border-radius: 8px;
      background: #6366f1;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }

    .submit-btn:disabled {
      background: #aaa;
      cursor: not-allowed;
    }
  `]
})
export class QuestionComponent {
  question = input.required<Question>();
  answerSelected = output<string>();

  selectedAnswer = '';

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
  }

  submitAnswer() {
    if (!this.selectedAnswer) return;

    this.answerSelected.emit(this.selectedAnswer);
    this.selectedAnswer = '';
  }
}


// MAIN APP COMPONENT
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuestionComponent],

  template: `
    <div class="quiz-container">

      @if (showWelcomePage) {
        <div class="welcome-page">
          <h1>INTERACTIVE QUIZ</h1>

          <p>Welcome! Ready to test your knowledge?</p>

          <button
            type="button"
            class="start-btn"
            (click)="startQuiz()">
            Start Quiz
          </button>
        </div>
      } @else {

        <div class="menu">
          <button
            type="button"
            class="menu-btn"
            (click)="showMenu = !showMenu">
            ☰ Menu
          </button>

          @if (showMenu) {
            <div class="menu-list">
              @for (language of languages; track language) {
                <button
                  type="button"
                  [class.active]="selectedLanguage === language"
                  (click)="selectLanguage(language)">
                  {{ language }}
                </button>
              }
            </div>
          }
        </div>

        <h1>{{ selectedLanguage }} Quiz</h1>

        @if (loading) {
          <div class="loading">
            <div class="spinner"></div>
            <h2>Loading questions...</h2>
            <p>Please wait while questions are loading.</p>
          </div>
        } @else if (errorMessage) {
          <p class="error">{{ errorMessage }}</p>

          <button
            type="button"
            class="restart-btn"
            (click)="selectLanguage(selectedLanguage)">
            Try Again
          </button>
        } @else if (questions.length === 0) {
          <p class="message">
            No questions available for {{ selectedLanguage }}.
          </p>
        } @else if (!quizFinished) {

          <p class="progress">
            Question {{ currentQuestion + 1 }}
            of {{ questions.length }}
          </p>

          <div class="progress-bar">
            <div
              class="progress-fill"
              [style.width.%]="progressPercentage">
            </div>
          </div>

          <app-question
            [question]="questions[currentQuestion]"
            (answerSelected)="submitAnswer($event)">
          </app-question>

        } @else {

          <div class="results">
            <h1>Quiz Completed!</h1>

            <div class="score">
              <h2>{{ score }} / {{ questions.length }}</h2>
              <p>Your Score</p>
              <p>Percentage: {{ percentage }}%</p>
            </div>

            <h2>Results Breakdown</h2>

            @for (question of questions; track $index; let i = $index) {
              <div class="result-item">
                <h3>{{ i + 1 }}. {{ question.question }}</h3>

                <p>
                  Your Answer:
                  <strong>{{ userAnswers[i] || 'Not answered' }}</strong>
                </p>

                <p>
                  Correct Answer:
                  <strong>{{ question.answer }}</strong>
                </p>

                @if (
                  userAnswers[i]?.trim()?.toLowerCase() ===
                  question.answer.trim().toLowerCase()
                ) {
                  <p class="correct">✓ Correct</p>
                } @else {
                  <p class="wrong">✗ Wrong</p>
                }
              </div>
            }

            <button
              type="button"
              class="restart-btn"
              (click)="restartQuiz()">
              Restart Quiz
            </button>
          </div>
        }
      }
    </div>
  `,

  styles: [`
    * {
      box-sizing: border-box;
    }

    :host {
      display: block;
      min-height: 100vh;
      background: #eef0ff;
      padding: 1px;
      font-family: Arial, sans-serif;
    }

    .quiz-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 30px;
      background: #f8f9ff;
      border-radius: 15px;
    }

    .menu {
      position: relative;
      margin-bottom: 20px;
    }

    .menu-btn {
      padding: 10px 18px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }

    .menu-list {
      position: absolute;
      top: 45px;
      left: 0;
      min-width: 140px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 8px;
      z-index: 10;
      box-shadow: 0 4px 12px #00000015;
    }

    .menu-list button {
      display: block;
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background: white;
      text-align: left;
      cursor: pointer;
    }

    .menu-list button:hover,
    .menu-list button.active {
      background: #eef0ff;
      color: #4f46e5;
    }

    h1 {
      text-align: center;
      color: #222;
    }

    .welcome-page {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      margin-top: 30px;
    }

    .welcome-page h1 {
      color: #6366f1;
      font-size: 32px;
    }

    .welcome-page p {
      color: #555;
      font-size: 18px;
      margin: 20px 0;
    }

    .start-btn {
      padding: 14px 28px;
      border: none;
      border-radius: 8px;
      background: #6366f1;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }

    .start-btn:hover {
      background: #4f46e5;
    }

    .loading {
      text-align: center;
      padding: 45px 20px;
      color: #6366f1;
    }

    .loading h2 {
      margin-top: 20px;
    }

    .loading p {
      color: #555;
    }

    .spinner {
      width: 42px;
      height: 42px;
      margin: auto;
      border: 5px solid #ddd;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .progress {
      text-align: center;
      color: #666;
      font-size: 16px;
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background: #ddd;
      border-radius: 10px;
      margin: 20px 0 30px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #6366f1;
      transition: width 0.3s;
    }

    .results {
      background: white;
      padding: 30px;
      border-radius: 12px;
    }

    .score {
      text-align: center;
      background: #f1f2ff;
      padding: 20px;
      margin: 25px 0;
      border-radius: 10px;
    }

    .score h2 {
      font-size: 40px;
      margin: 0;
      color: #6366f1;
    }

    .result-item {
      border: 1px solid #ddd;
      padding: 18px;
      margin: 15px 0;
      border-radius: 8px;
      background: white;
      overflow-wrap: anywhere;
    }

    .result-item h3 {
      margin-top: 0;
    }

    .correct {
      color: green;
      font-weight: bold;
    }

    .wrong,
    .error {
      color: #dc2626;
      font-weight: bold;
    }

    .message {
      text-align: center;
      padding: 20px;
    }

    .restart-btn {
      width: 100%;
      padding: 14px;
      margin-top: 20px;
      border: none;
      border-radius: 8px;
      background: #6366f1;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }

    .restart-btn:hover {
      background: #4f46e5;
    }

    @media (max-width: 600px) {
      .quiz-container {
        margin: 20px 10px;
        padding: 20px;
      }

      h1 {
        font-size: 24px;
      }

      .question-box h2 {
        font-size: 20px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);

  languages = ['C', 'C++', 'Java', 'Angular'];

  selectedLanguage = 'Angular';

  showMenu = false;
  showWelcomePage = true;
  loading = false;
  errorMessage = '';

  currentQuestion = 0;
  score = 0;
  quizFinished = false;

  userAnswers: string[] = [];
  questions: Question[] = [];

  private questionCache: Record<string, Question[]> = {};

  ngOnInit() {
    // Welcome page appears first.
  }

  startQuiz() {
    this.showWelcomePage = false;
    this.selectLanguage(this.selectedLanguage);
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
    this.showMenu = false;
    this.showWelcomePage = false;

    this.errorMessage = '';
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = [];
    this.quizFinished = false;

    // Use cached questions when available.
    const cachedQuestions = this.questionCache[language];

    if (cachedQuestions) {
      this.questions = cachedQuestions;
      this.loading = false;
      return;
    }

    this.questions = [];
    this.loading = true;

    // CORRECTED RENDER BACKEND URL
    const url =
      `https://interactive-quiz-backend-7etv.onrender.com/questions?category=${encodeURIComponent(language)}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.questions = data.map((q) => ({
          question: q.question,
          options: [
            q.option1,
            q.option2,
            q.option3,
            q.option4
          ],
          answer: q.answer
        }));

        this.questionCache[language] = this.questions;
        this.loading = false;
      },

      error: (err) => {
        console.error('Failed to load questions:', err);

        this.questions = [];
        this.errorMessage =
          'Unable to load questions. Please try again.';

        this.loading = false;
      }
    });
  }

  submitAnswer(answer: string) {
    const question = this.questions[this.currentQuestion];

    if (!question) return;

    this.userAnswers[this.currentQuestion] = answer;

    if (
      answer.trim().toLowerCase() ===
      question.answer.trim().toLowerCase()
    ) {
      this.score++;
    }

    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    } else {
      this.quizFinished = true;
    }
  }

  get progressPercentage(): number {
    return this.questions.length
      ? ((this.currentQuestion + 1) / this.questions.length) * 100
      : 0;
  }

  get percentage(): number {
    return this.questions.length
      ? Math.round((this.score / this.questions.length) * 100)
      : 0;
  }

  restartQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = [];
    this.quizFinished = false;
  }
}
