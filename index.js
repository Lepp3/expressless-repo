import http from 'http';
import homePage from './views/home/index.html.js';
import styles from './content/styles/site.css.js';
import addBreedPage from './views/addBreed.html.js';
import addCatPage from './views/addCat.html.js';
import shelterCatPage from './views/catShelter.html.js';
import editCatPage from './views/editCat.html.js';
import { v4 as uuidv4} from 'uuid';
import fs from 'fs/promises';



let cats = [];
let breeds = [];

initCats();
initBreeds();

const server = http.createServer((req,res)=>{

    if(req.method === 'POST'){
        let body = '';
        req.on('data', chunk=>{
            body += chunk.toString();
        });

        req.on('end', ()=>{
            const data  = new URLSearchParams(body);
            if(req.url === '/cats/add-cat'){
            let id = uuidv4();
            cats.push({
                id:id,
                ...Object.fromEntries(data.entries()),
            });

            saveCats();

            res.writeHead(302, {
                'location': '/',
            });
            }else if(req.url === '/cats/add-breed'){
                let id = uuidv4();
                breeds.push({
                    id: id,
                    ...Object.fromEntries(data.entries())
                });
                
                console.log(data);
                saveBreeds();
                res.writeHead(302,{
                    'location': '/',
                });
            }else if(req.url.includes('/delete')){
                const id = req.url.split('/')[2];
                cats = cats.filter((cat)=>cat.id !== id);
                saveCats();
                res.writeHead(302,{
                    'location': '/',
                })
            }else if(req.url.includes('/edit/')){
                const id = req.url.split('/')[2];
                const index = cats.findIndex(cat=>cat.id == id);
                let dataInput = Object.fromEntries(data.entries());
                let firstHalf = cats.slice(0,index);
                let secondHalf = cats.slice(index);
                let edittedCat = {
                    id:id,
                    ...Object.fromEntries(data.entries())
                }
                firstHalf.push(edittedCat,...secondHalf);
                cats = firstHalf;
                saveCats();
                res.writeHead(302,{
                    'location': '/',
                })
            }

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

    if(req.url === '/'){
        res.write(homePage(cats));
    }else if(req.url === '/cats/add-cat'){
        res.write(addCatPage());
    }else if(req.url === '/cats/add-breed'){
        res.write(addBreedPage());
    }else if(req.url.includes('/cats-find-new-home')){
        let id = req.url.split('/')[2];
        let cat = cats.find((cat)=>cat.id === id);
        res.write(shelterCatPage(cat));
    }else if(req.url.includes('/cats-edit')){
        let id = req.url.split('/')[2];
        let cat = cats.find((cat)=>cat.id === id);
        res.write(editCatPage(cat,breeds));
    }else{
        res.write('Page not found')
    }
    
    res.end();

});


async function initCats(){
    const catsJson = await fs.readFile('./cats.json',{encoding: 'utf-8'});
    cats = JSON.parse(catsJson);
}

async function saveCats(){
    const catsJson = JSON.stringify(cats,null,2);
    await fs.writeFile('./cats.json',catsJson,{encoding: 'utf-8'});
}

async function initBreeds(){
    const breedsJson = await fs.readFile('./breeds.json',{encoding:'utf-8'});
    breeds = JSON.parse(breedsJson);
}

async function saveBreeds(){
    const breedsJson = JSON.stringify(breeds,null,2);
    await fs.writeFile('./breeds.json',breedsJson,{encoding: 'utf-8'});
}

server.listen(5000);
console.log('Server is listening on http://localhost:5000...');
