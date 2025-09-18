const joinForm = document.getElementById("joinForm");

joinForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    let error = '';

    if(error != '') {
        document.getElementById('error').innerHTML = error;
        document.getElementById('error').style.opacity = 1;
    } else {
        const response = await fetch("/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, password: password })
        });

        const successfulOfJoin = await response.json();

        if (successfulOfJoin.successful)
        {
            localStorage.setItem('name', successfulOfJoin.name)
            window.location.href = "/";
        }
        else 
        {
            document.getElementById('error').style.opacity = 1;
            document.getElementById('error').innerHTML = successfulOfJoin.error;
        }

    }

})

