// Сортировка левого окна
function sort(objectRooms, arrRooms){
    let countRooms = objectRooms.length;

    // getFiniteValue(objectRooms);

    // function getFiniteValue(obj) {
    //     getProp(obj);
            
    //     function getProp(obj) {
    //         for(var prop in obj) {
    //             if ((typeof(obj[prop]) === 'object')) {
    //                 getProp(obj[prop]);
    //             } else {
    //                 console.log(obj[prop]);
    //             }
    //         }
    //     }
    // }

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
}