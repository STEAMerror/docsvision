//Функция добавления оборудования
function addEquip(equipName, equipCount, placeEquip){
    let filestore = firebase.firestore();
    filestore.collection("inventory").doc().set({ 
        name: equipName, 
        count: equipCount, 
        place: filestore.collection("places").doc(placeEquip), 
    }).then(() => {
        console.info("Done");
        alert("Оборудование успешно добавлено!");
        restart();
    });
}