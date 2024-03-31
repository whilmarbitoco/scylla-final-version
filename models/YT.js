const {google} = require('googleapis');
const youtube = google.youtube('v3');



async function getMusic(query) {
    try {
        const response = await youtube.search.list({
            part: 'id',
            q: query,
            type: 'video'
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching music:', error);
        
    }
}

module.exports = getMusic;
