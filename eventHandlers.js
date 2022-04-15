const controls = {
    autoAdvance: {
        tag: "auto-advance",
        attachEventHandlers: (element) => {
            element.onchange = (e) => {
                autoAdvanceMode = e.target.checked;
                console.log(e.target.name + " toggled to " + e.target.checked)
            };
            element.checked = autoAdvanceMode;

        }
    },
    autoSave: {
        tag: "auto-save",
        attachEventHandlers: (element) => {
            element.onchange = (e) => {
                savingFrames = e.target.checked;
                console.log(e.target.name + " toggled to " + e.target.checked)
            };
            element.checked = savingFrames;

        }
    },
    overlay: {
        tag: "overlay",
        attachEventHandlers: (element) => {
            element.onchange = (e) => {
                overlayMode = e.target.checked;
                console.log(e.target.name + " toggled to " + e.target.checked)
            };
            element.checked = overlayMode;
        }
    },
    next: {
        tag: "next",
        attachEventHandlers: (element) => {
            element.onclick = (e) => {
                generate();
                console.log(e.target.name + " button clicked");
            };
        }
    },
    save: {
        tag: "save",
        attachEventHandlers: (element) => {
            element.onclick = (e) => {
                saveFrame();
                console.log(e.target.name + " button clicked");
            };
        }
    },

};
function ready() {
    // let controlsElement = document.getElementById('controls');
    console.log("attaching click handlers");
    Object.values(controls).forEach(control => {
        let element = document.getElementById(control.tag);
        control.attachEventHandlers(element);
    });
};
document.addEventListener("DOMContentLoaded", ready);