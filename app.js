/**
 * Creado por Freddy Pérez - 30-11-20.
 */
const cardContainer = document.getElementById('card-container')

const templateCard = document.getElementById('template-card').content

const btnPrev = document.getElementsByClassName('prev')

const btnNext = document.getElementsByClassName('next')

const filterList = document.getElementById('lista-filtros')
const categoriesList = document.getElementById('lista-categorias')

const species = ['Human', 'Alien', 'Humanoid', 'Poopybutthole', 'Mythological Creature', 'Animal'
    , 'Robot', 'Cronenberg', 'Disease', 'unknown']

const genders = ['Male', 'Female', 'Genderless', 'unknown']

const status = ['alive', 'dead', 'unknown']


const fragment = document.createDocumentFragment();

const url = 'https://rickandmortyapi.com/api/character/'
let next = '';
let prev = '';


document.addEventListener('DOMContentLoaded', () => {
    //fetchPersonajes(url)
    fetchAllLocations()
    Array.from(btnNext).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            fetchPersonajes(next)
            window.scrollTo({top: 200, behavior: 'smooth'})
        })
    })

    Array.from(btnPrev).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            fetchPersonajes(prev)
            window.scrollTo({top: 200, behavior: 'smooth'})
        })
    })


})

const fetchPersonajes = async (page, sel) => {
    cardContainer.innerHTML = '<div class="loader"></div>';
    try{
        const respuesta = await fetch(page)
        const data = await respuesta.json()
        let dataRes = data.results
        next = data.info.next
        prev = data.info.prev
        prev ?
            Array.from(btnPrev).forEach((btn) => {
                btn.classList.remove('d-none')
            })
        :
            Array.from(btnPrev).forEach((btn) => {
                btn.classList.add('d-none')
            })

        sel ? filterPass(dataRes, sel):filterPass(dataRes)
    }catch(error){
        console.log(error)
        cardContainer.innerHTML = '<div class="alert">No se puede cargar los datos desde el API</div>'
    }
}

const renderPersonajes = (personajes) => {
    personajes.forEach(personaje => {
        //console.log(personaje.name)

        templateCard.querySelector(".title").textContent = personaje.name
        templateCard.querySelector('.img').src = personaje.image
        templateCard.querySelector('#especie').textContent = personaje.species
        templateCard.querySelector('#genero').textContent = personaje.gender
        templateCard.querySelector('#estado').textContent = personaje.status
        templateCard.querySelector('#origen').textContent = personaje.origin.name

        const clone = templateCard.cloneNode(true)

        fragment.appendChild(clone)
    })
    cardContainer.innerHTML = '';
    cardContainer.appendChild(fragment)
}

const filterSelect = (sel) => {
    sel.value != 'alphabetic' ? filterList.disabled = false : filterList.disabled = true
    fetchPersonajes(url, sel)
    console.log(sel.value)
}


const filterPass = (data, sel) => {
    if(sel){
        //populate filterlist
        switch(sel.value){
            case 'alphabetic' : orderAlphabetic(data)
                break
            case 'species' : populateFilter(data, species)
                break
            case 'gender' : populateFilter(data, genders)
                break
            case 'status' : populateFilter(data, status)
                break
            default: renderPersonajes(data)
        }
    }else{
        renderPersonajes(data)
    }
}

const orderAlphabetic = (data) => {
    const orderData = data.sort( (a, b) => a.name.localeCompare(b.name))
    renderPersonajes(orderData)
}

const populateFilter = (data, filters) => {
    console.log(data)
    filters.forEach(filter => {
        const option = document.createElement('option')
        option.appendChild(document.createTextNode(filter))
        option.value = filter
        filterList.appendChild(option)
    })
    renderPersonajes(data)
}

const filterPersonajes = (sel) => {
    console.log(sel.value)
    const filterValue = categoriesList.value
    let newUrl = url
    switch(filterValue){
        case 'species' :
            newUrl = url + '?species=' + sel.value
            console.log(newUrl)
            break
        case 'status' :
            newUrl = url + '?status=' + sel.value
            console.log(newUrl)
            break
        case 'gender' :
            newUrl = url + '?gender=' + sel.value
            console.log(newUrl)
            break
    }
    fetchPersonajes(newUrl)
    console.log(next)
}
const fetchDimensions = async () => {
    const __url = 'https://rickandmortyapi.com/api/location'
    const fetched = await fetch(__url)
    const dataJson = await fetched.json()
    dataJson.results.forEach(res => {
        console.log(res.dimension)
    })
}





/**************
 * Esta Función iba a traer cada personaje del API y luego procesar como "ordenar de manera alfabetica",
 * pero se demora mucho en cargar los 671 registros asi que solo ordenare los 20 resultados que llegan
 * en cada fetch
 * **/
const fetchAllLocations = async () => {
    let pagesRequired = 0

    const resp = await fetch('https://rickandmortyapi.com/api/location/')
    const data = await resp.json()

    const apiPromises = []
    pagesRequired = data.info.count

    for (let i = pagesRequired; i > 0; i--) {
        const allFetch = await fetch('https://rickandmortyapi.com/api/location/' + i)
        apiPromises.push(await allFetch.json());
    }
    Promise.all(apiPromises)
        .then(responses => {
            const processedResponses = []
            responses.map(response => {
                processedResponses.push(response)
            })
            //Aca se iba a retornar o procesar los datos
            let dimens = {}
            let unique = processedResponses.filter((current)=>{
                if(current.dimension in dimens){
                    return false
                }else{
                    dimens[current.dimension] = true
                    return true
                }
            })
            unique.forEach(res => {
                console.log(res.dimension)
            })

        })
}

