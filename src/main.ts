import { Component, input, output } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

@Component({
  selector: 'app-question',
  standalone: true,
  template: `
    <div class="question-box">

      <h2>{{ question().question }}</h2>

      <div class="options">

        @for (option of question().options; track option) {

          <button
            [class.selected]="selectedAnswer === option"
            (click)="selectAnswer(option)"
          >
            {{ option }}
          </button>

        }

      </div>

      <button
        class="submit-btn"
        [disabled]="!selectedAnswer"
        (click)="submitAnswer()"
      >
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
class QuestionComponent {

  question = input.required<Question>();

  answerSelected = output<string>();

  selectedAnswer = '';

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
  }

  submitAnswer() {

    if (!this.selectedAnswer) {
      return;
    }

    this.answerSelected.emit(this.selectedAnswer);

    this.selectedAnswer = '';
  }
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuestionComponent],

  template: `

    <div class="quiz-container">

      @if (!quizFinished) {

        <h1>ANGULAR INTERACTIVE QUIZ</h1>

        <p class="progress">
          Question {{ currentQuestion + 1 }}
          of
          {{ questions.length }}
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

      }

      @else {

        <div class="results">

          <h1>Quiz Completed!</h1>

          <div class="score">

            <h2>
              {{ score }} / {{ questions.length }}
            </h2>

            <p>Your Score</p>

            <p>
              Percentage:
              {{ percentage }}%
            </p>

          </div>

          <h2>Results Breakdown</h2>

          @for (
            question of questions;
            let i = $index;
            track i
          ) {

            <div class="result-item">

              <h3>
                {{ i + 1 }}. {{ question.question }}
              </h3>

              <p>
                Your Answer:
                <strong>
                  {{ userAnswers[i] }}
                </strong>
              </p>

              <p>
                Correct Answer:
                <strong>
                  {{ question.answer }}
                </strong>
              </p>

              @if (userAnswers[i] === question.answer) {

                <p class="correct">
                  ✓ Correct
                </p>

              }
              @else {

                <p class="wrong">
                  ✗ Wrong
                </p>

              }

            </div>

          }

          <button
            class="restart-btn"
            (click)="restartQuiz()"
          >
            Restart Quiz
          </button>

        </div>

      }

    </div>
  `,

  styles: [`

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
    }

    .quiz-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 30px;
      background: #f8f9ff;
      border-radius: 15px;
    }

    h1 {
      text-align: center;
      color: #222;
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
    }

    .result-item h3 {
      margin-top: 0;
    }

    .correct {
      color: green;
      font-weight: bold;
    }

    .wrong {
      color: red;
      font-weight: bold;
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

  `]
})
class AppComponent {

  currentQuestion = 0;

  score = 0;

  quizFinished = false;

  userAnswers: string[] = [];

  questions: Question[] = [

    // 1 - 5 Variables and Data Type

    {
      question: 'In Angular, which decorator is commonly used to pass data from a parent component to a child component?',
      options: ['@Input()', '@Pipe()', '@Output()', '@Inject()'],
      answer: '@Input()'
    },

    {
      question: 'Which angular button is used to handle a button click?',
      options: ['Class Binding', 'Event binding', 'property binding', 'interpolation'],
      answer: 'Event binding'
    },

    {
      question: 'which angular feature is commonly used for sending an event from a child component to its Parent?',
      options: ['@HostBinding', '@Pipe()', '@Output()', '@Input()'],
      answer: '@Output()'
    },

    
  {
      question: ' What is Angular primarily used for?',
      options: ['Editing images','Creating operating systems','Building web applications','Managing database'],
      answer: 'Building web applications'
    },

 {
      question: 'Which Angular feature is commonly used to share reusable logic or data between components?',
      options:['Service','Selector','Style sheet','Template'],
      answer:'Service'
    },

    
  ];

  submitAnswer(answer: string) {

    this.userAnswers[this.currentQuestion] = answer;

    if (answer === this.questions[this.currentQuestion].answer) {
      this.score++;
    }

    if (this.currentQuestion < this.questions.length - 1) {

      this.currentQuestion++;

    } else {

      this.quizFinished = true;

    }
  }

  get progressPercentage(): number {

    return ((this.currentQuestion + 1) / this.questions.length) * 100;

  }

  get percentage(): number {

    return Math.round(
      (this.score / this.questions.length) * 100
    );

  }

  restartQuiz() {

    this.currentQuestion = 0;

    this.score = 0;

    this.userAnswers = [];

    this.quizFinished = false;

  }

}