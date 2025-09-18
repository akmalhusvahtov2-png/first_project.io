const name = document.getElementById("name");

const userName = localStorage.getItem('name');

name.innerHTML = userName;

const imageForm = document.getElementById("imageForm");

const searchForm = document.getElementById("searchForm");

const userImg = document.getElementById("userImg");

// if (localStorage.length != 0) 
// else name.innerHTML = "Гость"

let error = '';

// Получаем кнопку удаления аккаунта
const deleteUserButton = document.getElementById("deleteUserButton");
// Получаем панель удаления аккаунта
const deletePanel = document.getElementById("deletePanel");
// Получаем кнопку отмены удаления аккаунта
const buttonCancelDelete = document.getElementById("buttonCancelDelete");

// Получаем кнопку обновления данных аккаунта
const updateUserButton = document.getElementById("updateUserButton");
// Получаем панель обновления данных аккаунта
const updatePanel = document.getElementById("updatePanel");
// Получаем кнопку отмены изменения данных аккаунта
const buttonCancelUpdate = document.getElementById("buttonCancelUpdate");

//
const nameInput = document.getElementById("nameInput");
// nameInput.value = localStorage.getItem("name");

// Получаем серый полу-прозрачный блок
const greyScreen = document.getElementById("greyScreen");

// Установка фото профиля из локалсторэджа
if (localStorage.length == 2)
{
    userImg.src = localStorage.userImage;
}

// Функция, вызывающая окно для удаления аккаунта
const deletePanelOn = () => {
    deletePanel.hidden = false;
    greyScreen.hidden = false;
}

// Функция, отменяющая удаления аккаунта
const deleteCancel = () => {
    deletePanel.hidden = true;
    greyScreen.hidden = true;
    document.getElementById('error').style.opacity = 0;
}

// Функция, вызывающая окно для изменения данных аккаунта
const updatePanelOn = () => {
    updatePanel.hidden = false;
    greyScreen.hidden = false;
}

// Функция, отменяющая изменения данных аккаунта
const updateCancel = () => {
    updatePanel.hidden = true;
    greyScreen.hidden = true;
    document.getElementById('error').style.opacity = 0;
} 

// Вызов функции появления окна для удаления аккаунта при нажатии на кнопку удаления акканута
deleteUserButton.addEventListener("click", deletePanelOn);

// Вызов функции отмены удаления аккаунта
buttonCancelDelete.addEventListener("click", deleteCancel);

// Вызов функции появления окна для изменения данных аккаунта при нажатии на кнопку изменения акканута
updateUserButton.addEventListener("click", updatePanelOn);

// Вызов функции отмены изменений аккаунта
buttonCancelUpdate.addEventListener("click", updateCancel);

// Отслеживание выбора файла
    document.querySelectorAll('#inputFile input[type=file]').forEach(input => {
        input.addEventListener('change', function() {
            let file = this.files[0];
            this.nextElementSibling.textContent = file.name;
        });
    });

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const searchName = searchForm.searchInput.value;

        try
        {
            const response = await fetch("/search", { 
              method: "POST", 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ searchName: searchName })
            });

            if (response.ok)
            {
                // получаем присланный объект в формате json
                const data = await response.json();

                if (data.successful)
                {
                    console.log(data.searchedUser);
                    window.location.href = `/search/${data.searchedUser}`;
                }
                else {
                    window.location.href = "/fail_search.html";
                }
            }
        }
        catch (error)
        {
            console.error(error);
        }

})

imageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(imageForm);

    formData.append('name', localStorage.getItem('name'));

    try
    {
        const response = await fetch("/image", { 
              method: "POST", 
              body: formData
        });

        if (response.ok)
        {
            const image = await response.json();

            let userImgName = '/images/' + image.fileName;
            userImg.src = userImgName;
            localStorage.setItem('userImage', userImgName);
        }
        else
        {
            console.error(error);
        }
    }
    catch (error) {
        console.error("Ошибка", error);
        alert("Сетевая ошибка :(");
    }

    

});
