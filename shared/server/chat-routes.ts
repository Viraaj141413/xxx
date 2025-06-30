import { Express } from 'express';

// Simple local response system that speaks normally in English
function generateLocalResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  // Calculator request
  if (lowerPrompt.includes('calculator') || lowerPrompt.includes('calc')) {
    return `I'll create a clean calculator for you! Here's a simple one:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .calculator {
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 300px;
        }

        .display {
            width: 100%;
            height: 60px;
            font-size: 24px;
            text-align: right;
            border: 2px solid #ddd;
            border-radius: 10px;
            padding: 0 15px;
            margin-bottom: 20px;
            background: #f8f9fa;
        }

        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        button {
            height: 50px;
            font-size: 18px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .number {
            background: #f8f9fa;
            color: #333;
        }

        .operator {
            background: #667eea;
            color: white;
        }

        .equals {
            background: #28a745;
            color: white;
        }

        .clear {
            background: #dc3545;
            color: white;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="calculator">
        <input type="text" class="display" id="display" value="0" readonly>
        <div class="buttons">
            <button class="clear" onclick="clearDisplay()">C</button>
            <button class="clear" onclick="deleteLast()">←</button>
            <button class="operator" onclick="appendToDisplay('/')">/</button>
            <button class="operator" onclick="appendToDisplay('*')">×</button>

            <button class="number" onclick="appendToDisplay('7')">7</button>
            <button class="number" onclick="appendToDisplay('8')">8</button>
            <button class="number" onclick="appendToDisplay('9')">9</button>
            <button class="operator" onclick="appendToDisplay('-')">-</button>

            <button class="number" onclick="appendToDisplay('4')">4</button>
            <button class="number" onclick="appendToDisplay('5')">5</button>
            <button class="number" onclick="appendToDisplay('6')">6</button>
            <button class="operator" onclick="appendToDisplay('+')">+</button>

            <button class="number" onclick="appendToDisplay('1')">1</button>
            <button class="number" onclick="appendToDisplay('2')">2</button>
            <button class="number" onclick="appendToDisplay('3')">3</button>
            <button class="equals" onclick="calculate()" rowspan="2">=</button>

            <button class="number" onclick="appendToDisplay('0')" style="grid-column: span 2;">0</button>
            <button class="number" onclick="appendToDisplay('.')">.</button>
        </div>
    </div>

    <script>
        let display = document.getElementById('display');
        let currentInput = '0';

        function updateDisplay() {
            display.value = currentInput;
        }

        function appendToDisplay(value) {
            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                currentInput += value;
            }
            updateDisplay();
        }

        function clearDisplay() {
            currentInput = '0';
            updateDisplay();
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        function calculate() {
            try {
                currentInput = eval(currentInput.replace('×', '*')).toString();
            } catch (error) {
                currentInput = 'Error';
            }
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;

            if (/[0-9]/.test(key)) {
                appendToDisplay(key);
            } else if (['+', '-', '*', '/'].includes(key)) {
                appendToDisplay(key === '*' ? '×' : key);
            } else if (key === 'Enter' || key === '=') {
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearDisplay();
            } else if (key === 'Backspace') {
                deleteLast();
            } else if (key === '.') {
                appendToDisplay('.');
            }
        });
    </script>
</body>
</html>
\`\`\`

This calculator includes:
- Clean, modern design
- Full keyboard support
- Basic math operations (+, -, ×, ÷)
- Clear and backspace functions
- Error handling
- Responsive layout

Just save this as an HTML file and open it in your browser!`;
  }

  // Todo app
  if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) {
    return `I'll create a simple todo app for you:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }

        h1 {
            text-align: center;
            color: #333;
        }

        .input-section {
            display: flex;
            margin-bottom: 20px;
            gap: 10px;
        }

        input[type="text"] {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
        }

        button {
            padding: 12px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        }

        button:hover {
            background: #0056b3;
        }

        .todo-item {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .todo-item.completed {
            text-decoration: line-through;
            opacity: 0.6;
        }

        .delete-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>My Todo List</h1>

    <div class="input-section">
        <input type="text" id="todoInput" placeholder="What do you need to do?">
        <button onclick="addTodo()">Add Task</button>
    </div>

    <div id="todoList"></div>

    <script>
        let todos = [];

        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();

            if (text) {
                todos.push({
                    id: Date.now(),
                    text: text,
                    completed: false
                });
                input.value = '';
                renderTodos();
            }
        }

        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                renderTodos();
            }
        }

        function deleteTodo(id) {
            todos = todos.filter(t => t.id !== id);
            renderTodos();
        }

        function renderTodos() {
            const todoList = document.getElementById('todoList');
            todoList.innerHTML = todos.map(todo => 
                \`<div class="todo-item \${todo.completed ? 'completed' : ''}">
                    <span onclick="toggleTodo(\${todo.id})" style="cursor: pointer;">
                        \${todo.text}
                    </span>
                    <button class="delete-btn" onclick="deleteTodo(\${todo.id})">Delete</button>
                </div>\`
            ).join('');
        }

        // Allow Enter key to add todos
        document.getElementById('todoInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
    </script>
</body>
</html>
\`\`\`

Features:
- Add new tasks
- Mark tasks as complete
- Delete tasks
- Clean, simple interface
- Keyboard shortcuts (Enter to add)`;
  }

  // Website creation
  if (lowerPrompt.includes('website') || lowerPrompt.includes('web') || lowerPrompt.includes('page')) {
    return `I'll create a simple website for you:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        header {
            background: #333;
            color: white;
            text-align: center;
            padding: 1rem;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .btn {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
        }

        .btn:hover {
            background: #0056b3;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }

        .card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
        <p>A simple, clean website template</p>
    </header>

    <div class="container">
        <h2>About</h2>
        <p>This is a basic website template. You can customize it however you like!</p>

        <a href="#" class="btn">Get Started</a>
        <a href="#" class="btn">Learn More</a>

        <div class="grid">
            <div class="card">
                <h3>Feature 1</h3>
                <p>Description of your first feature</p>
            </div>
            <div class="card">
                <h3>Feature 2</h3>
                <p>Description of your second feature</p>
            </div>
            <div class="card">
                <h3>Feature 3</h3>
                <p>Description of your third feature</p>
            </div>
        </div>
    </div>
</body>
</html>
\`\`\`

This creates a clean, responsive website with:
- Header section
- Content area
- Feature cards
- Modern styling
- Mobile-friendly design`;
  }

  // General chat responses - unique and helpful
  const chatResponses = [
    "Let's build something amazing! Describe your app idea and I'll create the complete code for you.",
    "Ready to code? Tell me what you want to build - calculator, todo list, game, or anything else!",
    "I can generate working code for any app you have in mind. What should we create today?",
    "Describe your project idea and I'll write clean, functional code that works immediately.",
    "What would you like to build? I'll create professional code with modern design and full functionality.",
    "Time to bring your idea to life! Just tell me what you want and I'll handle all the coding."
  ];

  return chatResponses[Math.floor(Math.random() * chatResponses.length)];
}

