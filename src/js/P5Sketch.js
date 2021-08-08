import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from "../audio/rectangles-no-2.ogg";
import cueSet1 from "./cueSet1.js";
import cueSet2 from "./cueSet2.js";
import cueSet3 from "./cueSet3.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.song = null;

        p.colours = ['#ff0505', '#0505ff', '#ffff05', '#05ff05', '#ff8205', '#ff05ff'];

        p.smallRectangles = [];

        p.bigRectangles = [];

        p.cueSet1Completed = [];
        
        p.cueSet2Completed = [];

        p.cueSet3Completed = [];

        p.preload = () => {
            p.song = p.loadSound(audio);
        }

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.angleMode(p.DEGREES);
            p.rectMode(p.CENTER);
            p.noLoop();
            p.background(0);
            p.strokeWeight(4);
            p.song.onended(p.logCredits);
            if(Math.random() < 0.05){
              const randomColor = require('randomcolor');
              p.colours = randomColor({luminosity: 'bright', count: 6});
            }

            for (let i = 0; i < cueSet1.length; i++) {
              let vars = {
                currentCue: i + 1,
                duration: cueSet1[i].duration,
                durationTicks: cueSet1[i].durationTicks,
              };
              p.song.addCue(cueSet1[i].time, p.executeCueSet1, vars);
            }  
            
            for (let i = 0; i < cueSet2.length; i++) {
              let vars = {
                currentCue: i + 1,
                duration: cueSet2[i].duration,
                durationTicks: cueSet2[i].durationTicks,
              };
              p.song.addCue(cueSet2[i].time, p.executeCueSet2, vars);
            }  

            for (let i = 0; i < cueSet3.length; i++) {
              let vars = {
                currentCue: i + 1,
                duration: cueSet3[i].duration,
                durationTicks: cueSet3[i].durationTicks,
              };
              p.song.addCue(cueSet3[i].time, p.executeCueSet3, vars);
            }  
        };

        p.draw = () => {
            p.background(0);
            p.bigRectangles.forEach((rectangle) => {
                p.drawBigRectangle(rectangle);
            });

            p.smallRectangles.forEach((rectangle) => {
                const { x, y, width, length, colour } = rectangle;
                p.stroke(colour);
                colour.setAlpha(63);
                p.fill(colour);
                p.rect(x, y, width, length);
            });
        };

        p.rectangleStyles = ['simple', 'diamond', 'criss-cross', 'bricks', 'recursive'];

        p.currentRectangleStyle = 'simple';

        p.drawBigRectangle = (rectangle) => {
            const { x, y, size, colour } = rectangle,
              style = p.currentRectangleStyle === 'random' ? p.random(p.rectangleStyles) : p.currentRectangleStyle;
            p.push();
            p.translate(x, y);
            switch (style) {
              case 'simple':
                p.stroke(colour);
                colour.setAlpha(63);
                p.fill(colour);
                p.rect(0, 0, size, size);
                break;
              case 'recursive':
                let recursiveSize = size;
                p.stroke(colour);
                colour.setAlpha(63);
                p.fill(colour);
                while(recursiveSize > 0){
                  p.rect(0, 0, recursiveSize, recursiveSize);
                  recursiveSize = recursiveSize - 32;
                }
                break;
              case 'bricks':
                const oneSixth = size / 6, oneThird = oneSixth * 2;
                p.stroke(colour);
                colour.setAlpha(63);
                p.fill(colour);
                p.rect(0, 0, size, size);
                p.rect(-oneSixth, -oneThird, oneThird * 2, oneThird);
                p.rect(oneThird, -oneThird, oneThird, oneThird);
                p.rect(-oneThird, 0, oneThird, oneThird);
                p.rect(oneSixth, 0, oneThird * 2, oneThird);
                p.rect(-oneSixth, oneThird, oneThird * 2, oneThird);
                p.rect(oneThird, oneThird, oneThird, oneThird);
                break;
              case 'criss-cross':
                p.stroke(colour);
                colour.setAlpha(63);
                p.fill(colour);
                p.rect(0, 0, size, size);
                p.rect(0, 0, size, size / 3);
                p.rotate(90);
                p.rect(0, 0, size, size / 3);
                break;
              case 'diamond':
                p.stroke(colour);
                colour.setAlpha(63);
                p.fill(colour);
                p.rect(0, 0, size, size);
                p.rotate(45);
                colour.setAlpha(95);
                p.fill(colour);
                p.rect(0, 0, size / 2, size / 2);
                p.rotate(45);
                colour.setAlpha(127);
                p.fill(colour);
                p.rect(0, 0, size / 4, size / 4);
                break;
            }
            p.translate(-x, -y);
            p.pop();
        };

        p.executeCueSet1 = (vars) => {
          const { currentCue } = vars;
          if (!p.cueSet1Completed.includes(currentCue)) {
            p.cueSet1Completed.push(currentCue);
            if(currentCue < 73 || currentCue > 88) {
              p.populateBigRectanglesArray();
              p.draw();
            }
          }
        };

        p.executeCueSet2 = (vars) => {
          const { currentCue } = vars;
          if (!p.cueSet2Completed.includes(currentCue)) {
            p.cueSet2Completed.push(currentCue);
            if(currentCue > 100 && currentCue <= 140 || (currentCue > 180)){
               p.bigRectangles = [];
            }
            const minCount = (currentCue > 100 && currentCue <= 160) || (currentCue > 180) ? 12 : 6;
            const maxCount = (currentCue > 100 && currentCue <= 160) || (currentCue > 180) ? 36 : 12;
            if((currentCue > 100 && currentCue <= 120) || (currentCue > 180)){
              p.currentRectangleStyle = 'random';
              p.populateBigRectanglesArray();
              if(currentCue > 180){
                p.populateSmallRectanglesArray(minCount, maxCount);
              }
            }
            else {
              p.populateSmallRectanglesArray(minCount, maxCount);
            }
            p.draw();

          }
        };

        p.executeCueSet3 = (vars) => {
          const { currentCue } = vars;
          if (!p.cueSet3Completed.includes(currentCue)) {
            p.cueSet3Completed.push(currentCue);
            const index = p.rectangleStyles.indexOf(p.currentRectangleStyle);
            const styles =  [...p.rectangleStyles]; 
            styles.splice(index, 1);
            p.currentRectangleStyle = p.random(styles);
          }
        };

        p.populateSmallRectanglesArray = (minCount, maxCount) => {
            p.smallRectangles = [];
            const count = p.random(minCount, maxCount);
            for (let i = 0; i < count; i++) {
                p.smallRectangles.push(
                    {
                        x: p.random(0, p.width),
                        y: p.random(0, p.height),
                        width: p.width / 32 * p.random(0.5, 1),
                        length: p.width / 32 * p.random(0.5, 1),
                        colour: p.color(p.random(p.colours))
                    }
                );
            }
        }

        p.populateBigRectanglesArray = (minCount = 6, maxCount = 18) => {
            p.bigRectangles = [];
            const count = p.random(minCount, maxCount);
            for (let i = 0; i < count; i++) {
                p.bigRectangles.push(
                    {
                        x: p.random(0, p.width),
                        y: p.random(0, p.height),
                        size: p.width / 8 * p.random(0.5, 1),
                        colour: p.color(p.random(p.colours))
                    }
                );
            }
        }

        p.mousePressed = () => {
          if (p.song.isPlaying()) {
            p.song.pause();
          } else {
            if (
              parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
              p.reset();
            }
            //document.getElementById("play-icon").classList.add("fade-out");
            p.canvas.addClass("fade-in");
            p.song.play();
          }
        };

        p.creditsLogged = false;

        p.logCredits = () => {
          if (
            !p.creditsLogged &&
            parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
          ) {
            p.creditsLogged = true;
            console.log(
              "Music By: http://labcat.nz/",
              "\n",
              "Animation By: https://github.com/LABCAT/rectangles-no-2"
            );
            p.song.stop();
          }
        };

        p.reset = () => {
          p.clear();
          p.cueSet1Completed = [];
          p.cueSet2Completed = [];
        };

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.redraw();
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
        </div>
    );
};

export default P5Sketch;
