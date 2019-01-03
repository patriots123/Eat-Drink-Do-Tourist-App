
let cityInput;
let stateInput;
let dateInput;
let zomatoCityID;

let categoryChoice;
let categoryOptionChoice;
let categoryOptionTypeChoice;


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
}


function matchCityFromAPI(responseJson) {
    for (let i = 0; i < responseJson.location_suggestions.length; i++) {
        if (responseJson.location_suggestions[i].name == `${cityInput}, ${stateInput}`) {
            zomatoCityID = responseJson.location_suggestions[i].id;
            break;
        }
    }
}

function getZomatoCityID() {
    const params = {
        q: cityInput,
    };
    const queryString = formatQueryParams(params)
    const requestUrl = apiInfo.zomato.citiesBaseUrl + '?' + queryString;

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


function handleNavBarLinks() {
    $('.change-loc-nav-link').on('click', function() {
        cityInput = '';
        stateInput = '';
        dateInput = '';
        zomatoCityID = undefined;
        $('.search-results-list').empty();
        $('.home-page').show();
        $('.homepage-title').show();
        $('.category-options, .category-option-types, .search-results-section').hide();
        $('.eat-drink-do-selection-page').hide();
        $('.change-loc-nav-link, .choose-eat-drink-do-nav-link').hide();
        $('nav, .nav-title').hide();
    });
    $('.choose-eat-drink-do-nav-link').on('click', function() {
        $('.search-results-list').empty();
        $('.eat-drink-do-selection-page').show();
        $('.category-options, .category-option-types, .search-results-section').hide();
        $('.choose-eat-drink-do-nav-link').hide();
    });
}

// save city, state, and date when the user hits submit and change pages, then find city id needed for Eat workflow
function handleLocationDateInput() {
    $('#location-data-entry').submit('click', event => {
        event.preventDefault();
        cityInput = $('#submit-city-town').val();
        stateInput = $('#submit-state').val();
        dateInput = $('#submit-date').val();
        $('.home-page').hide();
        $('nav').show();
        $('.eat-drink-do-selection-page').show();
        $('.change-loc-nav-link').show();
        $('.nav-title').show();
        getZomatoCityID();
    });
}




//generate HTML for category options (ex. Restaurants/ Foodtrucks for Eat)
function generateCategoryOptions() {
    $('.category-options').empty();
    let keysForButtonTitles = Object.keys(categoryOptions[categoryChoice]);
    for (let i = 0; i < keysForButtonTitles.length; i++) {
        $('.category-options').append(
            `<button id='${keysForButtonTitles[i]}' class='category-option-button blue-button'>${keysForButtonTitles[i]}</button>`)
    }
    $('.category-options').show();
}

//After user clicks Eat, Drink, or Do, save that choice and call function to generate the next option buttons
function handleCategoryDecision() {
    $('.eat-drink-do-selection-page').on('click', '.category-button',function() {
        categoryChoice = $(this).attr('id');
        $('.eat-drink-do-selection-page').hide();
        $('.choose-eat-drink-do-nav-link').show();
        generateCategoryOptions();
    });
}



//generate HTML for category option types (ex. Casual Dining under Restaurants)
function generateCategoryOptionTypes() {
    $('.category-option-types').empty();
    if (categoryChoice == 'eat') {
        let keysForButtonTitles = Object.keys(categoryOptions[categoryChoice][categoryOptionChoice])
        for (let i = 0; i < keysForButtonTitles.length; i++) {
            $('.category-option-types').append(
                `<button id='${keysForButtonTitles[i]}' class='category-option-type-button blue-button'>${keysForButtonTitles[i]}</button>`)
        }
    } else if (categoryChoice == 'drink') {
        for (let i = 0; i < categoryOptions[categoryChoice][categoryOptionChoice].length; i++) {
            $('.category-option-types').append(
                `<button id='${categoryOptions[categoryChoice][categoryOptionChoice][i]}' 
                class='category-option-type-button blue-button'>${categoryOptions[categoryChoice][categoryOptionChoice][i]}</button>`)
        }
    } else if (categoryChoice == 'do') {
        callDoAPI();
    }
    $('.category-option-types').show();
}

//After user clicks one of the category option buttons, call function to generate last set of decision buttons
function handleCategoryOptionDecision() {
    $('.category-options').on('click', '.category-option-button', function() {
        categoryOptionChoice = $(this).attr('id');
        generateCategoryOptionTypes();
    });
}

function displayEatResults(responseJson) {
    $('.search-results-list').empty();
    for (let i = 0; i < responseJson.restaurants.length; i++) {
        if (categoryOptionChoice === 'Restaurants') {
            $('.search-results-list').append(
                `<li class="result-list-item">
                    <h3>${responseJson.restaurants[i].restaurant.name}</h3>
                    <p>Cuisine(s): ${responseJson.restaurants[i].restaurant.cuisines}</p>
                    <p>Address: ${responseJson.restaurants[i].restaurant.location.address}</p>
                    <p>Rating: ${responseJson.restaurants[i].restaurant.user_rating.aggregate_rating}</p>
                    <p><a target="_blank" href = ${responseJson.restaurants[i].restaurant.url}</a>Check Out This Link For More Info!</p>
                </li>`
            );
        } else if (categoryOptionChoice === 'Foodtrucks') {
            $('.search-results-list').append(
                `<li class="result-list-item">
                    <h3>${responseJson.restaurants[i].restaurant.name}</h3>
                    <p>Cuisine(s): ${responseJson.restaurants[i].restaurant.cuisines}</p>
                    <p>Address: ${responseJson.restaurants[i].restaurant.location.locality_verbose}</p>
                    <p>Rating: ${responseJson.restaurants[i].restaurant.user_rating.aggregate_rating}</p>
                    <p><a target="_blank" href = ${responseJson.restaurants[i].restaurant.url}</a>Check Out This Link For More Info!</p>
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
    const options = {
        headers: new Headers({
          "user-key": apiInfo.zomato.key,
        })
    };
    fetch(requestUrl, options)
    .then(response => response.json())
    .then(responseJson => {
        if (zomatoCityID == undefined) {
            throw new Error();
        } else {
            displayEatResults(responseJson);
        }
    })
    .catch(function() {
        $('.search-results-list').append(`<p class="error-message">No results for ${cityInput}, ${stateInput}. Please fix city, state input.`);
        $('.search-results-section').show();
    });
}

function displayDrinkResults(responseJson) {
    $('.search-results-list').empty();
    for (let i = 0; i < responseJson.length; i++) {
        if (responseJson[i].status ===  categoryOptionTypeChoice) {
            $('.search-results-list').append(
                `<li class="result-list-item">
                    <h3>${responseJson[i].name}</h3>
                    <p>Address: ${responseJson[i].street} ${responseJson[i].city}, ${responseJson[i].state}</p>
                    <p><a target="_blank" href = ${responseJson[i].url}>Check Out This Link For More Info!</a></p>
                    <p><a target="_blank" href = ${responseJson[i].reviewlink}>See Customer Reviews!</a></p>
                </li>`
            );
        }
    }
    $('.search-results-section').show();
}

function callDrinkAPI() {
    const requestUrl = apiInfo.beerMapping.loccityUrl + `${apiInfo.beerMapping.key}/${cityInput},${stateInput}&s=json`
    fetch(requestUrl, {mode: 'cors'})
    .then(response => response.json())
    .then(responseJson => {
        if (responseJson.length == 1) {
            throw new Error();
        } else {
            displayDrinkResults(responseJson);
        }
    })
    .catch(function() {
        $('.search-results-list').append(`<p class="error-message">No results for ${cityInput}, ${stateInput}. Please fix city, state input.</p>`);
        $('.search-results-section').show();
    });
}

function displayDoResults(responseJson) {
    $('.search-results-list').empty();
    for (let i = 0; i < responseJson.events.length; i++) {
        $('.search-results-list').append(
            `<li class="result-list-item">
                <h3>${responseJson.events[i].title}</h3>
                <p>Time: ${responseJson.events[i].datetime_local}</p>
                <p>Location: ${responseJson.events[i].venue.name}</p>
                <p>Location Address: ${responseJson.events[i].venue.address} ${responseJson.events[i].venue.city}, ${responseJson.events[i].venue.state}</p>
                <p><a target="_blank" href = ${responseJson.events[i].url}>Buy Tickets Here!</a></p>
            </li>`
        );
    }
    $('.search-results-section').show();
}

function callDoAPI() {
    const params = {
        client_id: apiInfo.seatGeek.key,
        datetime_utc: dateInput,
        'venue.city': cityInput,
        'venue.state': stateInput,
    };
    const queryString = formatQueryParams(params)
    const requestUrl = apiInfo.seatGeek.eventsBaseUrl + '?' + queryString;

    fetch(requestUrl)
    .then(response => response.json())
    .then(responseJson => {
        if(responseJson.events.length == 0) {
            throw new Error();
        } else {
            displayDoResults(responseJson);
        }
    })
    .catch(function() {
        $('.search-results-list').append(`<p class="error-message">No events for ${cityInput}, ${stateInput}. Please fix city, state, date input.</p>`);
        $('.search-results-section').show();
    });
}


function getResultContent() {
    if ( categoryChoice === 'eat') {
        callEatAPI();
    } else if (categoryChoice === 'drink') {
        callDrinkAPI();
    }
}

function handleCategoryOptionTypeDecision() {
    $('.category-option-types').on('click', '.category-option-type-button',function() {
        categoryOptionTypeChoice = $(this).attr('id');
        getResultContent();
    });
}



function runApp() {
    handleNavBarLinks();
    handleLocationDateInput();
    handleCategoryDecision();
    handleCategoryOptionDecision();
    handleCategoryOptionTypeDecision();
}

$(runApp);