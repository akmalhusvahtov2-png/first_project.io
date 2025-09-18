    // данные для отправки
const myForm = document.getElementById("myForm");
myForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    // данные для отправки
    const name = myForm.name.value;
    const mail = myForm.mail.value;
    const phone = myForm.phone.value;
    const password = myForm.password.value;
    const check_password = myForm.check_password.value;

    var error = '';

    if(name == '' || mail == '' || phone == '' || password == '' || check_password == '')
        error = 'Все поля должны быть заполнены!';
    else if(name.length < 2 || name.length > 20) 
        error = 'Имя должно быть в пределах 2-20 символов!';
    else if(mail.split('&').length == 1 & mail.split('.').length == 1)
        error = 'В адресе электронной почты должны содержаться символы "@" и "."!';
    else if(password.length != 8)
        error = 'Пароль должен содержать 8 символов';
    else if(check_password.length != 8)
        error = 'Повторный пароль должен содержать 8 символов!';
    else if(check_password != password)
        error = 'Пароли должны совпадать!';

    if(error != '') {
        document.getElementById('error').innerHTML = error;
        document.getElementById('error').style.opacity = 1;
    } else {

        try{
            const response = await fetch("/user", { 
              method: "POST", 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({name: name, mail: mail, phone: phone, password: password,})
            });

            if (response.ok)
            {
                // получаем присланный объект в формате json
                const data = await response.json();
                console.log(data.message);

                if(data.successful == true)
                {
                    localStorage.setItem('name', data.name);
                    window.location.href = `/success/${data.message}`;
                } else {
                    window.location.href = "/fail.html";
                }


                document.getElementById('error').style.opacity = 0;
            }
            else
            {
                console.error(error);
            }
        }
        catch (error)
        {
            console.error(error);
        }
        
    }
    // return false;

 
    
});

// async function DeleteUser(id) {
//     const response = await fetch("/api/users/" + id, {
//         method: "DELETE",
//         headers: { "Accept": "application/json" }
//     });
//     if (response.ok === true) {
//         const user = await response.json();
//         document.querySelector(`tr[data-rowid="${user._id}"]`).remove();
//     }
// }