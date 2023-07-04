const production = {
    url: 'https://your-production-backend-url.app'
  };
  
  const development = {
    url: 'http://localhost:4000'
  };
  
  export const config = process.env.NODE_ENV === 'development' ? development : production;