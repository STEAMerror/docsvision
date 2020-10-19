 //Функция вызова модального окна
 function getModalWindow(EquipId, nameEquip){
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
    
    $('.modal-body').html(''); //Убираем в модальном окне данные, по ранее выбранному объекту
    
    // Добавляем форму в модальное окно
    $(".modal-body").prepend('<div class="' + EquipId + ' idEquip"><p class="equipName">Название: ' + nameEquip + '</p>Количество: <input type="number" id="inputCountEquip"/></div>');
    $(".modal-body").append('<p><input type="button" class="btn modalButton" id="changeEquip" value="Изменить"/><input type="button" class="btn" id="deleteEquip" value="Удалить"/></p>');
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
}