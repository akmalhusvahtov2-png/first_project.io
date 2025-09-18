// Получаем форму обновления данных аккаунта
const updateForm = document.getElementById("updateForm");

const inputUpdate = document.getElementById("inputUpdate");

const buttonUpdate = document.getElementById("buttonUpdate");

const updateDisabledOff = () => {
    buttonUpdate.disabled = false;
}

inputUpdate.addEventListener("keypress", updateDisabledOff);

updateForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const chekPasswordForUpdate = updateForm.inputUpdate.value;
    console.log(chekPasswordForUpdate);

    const name = updateForm.nameToUpdate.value;
    const mail = updateForm.mailToUpdate.value;
    const phone = updateForm.phoneToUpdate.value;

    var error = '';

    // if(updateForm.nameToUpdate == '' || mail == '' || phone == '' || chekPasswordForUpdate == '')
    //     error = 'Все поля должны быть заполнены!';
    // else if(updateForm.nameToUpdate.length < 2 || updateForm.nameToUpdate.length > 20) 
    //     error = 'Имя должно быть в пределах 2-20 символов!';
    // else if(mail.split('&').length == 1 & mail.split('.').length == 1)
    //     error = 'В адресе электронной почты должны содержаться символы "@" и "."!';

    if(error != '') {
        document.getElementById('error').innerHTML = error;
        document.getElementById('error').style.opacity = 1;
    } else {

        const response = await fetch("/user_update", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ localStorageName: userName, name: name, mail: mail, phone: phone, password: chekPasswordForUpdate })
        })

        const successfulOfUpdate = await response.json();

        if (successfulOfUpdate.successful === true)
        {
            localStorage.setItem('name', successfulOfUpdate.name);
            window.location.href = "/success_update.html"
        }
        else
        {
            document.getElementById('error').style.opacity = 1;
            document.getElementById('error').innerHTML = successfulOfUpdate.error;
        }

        // document.getElementById('error').style.opacity = 0;
        // document.getElementById('error').innerHTML = '';

    }


    

})