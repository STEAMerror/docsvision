$(document).ready(function(){
    //initialize
    var firebaseConfig = {
        apiKey: "AIzaSyD6DnGbVfdJlDJ_pEOUfDfTDJrA8j3lIs8",
        authDomain: "dv-inventory.firebaseapp.com",
        databaseURL: "https://dv-inventory.firebaseio.com",
        projectId: "dv-inventory",
        storageBucket: "dv-inventory.appspot.com",
        messagingSenderId: "130062240176",
        appId: "1:130062240176:web:ecbca5d29b37d25c6cee75"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    //get rooms
    firebase.firestore().collection("places").get().then(response => { 
        let docs = response.docs.map(x => ({ 
            id: x.id, 
            data: x.data(), 
            parts:  x.data().parts && x.data().parts.map(part => part.id) 
        })); 
        console.info(docs);
        let objectRooms = docs;
        let arrRooms = [];
        sort(objectRooms, arrRooms);
        showLeftMenu(objectRooms, arrRooms);
    });
    //проверяем наличие оборудования в комнатах и помечаем их
    function haveEquip(arrRooms){ 
        firebase.firestore().collection("inventory").get().then(response => { 
            let docs = response.docs.map(x => ({ 
                id: x.id, 
                data: x.data(), 
                placeId: x.data().place
            })); 
            console.info(docs); 
            let arrRoomsTemp = [];

            $('p').remove('.have-equip');
            
            for (let i = 0; i < docs.length; i++){
                if (docs[i].placeId){
                    if (arrRooms.includes (docs[i].data.place.id) && !arrRoomsTemp.includes (docs[i].data.place.id)){
                        arrRoomsTemp.push (docs[i].data.place.id);
                        $('.' + docs[i].data.place.id).prepend('<p class="have-equip">&#9672 </p>');
                    }
                }
            }
        });
    }

    // Сортировка левого окна
    function sort(objectRooms, arrRooms){
        let countRooms = objectRooms.length;
    
        for (let i = 0; i < countRooms; i++){
            if (objectRooms[i].parts){ //если в объекте есть зависимости
                let countParts = objectRooms[i].parts.length; //создаем счетчик их количества
                if (!arrRooms.includes (objectRooms[i].id)){ //если еще не отобразили
                    $('.leftWindow').append('<div class="' + objectRooms[i].id + ' first_level' +'">'); //отображаем первый уровень
                    arrRooms.push (objectRooms[i].id); //записываем в контрольный массив
                    for (let j = 0; j < countParts; j++){
                        $('.' + objectRooms[i].id).append('<div class="' + objectRooms[i].parts[j] + ' second_level' + '">'); //записываем в див первого уровня див второго уровня
                        arrRooms.push (objectRooms[i].parts[j]); //записываем в контрольный массив  
                        for (let z = 0; z < countRooms; z++){ //повторная проверка объекта
                            if (objectRooms[z].id == objectRooms[i].parts[j]){ //если в названии объекта встретилась зависимость с parts второго уровня, значит мы нашли третий уровень вложенности 
                                if (objectRooms[z].parts){ //если от этого объекта второго уровня, зависит какая-либо комната третьего уровня
                                    let countParts2 = objectRooms[z].parts.length; //запишем количество этих зависимых комнат
                                    for (let k = 0; k < countParts2; k++){
                                        $('.' + objectRooms[z].id).append('<div class="' + objectRooms[z].parts[k] + ' third_level' + '">'); //отображаем див третьего уровня
                                        arrRooms.push (objectRooms[z].parts[k]); //записываем конктрольный массив
                                    }
                                }    
                            }   
                        };
                    };
                }
            }   
        }
        if (countRooms != arrRooms.length){ //проверяем - все ли мы отобразили
            for (let i = 0; i < countRooms; i++){
                if (!arrRooms.includes (objectRooms[i].id)){
                    $('.leftWindow').append('<div class="' + objectRooms[i].id + '">') //Если обнаружили отсутствующие элементы - выводим их первым уровнем
                }
            }
        }
        haveEquip(arrRooms); //проверяем наличие оборудования в комнатах
        $('.rightWindow').append('<p>Выберите здание или комнату!</p>'); 
    }


//отображение левого окна и обработка нажатий
    function showLeftMenu(objectRooms, arrRooms) {
        let countEquip = objectRooms.length;
        let countRooms = arrRooms.length;
        //Добавляем в дивы инфу
        for (let i = 0; i < countEquip; i++){
            $("." + objectRooms[i].id).prepend('<p class="pointer">' + objectRooms[i].data.name + '</p>');
        }

        //обрабатываем нажатие на них
        for (let i = 0; i < countRooms; i++){
            $( "." + arrRooms[i] ).click( function() {
                event.stopPropagation();
                $('.rightWindow').html('');
                let nameSelectedRoom = arrRooms[i];

                //Если нет дочерних комнат, то выводим кнопку
                for (let j = 0; j < objectRooms.length; j++){
                    if (nameSelectedRoom == objectRooms[j].id){
                        if (!objectRooms[j].parts){
                            $(".rightWindow").prepend('<div class="top-info" id="without-parts"><input type="button" class="btn" id="addEquip" value="Добавить оборудование"/></div>');
                            $("#without-parts").click( function() {
                                getModalWindow();
                                $('.modal-body').html('');
                                $('.modal-body').append('<p><input type="button" class="btn" id="confirmAddEquip" value="Добавить"/></p>');
                                $('.modal-body').prepend('<p>Название: <input type="text" id="inputNameEquip"/></p><p>Количество: <input type="number" id="inputCountEquip"/></p>');
                                $( "#confirmAddEquip").click( function() {

                                    let equipName = document.getElementById('inputNameEquip').value;
                                    let equipCount = document.getElementById('inputCountEquip').value;
                                    let placeEquip = nameSelectedRoom;

                                    addEquip(equipName, equipCount, placeEquip); //Функция изменения количества оборудования

                                    alert("Оборудование успешно добавлено!");
                                    // window.location.reload(); //Перезагружаем страницу
                                });
                            });
                        } else {
                            $(".rightWindow").prepend('<div class="top-info"></div>');
                        }
                    }
                }

                
                $('#active').removeAttr('id', 'active'); //может удалить все активы со страницы
                $('.' + nameSelectedRoom).attr('id', 'active');       
                //получаем оборудование (Специально именно здесь, так как с базой работают несколько человек, и нужно чаще отслеживать изменения)
                firebase.firestore().collection("inventory").get().then(response => { 
                    let docs = response.docs.map(x => ({ 
                        id: x.id, 
                        data: x.data(), 
                        placeId: x.data().place
                    })); 
                    console.info(docs); 
                    let arrRoomsTemp = [];
                    $('p').remove('.have-equip');
            
                    for (let i = 0; i < docs.length; i++){
                        if (docs[i].placeId){
                            if (arrRooms.includes (docs[i].data.place.id) && !arrRoomsTemp.includes (docs[i].data.place.id)){
                                arrRoomsTemp.push (docs[i].data.place.id);
                                $('.' + docs[i].data.place.id).prepend('<p class="have-equip">&#9672 </p>');
                                
                            }
                        }
                    }

                    let objectEquip = docs;
                    
                    $('.top-info').append('<p>Оборудование в наличии:</p>'); 
        
                    showRightMenu(objectEquip, nameSelectedRoom, arrRooms); //Вызываем отображение правого меню с оборудованием выбранной комнаты
                    
                    getModalWindowDeleteChange(objectEquip); //Вызываем модальное окно для изменения и удаления
                    
                });
            });
        }  
    }

    //отображение правого меню
    function showRightMenu(objectEquip, nameSelectedRoom, arrRooms){
        
        //отображаем оборудование в выбранной комнате
        for (let q = 0; q < objectEquip.length; q++){
            if (objectEquip[q].placeId){
                if (objectEquip[q].data.place.id == nameSelectedRoom){
                    $('.rightWindow').append('<div class="equip pointer" id="' + objectEquip[q].id + '"><p class="equipName">' + objectEquip[q].data.name + '</p><p class="equipCount"> ' + objectEquip[q].data.count + '</p></div>');
                }
            }
        }
        
        //поиск оборудования в дочерних комнатах, если таковое имеется
        if($("." + nameSelectedRoom).children().length){
            findChildObject(nameSelectedRoom, objectEquip, arrRooms);    
        }
    }
    
    function findChildObject(nameSelectedRoom, objectEquip, arrRooms){
        let elem = $("." + nameSelectedRoom).children();
        for (let k = 0; k < elem.length; k++) {
            let temp = elem[k].className.split(" ");
            for (let z = 0; z < temp.length; z++) {
                if(arrRooms.includes (temp[z])){
                    nameSelectedRoom = temp[z];
                    showRightMenu(objectEquip, nameSelectedRoom, arrRooms); //Вызываем повторно, для отображения
                }
            } 
        }    
    };

    //Функция вызова модального окна
    function getModalWindow(){
        let modal = document.getElementById('myModal');
        let body = document.getElementById('modal_body');
        let closeModalWindow = document.getElementsByClassName("closeModal")[0];

        showModalWindow(modal, body); //показываем модальное окно

        //Закрывает модальное окно
        closeModalWindow.onclick = function() {
            modal.style.display = "none";
            enableScrolling(body); //Вызов функции, разрешающей прокрутку
        }
        
        
        //Закрывает окно при нажатии на фон
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                enableScrolling(body); //Вызов функции, разрешающей прокрутку
            }
        }
    }

    //Открывает модальное окно
    function showModalWindow(modal, body){
        modal.style.display = "block";
        disableScrolling();
    }

    //Блокирует прокрутку страницы
    function disableScrolling(){
        var x=window.scrollX;
        var y=window.scrollY;
        window.onscroll=function(){
            window.scrollTo(x, y);
        }; 
    }

    //Разрешает прокрутку страницы, и проводит разбинд клика на кнопку удалить\изменить
    function enableScrolling(body){
        window.onscroll=function(){};
        $( "#changeEquip" ).unbind("click");
        $( "#deleteEquip" ).unbind("click");
        $( "#addEquip" ).unbind("click");
    }

    //Открываем модальное окно, если выбрали конкретное оборудовагие
    function getModalWindowDeleteChange(objectEquip){
        for (let i = 0; i < objectEquip.length; i++){
            $( "#" + objectEquip[i].id ).click( function() {
                
                getModalWindow();
                
                $('.modal-body').html(''); //Убираем в модальном окне данные, по ранее выбранному объекту
                
                $(".modal-body").prepend('<div class="' + objectEquip[i].id + ' idEquip"><p class="equipName">Название: ' + objectEquip[i].data.name + '</p>Количество: <input type="number" id="inputCountEquip"/></div>');
                $(".modal-body").append('<p><input type="button" class="btn modalButton" id="changeEquip" value="Изменить"/><input type="button" class="btn" id="deleteEquip" value="Удалить"/></p>');


                // let EquipCount = document.getElementById('inputCountEquip').value = objectEquip[i].data.count;
                let EquipId = objectEquip[i].id;
                let placeEquip = objectEquip[i].placeId;
                let nameEquip = objectEquip[i].data.name;

                //Удаление оборудования
                $( "#deleteEquip").click( function() {
                    deleteEquip(EquipId); //Функция удаления выбранного оборудования
                    $(".rightWindow" + " #" + objectEquip[i].id).remove(); //Убираем из правого окна удаленный предмет
                    alert("Оборудование успешно удалено!");
                    document.getElementById('myModal').style.display = "none";
                    let body = document.getElementById('modal_body');
                    enableScrolling(body); //Вызов функции, разрешающей прокрутку
                });

                // Изменение оборудования
                $( "#changeEquip").click( function() {
                    let EquipCount = document.getElementById('inputCountEquip').value;
                    changeEquip(EquipId, nameEquip, EquipCount, placeEquip); //Функция изменения количества оборудования
                    $("#" + objectEquip[i].id + " .equipCount").html(" " + EquipCount); //Изменяем количество выбранного оборудования в правом окне
                    alert("Оборудование успешно изменено!");
                });
            });
        }
    }

    //Функция добавления оборудования
    function addEquip(equipName, equipCount, placeEquip){
        let filestore = firebase.firestore();
        filestore.collection("inventory").doc().set({ 
            name: equipName, 
            count: equipCount, 
            place: filestore.collection("places").doc(placeEquip), // main-101 – id места
        }).then(() => {
            console.info("Done");
            window.location.reload(); //Перезагружаем страницу
        });
    }

    //Функция удаления оборудования
    function deleteEquip(EquipId){
        // "id"  – идентификатор оборудования
        firebase.firestore().collection("inventory").doc(EquipId).delete().then(() => {
            console.info("Done");
        });
    }

    //функция изменения количества оборудования
    function changeEquip(EquipId, nameEquip, EquipCount, placeEquip){
        // "id"  – идентификатор оборудования
        firebase.firestore().collection("inventory").doc(EquipId).set({ 
            name: nameEquip,
            count: EquipCount,
            place: placeEquip
        }).then(() => {
        console.info("Done");
        });
    }

}); //document ready


