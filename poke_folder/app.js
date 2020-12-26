console.log("js is connected");

//DOM objects
const main_screen = document.querySelector('.main-screen')
const pokeName = document.querySelector('.poke-name')
const pokeId = document.querySelector('.poke-id')
const pokefront = document.querySelector('.poke-front-image')
const pokeback = document.querySelector('.poke-back-image')
const poke_type1 = document.querySelector('.poke-type-one')
const poke_type2 = document.querySelector('.poke-type-two')
const poke_weight = document.querySelector('.poke-weight')
const poke_height = document.querySelector('.poke-height')
console.log(pokeName)

// List items:
const poke_list = document.querySelectorAll('.list-item')
console.log(poke_list)

const left_button = document.querySelector('.left-button')
const right_button = document.querySelector('.right-button')

// constants + variables
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'steel', 'ghost',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
]

// util function for deleteing background
const resetScreen = () => {
    main_screen.classList.remove('hide')
    for (const type of TYPES)
    {
        //console.log(type)
        main_screen.classList.remove(type)
    }
}


let prev_url = '';
let next_url = '';

// create right hand list
const fetch_poke_list = url =>
{
    // fetching data for right side
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log("right hand side")
            const results = data['results']
            const previous = data['previous']
            const next = data['next']
            prev_url = previous
            next_url = next
            console.log(results)

            for (let i = 0; i < poke_list.length; i++)
            {
                const item = poke_list[i]
                const result_data = results[i]

                if (result_data)
                {
                    const name = result_data['name']
                    const url = result_data['url']
                    const url_arr = url.split('/')
                    //console.log(url_arr)
                    const id = url_arr[url_arr.length-2]
                    item.textContent = id + '. ' + name
                }
                else{
                    item.textContent = ''
                }
            }
        })
};

let poke_name = ''
//// display left hand data
const fetchPokeData = id => {
    // fetching data for left side
    let myurl = 'https://pokeapi.co/api/v2/pokemon/' + id
    console.log(myurl)
    fetch(myurl)
        .then(res => {
            return res.json()
        }).then( data => {
        console.log(data)
        console.log(data['name'])

        resetScreen()

        //extract Types:
        const dataTypes = data['types']
        const data_first_type = dataTypes[0]
        const data_second_type = dataTypes[1]
        poke_type1.textContent= data_first_type['type']['name']
        if(data_second_type)
        {
            poke_type2.textContent = data_second_type['type']['name']
            poke_type2.classList.remove('hide')
        }
        else
        {
            poke_type2.textContent = '';
            poke_type2.classList.add('hide')
        }

        main_screen.classList.add(data_first_type['type']['name'])
        pokeName.textContent = data['name']
        poke_name = data['name']
        pokeId.textContent = '#'+ data['id']
        poke_weight.textContent= "weight: " + data['weight']
        poke_height.textContent= "height: " + data['height']

        pokefront.src = data['sprites']['front_default'] || ''
        pokeback.src = data['sprites']['back_default'] || ''
        console.log(dataTypes)
    })
}

// event listner for buttons
const handle_right_button = () => {
    //console.log(e)
    if (next_url)
    {
        fetch_poke_list(next_url)
    }
};

const handle_left_button = () => {
    if (prev_url)
    {
        fetch_poke_list(prev_url)
    }
};

const handle_list_item = (e) => {
    if(!e.target)
        return
    const list_item = e.target

    if (!list_item.textContent)
        return

    const id = list_item.textContent.split('.')[0]
    fetchPokeData(id)
    //console.log(e)
};

right_button.addEventListener('click', handle_right_button)
left_button.addEventListener('click', handle_left_button)


for(const poke_list_item of poke_list)
{
    poke_list_item.addEventListener('click', handle_list_item )
}

// initilaize app
fetch_poke_list('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20')

let user_score = 100
let comp_score = 100
let opponent = ''
let flag = 0
function handle_play_btn()
{
    user_score = 100
    comp_score = 100
    flag = 0
    pokeName.textContent = poke_name
    let rand_obj = Math.floor(Math.random() * 100) + 1
    console.log(rand_obj)
    generate_score()
    let my_url = 'https://pokeapi.co/api/v2/pokemon/' + rand_obj

    fetch(my_url).then(
        res => {
            return res.json()
        }).then( data => {
        pokeback.src = data['sprites']['front_default'] || ''
        poke_weight.textContent= "You: " + 100
        opponent = data['name']
        poke_height.textContent= data['name'] + ": " + 100
    })
}

usr_score_small = 0
usr_score_big = 0
comp_score_small = 0
comp_score_big = 0
function generate_score()
{
    usr_score_small = Math.floor(Math.random() * 20) + 1
    usr_score_big =  Math.floor(Math.random() * 10) + 20

    comp_score_small = Math.floor(Math.random() * 20) + 1
    comp_score_big =  Math.floor(Math.random() * 10) + 20
}


function comp_attack()
{
    if (flag == 1)
        return

    if(Math.floor(Math.random() * 2) == 0)
    {
        user_score = user_score - comp_score_small
        poke_weight.textContent= "You" + ": " + user_score
        if(user_score <= 0){
            pokeName.textContent = "You Loose"
            flag = 1
            return
        }
    }
    else
    {
        user_score = user_score - comp_score_big
        poke_weight.textContent= "You" + ": " + user_score
        if(user_score <= 0){
            pokeName.textContent = "You Loose"
            flag = 1
            return
        }
    }

}

function handle_small_attack()
{
    if (flag == 1)
        return

    comp_score = comp_score - usr_score_small
    poke_height.textContent= opponent + ": " + comp_score
    if(comp_score <= 0){
        pokeName.textContent = "You Win"
        flag = 1
        return
    }

    comp_attack()
}

function handle_big_attack()
{
    if (flag == 1)
        return

    comp_score = comp_score - usr_score_big
    poke_height.textContent= opponent + ": " + comp_score
    if(comp_score <= 0){
        pokeName.textContent = "You Win"
        flag = 1
        return
    }
    comp_attack()
}
//addEventListener('click', handle_play_btn)