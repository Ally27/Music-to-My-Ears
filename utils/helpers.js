module.exports = {

  // formats date to Month Date, Year
    formatDate: (date) => {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = new Date(date).toLocaleString('en-US', options);
        return formattedDate;
      }
};

