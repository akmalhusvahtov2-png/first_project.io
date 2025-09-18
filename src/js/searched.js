const backButton = document.getElementById("backButton");

const userName = localStorage.getItem('name');

const backButtonForm = document.getElementById("backButtonForm");

backButtonForm.addEventListener("submit", async (e) => {
    e.preventDefault();

        try
        {
            const response = await fetch("/backButtonFromSearch", { 
              method: "POST", 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userName: userName })
            });

            if (response.ok)
            {
                // получаем присланный объект в формате json
                const data = await response.json();

                if (data)
                {
                    window.location.href = `/user_page/${data.userID}`;
                }
                else {
                    console.log("err");
                }
            }
        }
        catch (error)
        {
            console.error(error);
        }


})

