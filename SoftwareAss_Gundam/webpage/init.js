// create slider handler object
const sliderHandler = new Sliders();

// create currency converter object
const currencyConverter = new CurrencyConverter();

// wait for user to upload a database and create sqliser object
initSqlJs({ wasmBinary }).then(SQL => {
    document.getElementById("upload").addEventListener("change",
        function(event) {
            let file = event.target.files[0];
            let reader = new FileReader();

            reader.onload = function(e) {
                let temp = new Uint8Array(e.target.result);
                let DB = new SQL.Database(temp);

                const sqliser = new SQLiser(DB, sliderHandler);
                
                // setting the msrp slider's min and max values
                let msrpQuery = "SELECT DISTINCT MSRP FROM catalog c ORDER BY MSRP ASC"
                let msrpRange = sqliser.search(msrpQuery)[0].values;
                let start = msrpRange[0][0];
                let end = msrpRange[msrpRange.length-1][0];
                sliderHandler.updateSlider("msrp", {
                    start: [start, end],
                    range: {
                        "min": start,
                        "max": end
                    }
                });
            }

            reader.readAsArrayBuffer(file);
        }
    )
})

// make extra columns appear depending on filters