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
                        $("#addEquip").click( function() {
                            getModalWindow();
                            $('.modal-body').html('');
                            $('.modal-body').append('<p><input type="button" class="btn" id="confirmAddEquip" value="Добавить"/></p>');
                            $('.modal-body').prepend('<p>Название: <input type="text" id="inputNameEquip"/></p><p>Количество: <input type="number" id="inputCountEquip"/></p>');
                            $( "#confirmAddEquip").click( function() {

                                let equipName = document.getElementById('inputNameEquip').value;
                                let equipCount = document.getElementById('inputCountEquip').value;
                                let placeEquip = nameSelectedRoom;

                                addEquip(equipName, equipCount, placeEquip); //Функция изменения количества оборудования
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