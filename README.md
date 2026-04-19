## Project setup

```bash
$ npm install
```

You need either a Groq API key.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Project architecture

This project follows a hexagonal architecture (also known as ports and adapters).
The core idea is that the business logic is completely isolated from technical concerns: the application does not know how audio is downloaded, which provider is used, or how data is stored.
Each of these is a replaceable detail.

For this, we use **ports** (interfaces defined in the domain) that the application depends on and **adapters** (concrete implementations in the infrastructure).

For example, we use Groq API for transcript but it can easely be switched with another LLM simply by adding a new adapter (the process of the application does not change).

### Project layers

```
exposition/       Inputs of the project
- controllers/    Http controllers (receive requests and call application services)

application/      Orchestration — coordinates the flow between infrastructure layers
- services/       Use case logic (download → transcribe → structure → store)

domain/           Core — owned by the business, no external dependencies
- models/         Data shapes shared across the project
- ports/          Interfaces the application depends on (one per infrastructure concern)

Infrastructure/   Concrete implementations of the domains ports
- groq/           Groq API initialisation (initialized one time then imported where needed)
- audioDownload/  Download audio from a remote URL
- transcription/  Transcribe audio using Groq Whisper
- structuring/    Structures the transcript using an LLM (Groq)
- repository/     Persists voice notes to a loacl JSON file
```

### Dependency flow

```
exposition → application → domain ports ← infrastructure
```

Here we can see which layer depends on what:

- the infrastructure depends on the domain to implements it's port, never the other ay around.
- the application only know the domain but never the true implementation.

## Task 4 Improvement

### Logger

Why logger :

- In case of error/bug, we can locate it easely through the process
- It doesn't change the actual process and can be implemanted with nestjs internal logger

Tradeoff :

- Doesn't prevent the error, just let us know if it happens

## Task 5

### 1. Supporting different types of voice notes

As I implemented the approach B (dynamic structure), the design is allready able to handle multiple types of voice-notes without additional configuration.

### 2. Predefined schemas vs dynamic structure

### 3. Scaling to thousands of concurrent users

_**Note:** As I didn't work on a userbase this large but I tried to awnser it_
Right now, the biggest problem would be the the time used by each operation (depends on the API used for the AI).
All the requests are also treated synchronously which could become a bottleneck.

A message queue as a buffer could help prevent the system falling apart on a high volume of data.
Another option could be to limit the rate per deviceId or by user account in the future to prevent abuse (as it's already done by big AI companies).

### 4. Noisy environments

This could parasite the audio sent to the application which in turn could change the data saved in the transcript

Some noise suppresion could be used on the device before uppload but there will always be loud noise like heavy machinery or wind that could disrupt the audio.
