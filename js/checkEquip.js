//проверяем наличие оборудования в комнатах и помечаем их
function checkEquip(arrRooms){ 
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