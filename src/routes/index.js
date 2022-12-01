require('dotenv').config();
const axios = require('axios');

const { Router } = require('express');
const {Videogame, Genre} = require('../db')
const{API_KEY} = process.env
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();
const getAllVideogamesApi = async() => {
    let url = `https://api.rawg.io/api/games?key=${API_KEY}`
    let videojuegos = []
    try {
        for(let i=0; i<5; i++) { //con un for recorro mi API, ya que es un arreglo, 5 veces
            const respuesta = await axios.get(url) //realizo la peticion
            //en mi .data podemos encontrar dos propiedades, results que es es aquello que voy a mapear
            respuesta.data.results.map(el => { //a la respuesta/resultado lo mapeo
                videojuegos.push({ //y pusheo en mi array vacio todo aquello que mapee
                    id: el.id,
                                    name: el.name,
                                    description: el.description,
                                    released: el.released,
                                    image: el.background_image,
                                    rating: el.rating,
                                    platforms: el.platforms,
                                    genres: el.genres,
                })
            });
            //y next que es donde voy a entrar para pasar a la siguente pagina.
            url = respuesta.data.next
        }
        return videojuegos

    } catch(e) {
        console.log(e)
    }
};
const getAllVideogamesDb = async()=>{
    const gameDb = await Videogame.findAll({
        include: {
            model: Genre,
            attribute: ['name'],
            through:{
                attributes: []
            }
        }
    })
    return gameDb;
}
const getAllVideoGames = async()=>{
    const rec1 = await getAllVideogamesApi()
    const rec2 = await getAllVideogamesDb()
    const videoGames = rec2.concat(rec1)
    return videoGames;
}



router.get('/videogame', async(req, res)=>{
    const name = req.query.name;
    try{
        
     let allGames = await getAllVideoGames()
        if(name){
            const games = await allGames.filter(r=> r.name.toLowerCase().includes(name.toLowerCase()))
            games.length ? 
        res.status(200).send(games):
        res.status(404).send("videogame no encontrada")}
        else{
            res.status(200).send(allGames)
        }
    } catch (error) {
        res.status(404).send('No encontrado')
    }
})
router.get('/videogame/:id',async(req,res)=>{
    const id = req.params.id
    try{
        if(id.length < 15){
    const resuApi = await axios(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
    if(resuApi){
     const videogame = {
     id: resuApi.data.id,
     name: resuApi.data.name,
     released: resuApi.data.released,
     image: resuApi.data.background_image,
     rating: resuApi.data.rating,
        description: resuApi.data.description.replace(/<[^>]*>?/g, ''),
     platforms: resuApi.data.platforms.map((e) => e.platform.name   ),
     Genres: resuApi.data.genres.map((el)=>el.name),
                }
                return res.json(videogame)
            }
        }
            let resuDb = await Videogame.findByPk(id)
            if(resuDb){
                let GenreDb = await resuDb.getGenres()
                let Genres = GenreDb.map(d=> d.dataValues.name)
                return res.json({...resuDb.dataValues, Genres})
            }
        }catch(error){
            res.status(404).send('Error')
        }
  }),
router.get("/genres", async (req,res) =>{
   try {
     const apiGenreInfo = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
      const { results } = apiGenreInfo.data;
      for (let i = 0; i < results.length; i++) {
        const { name } = results[i];
       await Genre.findOrCreate({
          where: { name: name },
        });
      }
      let allGenres = await Genre.findAll();
      res.status(200).json(allGenres);
   } catch (error) {
    res.status(404).send('Error')
   }
})
router.post("/creategame", async (req,res) =>{
    const {  
        name, description,  released, rating, platforms, image, Genres
   } = req.body;
   try{ 
    let newVideogame = await Videogame.create({
        name,
        description, 
        released,
        rating,
        platforms,
        image
    })
  let findGenres = await Genre.findAll({
     where: {name: Genres } 
    });
    newVideogame.addGenres(findGenres);
    res.send("VideoGame Created Successfully")  
}catch(error){
  res.status(404).send("Error en la ruta de Post")
}
})


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
