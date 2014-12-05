var audio = new Audio(); //аудио
var audioHis = new Audio();// аудио из истории
var a;                  //глобальная переменная, которая обозначает нужный элемент из массива с треками  
var points=0;                // очки
var lifes=3;                //жизни
var guessed = 0;            //угаданные
var pts = 300;           //секунды


function itemrotate(angle, deg){            // функция вращения бобин, (начальный градус угла, на какой угол смещать)
    rotateInterval = setInterval(function(){    //задаём частоту 
    angle+=deg;
    jQuery(".rotateimg").rotate({animateTo:angle}); //используем команду из плагина jquery.rotate для поворота на нужный угол
    },70);
    }

function itemstoprotate(){                      //функция оставноки бобин и возврата в начальное положение
    clearInterval(rotateInterval);              // очищаем заданую ранее частоту (в функции itemrotate)
    jQuery(".rotateimg").rotate({animateTo:0}); // используем команду из плагина jquery.rotate чтобы повернуть бобину в исходное положение "0"
}

function mbox() {                           //старт игры, запуск песни
    a = Math.floor(Math.random()*musicArr.length); //случайно выбираем порядковый номер объекта в массиве
    audio.src = 'http://guessmelody.com/'+musicArr[a].file;                   //указываем путь к воспроизводиму файлу; путь является одним из свойств выбраного объекта (песни)
    pts = 300;                                           //значение таймера обратно к 15
    document.getElementById('start').innerHTML = pts + ' PTS'; //публикуем его
    audio.play();                                           //запуск аудио  
    timerGo();                                              //запуск таймера, который будет ожидать непосредственно начала проигрывания музыки                                        
    answerGen();                                            //генерация ответов
    itemrotate(0, -4);   console.log('bobinki');
    $('#start').attr('onclick','');
    }
            
function timerGo() {                                                //функция запуска таймера
    timerTimeout = setTimeout(function(){
        timerInterval = setInterval(function() {                    //сам таймер
            pts = pts-4;                                                //отнимаем значение секунд
            document.getElementById('start').innerHTML = pts + ' PTS';  // записываем его
            if(pts==0) lose();}, 200);},1500);                                // если значение секунд дошло до нуля вызываем функцию проигрыша раунда
   };


function mstop() {                                                  //остановка музыки
    audio.pause();                                                  //пауза
    clearTimeout(timerTimeout);
    clearInterval(timerInterval);
    itemstoprotate();                                               //остановили бобины и открутили на 0
    $('#start').attr('onclick','mbox()');
    }

function answerGen(){                                                       //генерация ответов
    var usedTracks = [];                                                    //массив с номерами треков, которые уже опубликованы в ответах
    usedTracks.push(a);                                                     //туда же вносим значение использующегося трека
    for (i=1; i<5; i++){                                                     // запускаем цикл, рассчитанный на 4 повторения
        rand = Math.floor(Math.random()*musicArr.length);                   //генерируем случайное число rand в пределах длины основного массива с треками
        if (usedTracks.indexOf(rand) == -1) {                               //если этого числа еще нет в массиве usedTracks то
        usedTracks.push(rand);                                              // вносим его туда и
        document.getElementById('ans'+i).innerHTML = musicArr[rand].song;  //записываем в блок с идентификатором
            // из трех букв "ans" и цифрой в конце = i значение автора и названия песни, находящейся под индексом = rand в основном массиве
        document.getElementById('ans'+i).onclick = function() {lose()};}    //задаем клику по ответу вызов функции проигрыша раунда
    else {i--;};}                                                           // если число rand таки нашлось в массиве usedTracks то добавляем i++ для повтора
    q = 1 + Math.random()*4;                                                //теперь когда у нас есть 4 точно разных ответа, генерируем число от 1 до 4
    q = q^0;                                                                // чтобы выбрать блок, куда впишем правильный ответ
    document.getElementById('ans'+q).innerHTML = musicArr[a].song; //заменяем данные из выбранного блока на правильный ответ
    document.getElementById('ans'+q).onclick = function() {win();};         //задаем клику на такой ответ функцию победы в раунде

}

