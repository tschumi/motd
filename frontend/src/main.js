import './assets/css/motd.css';
import {Motd, Platform, Speed} from '../wailsjs/go/main/Motd';

let footer = document.getElementById("footer");
let isPaused = false;

let progressBar = document.getElementById("progress-bar");
let platform = getPlatform();
let speed = getSpeed();

// Execute when DOM is loaded 
document.addEventListener("DOMContentLoaded", function(event) {
    motd();
  });

footer.onclick = function() {
    if (isPaused == true ) {
        isPaused = false;
    } else {
        isPaused = true;
    }
}

function motd() {
    try {
        Motd()
            .then((result) => {
                // fill the motd text and author with the data
                motdQuoteText.innerHTML = result[0];
                motdQuoteAuthor.innerHTML = result[1];

                // check the size of the motdQuote (default 30)
                // if it is bigger, resize the window before showing it
                const motdQuote = document.getElementById("motdQuote");
                var actualWindowSize = runtime.WindowGetSize();

                actualWindowSize.then(value => {
                    // same width, new height is the acutal height + real height of the container (depending on text length)
                    if (platform == "windows") {
                        // windows adds pixels to WindowSize if there is a zoom level (feature or bug?), so we have to downsize it again
                        devicePixelRatio = window.devicePixelRatio
                        runtime.WindowSetSize(Math.round(value.w / devicePixelRatio), Math.round(value.h / devicePixelRatio) + Math.round(motdQuote.offsetHeight * devicePixelRatio));
                    } else {
                        runtime.WindowSetSize(value.w, value.h + motdQuote.offsetHeight);
                    }
                }).catch(err => {
                    console.log(err);
                });

                // now we can show the window
                runtime.WindowCenter();
                runtime.WindowShow();
                
                // start the animation
                animateProgressBar( progressBar, 100, result[2] * speed )
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
};

function animateProgressBar( progressBar, value, speed ) {
    let id = setInterval(animateProgressBar, speed);

    // we calculate the wait time before closing depending on the speed
    let waitForAnimation = -5 / (speed / 100)
    
    function animateProgressBar() {
        // wait the calculated time before closing the application to let the animation finish
        if (value <= waitForAnimation) {
            clearInterval(id);
            runtime.Quit();
        } else {
            if (isPaused == false ) {
                value--; 
                progressBar.style.width = value + '%';
            }
        }
    }
}

function getPlatform () {
    try {
        Platform()
            .then((result) => {
                platform = result;
            })
    } catch (error) {
        console.error(error);
    }
}

function getSpeed () {
    try {
        Speed()
            .then((result) => {
                speed = result;
            })
    } catch (error) {
        console.error(error);
    }
}