// Получаем кнопку выхода из аккаунта
const leaveFromAccountButton = document.getElementById("leaveFromAccountButton");

// Функция удаления имени пользователя из localStorage и перенаправление его на основную страницу
const leave = () => {
    localStorage.clear();
    window.location.href = "/"
}

// Вызов функции удаления имени пользователя из localStorage и перенаправления его на основную страницу при нажатии на кнопку выхода из аккаунта
leaveFromAccountButton.addEventListener("click", leave);