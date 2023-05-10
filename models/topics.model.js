const db =require('../db/connection')
const fs= require('fs/promises')

exports.selectTopics = ()=>{
    return db.query(`
        SELECT * FROM topics;
    `)
}

exports.fetchApi = () => {
    return fs.readFile('./endpoints.json', 'utf-8', (err, data) => {
        return data;
    })
    .then((data) => {
        return JSON.parse(data);
    })
}