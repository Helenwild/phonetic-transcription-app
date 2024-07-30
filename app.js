document.getElementById('transcriptionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const sentence = document.getElementById('sentence').value;
    console.log('Form submitted with sentence:', sentence); // Debugging log
    getPhoneticTranscription(sentence);
});

async function getPhoneticTranscription(sentence) {
    const apiKey = '45ada2c23b615c39573d30efa23b0b3b';
    const appId = 'b0942aed';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = `https://od-api-sandbox.oxforddictionaries.com/api/v2/entries/en-gb/${encodeURIComponent(sentence.toLowerCase())}`;
    const url = proxyUrl + targetUrl;
    console.log('Fetching URL:', url); // Debugging log

    try {
        const response = await fetch(url, {
            headers: {
                'app_id': appId,
                'app_key': apiKey
            }
        });

        console.log('Response status:', response.status); // Debugging log

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API response data:', data); // Debugging log
        displayTranscription(data);
    } catch (error) {
        console.error('Error fetching the phonetic transcription:', error);
    }
}

function displayTranscription(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (data.results && data.results.length > 0) {
        const lexicalEntries = data.results[0].lexicalEntries;
        lexicalEntries.forEach(entry => {
            entry.entries.forEach(e => {
                e.pronunciations.forEach(pronunciation => {
                    if (pronunciation.phoneticSpelling) {
                        const p = document.createElement('p');
                        p.textContent = pronunciation.phoneticSpelling;
                        resultDiv.appendChild(p);
                    }
                });
            });
        });
    } else {
        resultDiv.textContent = 'No phonetic transcription found.';
    }
}