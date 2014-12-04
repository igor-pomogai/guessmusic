var audio = new Audio(); 
var a;
var b=0;
var c=3;


function itemrotate(angle, deg){            // функция вращения бобин, (начальный градус угла, на какой угол смещать)
    rotateInterval = setInterval(function(){    //задаём частоту 
    angle+=deg;
    jQuery(".rotateImg").rotate({animateTo:angle}); //используем команду из плагина jquery.rotate для поворота на нужный угол
    },70);
    }

function itemstoprotate(){                      //функция оставноки бобин и возврата в начальное положение
    clearInterval(rotateInterval);              // очищаем заданую ранее частоту (в функции itemrotate)
    jQuery(".rotateImg").rotate({animateTo:0}); // используем команду из плагина jquery.rotate чтобы повернуть бобину в исходное положение "0"
}

function mbox() {                           //старт игры, запуск песни
    a = Math.floor(Math.random()*musicArr.length); //случайно выбираем порядковый номер объекта в массиве
    audio.src = ''+musicArr[a].file;                   //указываем путь к воспроизводиму файлу; путь является одним из свойств выбраного объекта (песни)
    audio.play();                                       //начинаем проигрывание песни
    itemrotate(0, -5);                                  // вызываем функцию вращения бобин
    document.getElementById('start').style.display = 'none';
    answerGen();
    }
            
function mstop() {
    document.getElementById('start').style.display = 'inline-block';
    audio.pause();  
    audio.currentTime = 0;
    itemstoprotate();
    }

function answerGen(){
    for (i=1; i<5; i++){
    rand = Math.floor(Math.random()*musicArr.length);
    document.getElementById('ans'+i).innerHTML = musicArr[rand].author + ' - ' + musicArr[rand].song;
    document.getElementById('ans'+i).onclick = function() {lose()};
    }

    q = 1 + Math.random()*4;
    q = q^0;
    document.getElementById('ans'+q).innerHTML = musicArr[a].author + ' - ' + musicArr[a].song;
    document.getElementById('ans'+q).onclick = function() {win();};

}

function win(){
    b++;
    document.getElementById('testid').innerHTML = b + '  points';
    mstop();
    mbox();
}

function lose(){
    alert('Не верно');
    c = c-1;
    document.getElementById('testid2').innerHTML = c + '  life';
    mstop();
    if (c>0){
        mbox();
    }
    else {
        alert('ТЫ ЛОШАРА, ПРОЕБАЛ И ' + b + '  ОЧКОВ НАБРАЛ!');
        b=0;
        c=3;
        document.getElementById('testid').innerHTML = b;
        document.getElementById('testid2').innerHTML = c;

    }
}


