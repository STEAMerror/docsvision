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

restart();

function restart (){
    
    //get rooms
    firebase.firestore().collection("places").get().then(response => { 
        let docs = response.docs.map(x => ({ 
            id: x.id, 
            data: x.data(), 
            parts:  x.data().parts && x.data().parts.map(part => part.id) 
        })); 
        console.info(docs);
        clearWindow();
        let objectRooms = docs;
        let arrRooms = [];
        sort(objectRooms, arrRooms);
        $('.rightWindow').append('<p>Выберите здание или комнату!</p>'); 
        checkEquip(arrRooms);
        showLeftMenu(objectRooms, arrRooms);
    }); 
}