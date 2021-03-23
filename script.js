"use strict";

// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
// var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var pattern = [1,2,3];
var progress = 0; 
var gamePlaying = false;
var guessCounter = 0;

//audio
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0


function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
  
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
  
    //starts clue sequence
    playClueSequence();
    
}

function stopGame(){
  
  gamePlaying = false;
  //Removes the hidden property of startBtn so that its ready to be clicked again
  document.getElementById("startBtn").classList.remove("hidden");
  //Makes the stopBtn disappear just as it was initially
  document.getElementById("stopBtn").classList.add("hidden");
  
  
}
//Lights the button for the sequence clue
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
//clears button to support clue functionality
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
//Plays the clue sequence by taking into account progress so far
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
    
    if( btn != pattern[guessCounter]){ //Initially check to see if clicked on right button to stop game
      loseGame();
    }else{                            //If button was successfully pressed in accordance to the order
      if(guessCounter < progress){    //Check to see if we are still in the same play
        guessCounter++;
      }else{
        if(progress == (pattern.length-1)){  //If the final number is reached and successful, we win! 
          winGame();
        }else{
          progress++;
          playClueSequence();                //Progres will increment with the next seqence play
        }
      }
    }
    
}

//Functions loseGame and winGame will use alert to show result of game
function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}
function winGame(){
  stopGame();
  alert("Game Over. You won!");
}




/// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
