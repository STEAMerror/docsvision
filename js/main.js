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
                $('div').removeAttr('id', 'active'); //может удалить все активы со страницы
                $('.' + nameSelectedRoom).attr('id', 'active');       
                //получаем оборудование (Специально именно здесь, так как с базой данных работают несколько человек)
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
                    
                    $('.rightWindow').append('<p>Оборудование в наличии:</p>'); 
                    showRightMenu(objectEquip, nameSelectedRoom, arrRooms);
                });
            });
        }  
    }

    function showRightMenu(objectEquip, nameSelectedRoom, arrRooms){
        let countEquipAll = objectEquip.length;
        
        for (let q = 0; q < countEquipAll; q++){
            if (objectEquip[q].placeId){
                if (objectEquip[q].data.place.id == nameSelectedRoom){
                    // $('.rightWindow').append('<div class="' + objectEquip[q].data.place.id + ' equip"><p class="equipName">' + objectEquip[q].data.name + '</p><p class"equipCount"> ' + objectEquip[q].data.count + '</p></div>'); 
                    $('.rightWindow').append('<div class="equip"><p class="equipName">' + objectEquip[q].data.name + '</p><p class"equipCount"> ' + objectEquip[q].data.count + '</p></div>');
                }
            }
        }
        
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
                    showRightMenu(objectEquip, nameSelectedRoom, arrRooms);
                }
            } 
        }    
    };
}); //document ready


