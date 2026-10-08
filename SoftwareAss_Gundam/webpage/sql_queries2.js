class SQLiser {
    constructor(DB, sliderHandler) {
        // get all relevant elements
        this.TableRef = document.getElementById("results")
        this.SubmitBtn = document.getElementById("submitBtn");
        this.sqlQuery = document.getElementById("sqlQuery");
        this.releaseRange = {
            date1: [
                document.getElementById("day1"),
                document.getElementById("month1"),
                document.getElementById("year1")
            ],
            date2: [
                document.getElementById("day2"),
                document.getElementById("month2"),
                document.getElementById("year2")
            ]
        };
        
        this.DB = DB; // database
        this.SH = sliderHandler; // slider handler object reference

        // adds event listener to submit query button
        this.SubmitBtn.addEventListener("click", (e) => {
            let userQuery = this.getUserQuery();
            console.log(userQuery);
            this.updateTable(this.search(userQuery));
        });

        // makes the table appear when everything is loaded up
        let result = this.search(`SELECT c."Order", c.Product_name, c.Release_date, c.Grade, c.MSRP, s.Continuity, c.First_appearance, s.Production_year
            FROM catalog c
            LEFT JOIN series s ON c.First_appearance = s.First_appearance
            LEFT JOIN grades g ON g.Grade = c.Grade`);
        let headings = result[0].columns;
        let data = result[0].values;

        // create table with additional options
        this.Table = $("#results").DataTable({
            data: data, // add data
            columns: headings.map(name => ({ // add columns without _
                title: name.replace("_", " "),
                footer: name.replace("_", " ")
            })),
            scrollX: false, // allow horizontal scrolling
            search: { // make it start search only once the user presses enter
                return: true
            },
            colReorder: true, // allow col reordering
            "order": [], // disables initial sorting
            language: {
                search: "Search all:",
                emptyTable: "No results found for your filters.",
                zeroRecords: "No matching records.",
                loadingRecords: "Loading...",
                infoEmpty: "No entries to show."
            },
            initComplete: function () {
                this.api().columns().every(function () {
                    let column = this;
                    let title = column.footer().textContent;

                    // create and style select dropdown
                    let select = document.createElement("select");
                    select.className = "form-select form-select-sm mb-1";
                    select.innerHTML = `
                    <option value="contains">Contains</option>
                    <option value="starts">Starts with</option>
                    <option value="ends">Ends with</option>
                    <option value="equals">Equals</option>
                    <option value="notEquals">Not equals</option>
                    <option value="notContains">Does not contain</option>
                    `;

                    // create and style input field
                    let input = document.createElement("input");
                    input.className = "form-control form-control-sm";
                    input.placeholder = title;

                    // wrap in flex container for alignment
                    let wrapper = document.createElement("div");
                    wrapper.className = "d-flex flex-column align-items-stretch"; 
                    wrapper.appendChild(select);
                    wrapper.appendChild(input);

                    column.footer().replaceChildren(wrapper);

                    // filtering logic with regex
                    function applyFilter() {
                        let val = input.value;
                        let type = select.value;

                        let pattern = "";
                        switch (type) {
                            case "contains": pattern = val; break;
                            case "starts": pattern = "^" + val; break;
                            case "ends": pattern = val + "$"; break;
                            case "equals": pattern = "^" + val + "$"; break;
                            case "notEquals": pattern = "^(?!" + val + "$).*"; break;
                            case "notContains": pattern = "^(?!.*" + val + ").*$"; break;
                        }

                        column.search(pattern, true, false).draw();
                    }

                    input.addEventListener("input", applyFilter);
                    select.addEventListener("change", applyFilter);
                });
            }
        });
    }

    getUserQuery() {
        // conditions array
        let conds = [];

        // filters and collects all of the values of the ticked checkboxes
        let contVals = [...document.querySelectorAll(".continuityCheckbox")]
            .filter(cb => cb.checked)
            .map(cb => `'${cb.value}'`)
        let scaleVals = [...document.querySelectorAll(".scaleCheckbox")]
            .filter(cb => cb.checked)
            .map(cb => `'${cb.value}'`)
        let gradeVals = [...document.querySelectorAll(".gradeCheckbox")]
            .filter(cb => cb.checked)
            .map(cb => `'${cb.value}'`)

        // add continuity conditions
        if (contVals.length > 0) {
            conds.push(`s.Continuity IN (${contVals.join(",")})`);
        } else {
            conds.push(`1 = 0`); // forces no results
        }

        // add scale conditions
        if (scaleVals.length > 0) {
            conds.push(`g.Scale IN (${scaleVals.join(",")})`);
        } else {
            conds.push(`1 = 0`); // forces no results
        }

        // add grade conditions
        if (gradeVals.length > 0) {
            conds.push(`c.Grade IN (${gradeVals.join(",")})`);
        } else {
            conds.push(`1 = 0`); // forces no results
        }

        // add production year condition
        let prodRange = this.SH.getValFromSlider("pdYear");
        conds.push(`s.Production_year BETWEEN ${Number(prodRange[0])} AND ${Number(prodRange[1])}`);

        // add msrp condiiton
        let msrpRange = this.SH.getValFromSlider("msrp");
        conds.push(`c.MSRP BETWEEN ${msrpRange[0]} AND ${msrpRange[1]}`);

        // add release date condition
        let d1 = this.releaseRange.date1;
        let d2 = this.releaseRange.date2;
        let pad = n => n.toString().padStart(2, "0");

        let date1 = `${d1[2].value}-${pad(d1[1].value)}-${pad(d1[0].value)}`;
        let date2 = `${d2[2].value}-${pad(d2[1].value)}-${pad(d2[0].value)}`;

        conds.push(`c.Release_date BETWEEN '${date1}' AND '${date2}'`);

        // final query
        return `
            SELECT c."Order", c.Product_name, c.Release_date, c.Grade, c.MSRP, s.Continuity, c.First_appearance, s.Production_year
            FROM catalog c
            LEFT JOIN series s ON c.First_appearance = s.First_appearance
            LEFT JOIN grades g ON g.Grade = c.Grade
            WHERE ${conds.join(" AND ")}
        `;
    }


    search(query) {
        // asks database to execute a query
        return this.DB.exec(query);
    }

    updateTable(result) {
        // updates table based on the result of a query

        // removes data within table
        this.Table.clear();

        // gets and adds data to table
        if (result.length > 0) {
            let data = result[0].values;
            this.Table.rows.add(data);
        }

        // draws table
        this.Table.draw();
    }
}