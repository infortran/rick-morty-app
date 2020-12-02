/**
 * Creado por Freddy Pérez - 30-11-20.
 */
const cardContainer = document.getElementById('card-container')

const templateCard = document.getElementById('template-card').content

const filterContainer = document.getElementById('filter-container')

const filterDimensions = document.getElementById('filter-dimensions').content

const filterNormal = document.getElementById('filter-normal').content

const switchDimensions = document.getElementById('switch-dimensions')

const btnPrev = document.getElementsByClassName('prev')

const btnNext = document.getElementsByClassName('next')

const species = ['...','Human', 'Alien', 'Humanoid', 'Poopybutthole', 'Mythological Creature', 'Animal',
    'Robot', 'Cronenberg', 'Disease', 'unknown']

const genders = ['...', 'Male', 'Female', 'Genderless', 'unknown']

const status = ['...', 'alive', 'dead', 'unknown']


const fragment = document.createDocumentFragment();

const url = 'https://rickandmortyapi.com/api/character/'
let next = null;
let prev = null;


document.addEventListener('DOMContentLoaded', () => {
    //init app
    fetchPersonajes(url)

    //cargar la vista de filtros normales
    const clone = filterNormal.cloneNode(true)
    filterContainer.appendChild(clone)

    //selecion de botones siguiente por clases
    Array.from(btnNext).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            if(next){
                fetchPersonajes(next)
                window.scrollTo({top: 200, behavior: 'smooth'})
            }else{
                btn.classList.add('d-none')
                btn.classList.remove('next')
            }
        })
    })

    //selecion de botones anterior por clases
    Array.from(btnPrev).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            if(prev) {
                fetchPersonajes(prev)
                window.scrollTo({top: 200, behavior: 'smooth'})
            }else{
                btn.classList.remove('d-none')
                btn.classList.add('next')
            }
        })
    })

    //Switch para cambiar a modo dimensiones
    switchDimensions.addEventListener('change', (e) => {
        changeFilterType(switchDimensions.checked)
    })

})


//funcion para traer los datos desde una url, ademas cambia el estado del boton previous y next
const fetchPersonajes = async (url, sel) => {
    cardContainer.innerHTML = '<div class="loader"></div>';
    try{
        const respuesta = await fetch(url)
        const data = await respuesta.json()
        let dataRes = data.results
        next = data.info.next
        prev = data.info.prev
        console.log(next)
        prev ?
            Array.from(btnPrev).forEach((btn) => {
                btn.classList.remove('d-none')
            })
        :
            Array.from(btnPrev).forEach((btn) => {
                btn.classList.add('d-none')
            })

        next ?
            Array.from(btnNext).forEach((btn) => {
                btn.classList.remove('d-none')
            })
            :
            Array.from(btnNext).forEach((btn) => {
                btn.classList.add('d-none')
            })

        sel ? filterPass(dataRes, sel):filterPass(dataRes)
    }catch(error){
        console.log(error)
        cardContainer.innerHTML = '<div class="alert">No se puede cargar los datos desde el API</div>'
    }
}

//Pintar los personajes en card-container
const renderPersonajes = personajes => {
    personajes.forEach(personaje => {
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

//onchange de select lista categorias
const filterSelect = sel => {
    const filterList = document.getElementById('lista-filtros')
    sel.value != 'alphabetic' ? filterList.disabled = false : filterList.disabled = true
    fetchPersonajes(url, sel)
}

//Pasar los datos por filtro o solo renderizar
const filterPass = (data, sel) => {
    if(sel){
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

//funcion que ordena los personajes alfabeticamente
const orderAlphabetic = data => {
    const orderData = data.sort( (a, b) => a.name.localeCompare(b.name))
    renderPersonajes(orderData)
    /*
    * PD. No me di mucho tiempo de perfeccionar esta funcion
     * ya que la lista de personajes ya venia ordenada de la A a la Z
    * */
}

//mostrar opciones segun el filtro que pasemos como parametro
const populateFilter = (data, filters) => {
    //console.log(data)
    const filterList = document.getElementById('lista-filtros')
    filterList.innerHTML = ''
    filters.forEach(filter => {
        const option = document.createElement('option')
        option.appendChild(document.createTextNode(filter))
        option.value = filter
        filterList.appendChild(option)
    })
    renderPersonajes(data)
}

//mostrar los filtros de acuerdo al select previo
const filterPersonajes = sel => {
    const categoriesList = document.getElementById('lista-categorias')
    const filterValue = categoriesList.value
    let newUrl = url
    switch(filterValue){
        case 'species' :
            newUrl = url + '?species=' + sel.value
            break
        case 'status' :
            newUrl = url + '?status=' + sel.value
            break
        case 'gender' :
            newUrl = url + '?gender=' + sel.value
            break
    }
    fetchPersonajes(newUrl)
}

//mostrar las dimensiones en el select de dimensiones
const populateDimensions = locations => {
    locations.forEach(res => {
        const filterDimensionList = document.getElementById('lista-dimensions')
        const option = document.createElement('option')
        const message = res.id +'- '+ res.dimension + ' - ' + res.name
        option.appendChild(document.createTextNode(message))
        option.value = res.id
        filterDimensionList.appendChild(option)
    })
}

//Esta funcion cambia los tipos de filtro entre normal y filtro de dimensiones
const changeFilterType = active => {
    filterContainer.innerHTML = '';
    if(active){
        const clone = filterDimensions.cloneNode(true)
        filterContainer.appendChild(clone)
        switchButtons(false)
        fetchAllLocations()
    }else{
        const clone = filterNormal.cloneNode(true)
        filterContainer.appendChild(clone)
        switchButtons(true)
    }
}

//mostrur u ocultar los botones sig y prev de acuerdo al estado del filter
const switchButtons = enabled => {
    const btnsNext = document.getElementsByClassName('next')
    Array.from(btnsNext).forEach((btn) => {
        if(enabled && next){
            btn.classList.remove('d-none')
            btn.classList.add('next-style')
        }else{
            btn.classList.add('d-none')
            btn.classList.remove('next-style')
        }
    })
    const btnsPrev = document.getElementsByClassName('prev')
    Array.from(btnsPrev).forEach((btn) => {
        if(enabled && prev) {
            btn.classList.remove('d-none')
            btn.classList.add('prev-style')
        }else{
            btn.classList.add('d-none')
            btn.classList.remove('prev-style')
        }
    })
}

//Filtramos la dimension y cargamos de a uno los personajes en el array residents
const filterDimension = async selected => {
    const location = await fetch('https://rickandmortyapi.com/api/location/' + selected.value)
    const data = await location.json()
    cardContainer.innerHTML = '';
    data.residents.forEach(personajeUrl => {
        loadCharOneByOne(personajeUrl)
    })
}

//cargamos de a uno los personajes con su url
const loadCharOneByOne = async url => {
    const pers = await fetch(url)
    const personaje = await pers.json()

    templateCard.querySelector(".title").textContent = personaje.name
    templateCard.querySelector('.img').src = personaje.image
    templateCard.querySelector('#especie').textContent = personaje.species
    templateCard.querySelector('#genero').textContent = personaje.gender
    templateCard.querySelector('#estado').textContent = personaje.status
    templateCard.querySelector('#origen').textContent = personaje.origin.name

    const clone = templateCard.cloneNode(true)

    fragment.appendChild(clone)
    cardContainer.appendChild(fragment)
}

//Leer todas las localizaciones para obtener la lista de dimensiones
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
            const allLocations = []
            responses.map(response => {
                allLocations.push(response)
            })
            populateDimensions(allLocations)
        })
}

