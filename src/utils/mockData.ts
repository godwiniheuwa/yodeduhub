
export const mockQuizzes = [
  {
    id: "quiz1",
    title: "Web Development Basics",
    description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals.",
    category: "tech",
    timeLimit: 15,
    questionsCount: 10,
    attempted: true,
    score: 80,
    attempts: 12,
    averageScore: 75,
  },
  {
    id: "quiz2",
    title: "React Framework Mastery",
    description: "Advanced concepts in React including hooks, context, and state management.",
    category: "tech",
    timeLimit: 20,
    questionsCount: 15,
    attempted: false,
    attempts: 8,
    averageScore: 68,
  },
  {
    id: "quiz3",
    title: "World History: Ancient Civilizations",
    description: "Explore ancient Egypt, Greece, Rome, and Mesopotamia.",
    category: "history",
    timeLimit: 25,
    questionsCount: 20,
    attempted: true,
    score: 65,
    attempts: 15,
    averageScore: 72,
  },
  {
    id: "quiz4",
    title: "Mathematics: Algebra Fundamentals",
    description: "Basic algebra concepts including equations, functions, and graphs.",
    category: "math",
    timeLimit: 30,
    questionsCount: 15,
    attempted: false,
    attempts: 20,
    averageScore: 60,
  },
  {
    id: "quiz5",
    title: "English Literature: Classic Novels",
    description: "Questions about famous authors and their works from the 19th and 20th centuries.",
    category: "language",
    timeLimit: 20,
    questionsCount: 12,
    attempted: true,
    score: 92,
    attempts: 18,
    averageScore: 78,
  },
  {
    id: "quiz6",
    title: "Biology: Human Anatomy",
    description: "Learn about the systems and structures of the human body.",
    category: "science",
    timeLimit: 25,
    questionsCount: 18,
    attempted: false,
    attempts: 14,
    averageScore: 65,
  },
];

export const mockQuestions = [
  {
    id: "q1",
    quizId: "quiz1",
    text: "Which HTML tag is used to define an unordered list?",
    type: "multiple-choice",
    options: [
      { id: "opt1", text: "<ul>" },
      { id: "opt2", text: "<ol>" },
      { id: "opt3", text: "<li>" },
      { id: "opt4", text: "<list>" },
    ],
    correctOptionId: "opt1",
  },
  {
    id: "q2",
    quizId: "quiz1",
    text: "Which CSS property is used to change the text color of an element?",
    type: "multiple-choice",
    options: [
      { id: "opt1", text: "font-color" },
      { id: "opt2", text: "text-color" },
      { id: "opt3", text: "color" },
      { id: "opt4", text: "text-style" },
    ],
    correctOptionId: "opt3",
  },
  {
    id: "q3",
    quizId: "quiz1",
    text: "Which JavaScript function is used to select an HTML element by its id?",
    type: "multiple-choice",
    options: [
      { id: "opt1", text: "querySelector()" },
      { id: "opt2", text: "getElementById()" },
      { id: "opt3", text: "selectElement()" },
      { id: "opt4", text: "findElement()" },
    ],
    correctOptionId: "opt2",
  },
  {
    id: "q4",
    quizId: "quiz1",
    text: "What does CSS stand for?",
    type: "multiple-choice",
    options: [
      { id: "opt1", text: "Cascading Style Sheets" },
      { id: "opt2", text: "Computer Style Sheets" },
      { id: "opt3", text: "Creative Style System" },
      { id: "opt4", text: "Colorful Style Sheets" },
    ],
    correctOptionId: "opt1",
  },
  {
    id: "q5",
    quizId: "quiz1",
    text: "Select all valid ways to declare a variable in JavaScript",
    type: "multi-select",
    options: [
      { id: "opt1", text: "var x = 5;" },
      { id: "opt2", text: "let x = 5;" },
      { id: "opt3", text: "const x = 5;" },
      { id: "opt4", text: "variable x = 5;" },
    ],
    correctOptionIds: ["opt1", "opt2", "opt3"],
  },
  {
    id: "q6",
    quizId: "quiz1",
    text: "Arrange the following HTML elements in the correct nesting order",
    type: "drag-drop",
    options: [
      { id: "opt1", text: "<html>" },
      { id: "opt2", text: "<head>" },
      { id: "opt3", text: "<body>" },
      { id: "opt4", text: "<div>" },
    ],
    correctOrder: ["opt1", "opt2", "opt3", "opt4"],
  },
  {
    id: "q7",
    quizId: "quiz1",
    text: "What property is used to set the background color in CSS?",
    type: "short-answer",
    options: [],
    correctAnswer: "background-color",
  },
  {
    id: "q8",
    quizId: "quiz1",
    text: "What does the 'DOM' stand for in web development?",
    type: "multiple-choice",
    options: [
      { id: "opt1", text: "Document Object Model" },
      { id: "opt2", text: "Data Object Model" },
      { id: "opt3", text: "Document Oriented Markup" },
      { id: "opt4", text: "Digital Ordinance Model" },
    ],
    correctOptionId: "opt1",
  },
  {
    id: "q9",
    quizId: "quiz1",
    text: "What is the correct way to declare a JavaScript variable?",
    type: "multiple-choice",
    options: [
      { id: "opt1", text: "variable x;" },
      { id: "opt2", text: "v x;" },
      { id: "opt3", text: "let x;" },
      { id: "opt4", text: "x = var;" },
    ],
    correctOptionId: "opt3",
  },
  {
    id: "q10",
    quizId: "quiz1",
    text: "Which CSS property is used to add space between elements?",
    type: "multiple-choice",
    options: [
      { id: "opt1", text: "space" },
      { id: "opt2", text: "margin" },
      { id: "opt3", text: "padding" },
      { id: "opt4", text: "gap" },
    ],
    correctOptionId: "opt2",
  },
];

export const mockUserStats = {
  quizzesAttempted: 5,
  quizzesCompleted: 3,
  averageScore: 79,
  timeSpent: "2h 15m",
};

export const mockAdminStats = {
  totalQuizzes: 12,
  totalQuestions: 180,
  activeUsers: 128,
  quizCompletions: 543,
};
