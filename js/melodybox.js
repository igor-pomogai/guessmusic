var audio = new Audio(); 
var audioHis = new Audio();
var a;                 
var points=0;               
var lifes=3;                
var guessed = 0;            
var pts = 300;           
var timerInterval=0;
var resultname = '';
var resultdescrip = '';

function itemrotate(angle, deg){            
    rotateInterval = setInterval(function(){    
    angle+=deg;
    jQuery(".rotateimg").rotate({animateTo:angle}); 
    },70);
    }

function itemstoprotate(){                      
    clearInterval(rotateInterval);              
    jQuery(".rotateimg").rotate({animateTo:0}); 
}

function mbox() {                           
    a = Math.floor(Math.random()*musicArr.length); 
    audio.src = 'http://guessmelody.com/'+musicArr[a].file;                  
    pts = 300;                                           
    document.getElementById('start').innerHTML = pts + ' очков'; 
    audio.play();                                            
    timerGo();                                                                                      
    answerGen();                                            
    itemrotate(0, -4);   console.log('bobinki');
    $('#start').attr('onclick','');
    }
            
function timerGo() {                                                
    timerTimeout = setTimeout(function(){
        timerInterval = setInterval(function() {                    
            pts = pts-4;                                                
            document.getElementById('start').innerHTML = pts + ' очков';  
            if(pts===0) lose();}, 200);},1500);                                
   }


function mstop() {                                                  
    audio.pause();                                                  
    clearTimeout(timerTimeout);
    clearInterval(timerInterval);
    itemstoprotate();                                               
    $('#start').attr('onclick','mbox()');
    }

function answerGen(){                                                       
    var usedTracks = [];                                                    
    usedTracks.push(a);                                                     
    for (i=1; i<5; i++){                                                     
        rand = Math.floor(Math.random()*musicArr.length);                   
        if (usedTracks.indexOf(rand) == -1) {                               
        usedTracks.push(rand);                                              
        document.getElementById('ans'+i).innerHTML = musicArr[rand].song;  
        document.getElementById('ans'+i).onclick = function() {lose();};}    
    else {i--;}}                                                           
    q = 1 + Math.random()*4;                                                
    q = q^0;                                                                
    document.getElementById('ans'+q).innerHTML = musicArr[a].song + ''; 
    document.getElementById('ans'+q).onclick = function() {win();};         

}

function win(){                                                             
    mstop();                                                                                                 
    points = points+pts;                                                               
    guessed = guessed+1;
    historyadd(pts,'success');
    document.getElementById('points').innerHTML = points + '  очков';           
    document.getElementById('guessed').innerHTML = guessed;
    document.getElementById('wintitle').innerHTML = 'Угадали!';
    $('.modal-header').css('background-color','#8ce58c');
    document.getElementById('wintext').innerHTML = 'Вы угадали и набрали <span class="label label-warning">' + pts + '</span> очков за этот трэк! \n В сумме у Вас <span class="label label-success">' + points + '</span> очков!';
    document.getElementById('winbut').onclick = function() {mbox();};
    document.getElementById('winbut').innerHTML = 'Следующий трэк!';
    document.getElementById('winbut2').style.display = 'none'; 
    $('#modal-test').modal('show');
}

function lose(){                                                            
    mstop();                                                                
    lifes = lifes-1;                                                                
    historyadd(0,'danger');
    $('.modal-header').css('background-color','#ff837f');
    document.getElementById('lifes').innerHTML = lifes + '  жизни';            
    if (lifes>0){                                                              
        document.getElementById('wintitle').innerHTML = 'Не угадали!';
        document.getElementById('wintext').innerHTML = 'Не-а,  Правильный ответ: <br><br>' + musicArr[a].song;
        document.getElementById('winbut').innerHTML = 'Следующий трэк!';
        document.getElementById('winbut').onclick = function() {mbox();};
        document.getElementById('winbut2').style.display = 'none';
        $('#modal-test').modal('show');
    }
    else {                                                             
        resultgen();
        document.getElementById('points').innerHTML = points + ' очков';
        document.getElementById('lifes').innerHTML = lifes + ' жизни';
        document.getElementById('guessed').innerHTML = guessed;
        document.getElementById('wintitle').innerHTML = 'Игра окончена!';
        document.getElementById('wintext').innerHTML = 'Ваш результат: <b>'+resultname+'</b> <br> Вы набрали <span class="label label-success">' + points + '</span> очков, угадав <span class="label label-info">' + guessed + '</span> песен! <br><br> Поделитесь результатом на своей стене Вконтакте, сделайте вызов друзьям:';
        document.getElementById('vk_share_button').style.display = 'block';
        document.getElementById('vk_share_button').innerHTML = VK.Share.button({url:'http://guessmelody.com', title:'Угадай мелодию! Мой результат: ' + resultname , description: resultdescrip, image:'http://guessmelody.com/img/ogimage.png', noparse:true}, {type:'round',text:'Поделиться'});
        document.getElementById('winbut').innerHTML = 'Закончить';
        document.getElementById('winbut').onclick = function() {resetgame();};
        document.getElementById('winbut2').style.display = 'none';
        $('#modal-test').modal('show');
    }
}

