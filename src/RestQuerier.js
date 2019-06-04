import base64 from 'base-64';

const username = 'admin';
const password = 'admin';

let headers = new Headers();

headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));

const getQuery = service =>
fetch(`http://localhost:8080/actuator/${service}`, {headers})
  .then(response => response.json())
  
export { getQuery };