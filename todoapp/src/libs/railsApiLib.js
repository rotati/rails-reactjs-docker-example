// import config from '../config';

export async function invokeRailsApi({
    path,
    method = "GET",
    headers =  {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    queryParams = {},
    body
    }) {
  
      var url = 'http://localhost/notes'
  
      body = body ? JSON.stringify(body) : body;
      // headers = signedRequest.headers;
      console.log("URL: ", url);
      console.log("Method", method);
      console.log("Headers", headers);
  
      const results = await fetch(url, {
        method,
        headers,
        body
      });
  
      if (results.status !== 200) {
        console.log("ERROR!", results.text());
        throw new Error(await results.text());
      }
  
      return results.json();
  }