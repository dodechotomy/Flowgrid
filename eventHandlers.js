const controls = {
    autoAdvance: {
        tag: "auto-advance",
        attach: (element) => {
            element.onchange = (e) => {
                autoAdvanceMode = e.target.checked;
                console.log(e.target.name + " toggled to " + e.target.checked)
            };
            element.checked = autoAdvanceMode;

        }
    },
    autoSave: {
        tag: "auto-save",
        attach: (element) => {
            element.onchange = (e) => {
                savingFinals = e.target.checked;
                console.log(e.target.name + " toggled to " + e.target.checked)
            };
            element.checked = savingFinals;

        }
    },
    saveFrames: {
        tag: "save-frames",
        attach: (element) => {
            element.onchange = (e) => {
                savingFrames = e.target.checked;
                console.log(e.target.name + " toggled to " + e.target.checked)
            };
            element.checked = savingFrames;

        }
    },
    animate: {
        tag: "animate",
        attach: (element) => {
            element.onchange = (e) => {
                animateMode = e.target.checked;
                console.log(e.target.name + " toggled to " + e.target.checked)
            };
            element.checked = animateMode;

        }
    },
    next: {
        tag: "next",
        attach: (element) => {
            element.onclick = (e) => {
                generate();
                console.log(e.target.name + " button clicked");
            };
        }
    },
    save: {
        tag: "save",
        attach: (element) => {
            element.onclick = (e) => {
                saveFrame();
                console.log(e.target.name + " button clicked");
            };
        }
    },
    density: {
        tag: "walker-density",
        attach: (element) => {
            element.onchange = (e) => {
                walkerDensity = parseFloat(e.target.value);
                console.log(e.target.name + ": " + e.target.value);
            };
            element.value = walkerDensity;
        }
    },
    lifespanMin: {
        tag: "lifespan-min",
        attach: (element) => {
            element.onchange = (e) => {
                lifeSpan[0] = parseFloat(e.target.value);
                console.log(e.target.name + ": " + e.target.value);
            };
            element.value = lifeSpan[0];
        }
    },
    lifespanMax: {
        tag: "lifespan-max",
        attach: (element) => {
            element.onchange = (e) => {
                lifeSpan[1] = parseFloat(e.target.value);
                console.log(e.target.name + ": " + e.target.value);
            };
            element.value = lifeSpan[1];
        }
    },
    resolutionX: {
        tag: "resolution-x",
        attach: (element) => {
            element.onchange = (e) => {
                resolution[0] = parseInt(e.target.value);
                console.log(e.target.name + ": " + e.target.value);
            };
            element.value = resolution[0];
        }
    },
    resolutionY: {
        tag: "resolution-y",
        attach: (element) => {
            element.onchange = (e) => {
                resolution[1] = parseInt(e.target.value);
                console.log(e.target.name + ": " + e.target.value);
            };
            element.value = resolution[1];
        }
    }

};
function ready() {
    // let controlsElement = document.getElementById('controls');
    console.log("attaching click handlers");
    Object.values(controls).forEach(control => {
        let element = document.getElementById(control.tag);
        control.attach(element);
    });
};
document.addEventListener("DOMContentLoaded", ready);