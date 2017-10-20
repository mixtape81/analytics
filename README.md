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
### /users 
> request:

{
  'id': string,
  'version': 'v_' + Number,
  'part': { 
    'statistics': bool,
    'time': {
      
    },
    'relational': {
      'included': bool,
      'type': String,
      'time': {
        
      }
    }
  }
}
'type' = ['songs', 'genres', 'users']

> response:

{ 
  flux: {
   trend: Number,
   
  },
  relations: {
    influence: Number /*0->1*/,
    type: {
      songs: [
        {
          id
          relation: '',
          
        }
      ],
      genres: [ditto], 
      playlist: [ditto],
      users: [ditto],
    }
  },
}


 

