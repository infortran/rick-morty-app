/**
 * Creado por Freddy Pérez - 30-11-20.
 */



document.addEventListener('DOMContentLoaded', ()=>{
    fetchPersonajes()
})

const fetchPersonajes = async () => {
    try{
        const respuesta = await fetch("https://rickandmortyapi.com/api/character/")
        const data = await respuesta.json()
        renderPersonajes(data)

    }catch(error){
        console.log(error)
    }
}

const renderPersonajes = (data) => {
    data.results.forEach(producto => {
        console.log(producto)
    })
}

const filterPersonajes = (filter) => {

}