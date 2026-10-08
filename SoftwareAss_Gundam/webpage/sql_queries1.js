class SQLiser {
    constructor(DB, sliderHandler) {
        // get all elements
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
        
        // base query
        this.baseQuery = `
        SELECT c."Order", c.Product_name, c.Release_date, c.Grade, c.MSRP, s.Continuity, c.First_appearance FROM catalog c
        JOIN series s ON c.First_appearance=s.First_appearance
        `;
        this.baseQuery2 = "JOIN grades g ON g.Grade=c.Grade"

        // adds event listener to submit query button
        this.SubmitBtn.addEventListener("click", (e) => {
            let userQuery = this.getUserQuery();
            console.log(userQuery);
            this.updateTable(this.search(userQuery));
        });

        // makes the table appear when everything is loaded up
        this.updateTable(this.search(`${this.baseQuery} ${this.baseQuery2}`));
    }

    getUserQuery() {
        let seriesConds = [];
        let gradesConds = [];
        let whereConds = [];

        // --- SERIES CONDITIONS ---
        let contCBs = document.querySelectorAll(".continuityCheckbox");
        let continuities = [];
        contCBs.forEach(cont => {
            if (cont.checked) continuities.push(`'${cont.value}'`);
        });
        if (continuities.length > 0) {
            seriesConds.push(`s.Continuity IN (${continuities.join(",")})`);
        }

        let prodRange = this.SH.getValFromSlider("pdYear");
        seriesConds.push(`s.Production_year BETWEEN ${Number(prodRange[0])} AND ${Number(prodRange[1])}`);

        // --- GRADES CONDITIONS ---
        let scaleCBs = document.querySelectorAll(".scaleCheckbox");
        let scales = [];
        scaleCBs.forEach(scale => {
            if (scale.checked) scales.push(`'${scale.value}'`);
        });
        if (scales.length > 0) {
            gradesConds.push(`g.Scale IN (${scales.join(",")})`);
        }

        // --- WHERE CONDITIONS ---
        let gradeCBs = document.querySelectorAll(".gradeCheckbox");
        let grades = [];
        gradeCBs.forEach(grade => {
            if (grade.checked) grades.push(`'${grade.value}'`);
        });
        if (grades.length > 0) {
            whereConds.push(`c.Grade IN (${grades.join(",")})`);
        }

        let msrpRange = this.SH.getValFromSlider("msrp");
        whereConds.push(`c.MSRP BETWEEN ${msrpRange[0]} AND ${msrpRange[1]}`);

        let date1 = this.releaseRange["date1"];
        let date2 = this.releaseRange["date2"];
        let pad = n => n.toString().padStart(2, "0");
        whereConds.push(
            `c.Release_date BETWEEN '${date1[2].value}-${pad(date1[1].value)}-${pad(date1[0].value)}'` +
            ` AND '${date2[2].value}-${pad(date2[1].value)}-${pad(date2[0].value)}'`
        );

        // --- BUILD JOIN CLAUSES CLEANLY ---
        let seriesJoin = this.baseQuery.trim();
        if (seriesConds.length > 0) {
            seriesJoin += " AND " + seriesConds.join(" AND ");
        }

        let gradesJoin = this.baseQuery2.trim();
        if (gradesConds.length > 0) {
            gradesJoin += " AND " + gradesConds.join(" AND ");
        }

        // --- FINAL QUERY ---
        return `
        ${seriesJoin}
        ${gradesJoin}
        WHERE ${whereConds.join(" AND ")}
            `.trim();
    }


    search(query) {
        // asks database to execute a query
        return this.DB.exec(query);
    }

    updateTable(result) {
        // updates table based on the result of a query

        // destroys the table in order to be able to change the columns
        try {
            if (this.Table) {
                this.Table.destroy();
            }
            $("#results").empty();
        }
        catch (error) {
            console.log(error)
        }

        // gets heading and data
        let headings = result[0].columns;
        let data = result[0].values;

        // recreates the table with additional options
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
            language: { // change search bar on top right to say "search all"
                search: "Search all:"
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
}