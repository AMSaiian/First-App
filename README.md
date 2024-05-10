# First-App

## To run application with docker compose:

Clone repo, navigate to root of project and run `docker compose up`

```
  git clone https://github.com/AMSaiian/First-App.git First-App
  cd first-app
  docker compose up
```

## To run UI
- Navigate to folder `.\First-App.WebUI\`
- Install required packages using `npm install`
- Run using Angular CLI with `ng serve`
- UI can be accessed with *http://localhost:4200/*

## To run API
- Navigate to folder `.\FirstApp\WebApi\`
- Set the environment variable  `ConnectionStrings:DefaultConnection` in `WebApi` with your connection to PostgreSQL DB
- Run application using `dotnet run`
- API can be accessed with *http://localhost:8000/*