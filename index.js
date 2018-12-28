
let categoryOptions = {
    eat: ['Restaurants', 'Foodtrucks'],
    drink: ['Bars', 'Breweries', 'Events'],
    do: ['Sports', 'Concerts', 'Shopping']
}

let cityInput;
let stateInput;
let dateInput;

let categoryChosen;
let categoryOptionChosen;


function handleLocationDateInput() {
    $('#location-data-entry').submit('click', event => {
        event.preventDefault();
        console.log('submit location and date info clicked');
        cityInput = $('#submit-city-town').val();
        stateInput = $('#submit-state').val();
        dateInput = $('#submit-date').val();
        console.log(`city: ${cityInput}, state: ${stateInput}, date: ${dateInput}`);
        $('.home-page').hide();
        $('.eat-drink-do-selection-page').show();
    });
}





function generateCategoryOptions() {
    let specificCategoryOptions = categoryOptions[categoryChosen];
    for (let i = 0; i < specificCategoryOptions.length; i++) {
        $('.category-options').append(`<button id='${specificCategoryOptions[i]}' class='category-option-button'>${specificCategoryOptions[i]}</button>`)
    };
    $('.category-options').show();
}

function handleCategoryDecision() {
    $('.eat-drink-do-selection-page').on('click', '.category-button',function() {
        console.log('category decision made');
        categoryChosen = $(this).attr('id');
        console.log(categoryChosen);
        $('.eat-drink-do-selection-page').hide();
        generateCategoryOptions();
    });
}


function displayResultsContent(responseJson) {
    console.log('display content');
    for (let i = 0; i < responseJson.restaurants.length; i++) {
        $('.search-results-list').append(
            `<li class="result-list-item">
                <p>${responseJson.restaurants[i].restaurant.name}</p>
                <p>${responseJson.restaurants[i].restaurant.location.address}</p>
                <p>${responseJson.restaurants[i].restaurant.user_rating.aggregate_rating}</p>
            </li>`
        );
    }
    $('.search-results-section').show();
}


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
}

function callRestaurantAPI() {
    console.log('call restaurant api');
    const apiKey = '67efe258063ce738fec93f327d85c4ab';
    const baseUrl = 'https://developers.zomato.com/api/v2.1/search';

    const params = {
        q: cityInput,
        count: 10,
        sort: 'rating',
        establishment_type: [101,18,275,24,16,1,271,21]
    }

    const queryString = formatQueryParams(params)
    const requestUrl = baseUrl + '?' + queryString;

    const options = {
        headers: new Headers({
          "user-key": apiKey,
          "accept": 'application/json',
        })
    };

    console.log('calling restaurant API');
    fetch(requestUrl, options)
    .then(response => response.json())
    .then(responseJson => displayResultsContent(responseJson))
    // .catch(console.log(`Something went wrong`));
}

function getResultContent() {
    if (categoryOptionChosen === 'Restaurants') {
        callRestaurantAPI();
    }
}

function handleCategoryOptionDecision() {
    $('.category-options').on('click', '.category-option-button', function() {
        console.log('category option decision made');
        categoryOptionChosen = $(this).attr('id');
        console.log(categoryOptionChosen);
        $('.eat-drink-do-selection-page').hide();
        getResultContent();
    });
}




function runApp() {
    console.log('app running');
    handleLocationDateInput();
    handleCategoryDecision();
    handleCategoryOptionDecision();
}

$(runApp);