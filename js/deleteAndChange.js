 //Открываем модальное окно, если выбрали конкретное оборудовагие
 function getModalWindowDeleteChange(objectEquip){
    for (let i = 0; i < objectEquip.length; i++){
        $( "#" + objectEquip[i].id ).click( function() {
            let EquipId = objectEquip[i].id;
            let placeEquip = objectEquip[i].placeId;
            let nameEquip = objectEquip[i].data.name;
            getModalWindow(EquipId, nameEquip);

            //Удаление оборудования
            $( "#deleteEquip").click( function() {
                deleteEquip(EquipId); //Функция удаления выбранного оборудования
                alert("Оборудование успешно удалено!");
                document.getElementById('myModal').style.display = "none";
                let body = document.getElementById('modal_body');
                enableScrolling(body); //Вызов функции, разрешающей прокрутку
            });

            //Функция удаления оборудования
            function deleteEquip(EquipId){
                // "id"  – идентификатор оборудования
                firebase.firestore().collection("inventory").doc(EquipId).delete().then(() => {
                    console.info("Done");
                    restart();
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
                alert("Оборудование успешно изменено!");
                restart();
                });
            }

            // Изменение оборудования
            $("#changeEquip").click( function() {
                let EquipCount = document.getElementById('inputCountEquip').value;
                changeEquip(EquipId, nameEquip, EquipCount, placeEquip); //Функция изменения количества оборудования
            });
        });
    }
}