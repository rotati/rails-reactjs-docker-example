import config from '../config';

export async function invokeRailsApi({
    path,
    method = "GET",
    headers =  {},
    queryParams = {},
    body
    }) {
  
      var url = config.railsApiGateway.URL + path
  
      body = body ? JSON.stringify(body) : body;
  
      const results = await fetch(url, {
        method,
        headers,
        body
      });
  
      if (results.status !== 200) {
        throw new Error(await results.text());
      }
  
      return results.json();
  }