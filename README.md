## Project setup

```bash
$ npm install
```

You need a Groq API key.

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

- The infrastructure depends on the domain to implement its ports, never the other way around.
- The application only knows the domain but never the true implementation.

## Task 4 Improvement

### Logger

Why logging:

- In case of error or bug, we can locate it easily throughout the process
- It does not change the actual process and can be implemented with the NestJS built-in logger

Tradeoff:

- Does not prevent errors, just lets us know when they happen

## Task 5

### 1. Supporting different types of voice notes

As I implemented the approach B (dynamic structure), the design is allready able to handle multiple types of voice-notes without additional configuration.

### 2. Predefined schemas vs dynamic structure

**Predefined schema (Approach A)**
| Advantages | Disadvantages |
| ---------- | ------------- |
| Predictable output | Rigid - each new type require development |
| Simple database queries | Does not cover unexpected cases |
| LLM can make fewer errors when given a structured from | Loses on information that does not fit in the schema |

**Dynamic structure (Approach B)**
| Advantages | Disadvantages |
| ---------- | ------------- |
| Flexible - adapt to any type of note | Variable outputs, difficult to query |
| Capture all available information | Can lead to unstable output |
| No schema maintenance | Higher LLM cost |

### 3. Scaling to thousands of concurrent users

_**Note:** As I didn't work on a userbase this large but I tried to awnser it_
Right now, the biggest problem would be the time taken by each operation (which depends on the API used for the AI).
All requests are also processed synchronously, which could become a bottleneck.

A message queue used as a buffer could help prevent the system from falling apart under a high volume of requests.
Another option would be to rate limit requests per `deviceId` or by user account to prevent abuse (as already done by major AI companies).

### 4. Noisy environments

Background noise could affect the audio sent to the application, which in turn could degrade the transcript and the structured data saved.

Some noise suppression could be applied on the device before upload, but there will always be loud sounds such as heavy machinery or strong wind that could disrupt the audio regardless.
