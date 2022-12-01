

const {PORT} = process.env.PORT || 3000
const {DB_USER} = process.env.DB_USER ||' postgres'
 const DB_PASSWORD =process.env.DB_PASSWORD || `40990161em`
 const DB_HOST = process.env.DB_HOST || 'localhost'
 const DATABASE = process.env.DATABASE || 'videogames'


 module.exports ={
    PORT,
    DB_USER
 }

 Videogame.belongsToMany(Genre,{through: "Videogame_Genre"})
 Genre.belongsToMany(Videogame,{through: "Videogame_Genre"})