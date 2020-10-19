//Очистка экрана
function clearWindow() {
    $('.equipInRooms').html('');
    $('.equipInRooms').append('<div class="app"><div class="leftWindow"></div><div class="rightWindow"></div></div><div class="modal" id="myModal" ><div class="modal-content" id="modal_body"><span class="closeModal">&times;</span><div class="modal-body"><form></form></div></div></div>');
}