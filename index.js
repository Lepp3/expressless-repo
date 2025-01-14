import http from 'http';
import homePage from './views/home/index.html.js';
import styles from './content/styles/site.css.js';
import addBreedPage from './views/addBreed.html.js';
import addCatPage from './views/addCat.html.js';
import { v4 as uuidv4} from 'uuid';
import fs from 'fs/promises';



let cats = [];

initCats();

const server = http.createServer((req,res)=>{

    if(req.method === 'POST'){
        let body = '';
        req.on('data', chunk=>{
            body += chunk.toString();
        });

        req.on('end', ()=>{
            const data  = new URLSearchParams(body);
            let id = uuidv4();
            cats.push({
                id:id,
                ...Object.fromEntries(data.entries()),
            });

            saveCats();

            res.writeHead(302, {
                'location': '/',
            });
            

            res.end();
        });

        return;
    }

    // load assets
    if(req.url === '/styles/site.css'){
        res.writeHead(200,{
            'content-type':'text/css'
        });

        res.write(styles);
        return res.end();
    }

    res.writeHead(200,{
        'content-type': 'text/html'
    })

    switch(req.url){
        case '/':
            res.write(homePage(cats));
            break;
        case '/cats/add-breed':
            res.write(addBreedPage());
            break;
        case '/cats/add-cat':
            res.write(addCatPage());
            break;

        default:
            res.write('Page not found');
            break;
    }
    
    res.end();

});


async function initCats(){
    const catsJson = await fs.readFile('./cats.json',{encoding: 'utf-8'});
    cats = JSON.parse(catsJson);
}

async function saveCats(){
    const catsJson = JSON.stringify(cats,null,2);
    await fs.writeFile('./cats.json/',catsJson,{encoding: 'utf-8'});
}

server.listen(5000);
console.log('Server is listening on http://localhost:5000...');