function win(){                                                             // функция победы в раунде
    mstop();                                                                //остановим музыку и бобины                                   
    points = points+pts;                                                               //добавим + к очкам
    guessed = guessed+1;
    historyadd(pts,'success');
    document.getElementById('points').innerHTML = points + '  очков';           //опубликуем очки
    document.getElementById('guessed').innerHTML = guessed + ' угадано'
    document.getElementById('wintitle').innerHTML = 'Угадали!';
    document.getElementById('wintext').innerHTML = 'Вы угадали и набрали <span class="label label-warning">' + pts + '</span> очков за этот трэк! \n В сумме у Вас <span class="label label-success">' + points + '</span> очков!';
    $('winbut').attr('onclick','mbox()');
    document.getElementById('winbut').innerHTML = 'Следующий трэк!';
    $('#modal-test').modal('show');
}

function lose(){                                                            //проигрыш раунда
    mstop();                                                                //остановим  музыку
    lifes = lifes-1;                                                                //отнимем 1 жизнь
    historyadd(0,'danger');
    document.getElementById('lifes').innerHTML = lifes + '  жизни';            //опубликуем жизни
    if (lifes>0){                                                               //если жизни еще есть - 
        document.getElementById('wintitle').innerHTML = 'Не угадали!';
        document.getElementById('wintext').innerHTML = 'Жаль... \n Правильный ответ: \n' + musicArr[a].song;
        document.getElementById('winbut').innerHTML = 'Следующий трэк!';
        document.getElementById('winbut').onclick = function() {mbox();};
        $('#modal-test').modal('show');
    }
    else {                                                                  //если жизни закончили, то оповестим игрока о результатах
        document.getElementById('points').innerHTML = points + ' очков';
        document.getElementById('lifes').innerHTML = lifes + ' жизни';
        document.getElementById('guessed').innerHTML = guessed + ' угадано'
        document.getElementById('wintitle').innerHTML = 'Игра окончена!';
        document.getElementById('wintext').innerHTML = 'Конец. Вы набрали <span class="label label-success">' + points + '</span> очков, угадав <span class="label label-info">' + guessed + '</span> песен!';
        document.getElementById('winbut').innerHTML = 'Закончить';
        document.getElementById('winbut').onclick = function() {resetgame();};
        document.getElementById('vk_like').style.display = 'inline-block';
        $('#modal-test').modal('show');
    }
}

function resetgame() {
    lifes = 3; points = 0; pts = 300; guessed = 0;
    document.getElementById('points').innerHTML = points + ' очков';
    document.getElementById('lifes').innerHTML = lifes + ' жизни';
    document.getElementById('guessed').innerHTML = guessed + ' угадано'
    document.getElementById('start').onclick = function() {mbox();};
    document.getElementById('start').innerHTML = '<span class="glyphicon glyphicon-play-circle"></span> PLAY';
    for (i=1; i<5; i++){document.getElementById('ans'+i).innerHTML="-"; document.getElementById('ans'+i).onclick = '';};
    document.getElementById('winbut').onclick = function() {mbox();};
    document.getElementById('vk_like').style.display = 'none';
    
}

function historyadd(ptsHis,labelstyle) {
    var curTrackFile = musicArr[a].file;
    var curTrackSong = musicArr[a].song;
    $('<a href="#" onclick="playHis(id)" class="list-group-item text-left" id="'+curTrackFile+'">'+ '<span class="label label-'+labelstyle+'">' + ptsHis + '</span> ' + curTrackSong + '<span class="glyphicon glyphicon-play-circle"></span></a>').insertAfter("#hist1");
}

function playHis(track) {
    itemstoprotate();
    if (audioHis.src == 'http://guessmelody.com/' + track || track == 'hist1'){
        audioHis.pause();
        audioHis.src='';
    } else {
    audioHis.pause();
    audioHis.src = 'http://guessmelody.com/' + track;
    audioHis.play();
    itemrotate(0,-4)}
}


