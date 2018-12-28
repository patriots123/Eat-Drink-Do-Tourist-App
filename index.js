
let categoryOptions = {
    eat: ['Restaurants', 'Foodtrucks'],
    drink: ['Bars', 'Breweries', 'Events'],
    do: ['Sports', 'Concerts', 'Shopping']
}

let cityInput;
let stateInput;
let dateInput;


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


function generateCategoryOptions(category) {
    let specificCategoryOptions = categoryOptions[category];
    for (let i = 0; i < specificCategoryOptions.length; i++) {
        $('.category-options').append(`<button id='${specificCategoryOptions[i]}' class='category-option-button'>${specificCategoryOptions[i]}</button>`)
    };
    $('.category-options').show();
}

function handleCategoryDecision() {
    $('.eat-drink-do-selection-page').on('click', '.category-button',function() {
        console.log('category decision made');
        const category = $(this).attr('id');
        console.log(category);
        $('.eat-drink-do-selection-page').hide();
        generateCategoryOptions(category);
    });
}

function handleCategoryOptionDecision() {
    $('.category-options').on('click', '.category-option-button', function() {
        console.log('category option decision made');
        const categoryOption = $(this).attr('id');
        console.log(categoryOption);
        $('.eat-drink-do-selection-page').hide();
        showResults(categoryOption);
    });
}

function runApp() {
    console.log(categoryOptions.eat);
    console.log('app running');
    handleLocationDateInput();
    handleCategoryDecision();
    handleCategoryOptionDecision();
}

$(runApp);