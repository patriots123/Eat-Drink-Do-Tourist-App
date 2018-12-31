
let cityInput;
let stateInput;
let dateInput;
let zomatoCityID;

let categoryChoice;
let categoryOptionChoice;
let categoryOptionTypeChoice;

function matchCityFromAPI(responseJson) {
    for (let i = 0; i < responseJson.location_suggestions.length; i++) {
    console.log(responseJson.location_suggestions[i].name);
        if (responseJson.location_suggestions[i].name == `${cityInput}, ${stateInput}`) {
            zomatoCityID = responseJson.location_suggestions[i].id;
            console.log(`Zomato CityID: ${zomatoCityID}`);
            break;
        } else {
            console.log('not a match');
        }
    }
}

function getZomatoCityID() {
    const params = {
        q: cityInput,
    };
    const queryString = formatQueryParams(params)
    const requestUrl = citiesBaseUrl + '?' + queryString;

    const options = {
        headers: new Headers({
          "user-key": apiInfo.zomato.key,
        })
    };
    fetch(requestUrl, options)
    .then(response => response.json())
    .then(responseJson => cityID = matchCityFromAPI(responseJson))
    // .catch(console.log(`Something went wrong`));
}


// save city, state, and date when the user hits submit and change pages
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
        getZomatoCityID();
    });
}




//generate HTML for category options (ex. Restaurants/ Foodtrucks for Eat)
function generateCategoryOptions() {
    let keysForButtonTitles = Object.keys(categoryOptions[categoryChoice]);
    for (let i = 0; i < keysForButtonTitles.length; i++) {
        $('.category-options').append(
            `<button id='${keysForButtonTitles[i]}' class='category-option-button'>${keysForButtonTitles[i]}</button>`)
    }
    $('.category-options').show();
}

//After user clicks Eat, Drink, or Do, save that choice and call function to generate the next option buttons
function handleCategoryDecision() {
    $('.eat-drink-do-selection-page').on('click', '.category-button',function() {
        console.log('category decision made');
        categoryChoice = $(this).attr('id');
        console.log(categoryChoice);
        $('.eat-drink-do-selection-page').hide();
        generateCategoryOptions();
    });
}



//generate HTML for category option types (ex. Casual Dining under Restaurants)
function generateCategoryOptionTypes() {
    $('.category-option-types').empty();
    console.log(categoryChoice);
    if (categoryChoice == 'eat') {
        let keysForButtonTitles = Object.keys(categoryOptions[categoryChoice][categoryOptionChoice])
        for (let i = 0; i < keysForButtonTitles.length; i++) {
            $('.category-option-types').append(
                `<button id='${keysForButtonTitles[i]}' class='category-option-type-button'>${keysForButtonTitles[i]}</button>`)
        }
    } else if (categoryChoice == 'drink') {
        for (let i = 0; i < categoryOptions[categoryChoice][categoryOptionChoice].length; i++) {
            $('.category-option-types').append(
                `<button id='${categoryOptions[categoryChoice][categoryOptionChoice][i]}' class='category-option-type-button'>${categoryOptions[categoryChoice][categoryOptionChoice][i]}</button>`)
        }
    }
    $('.category-options').show();
}

//After user clicks one of the category option buttons, call function to generate last set of decision buttons
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

function displayEatResults(responseJson) {
    console.log(categoryOptionChoice);
    $('.search-results-list').empty();
    for (let i = 0; i < responseJson.restaurants.length; i++) {
        if (categoryOptionChoice === 'Restaurants') {
            $('.search-results-list').append(
                `<li class="result-list-item">
                    <p>${responseJson.restaurants[i].restaurant.name}</p>
                    <p>${responseJson.restaurants[i].restaurant.location.address}</p>
                    <p>${responseJson.restaurants[i].restaurant.user_rating.aggregate_rating}</p>
                </li>`
            );
        } else if (categoryOptionChoice === 'Foodtrucks') {
            $('.search-results-list').append(
                `<li class="result-list-item">
                    <p>${responseJson.restaurants[i].restaurant.name}</p>
                    <p>${responseJson.restaurants[i].restaurant.location.locality_verbose}</p>
                    <p>${responseJson.restaurants[i].restaurant.user_rating.aggregate_rating}</p>
                </li>`
            );
        }
    }
    $('.search-results-section').show();
}

function callEatAPI() {
    const params = {
        city_id: zomatoCityID,
        count: 15,
        sort: 'rating',
        establishment_type: categoryOptions[categoryChoice][categoryOptionChoice][categoryOptionTypeChoice],
    };
    const queryString = formatQueryParams(params)
    const requestUrl = apiInfo.zomato.searchBaseUrl + '?' + queryString;
    console.log(requestUrl);
    const options = {
        headers: new Headers({
          "user-key": apiInfo.zomato.key,
        })
    };
    console.log('calling eat API');
    fetch(requestUrl, options)
    .then(response => response.json())
    .then(responseJson => displayEatResults(responseJson))
    // .catch(console.log(`Something went wrong`));
}

function displayDrinkResults(responseJson) {
    $('.search-results-list').empty();
    for (let i = 0; i < responseJson.length; i++) {
        if (responseJson[i].status ===  categoryOptionTypeChoice) {
            $('.search-results-list').append(
                `<li class="result-list-item">
                    <p>${responseJson[i].name}</p>
                    <p>${responseJson[i].street} ${responseJson[i].city}, ${responseJson[i].state}</p>
                    <p>${responseJson[i].overall}</p>
                </li>`
            );}
    }
    $('.search-results-section').show();
}



function callDrinkAPI() {
    const requestUrl = apiInfo.beerMapping.loccityUrl + `${apiInfo.beerMapping.key}/${cityInput},${stateInput}&s=json`
    console.log(requestUrl);
    console.log('calling drink API');
    fetch(requestUrl)
    .then(response => response.json())
    .then(responseJson => displayDrinkResults(responseJson))
    // .catch(console.log(`Something went wrong`));
}


function getResultContent() {
    if ( categoryChoice === 'eat') {
        callEatAPI();
    } else if (categoryChoice === 'drink') {
        callDrinkAPI();
    } else {
        // Do
    }
}

function handleCategoryOptionTypeDecision() {
    $('.category-option-types').on('click', '.category-option-type-button',function() {
        console.log('category option type decision made');
        categoryOptionTypeChoice = $(this).attr('id');
        console.log(categoryOptionTypeChoice);
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