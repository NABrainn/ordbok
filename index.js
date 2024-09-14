//translate API
async function translateText(text, sourceLang, targetLang) {
    const endpointsUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://raw.githubusercontent.com/Uncover-F/TAS/Uncover/.data/endpoints.json');

    try {
        const endpointsResponse = await fetch(endpointsUrl);
        if (!endpointsResponse.ok) {
            throw new Error(`Error fetching endpoints: ${endpointsResponse.status} - ${endpointsResponse.statusText}`);
        }
        const endpointsData = await endpointsResponse.json();
        const endpoints = JSON.parse(endpointsData.contents);

        for (const endpoint of endpoints) {
            const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`${endpoint}?text=${encodeURIComponent(text)}&source_lang=${sourceLang}&target_lang=${targetLang}`)}`;
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    const parsedContents = JSON.parse(data.contents);
                    return parsedContents.response.translated_text;
                } else {
                    console.error(`Error at ${endpoint}: ${response.status} - ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Request exception at ${endpoint}:`, error);
            }
        }
        throw new Error('All endpoints failed.');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