function resetgame() {
    mstop();
    lifes = 3; points = 0; pts = 300; guessed = 0;
    $('.modal-header').css('background-color','#ffffff');
    document.getElementById('points').innerHTML = points + ' очков';
    document.getElementById('lifes').innerHTML = lifes + ' жизни';
    document.getElementById('guessed').innerHTML = guessed;
    document.getElementById('start').onclick = function() {mbox();};
    document.getElementById('start').innerHTML = '<span class="glyphicon glyphicon-play-circle"></span> PLAY';
    for (i=1; i<5; i++){document.getElementById('ans'+i).innerHTML="-"; document.getElementById('ans'+i).onclick = '';}
    document.getElementById('winbut').onclick = function() {mbox();};
    document.getElementById('vk_share_button').style.display='none';
    document.getElementById('vk_like').style.display = 'none';
    
}

function historyadd(ptsHis,labelstyle) {
    var curTrackFile = musicArr[a].file;
    var curTrackSong = musicArr[a].song;
    $('<a href="#hist1" onclick="playHis(id)" class="list-group-item text-left historyitem" id="'+curTrackFile+'">'+ '<span class="label label-'+labelstyle+'">' + ptsHis + '</span> ' + curTrackSong + '<span class="glyphicon glyphicon-play-circle"></span></a>').insertAfter("#hist1");
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
    itemrotate(0,-4);}
}

function clearHis() {
    $('.historyitem').remove();
    itemstoprotate();
    audioHis.pause();
    audioHis.src='';
}

function muteAudio() {
    if(audio.muted===true){
        audio.muted=false;
        $('#mutespan').removeClass('glyphicon-volume-up');
        $('#mutespan').addClass('glyphicon-volume-off');
    }
    else{
        $('#mutespan').removeClass('glyphicon-volume-off');
        $('#mutespan').addClass('glyphicon-volume-up');
        audio.muted=true;
    }
}

function newGame() {
    document.getElementById('wintitle').innerHTML = 'Начать новую игру?';
    document.getElementById('wintext').innerHTML = 'Вы уверены, что хотите начать новую игру? Весь текущий прогресс будет утерян!';
    document.getElementById('winbut').innerHTML = 'Да, начать новую игру!';
    document.getElementById('winbut').onclick = function() {resetgame();};
    document.getElementById('winbut2').style.display = 'inline-block';
    $('#modal-test').modal('show');
}

function howtoplay() {
    $('#modal-info').modal('show');
}

function aboutsite() {
    $('#modal-site').modal('show');
}

function supportpj() {
     $('#modal-supportpj').modal('show');
}

function contacts() {
     $('#modal-contacts').modal('show');
}

function resultgen() {
    resultname = '';
    if (points <= 300){
        resultname='Целеустремленный: ' + points + ' очков';
        resultdescrip='Набрано ' + points + ' очков, угадано '+guessed+' мелод. Кто наберет больше? =)';
    }
    else if(points > 300 && points <= 700){
        resultname='Любитель: ' + points + ' очков';
        resultdescrip='Набрано ' + points + ' очков, угадано '+guessed+' мелод. Кто наберет больше? =)';
    }
    else if(points > 700 && points <= 1100){
        resultname='Меломан: ' + points + ' очков';
        resultdescrip='Набрано ' + points + ' очков, угадано '+guessed+' мелод. Хороший результат. Кто наберет больше? =) ';
    }
    else if(points > 1100 && points <= 1700){
        resultname='Знаток: ' + points + ' очков';
        resultdescrip='Набрано ' + points + ' очков, угадано '+guessed+' мелод. Отличный результат! Кто наберет больше? ';
    }
    else if(points > 1700 && points <= 2600){
        resultname='Профессионал: ' + points + ' очков';
        resultdescrip='Набрано ' + points + ' очков, угадано '+guessed+' мелод. Замечательный результат!! Кто наберет больше?';
    }
    else if(points > 2600){
        resultname='Читер 80 уровня: ' + points + ' очков';
        resultdescrip='Набрано ' + points + ' очков, угадано '+guessed+' мелод. Невероятный результат! Кто попробует повторить? =) ';
    }
}
