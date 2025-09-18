// Получаем форму удаления аккаунта
const deleteForm = document.getElementById("deleteForm");

const inputDelete = document.getElementById("inputDelete");

const buttonDelete = document.getElementById("buttonDelete");


const deleteDisabledOff = () => {
    buttonDelete.disabled = false;
}

inputDelete.addEventListener("keypress", deleteDisabledOff);

deleteForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const chekPasswordForDelete = deleteForm.inputDelete.value;
    
    var error = '';

    if(error != '') {
        document.getElementById('error').innerHTML = error;
        document.getElementById('error').style.opacity = 1;
    } else {
        const response = await fetch("/user_delete", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: userName, password: chekPasswordForDelete })
        })

        const successfulOfDelete = await response.json();

        if (successfulOfDelete.successful)
        {
            localStorage.clear();
            window.location.href = "/success_delete.html"
        }
        else
        {
            console.log(successfulOfDelete.error);
            document.getElementById('error').style.opacity = 1;
            document.getElementById('error').innerHTML = successfulOfDelete.error;
        }
    }

    

    

})