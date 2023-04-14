const axios = require("axios");

async function getTopTracks() {
  try {
    const rawData = await axios.get(
      "https://api.spotify.com/v1/playlists/03HusFeEsbdRBAVU88VF26",
      {
        headers: {
          Authorization: "Bearer BQCYzInUXj2vM9qsIsdFvKN1TOeNKlK5GN51B5cpcagdafBLZP9lrqH01Ivex0KIR0dTcdTu3-ZmbkDdlig1dheI4GA-f-HYC4Dj2mR4ZnLjcT1C3LRpBDL-Cqs5q1iGIWuIvdd-WMtjn8W7BqKJqWM2dVG3OnKktVzUIoX-NJLcBgSRCf4V2h4gjp8"
        },
      }
    )

    const rawTData = await axios.get(
        "https://api.spotify.com/v1/playlists/03HusFeEsbdRBAVU88VF26/tracks?limit=10&locale=en-US,en;q=0.5",
        {
          headers: {
            Authorization: "Bearer BQCYzInUXj2vM9qsIsdFvKN1TOeNKlK5GN51B5cpcagdafBLZP9lrqH01Ivex0KIR0dTcdTu3-ZmbkDdlig1dheI4GA-f-HYC4Dj2mR4ZnLjcT1C3LRpBDL-Cqs5q1iGIWuIvdd-WMtjn8W7BqKJqWM2dVG3OnKktVzUIoX-NJLcBgSRCf4V2h4gjp8"
          },
        }
      )
    
    // Handle the retrieved data here
    const data = rawData.data;
    const trackData = rawTData.data.items;
    const imageArr = data.images;
    const postLink = data.href;
    const playlistTitle = data.name;
    
    console.log(imageArr, postLink, playlistTitle,trackData)

  } catch (error) {
    console.error(error);
    // Handle the error here
  }
}

// Call the function to execute the code


