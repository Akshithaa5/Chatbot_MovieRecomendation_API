import axios from 'axios';

const cache = {}; // Simple in-memory cache for demonstration purposes

async function fetchMovieDetails(title) {
  const cacheKey = encodeURIComponent(title);
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const rapidapiUrl = `https://streaming-availability.p.rapidapi.com/search?query=${encodeURIComponent(title)}`;
  try {
    const response = await axios.get(rapidapiUrl, {
      headers: {
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      },
    });
    cache[cacheKey] = response.data; // Cache the result
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) { // Rate limit error
      console.error('Rate limit exceeded. Please try again later.');
    }
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests are allowed' });
  }

  const { message } = req.body;

  try {
    const omdbApiKey = process.env.OMDB_API_KEY;
    
    const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${encodeURIComponent(message)}&type=movie`;
    const omdbResponse = await axios.get(omdbUrl);

    if (omdbResponse.data.Response === "True") {
      const movies = omdbResponse.data.Search.map(movie => movie.Title).filter(title => title !== "undefined");

      if (movies.length > 0) {
        const movieDetailsPromises = movies.map(async (title) => {
          try {
            const rapidapiResponse = await fetchMovieDetails(title);
            return {
              title,
              streamingInfo: rapidapiResponse.results.map(result => ({
                platform: result.platform,
                link: result.link,
              })),
            };
          } catch (error) {
            console.error('Error fetching movie details:', error.message);
            return {
              title,
              streamingInfo: [],
            };
          }
        });

        const movieDetails = await Promise.all(movieDetailsPromises);

        const replyMessage = movieDetails
          .map(movie => {
            const platforms = movie.streamingInfo
              .map(info => `${info.platform} (${info.link})`)
              .join(', ');
            return `${movie.title}: Available on ${platforms || 'unknown platforms'}`;
          })
          .join('\n');

        res.status(200).json({ message: replyMessage });
      } else {
        res.status(200).json({ message: 'No movies found for your query.' });
      }
    } else {
      res.status(200).json({ message: 'No movies found for your query.' });
    }
  } catch (error) {
    console.error('Error in API call:', error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}
