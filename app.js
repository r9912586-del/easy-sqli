
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database(":memory:");

// база
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER, username TEXT, password TEXT)");

  db.run("INSERT INTO users VALUES (1, 'admin', 'supersecret')");
  db.run("INSERT INTO users VALUES (2, 'user', '1234')");
  db.run("INSERT INTO users VALUES (3, 'guest', 'guest')");
});

// фронт
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// логин
// логин
app.post("/login", (req, res) => {
  let { username, password } = req.body;

  // 🔥 "фильтр" (специально плохой для CTF)
  if (username.includes("root")) {
    return res.send("Nice try 🙂");
  }

  const query = `
    SELECT * FROM users 
    WHERE username = '${username}' 
    AND password = '${password}'
  `;

  console.log("Выполняю запрос:", query);

  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).send("Database error");
    }

    if (!row) {
      return res.send("Invalid username or password");
    }

    // ЛОГИКА ФЛАГА (теперь флаг просто в коде)
    if (row.username === "admin") {
      const MY_FLAG = "CTF{SQL_1nj3ct10n_is_fun_2026}"; 
      return res.send(`🎉 Поздравляю, админ! Твой флаг: OBIS{TIGRRR}`);
    }

    // Ответ для обычного пользователя (не админа)
    res.send(`Привет, ${row.username}! Ты вошел в систему, но флаг доступен только админу.`);
  });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`-----------------------------------------`);
  console.log(`Сервер запущен!`);
  console.log(`Админка доступна тут: http://localhost:${PORT}`);
  console.log(`-----------------------------------------`);
});
