import http from 'http';
import homePage from './views/home/index.html.js';
import styles from './content/styles/site.css.js';
import addBreedPage from './views/addBreed.html.js';
import addCatPage from './views/addCat.html.js';
import { v4 as uuidv4} from 'uuid';



const cats = [
    {
        id: 1,
        imageUrl: 'https://media.4-paws.org/f/8/0/5/f8055215b5cdc5dee5494c255ca891d7b7d33cd1/Molly_006-2829x1886-2726x1886.jpg',
        name: 'Pretty kitty',
        breed: 'bombay',
        description: 'sikem sana'
    },
    {
        id: 2,
        imageUrl: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
        name: 'Pretty kitty',
        breed: 'bombay',
        description: 'sikem sana'
    },
    {
        id: 3,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1667030474693-6d0632f97029?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0fGVufDB8fDB8fHww',
        name: 'Pretty kitty',
        breed: 'bombay',
        description: 'sikem sana'
    }, {
        id: 4,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg',
        name: 'Pretty kitty',
        breed: 'bombay',
        description: 'sikem sana'
    }
]

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
            })
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

server.listen(5000);
console.log('Server is listening on http://localhost:5000...');
