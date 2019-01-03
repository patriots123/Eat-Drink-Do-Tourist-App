
const categoryOptions = {
    eat: {
        'Restaurants': {
            'Diner': 101,
            'Fine Dining': 18,
            'Pizzeria': 275,
            'Deli': 24,
            'Casual Dining': 16,
            'Cafe': 1,
            'Sandwhich Shop': 271,
            'Quick Bites': 21
        },
        'Foodtrucks': {
            'Foodtrucks': 81,
        }
    },
    drink: {
        'Bars': [
            'Beer Bar',
            'Brewpub'
        ],
        'Breweries': [
            'Brewery',
            'Beer Store'
        ]
    },
    do: {
        'Events': []
    }
}

const apiInfo = {
        zomato: {
            key: '67efe258063ce738fec93f327d85c4ab',
            searchBaseUrl: 'https://developers.zomato.com/api/v2.1/search',
            citiesBaseUrl: 'https://developers.zomato.com/api/v2.1/cities'
        },
        beerMapping: {
            key: '76f32d8d9bfc0947e2c5af1270c13c76',
            loccityUrl: 'http://beermapping.com/webservice/loccity/'
        },
        seatGeek: {
            key: 'MTQ2NTUxMjJ8MTU0NjEzOTkwNS4wNg',
            eventsBaseUrl: 'https://api.seatgeek.com/2/events'
        }
    }