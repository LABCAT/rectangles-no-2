import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from "../audio/rectangles-no-2.ogg";
import cueSet1 from "./cueSet1.js";

const P5Sketch = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.song = null;

        p.colours = ['#ff0505', '#0505ff', '#ffff05', '#05ff05', '#ff8205', '#ff05ff'];

        p.bigRectangles = [];

        p.cueSet1Completed = [];

        p.preload = () => {
            p.song = p.loadSound(audio);
        }

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.background(15);
            p.strokeWeight(4);
            p.song.onended(p.logCredits);

            for (let i = 0; i < cueSet1.length; i++) {
              let vars = {
                currentCue: i + 1,
                duration: cueSet1[i].duration,
                durationTicks: cueSet1[i].durationTicks,
              };
              p.song.addCue(cueSet1[i].time, p.executeCueSet1, vars);
            }            
        };

        p.draw = () => {
           
        };

        p.drawBigRectangles = () => {
            p.background(15);
            p.bigRectangles.forEach((rectangle) => {
                const { x, y, size, colour } = rectangle;
                p.stroke(colour);
                colour.setAlpha(63);
                p.fill(colour);
                p.rect(x, y, size, size);
            });
        };

        p.executeCueSet1 = (vars) => {
          if (!p.cueSet1Completed.includes(vars.currentCue)) {
            p.cueSet1Completed.push(vars.currentCue);
            p.populateBigRectangleArray();
            p.drawBigRectangles();
          }
        };

        p.populateBigRectangleArray = () => {
            p.bigRectangles = [];
            const count = p.random(6, 18);
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
