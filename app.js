/**
 * Creado por Freddy Pérez - 30-11-20.
 */
const cardContainer = document.getElementById('card-container')

const templateCard = document.getElementById('template-card').content

const btnPrev = document.getElementsByClassName('prev')

const btnNext = document.getElementsByClassName('next')



const fragment = document.createDocumentFragment();

const url = 'https://rickandmortyapi.com/api/character/?page=1'
let next = '';
let prev = '';


document.addEventListener('DOMContentLoaded', () => {
    fetchPersonajes(url)

    Array.from(btnNext).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            fetchPersonajes(next)
            window.scrollTo({top: 300, behavior: 'smooth'})
        })
    })

    Array.from(btnPrev).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            fetchPersonajes(prev)
            window.scrollTo({top: 300, behavior: 'smooth'})
        })
    })


})

const fetchPersonajes = async (page) => {
    try{
        const respuesta = await fetch(page)
        const data = await respuesta.json()
        next = data.info.next
        prev = data.info.prev
        if(prev) {
            Array.from(btnPrev).forEach((btn) => {
                btn.classList.remove('d-none')
            })
        }else{
            Array.from(btnPrev).forEach((btn) => {
                btn.classList.add('d-none')
            })
        }
        renderPersonajes(data)

    }catch(error){
        console.log(error)
    }
}

const fetchPrevPersonajes = async () => {

}

const renderPersonajes = (personajes) => {
    personajes.results.forEach(personaje => {
        console.log(personaje.name)

        templateCard.querySelector(".title").textContent = personaje.name
        templateCard.querySelector('.img').src = personaje.image
        templateCard.querySelector('#especie').textContent = personaje.species
        templateCard.querySelector('#genero').textContent = personaje.gender
        templateCard.querySelector('#estado').textContent = personaje.status
        templateCard.querySelector('#localizacion').textContent = personaje.location.name

        const clone = templateCard.cloneNode(true)

        fragment.appendChild(clone)
    })
    cardContainer.innerHTML = '';
    cardContainer.appendChild(fragment)
}



const filterPersonajes = (filter) => {

}