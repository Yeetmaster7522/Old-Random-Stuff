class CurrencyConverter {
    constructor() {
        // controls two text inputs that only accepts number and decimal inputs
        // and outputs the conversion between yen and aud

        this.audInput = document.getElementById("aud");
        this.yenInput = document.getElementById("yen");

        // event listener for aud input
        this.audInput.addEventListener("input", (e) => {
            let raw = e.target.value.replace(/[^\d.]/g, ""); // remove anything not a decimal or number
            
            // only allowing input of up to 2 d.p.
            let parts = raw.split(".");
            if (parts.length > 1) {
                parts[1] = parts[1].slice(0, 2);
                raw = parts[0] + "." + parts[1];
            }

            // set value of aud and yen input
            if (raw.length > 0) {
                e.target.value = "$" + raw; // set aud input value
                this.yenInput.value = `¥${Math.floor(this.convertToYen(Number(raw)))}`; // set yen input value and floors the output as yen does not have decimals
            }
            else {
                // if there is nothing inputted both yen and aud inputs will be set to nothing
                e.target.value = "";
                this.yenInput.value = "";
            }
        });

        // event listener for yen input
        this.yenInput.addEventListener("input", (e) => {
            let raw = e.target.value.replace(/[^\d]/g, ""); // remove anything not a number
            if (raw.length > 0) {
                e.target.value = "¥" + raw; // set yen input value
                this.audInput.value = `$${this.convertToAud(Number(raw)).toFixed(2)}` // set aud input value and limits output to 2 d.p.
            }
            else {
                // if there is nothing inputted both yen and aud inputs will be set to nothing
                e.target.value = "";
                this.audInput.value = "";
            }
        });
    }

    convertToAud(num) {
        // converts number (presumably in yen) into aud
        return num * 0.0096;
    }

    convertToYen(num) {
        // converts number (presumably in aud) into yen
        return num * 104;
    }
}