# Project Name

The project description

## Roadmap

View the project roadmap [here](LINK_TO_DOC)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)

## Usage

> Some usage instructions

## Requirements

- Node 6.9.x
- Redis 3.2.x
- Postgresql 9.6.x
- etc

## Other Information

(TODO: fill this out with details about your project. Suggested ideas: architecture diagram, schema, and any other details from your app plan that sound interesting.)

Objective 1: update songs per playlist id 

## API's

### /songs
### /genres
### /playlistID
### /users 
> request:

{
  'id': string /*default: none*/,
  'metricCategory': STRING /*default: none*/,
  'version': 'v_' + NUMBER,
  'part': { 
    'statistics': BOOL /*default: 'true'*/,
    'history': {
      'scale': NUMBER /*0 - 10, 0=recent(default), 10=alldata*/, 
      'start':'DD/MM/YYY'/*default: none*/,
      'end':'DD/MM/YYYY/*default: none*/',
    },
    'relational': {
      'included': BOOL/*default: false*/,
      'type': ARRAY /*['songs', 'genres', 'users'] default: each*/,
      'history': {
        'scale': NUMBER /*0 - 10, 0=recent(default), 10=alldata(dump)*/, 
        'start':'DD/MM/YYY' /*default: none*/,
        'end':'DD/MM/YYYY /*defaut: none*/'
      }
    }
  }
}

> response:

{
  'increase': {
    'data': OBJECT, 
    'day': NUMBER,
    'week': NUMBER,
    'days': ARRAY
  },
  'history': ARRAY,
  'relations': {
    'significance': Number /*0->1*/,
    'type': {
      'songs': [
        {
          'songId': NUMBER,
          'relationId: NUMBER,
          'genre': STRING,
          'popularity': NUMBER,
          'trend': {
            'increase': NUMBER /*+-*/,
            'metricCategory': STRING,
            'metrics': OBJECT
          }
        }
      ],
      'genres': [ditto], 
      'playlist': [ditto],
      'users': [ditto]
    }
  }
}


 

