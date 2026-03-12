 document.addEventListener('DOMContentLoaded', () => {
    let countryList = {
        USD: "US",
    EUR: "FR",
    GBP: "GB",
    PKR: "PK",
    AED: "AE",
    INR: "IN",
    JPY: "JP",
    CAD: "CA"

    };

    let selects = document.querySelectorAll('.drop select');
    let frcur = document.getElementById('from-select');
    let tocur = document.getElementById('to-select');
    let message = document.getElementById('message');
    let btn = document.getElementById('btn');
 
    for (let select of selects) {
        for (let code in countryList) {
            if (countryList.hasOwnProperty(code)) {
                let newoption = document.createElement('option');
                newoption.value = code.toUpperCase();
                newoption.innerText = code;
                select.append(newoption);
            }
        }
        select.addEventListener('change', (evt) => {
            updateflag(evt.target);
        });
    }

    let updateflag = (element) => {
        let curcode = element.value;
        let countrycode = countryList[curcode];
        let newsource = `https://flagsapi.com/${countrycode}/flat/64.png`;
        let img = element.closest('.drop').querySelector('img');
        img.src = newsource;
    };

    let updaterate = async () => {
        let amount = document.getElementById('amount');
        let amtval = Number(amount.value);
        if (amtval === '' || amtval < 1) {
            amtval = 1;
        }
         const from=frcur.value.toUpperCase();
         const to=tocur.value.toUpperCase();
        let base_url = `https://api.frankfurter.app/latest?from=${from}&to=${to}`;
        try {
            let response = await fetch(base_url);
            let data = await response.json();
            let rates = data.rates[to];
            let finalamt = amtval * rates;
            message.innerText = `${amtval} ${frcur.value} = ${finalamt} ${tocur.value}`;
        } catch (eror) {
            message.innerText = "Error fetching rate";
        }
    };

    btn.addEventListener('click', (bt) => {
        bt.preventDefault();
        updaterate();
    });
});