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


//function importArticle:

//1. takes 2 arguments:
//  url - endpoint for fetching the resource
//  tag - HTML node and it's contents that are fetched (in this case article)

//2. declares:
//  const endpointUrl - the url where the resource is located
//  let stringToDisplay - an empty string

//3. fetches the resource located at the url
//  then returns text html from Response object
//  then returns Document object from text html
//  then returns NodeList of the given tag from Document object
//  then iterates over NodeList: 
//  - on each element walkTheDOM() function is called recursively, stringToDisplay is appended in the process from nodes that are #text and not SCRIPT or STYLE
//  - at the end stirngToDisplay is returned
//  then stringToDisplay is passed to renderText() function

function importArticle(url, tag) {

        const endpointUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        let stringToDisplay = '';

        fetch(endpointUrl)
            .then(response => response.text())
            .then(html => {
                const domParser = new DOMParser();
                return domParser.parseFromString(html, 'text/html')
            })
            .then(document =>  {
                const matches = document.querySelectorAll(tag);
                return matches;
            })
            .then(nodeList => {
                for(const node of nodeList) {
                    walkTheDOM(node, (node) => {
                        if(node.nodeName === '#text' && node.parentNode.nodeName !== "SCRIPT" && node.parentNode.nodeName !== "STYLE") {
                            stringToDisplay += node.data;
                        }
                    })
                }
                return stringToDisplay
            })
            .then(stringToDisplay => renderText(stringToDisplay)
            )
}

//function walkTheDOM:
//1. takes 2 arguments:
//  node - the node to walk
//  func - callback
//2. calls function on each deepest nested node

function walkTheDOM(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
        walkTheDOM(node, func);
        node = node.nextSibling;
    }
}


//function renderText
//1. takes 1 argument:
//  string - stringto render
//2. declares:
//  const renderedText - node used to render string from fetched url
//3. assigns string to the renderedText's textContent property
function renderText(string) {
    const renderedText = document.querySelector('.text');
    renderedText.textContent = string;
}

importArticle('https://www.nrk.no/urix/stormen-_boris_-herjer-i-sentral-europa-1.17044040', 'article')




