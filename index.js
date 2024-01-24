        const apiKey = '8f0c8310124c3ba0e659bd74';
        async function fetchCurrencyRates(baseCurrency) {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        async function setCurrencyOptions() {
            try {
                const data = await fetchCurrencyRates('USD');
                const currencyOptions = Object.keys(data.conversion_rates).sort();
                const fromCurrencySelect = document.getElementById('from-currency');
                const toCurrencySelect = document.getElementById('to-currency');
                currencyOptions.forEach(currency => {
                    fromCurrencySelect.add(new Option(currency, currency));
                    toCurrencySelect.add(new Option(currency, currency));
                });
            } catch (error) {
                console.error(error);
            }
        }
        async function convertCurrency() {
            const amount = document.getElementById('amount').value;
            const fromCurrency = document.getElementById('from-currency').value;
            const toCurrency = document.getElementById('to-currency').value;
            const resultElement = document.getElementById('result');
            const exchangeRateInfoElement = document.getElementById('exchangeRateInfo'); // Dodano element do wyświetlania kursu
            try {
                const rates = await fetchCurrencyRates(fromCurrency);
                const rate = rates.conversion_rates[toCurrency];
                const result = (amount * rate).toFixed(2);
                exchangeRateInfoElement.textContent = `1 ${fromCurrency} = ${rate.toFixed(2)} ${toCurrency}, 1 ${toCurrency} = ${(1 / rate).toFixed(2)} ${fromCurrency}`;
                resultElement.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
            } catch (error) {
                resultElement.textContent = 'Błąd podczas konwersji.';
                console.error(error);
            }
        }
        document.getElementById('currency-converter').addEventListener('submit', function(event) {
            event.preventDefault();
            convertCurrency();
        });
        document.getElementById('swap-currency').addEventListener('click', function() {
            const fromCurrency = document.getElementById('from-currency');
            const toCurrency = document.getElementById('to-currency');
            const tempValue = fromCurrency.value;
            fromCurrency.value = toCurrency.value;
            toCurrency.value = tempValue;
        });
        setCurrencyOptions();