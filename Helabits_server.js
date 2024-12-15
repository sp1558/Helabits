const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let habits = [];

app.get('/habits', (req, res) => {
    res.json(habits);
});

app.post('/habits', (req, res) => {
    const { name, goal, category } = req.body;
    const newHabit = {
        id: habits.length + 1,
        name,
        goal,
        progress: 0,
        category,
        weekData: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 },
    };
    habits.push(newHabit);
    res.status(201).json(newHabit);
});

app.put('/habits/:id', (req, res) => {
    const { id } = req.params;
    const { day, increment } = req.body;
    const habit = habits.find(h => h.id === parseInt(id));
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    habit.weekData[day] = Math.max(0, (habit.weekData[day] || 0) + (increment ? 1 : -1));
    habit.progress = Object.values(habit.weekData).reduce((a, b) => a + b, 0);
    res.json(habit);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
