const { error } = require("console");
// подключение express
const express = require("express");
// подключение multer
const multer  = require("multer");
const req = require("express/lib/request");
// подключение path
const path = require('path');
// подключение MongoDB
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
// подключение fs
const fs = require("fs");
const { text } = require("stream/consumers");

const url = "mongodb://127.0.0.1:27017/";
// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient(url);
(async () => {
     try {
        await mongoClient.connect();
        app.locals.collection = mongoClient.db("usersdb").collection("users");
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
    }catch(err) {
        return console.log(err);
    } 
})();

// создаем объект приложения
const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.urlencoded({ extended: true })); 
app.use(express.static('src'));

app.use(multer({dest:"src/images"}).single("image"));

// устанавливаем автоматически парсинг тела запроса в json
app.use(express.json());

// определяем обработчик для маршрута "/"
app.get("/", function (request, response){
    // отправляем ответ
     response.sendFile(path.join(__dirname, 'src', 'html', 'first_project.html'));
});
// app.get("/:id", async (request, response) => {

//     const collection = request.app.locals.collection;

//     const id = new ObjectId(request.params.id);

// })
// Страница 
app.get("/userID", async (request, response) => {
    
    const collection = request.app.locals.collection;

    const userName = collection.findOne({_id: app.locals.id});
    console.log(userName);

    response.json({message: userName});
})
// Страница регистрации аккаунта
app.get("/registration.html", function(request, response){
    // отправляем ответ
     response.sendFile(path.join(__dirname, 'src', 'html', 'registration.html'));
});
// Главная страница
app.post("/first_project.html", async (request, response) => {

    const collection = request.app.locals.collection;
    
    const name = request.body.name;

    const user = await collection.findOne({name: name});

    response.json({ message: user._id});

    // app.locals.idMainPage = user.id;
})
// Страница входа в аккаунт
app.get("/join.html", function(request, response){
    // отправляем ответ
     response.sendFile(path.join(__dirname, 'src', 'html', 'join.html'));
});
// Страница успешной авторизации
app.get("/success/:id", async (request, response) => {
    
    try {
        const collection = request.app.locals.collection;

        app.locals.id = new ObjectId(request.params.id);

        const user = await collection.findOne({ _id: app.locals.id });
        
        response.render("success", {
            name: user.name,
            id: user._id,
            phone: user.phone,
            mail: user.mail
        })
    }
    catch {
        console.log("err");
        response.sendStatus(500);
    }

})
// Страница успешно отправленного отзыва
app.get("/sent_response", function (request, response) {
    response.sendFile(path.join(__dirname, 'src', 'html', 'sent_response.html'));
})
// Страница неудачной авторизации
app.get("/fail.html", function(request, response) {
    response.sendFile(path.join(__dirname, 'src', 'html', 'fail.html'));
})
// Страница неудачного поиска пользователя
app.get("/fail_search.html", function(request, response) {
    response.sendFile(path.join(__dirname, 'src', 'html', 'fail_search.html'));
})
// Страница неудачно отправленного отзыва
app.get("/fail_response.html", function(request, response) {
    response.sendFile(path.join(__dirname, 'src', 'html', 'fail_response.html'));
})
// Страница пользователя
app.get("/user_page/:id", async (request, response) => {

    try {

        const collection = request.app.locals.collection;

        const id = request.params.id;

        const user = await collection.findOne({ _id: new ObjectId(id) });

        let fullDate = String(user.date);
        let day = fullDate.slice(8, 10);
        let month = fullDate.slice(4, 7);
        let year = fullDate.slice(11, 15);
        console.log(day);
        console.log(month);
        console.log(year);

        response.render("user_page", {
            name: user.name,
            id: user._id,
            phone: user.phone,
            mail: user.mail,
            day: day,
            month: month,
            year: year
        })
    }
    catch {
        console.log("err");
        response.sendStatus(500);
    }

})
app.post("/image", async (request, response) => {

    try {

        const collection = request.app.locals.collection;

        const userName = request.body.name;

        let dataImage = request.file;
        const image = { image: dataImage }

        if(!image)
        {
            response.send("Ошибка при загрузке файла");
        }  
        else
        {
            const result = await collection.findOneAndUpdate({ name: userName }, { $set: { image : dataImage.filename } });
            response.json({ fileName: dataImage.filename });
        }
    }
    catch {
        console.log("err");
        response.sendStatus(500);
    }

    
})
// Поиск пользователя по имени
app.post("/search", async (request, response) => {

    try
    {
        const collection = request.app.locals.collection;

        const searchName = request.body.searchName;
        console.log(searchName);

        const searchedUser = await collection.findOne({ name: searchName });
        console.log(searchedUser);

        // let fullDate = String(searchedUser.date);
        // let day = fullDate.slice(8, 10);
        // let month = fullDate.slice(4, 7);
        // let year = fullDate.slice(11, 15);
        // console.log(day);
        // console.log(month);
        // console.log(year);

        if (searchedUser)
        {
            response.json({
                successful: true,
                searchedUser: searchName
            })
            // response.render("/searched", {
            //     name: searchedUser.name,
            //     id: searchedUser._id,
            //     day: day,
            //     month: month,
            //     year: year,
            //     image: searchedUser.image
            // })
        }
        else
        {
            response.json({
                successful: false
            })
        }

    }
    catch
    {
        console.log("err");
        response.sendStatus(500);
    }

})
//
app.get("/search/:name", async (request, response) => {

    try
    {
        const collection = request.app.locals.collection;

        const searchName = request.params.name;
        // const userName = request.body.userName;

        const searchedUser = await collection.findOne({ name: searchName });
        // const user = await collection.findOne({ name: userName });

        let fullDate = String(searchedUser.date);
        let day = fullDate.slice(8, 10);
        let month = fullDate.slice(4, 7);
        let year = fullDate.slice(11, 15);
        console.log(day);
        console.log(month);
        console.log(year);

        response.render("searched", {
            searchedName: searchedUser.name,
            id: searchedUser._id,
            day: day,
            month: month,
            year: year,
            image: searchedUser.image,
            // userName: user.name
        })
    }
    catch
    {
        console.log("err");
        response.sendStatus(500);
    }

})
//
app.post("/backButtonFromSearch", async (request, response) => {

    try
    {
        const collection = request.app.locals.collection;

        const userName = request.body.userName;
        console.log(userName);

        const user = await collection.findOne({ name: userName });

        if (user)
        {
            response.json({ userID: user._id.toString() })
        }
        else
        {
            console.log("err")
        }
    }
    catch
    {
        console.log("err");
        response.sendStatus(500);
    }

})
// Страница успешного удаления пользователя
app.get("/success_delete.html", function (request, response) {
    response.sendFile(path.join(__dirname, 'src', 'html', 'success_delete.html'));
})
// Страница успешного обновления данных пользователя
app.get("/success_update.html", function (request, response) {
    response.sendFile(path.join(__dirname, 'src', 'html', 'success_update.html'));
})
// Отправка отзыва пользователя
app.post("/response", async (request, response) => {

    try
    {

        let responseText = request.body.responseText;
        responseText = responseText + "\n";
        console.log(responseText);

        const responsesDir = path.join(__dirname, 'src', 'responses');
        const pathToFile = path.join(responsesDir, 'response.txt');

        if (responseText)
        {
            fs.writeFileSync(pathToFile, responseText, {encoding: "utf-8", flag: "a"});
            // fs.writeFileSync(pathToFile, "\n", {encoding: "utf-8", flag: "a"});
            response.json({
                successful: true
            })
        }
        else
        {
            response.json({
                successful: false
            })
        }

    }
    catch
    {
        console.log("err");
        response.sendStatus(500);
    }

})
// Отправка данных при регистрации
app.post("/user", async (request, response) => {

    try{

        if(!request.body) return response.sendStatus(400);

        // app.locals.id = crypto.randomUUID()
        const userName = request.body.name;
        const userMail = request.body.mail;
        const userPhone = request.body.phone;
        const userPassword = request.body.password;
        const registrationDate = new Date();
        const user = {name: userName, mail: userMail, phone: userPhone, password: userPassword, date: registrationDate};

        const collection = request.app.locals.collection;

        // console.log(user);

        const responseText = `Your name: ${userName}, your mail: ${userMail}, your phone: ${userPhone}, your password: ${userPassword}`;

        // Если пользователь с таким именем уже есть в базе данных - отсылается клиенту путь на страницу с отказом в регистрации
        // Если же такого пользователя в БД ещё нет - клиенту отсылается путь на страницу с подтверждением регистрации
        if(await collection.findOne({name: userName}))
        {
            response.json({
                message: "/fail.html",
                successful: false
            });
        } else {
            const result = await collection.insertOne(user);
            response.json({
                message: result.insertedId,
                successful: true,
                name: userName
            });
        }
    
        
        // response.redirect(`/success/${result.insertedId}`);
        // response.send(user);
    }
    catch(err){
        console.log(err);
        response.sendStatus(500);
    }

    
    
    // response.redirect("https://metanit.com");
});
// Вход в аккаунт
app.post("/join", async (request, response) => {
    
    if (!request.body) return response.sendStatus(400);

    const collection = request.app.locals.collection;

    try {

        const name = request.body.name;
        const password = request.body.password;
        console.log(name, password);

        const user = await collection.findOne({ name: name });
        if (!user) return response.json({ error: "Пользователя с таким именем не существует!" });

        if(name == '' || password == '')
            response.json({
                successful: false,
                error: "Все поля должны быть заполнены!"
            })
        else if (name.length < 2 || name.length > 20)
            response.json({
                successful: false,
                error: "Имя должно быть в пределах 2-20 символов!" 
            })
            else if (user.password != password)
            response.json({
                successful: false,
                error: "Пароль введён неверно!" 
            })
        else 
        {
            response.json({
                successful: true,
                error: '',
                name: name
            })
        }

    }

    catch(err) {
        console.log(err);
        response.sendStatus(500);
    }

})
// Удаление пользователя
app.delete("/user_delete", async (request, response) => {

    if (!request.body) return response.sendStatus(400);

    const collection = request.app.locals.collection;

    try {

        const name = request.body.name;
        const password = request.body.password;

        const user = await collection.findOne({ name: name });

        if (user.password === password) 
        {
            const userDelete = await collection.findOneAndDelete({ name: name })
            response.json({ successful: true });
        }
        else
        {
            response.json({
                successful: false,
                error: "Пароль введён неверно" })
        }

        // if(user) alert("Данные пользователя были удалены!")
        // else response.sendStatus(404);
    }
    catch(err) {
        console.log(err);
        response.sendStatus(500);
    }
})
// Обновление данных пользователя
app.put("/user_update", async (request, response) => {

    if(!request.body) return response.sendStatus(400);

    const collection = request.app.locals.collection;

    try {

        const password = request.body.password;
        const localStorageName = request.body.localStorageName;
        const name = request.body.name;
        const mail = request.body.mail;
        const phone = request.body.phone;
        console.log(password, name, mail, phone);

        const user = await collection.findOne({name: localStorageName})
        console.log(user.password);

        if(name == '' || mail == '' || phone == '' || password == '')
            response.json({
                successful: false,
                error: "Все поля должны быть заполнены!"
            })
        else if (name.length < 2 || name.length > 20)
            response.json({
                successful: false,
                error: "Имя должно быть в пределах 2-20 символов!" 
            })
        else if (mail.split('&').length == 1 & mail.split('.').length == 1)
            response.json({
                successful: false,
                error: 'В адресе электронной почты должны содержаться символы "@" и "."!" ' 
            })
        else if (user.password != password)
            response.json({
                successful: false,
                error: "Пароль введён неверно!" 
            })
        else 
        {
            const userUpdate = collection.findOneAndUpdate({ name: user.name }, { $set: { name: name, mail: mail, phone: phone } })
            response.json({
                successful: true,
                error: '',
                name: name
            })
        }

    }
    catch(err) {
        console.log(err);
        response.sendStatus(500);
    }

})

process.on("SIGINT", async() => {
       
    await mongoClient.close();
    console.log("Приложение завершило работу");
    process.exit();
});
