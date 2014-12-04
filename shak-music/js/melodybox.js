var audio = new Audio(); //аудио
var a;                  //глобальная переменная, которая обозначает нужный элемент из массива с треками  
//var a2;                // глобальная переменная обозначающая трэк из предыдущего раунда
var points=0;                // очки
var lifes=3;                //жизни
var pts = 300;           //секунды
var rotateInterval = 0;
var timerInterval = 0;


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
    //if (a != a2) {
    audio.src = 'http://guessmelody.com/'+musicArr[a].file;                   //указываем путь к воспроизводиму файлу; путь является одним из свойств выбраного объекта (песни)
    pts = 300;                                           //значение таймера обратно к 15
    document.getElementById('start').innerHTML = pts + ' PTS'; //публикуем его
    audio.play();                                           //запуск аудио  
    timerGo();                                              //запуск таймера, который будет ожидать непосредственно начала проигрывания музыки                                        
    //document.getElementById('start').style.display = 'none';   
    answerGen();                                            //генерация ответов
    }
            
function timerGo() {                                                //функция запуска таймера
    console.log('timer poshel');
    //audio.onplaying = function() { console.log('onplaying pshlo') ;                                    // если аудио заиграло - делаем следующее:
        itemrotate(0, -4);   console.log('bobinki');                                        //запуск бобин
        //document.getElementById('answers').style.display = 'block';
        timerInterval = setInterval(function() {                    //сам таймер
            pts = pts-4;                                                //отнимаем значение секунд
            document.getElementById('start').innerHTML = pts + ' PTS';  // записываем его
            if(pts==0) lose();}, 200);}                                // если значение секунд дошло до нуля вызываем функцию проигрыша раунда
   // };


function mstop() {                                                  //остановка музыки
    audio.pause();                                                  //пауза
    audio.src="";
    clearInterval(timerInterval);
    itemstoprotate();                                               //остановили бобины и открутили на 0
    //document.getElementById('answers').style.display = 'none';
    document.getElementById('start').style.display = 'inline-block';
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
    points = points+pts;                                                               //добавим +1 к очкам
    document.getElementById('points').innerHTML = points + '  points';           //опубликуем очки
    setTimeout('mbox()',1000);                                              //начнём след. раунд но дадим перерывчик в 1 сек
}

function lose(){                                                            //проигрыш раунда
    mstop();                                                                //остановим  музыку
    alert('Не верно');
    lifes = lifes-1;                                                                //отнимем 1 жизнь
    document.getElementById('lifes').innerHTML = lifes + '  life';            //опубликуем жизни
    if (lifes>0){                                                               //если жизни еще есть - 
        setTimeout('mbox()',1000);                                          // начнём след. раунд
    }
    else {                                                                  //если жизни закончили, то оповестим игрока о результатах
        alert('ТЫ ЛОШАРА, ПРОЕБАЛ И ' + points + '  ОЧКОВ НАБРАЛ!');
        points=0;
        lifes=3;
        document.getElementById('testid').innerHTML = points;
        document.getElementById('testid2').innerHTML = lifes;
    }
}


