class Sliders {
    // handles the noUIsliders
    constructor() {
        // creates sliders and connects spinboxes to them
        this.msrpSlider = document.getElementById("slider");
        this.pdYearSlider = document.getElementById("slider2");

        this.createSlider(
            this.msrpSlider, 
            [0,10000], 
            {
                "min": 0,
                "max": 10000
            },
            100
        );
        this.addNumInputs(
            this.msrpSlider, 
            document.getElementById("leftNum"), 
            document.getElementById("rightNum")
        );

        this.createSlider(
            this.pdYearSlider,
            [1970, 2025],
            {
                "min": 1970,
                "max": 2025
            },
            1
        );
        this.addNumInputs(
            this.pdYearSlider,
            document.getElementById("leftNum2"),
            document.getElementById("rightNum2")
        );
    }

    createSlider(slider, start, range, step) {
        // creates a double ended slider based on start, range, and step
        noUiSlider.create(slider, {
            start: start,
            step: step,
            range: range,
            connect: true,
            keyboardSupport: true,
            behaviour: "tap-drag"
        });
    }

    addNumInputs(slider, leftNum, rightNum) {
        // connects slider to 2 spinboxes
        slider.noUiSlider.on("update", function (values, handle) {
            if (handle === 0) {
                leftNum.value = Math.round(values[0]);
            }
            else {
                rightNum.value = Math.round(values[1]);
            }
        })

        leftNum.addEventListener("input", function () {
            slider.noUiSlider.setHandle(0, this.value);
        });

        rightNum.addEventListener("input", function () {
            slider.noUiSlider.setHandle(1, this.value);
        });
    }

    updateSlider(slider, options) {
        // updates individual slider options
        if (slider == "msrp") {
            slider = this.msrpSlider;
        }
        else if (slider == "pdYear") {
            slider = this.pdYearSlider;
        }

        slider.noUiSlider.updateOptions(options);
        this.msrpSlider.setAttribute("min", options["start"][0]);
        this.msrpSlider.setAttribute("max", options["start"][0]);
    }

    getValFromSlider(slider) {
        // returns values from slider
        if (slider == "msrp") {
            slider = this.msrpSlider;
        }
        else if (slider = "pdYear") {
            slider = this.pdYearSlider;
        }

        return slider.noUiSlider.get(true);
    }
}
