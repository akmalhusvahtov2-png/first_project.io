// const { response } = require("express");

// Получение имени из localStorage
const userName = localStorage.getItem('name');

// Получение панели для имени пользоваетля
const userAccountPanel = document.getElementById('userPanel');

// Получение тега изображения для фото профиля
const userImg = document.getElementById("userImg");

// Получение формы отзыва
const responseForm = document.getElementById("responseForm");

// Вставка имени пользователя из localStorage в панель для имени пользователя
if (localStorage.length != 0) userAccountPanel.innerHTML = `Пользователь ${userName}`;
else userAccountPanel.innerHTML = "Гость"

//
// if (localStorage.getItem('userImage')) userImg.src = localStorage.getItem('userImage');

// Функция для перенаправления клиента на страницу пользователя
const hrefUserPage = (id) => {
    window.location.href = `/user_page/${id}`;
}


async function serverData() {

    try {
        if (localStorage.length === 0) return
        // Отправка имени из localStorage на сервер
        const response = await fetch("/first_project.html", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name: userName})
        });

        // Принятие ID пользователя из сервера
        const data = await response.json();
        console.log(data.message);

        if (response.ok)
        {
            // Вызов функции перенаправления клиента на страницу пользователя
            userAccountPanel.addEventListener("click", () => hrefUserPage(data.message));
        }
    }

    catch (error) {
        console.error('Ошибка:', error);
    }
}

//
responseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Получение данных формы
    const responseText = responseForm.responseText.value;
    console.log(responseText);

        try
        {
            const response = await fetch("/response", { 
              method: "POST", 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ responseText: responseText })
            });

            if (response.ok)
            {
                // получаем присланный объект в формате json
                const data = await response.json();

                if (data.successful)
                {
                    console.log(data.searchedUser);
                    window.location.href = "/sent_response";
                    // window.location.href = `/sent_response/${data.searchedUser}`;
                }
                else {
                    window.location.href = "/fail_response.html";
                }
            }
        }
        catch (error)
        {
            console.error(error);
        }

})

// Вызываем функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    serverData();
});


