
let cityInput;
let stateInput;
let dateInput;

let categoryChoice;
let categoryOptionChoice;
let categoryOptionTypeChoice;


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
    let keysForButtonTitles = Object.keys(categoryOptions[categoryChoice]);
    for (let i = 0; i < keysForButtonTitles.length; i++) {
        $('.category-options').append(
            `<button id='${keysForButtonTitles[i]}' class='category-option-button'>${keysForButtonTitles[i]}</button>`)
    }
    $('.category-options').show();
}

function handleCategoryDecision() {
    $('.eat-drink-do-selection-page').on('click', '.category-button',function() {
        console.log('category decision made');
        categoryChoice = $(this).attr('id');
        console.log(categoryChoice);
        $('.eat-drink-do-selection-page').hide();
        generateCategoryOptions();
    });
}




function generateCategoryOptionTypes() {
    $('.category-option-types').empty();
    let keysForButtonTitles = Object.keys(categoryOptions[categoryChoice][categoryOptionChoice])
    for (let i = 0; i < keysForButtonTitles.length; i++) {
        $('.category-option-types').append(
            `<button id='${keysForButtonTitles[i]}' class='category-option-type-button'>${keysForButtonTitles[i]}</button>`)
    }
    $('.category-options').show();
}


function handleCategoryOptionDecision() {
    $('.category-options').on('click', '.category-option-button', function() {
        console.log('category option decision made');
        categoryOptionChoice = $(this).attr('id');
        console.log(categoryOptionChoice);
        generateCategoryOptionTypes();
    });
}




function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
}

function displayResultsContent(responseJson) {
    console.log('display content');
    $('.search-results-list').empty();
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

function callEatDrinkAPI() {
    const apiKey = '67efe258063ce738fec93f327d85c4ab';
    const baseUrl = 'https://developers.zomato.com/api/v2.1/search';
    const params = {
        q: cityInput,
        count: 15,
        sort: 'rating',
        establishment_type: categoryOptions[categoryChoice][categoryOptionChoice][categoryOptionTypeChoice],
    };

    const queryString = formatQueryParams(params)
    const requestUrl = baseUrl + '?' + queryString;

    const options = {
        headers: new Headers({
          "user-key": apiKey,
        })
    };

    console.log('calling eat drink API');
    fetch(requestUrl, options)
    .then(response => response.json())
    .then(responseJson => displayResultsContent(responseJson))
    // .catch(console.log(`Something went wrong`));
}


function getResultContent() {
    if ( categoryChoice === 'eat' || categoryChoice === 'drink') {
        callEatDrinkAPI();
    } else {
        // Do
    }
}

function handleCategoryOptionTypeDecision() {
    $('.category-option-types').on('click', '.category-option-type-button',function() {
        console.log('category option type decision made');
        categoryOptionTypeChoice = $(this).attr('id');
        console.log(categoryOptionTypeChoice);
        // callEatDrinkAPI();
        getResultContent();
    });
}




function runApp() {
    console.log('app running');
    handleLocationDateInput();
    handleCategoryDecision();
    handleCategoryOptionDecision();
    handleCategoryOptionTypeDecision();
}

$(runApp);