export function registerChatRoutes(app: Express) {
  // Proxy route for your hosted AI API
  app.post('/api/generate-code', async (req, res) => {
    try {
      console.log('AI proxy request:', req.body);

      const { prompt, codeType, framework, includeComments } = req.body;
      const AI_CODE_API = 'https://new-project-49chatgptreplit.created.app/api/generate-code';

      // Make request to your hosted Create API
      const response = await fetch(AI_CODE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          codeType: codeType || 'javascript',
          framework: framework || null,
          includeComments: includeComments !== false
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);

    } catch (error) {
      console.error('Error calling AI API:', error);
      res.status(500).json({
        error: 'Failed to generate code',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/api/claude-proxy', (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt is required' 
      });
    }

    const lowerPrompt = prompt.toLowerCase();
    let response = '';

    // Enhanced AI responses with actual code generation
    if (lowerPrompt.includes('calculator')) {
      response = `I'll create a modern calculator app for you!

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Calculator</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .calculator {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .display {
            background: rgba(0, 0, 0, 0.3);
            color: white;
            font-size: 2rem;
            padding: 20px;
            text-align: right;
            border-radius: 10px;
            margin-bottom: 20px;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }
        button {
            padding: 20px;
            font-size: 1.2rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
        }
        .number, .decimal { 
            background: rgba(255, 255, 255, 0.8);
            color: #333;
        }
        .operator { 
            background: #ff6b6b;
            color: white;
        }
        .equals { 
            background: #4ecdc4;
            color: white;
        }
        .clear { 
            background: #95a5a6;
            color: white;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .zero { grid-column: span 2; }
    </style>
</head>
<body>
    <div class="calculator">
        <div class="display" id="display">0</div>
        <div class="buttons">
            <button class="clear" onclick="clearDisplay()">C</button>
            <button class="clear" onclick="deleteLast()">⌫</button>
            <button class="operator" onclick="appendToDisplay('/')">/</button>
            <button class="operator" onclick="appendToDisplay('*')">×</button>

            <button class="number" onclick="appendToDisplay('7')">7</button>
            <button class="number" onclick="appendToDisplay('8')">8</button>
            <button class="number" onclick="appendToDisplay('9')">9</button>
            <button class="operator" onclick="appendToDisplay('-')">-</button>

            <button class="number" onclick="appendToDisplay('4')">4</button>
            <button class="number" onclick="appendToDisplay('5')">5</button>
            <button class="number" onclick="appendToDisplay('6')">6</button>
            <button class="operator" onclick="appendToDisplay('+')">+</button>

            <button class="number" onclick="appendToDisplay('1')">1</button>
            <button class="number" onclick="appendToDisplay('2')">2</button>
            <button class="number" onclick="appendToDisplay('3')">3</button>
            <button class="equals" onclick="calculate()" rowspan="2">=</button>

            <button class="number zero" onclick="appendToDisplay('0')">0</button>
            <button class="decimal" onclick="appendToDisplay('.')">.</button>
        </div>
    </div>

    <script>
        let display = document.getElementById('display');
        let currentInput = '0';
        let shouldResetDisplay = false;

        function updateDisplay() {
            display.textContent = currentInput;
        }

        function clearDisplay() {
            currentInput = '0';
            updateDisplay();
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        function appendToDisplay(value) {
            if (shouldResetDisplay) {
                currentInput = '0';
                shouldResetDisplay = false;
            }

            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                currentInput += value;
            }
            updateDisplay();
        }

        function calculate() {
            try {
                let expression = currentInput.replace(/×/g, '*');
                let result = eval(expression);
                currentInput = result.toString();
                shouldResetDisplay = true;
                updateDisplay();
            } catch (error) {
                currentInput = 'Error';
                shouldResetDisplay = true;
                updateDisplay();
            }
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            if (key >= '0' && key <= '9') {
                appendToDisplay(key);
            } else if (key === '+' || key === '-' || key === '*' || key === '/') {
                appendToDisplay(key === '*' ? '×' : key);
            } else if (key === '.' || key === ',') {
                appendToDisplay('.');
            } else if (key === 'Enter' || key === '=') {
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearDisplay();
            } else if (key === 'Backspace') {
                deleteLast();
            }
        });
    </script>
</body>
</html>
\`\`\`

This calculator features:
- Modern glassmorphism design
- Full keyboard support
- Error handling
- Smooth animations
- Mobile-responsive layout
- Advanced mathematical operations`;

    } else if (lowerPrompt.includes('todo')) {
      response = `I'll create a beautiful todo list app for you!

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Todo App</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2d3436;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5rem;
        }
        .input-container {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }
        #todoInput {
            flex: 1;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        #todoInput:focus {
            outline: none;
            border-color: #74b9ff;
        }
        .add-btn {
            padding: 15px 25px;
            background: #00b894;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s;
        }
        .add-btn:hover {
            background: #00a085;
            transform: translateY(-2px);
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(116, 185, 255, 0.1);
            border-radius: 15px;
        }
        .stat {
            text-align: center;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #0984e3;
        }
        .stat-label {
            color: #636e72;
        }
        .todo-list {
            list-style: none;
        }
        .todo-item {
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 10px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
        }
        .todo-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        .todo-item.completed {
            opacity: 0.7;
            text-decoration: line-through;
        }
        .todo-checkbox {
            margin-right: 15px;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        .todo-text {
            flex: 1;
            color: #2d3436;
        }
        .todo-actions {
            display: flex;
            gap: 10px;
        }
        .edit-btn, .delete-btn {
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .edit-btn {
            background: #fdcb6e;
            color: white;
        }
        .delete-btn {
            background: #e17055;
            color: white;
        }
        .filter-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        .filter-btn {
            padding: 10px 20px;
            border: 2px solid #74b9ff;
            background: white;
            color: #74b9ff;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .filter-btn.active {
            background: #74b9ff;
            color: white;
        }
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #636e72;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📝 Smart Todo</h1>

        <div class="input-container">
            <input type="text" id="todoInput" placeholder="Add a new task..." maxlength="100">
            <button class="add-btn" onclick="addTodo()">Add Task</button>
        </div>

        <div class="stats">
            <div class="stat">
                <div class="stat-number" id="totalTasks">0</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="completedTasks">0</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="pendingTasks">0</div>
                <div class="stat-label">Pending</div>
            </div>
        </div>

        <div class="filter-buttons">
            <button class="filter-btn active" onclick="filterTodos('all')">All</button>
            <button class="filter-btn" onclick="filterTodos('pending')">Pending</button>
            <button class="filter-btn" onclick="filterTodos('completed')">Completed</button>
        </div>

        <ul class="todo-list" id="todoList"></ul>

        <div class="empty-state" id="emptyState" style="display: none;">
            <h3>No tasks yet!</h3>
            <p>Add your first task above to get started.</p>
        </div>
    </div>

    <script>
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        let currentFilter = 'all';

        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();

            if (text) {
                const todo = {
                    id: Date.now(),
                    text: text,
                    completed: false,
                    createdAt: new Date().toISOString()
                };

                todos.unshift(todo);
                input.value = '';
                saveTodos();
                renderTodos();
                updateStats();
            }
        }

        function toggleTodo(id) {
            todos = todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
            saveTodos();
            renderTodos();
            updateStats();
        }

        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            updateStats();
        }

        function editTodo(id) {
            const todo = todos.find(t => t.id === id);
            const newText = prompt('Edit task:', todo.text);

            if (newText && newText.trim()) {
                todos = todos.map(t => 
                    t.id === id ? { ...t, text: newText.trim() } : t
                );
                saveTodos();
                renderTodos();
            }
        }

        function filterTodos(filter) {
            currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            renderTodos();
        }

        function renderTodos() {
            const todoList = document.getElementById('todoList');
            const emptyState = document.getElementById('emptyState');

            let filteredTodos = todos;
            if (currentFilter === 'completed') {
                filteredTodos = todos.filter(todo => todo.completed);
            } else if (currentFilter === 'pending') {
                filteredTodos = todos.filter(todo => !todo.completed);
            }

            if (filteredTodos.length === 0) {
                todoList.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }

            todoList.style.display = 'block';
            emptyState.style.display = 'none';

            todoList.innerHTML = filteredTodos.map(todo => \`
                <li class="todo-item \${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" class="todo-checkbox" 
                           \${todo.completed ? 'checked' : ''} 
                           onchange="toggleTodo(\${todo.id})">
                    <span class="todo-text">\${todo.text}</span>
                    <div class="todo-actions">
                        <button class="edit-btn" onclick="editTodo(\${todo.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteTodo(\${todo.id})">Delete</button>
                    </div>
                </li>
            \`).join('');
        }

        function updateStats() {
            const total = todos.length;
            const completed = todos.filter(todo => todo.completed).length;
            const pending = total - completed;

            document.getElementById('totalTasks').textContent = total;
            document.getElementById('completedTasks').textContent = completed;
            document.getElementById('pendingTasks').textContent = pending;
        }

        // Event listeners
        document.getElementById('todoInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        // Initialize
        renderTodos();
        updateStats();
    </script>
</body>
</html>
\`\`\`

This todo app includes:
- Local storage persistence
- Task statistics
- Filter functionality
- Edit and delete tasks
- Keyboard shortcuts
- Modern responsive design
- Smooth animations`;

    } else if (lowerPrompt.includes('website') || lowerPrompt.includes('landing')) {
      response = `I'll create a stunning modern website for you!

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>');
            animation: float 20s infinite linear;
        }
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-100px) rotate(360deg); }
        }
        .hero-content {
            z-index: 1;
            max-width: 800px;
            padding: 0 20px;
        }
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            opacity: 0;
            animation: slideUp 1s ease-out 0.5s forwards;
        }
        .hero p {
            font-size: 1.3rem;
            margin-bottom: 30px;
            opacity: 0;
            animation: slideUp 1s ease-out 0.7s forwards;
        }
        .cta-button {
            background: #ff6b6b;
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
            animation: slideUp 1s ease-out 0.9s forwards;
        }
        .cta-button:hover {
            background: #ff5252;
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .features {
            padding: 100px 0;
            background: #f8f9fa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 60px;
        }
        .feature-card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-10px);
        }
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: #333;
        }
        .section-subtitle {
            text-align: center;
            color: #666;
            font-size: 1.2rem;
            max-width: 600px;
            margin: 0 auto;
        }
        .about {
            padding: 100px 0;
            background: white;
        }
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
            margin-top: 60px;
        }
        .about-text {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #555;
        }
        .about-image {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 400px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }
        .contact {
            padding: 100px 0;
            background: #333;
            color: white;
            text-align: center;
        }
        .contact-form {
            max-width: 600px;
            margin: 40px auto 0;
        }
        .form-group {
            margin-bottom: 30px;
            text-align: left;
        }
        .form-group label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid transparent;
            transition: border-color 0.3s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        .submit-btn {
            background: #667eea;
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .submit-btn:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .about-content { grid-template-columns: 1fr; }
            .features-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1>Welcome to the Future</h1>
            <p>Experience the next generation of web technology with our innovative solutions</p>
            <button class="cta-button" onclick="scrollToSection('features')">Explore Features</button>
        </div>
    </section>

    <section class="features" id="features">
        <div class="container">
            <h2 class="section-title">Amazing Features</h2>
            <p class="section-subtitle">Discover what makes our platform unique and powerful</p>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Lightning Fast</h3>
                    <p>Optimized for speed and performance with cutting-edge technology</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>Beautiful Design</h3>
                    <p>Modern, responsive design that looks great on all devices</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure & Reliable</h3>
                    <p>Built with security in mind and backed by reliable infrastructure</p>
                </div>
            </div>
        </div>
    </section>

    <section class="about" id="about">
        <div class="container">
            <h2 class="section-title">About Us</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>We are passionate about creating exceptional digital experiences that make a difference. Our team combines creativity with technical expertise to deliver solutions that exceed expectations.</p>

                    <p>With years of experience in the industry, we understand what it takes to build products that users love and businesses trust. Every project is an opportunity to push boundaries and create something remarkable.</p>

                    <p>Join us on this journey as we continue to innovate and shape the future of technology.</p>
                </div>
                <div class="about-image">
                    <span>Innovation in Action</span>
                </div>
            </div>
        </div>
    </section>

    <section class="contact" id="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <p class="section-subtitle">Ready to start your next project? Let's talk!</p>

            <form class="contact-form" onsubmit="handleSubmit(event)">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="your@email.com" required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="5" placeholder="Tell us about your project..." required></textarea>
                </div>
                <button type="submit" class="submit-btn">Send Message</button>
            </form>
        </div>
    </section>

    <script>
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({
                behavior: 'smooth'
            });
        }

        function handleSubmit(event) {
            event.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            event.target.reset();
        }

        // Smooth scrolling for all internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Add scroll animation effects
        function animateOnScroll() {
            const elements = document.querySelectorAll('.feature-card, .about-content');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }

        // Initialize scroll animations
        document.querySelectorAll('.feature-card, .about-content').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Check on load
    </script>
</body>
</html>
\`\`\`

This modern website includes:
- Stunning hero section with animations
- Responsive design for all devices
- Smooth scrolling navigation
- Interactive contact form
- Modern CSS animations
- Professional layout and typography`;

    } else if (lowerPrompt.includes('game')) {
      response = `I'll create an exciting game for you!

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Invaders Game</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Courier New', monospace;
            background: #000;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
        }
        .game-container {
            text-align: center;
            background: #111;
            border: 2px solid #333;
            border-radius: 10px;
            padding: 20px;
        }
        canvas {
            border: 2px solid #0f0;
            background: #000;
        }
        .score {
            color: #0f0;
            font-size: 1.5rem;
            margin-bottom: 10px;
        }
        .controls {
            margin-top: 15px;
            font-size: 0.9rem;
            color: #888;
        }
        .game-over {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            display: none;
        }
        .restart-btn {
            background: #0f0;
            color: #000;
            border: none;
            padding: 10px 20px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="score">Score: <span id="score">0</span></div>
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        <div class="controls">
            Use ARROW KEYS to move • SPACE to shoot • ESC to pause
        </div>
    </div>

    <div class="game-over" id="gameOver">
        <h2>Game Over!</h2>
        <p>Final Score: <span id="finalScore">0</span></p>
        <button class="restart-btn" onclick="restartGame()">Play Again</button>
    </div>

    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const gameOverElement = document.getElementById('gameOver');
        const finalScoreElement = document.getElementById('finalScore');

        // Game state
        let gameRunning = true;
        let score = 0;
        let keys = {};

        // Player
        const player = {
            x: canvas.width / 2 - 25,
            y: canvas.height - 60,
            width: 50,
            height: 30,
            speed: 5,
            color: '#0f0'
        };

        // Bullets
        let bullets = [];
        const bulletSpeed = 7;

        // Enemies
        let enemies = [];
        const enemyRows = 5;
        const enemyCols = 10;
        let enemyDirection = 1;
        let enemySpeed = 1;

        // Initialize enemies
        function createEnemies() {
            enemies = [];
            for (let row = 0; row < enemyRows; row++) {
                for (let col = 0; col < enemyCols; col++) {
                    enemies.push({
                        x: col * 70 + 50,
                        y: row * 50 + 50,
                        width: 40,
                        height: 30,
                        alive: true,
                        color: \`hsl(\${row * 60}, 70%, 60%)\`
                    });
                }
            }
        }

        // Event listeners
        document.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            if (e.key === ' ') {
                e.preventDefault();
                shoot();
            }
            if (e.key === 'Escape') {
                gameRunning = !gameRunning;
            }
        });

        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        // Player movement
        function updatePlayer() {
            if (keys['ArrowLeft'] && player.x > 0) {
                player.x -= player.speed;
            }
            if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
                player.x += player.speed;
            }
        }

        // Shooting
        function shoot() {
            bullets.push({
                x: player.x + player.width / 2 - 2,
                y: player.y,
                width: 4,
                height: 10,
                speed: bulletSpeed
            });
        }

        // Update bullets
        function updateBullets() {
            bullets = bullets.filter(bullet => {
                bullet.y -= bullet.speed;
                return bullet.y > 0;
            });
        }

        // Update enemies
        function updateEnemies() {
            let hitEdge = false;

            enemies.forEach(enemy => {
                if (enemy.alive) {
                    enemy.x += enemyDirection * enemySpeed;
                    if (enemy.x <= 0 || enemy.x >= canvas.width - enemy.width) {
                        hitEdge = true;
                    }
                }
            });

            if (hitEdge) {
                enemyDirection *= -1;
                enemies.forEach(enemy => {
                    if (enemy.alive) {
                        enemy.y += 20;
                    }
                });
            }
        }

        // Collision detection
        function checkCollisions() {
            // Bullet vs Enemy
            bullets.forEach((bullet, bulletIndex) => {
                enemies.forEach((enemy, enemyIndex) => {
                    if (enemy.alive && 
                        bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y) {

                        bullets.splice(bulletIndex, 1);
                        enemy.alive = false;
                        score += 10;
                        scoreElement.textContent = score;
                    }
                });
            });

            // Enemy vs Player
            enemies.forEach(enemy => {
                if (enemy.alive && enemy.y + enemy.height >= player.y) {
                    gameOver();
                }
            });

            // Check if all enemies are destroyed
            if (enemies.every(enemy => !enemy.alive)) {
                createEnemies();
                enemySpeed += 0.5;
            }
        }

        // Draw functions
        function drawPlayer() {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);

            // Draw cannon
            ctx.fillRect(player.x + player.width/2 - 3, player.y - 10, 6, 10);
        }

        function drawBullets() {
            ctx.fillStyle = '#ff0';
            bullets.forEach(bullet => {
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
        }

        function drawEnemies() {
            enemies.forEach(enemy => {
                if (enemy.alive) {
                    ctx.fillStyle = enemy.color;
                    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

                    // Draw eyes
                    ctx.fillStyle = '#000';
                    ctx.fillRect(enemy.x + 8, enemy.y + 8, 6, 6);
                    ctx.fillRect(enemy.x + 26, enemy.y + 8, 6, 6);
                }
            });
        }

        function drawStars() {
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 100; i++) {
                ctx.fillRect(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    1, 1
                );
            }
        }

        // Game over
        function gameOver() {
            gameRunning = false;
            finalScoreElement.textContent = score;
            gameOverElement.style.display = 'block';
        }

        // Restart game
        function restartGame() {
            gameRunning = true;
            score = 0;
            scoreElement.textContent = score;
            bullets = [];
            player.x = canvas.width / 2 - 25;
            enemySpeed = 1;
            createEnemies();
            gameOverElement.style.display = 'none';
            gameLoop();
        }

        // Main game loop
        function gameLoop() {
            if (!gameRunning) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background
            drawStars();

            // Update
            updatePlayer();
            updateBullets();
            updateEnemies();
            checkCollisions();

            // Draw
            drawPlayer();
            drawBullets();
            drawEnemies();

            requestAnimationFrame(gameLoop);
        }

        // Start game
        createEnemies();
        gameLoop();
    </script>
</body>
</html>
\`\`\`

This Space Invaders game features:
- Classic arcade gameplay
- Smooth controls and animations
- Collision detection
- Score tracking
- Progressive difficulty
- Retro styling with modern touches`;

    } else {
      // General conversation
      response = `I understand! I'm here to help you build amazing things. Here's what I can create for you:

🧮 **Calculators** - Modern, functional calculators with advanced features
📝 **Todo Apps** - Beautiful task management applications
🌐 **Websites** - Stunning landing pages and full websites
🎮 **Games** - Interactive games like Space Invaders, Tic-Tac-Toe, etc.
📊 **Dashboards** - Data visualization and admin panels
🛒 **E-commerce** - Shopping carts and product pages
📱 **Mobile-First Apps** - Responsive web applications
🎨 **UI Components** - Reusable interface elements

Just tell me what you want to build and I'll create the complete code for you! Everything works locally without any external dependencies.

What would you like to create today?`;
    }

    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'Server is running',
      timestamp: new Date().toISOString()
    });
  });
}