[![progress-banner](https://backend.codecrafters.io/progress/http-server/b9a38378-e410-4ee2-adfa-15acd3c3470f)](https://app.codecrafters.io/users/usfmah?r=2qF)

This is a starting point for TypeScript solutions to the
["Build Your Own HTTP server" Challenge](https://app.codecrafters.io/courses/http-server/overview).

[HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) is the
protocol that powers the web. In this challenge, you'll build a HTTP/1.1 server
that is capable of serving multiple clients.

Along the way you'll learn about TCP servers,
[HTTP request syntax](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html),
and more.

**Note**: If you're viewing this repo on GitHub, head over to
[codecrafters.io](https://codecrafters.io) to try the challenge.

# Passing the first stage

The entry point for your HTTP server implementation is in `app/main.ts`. Study
and uncomment the relevant code, and then run the command below to execute the
tests on our servers:

```sh
codecrafters submit
```

Time to move on to the next stage!

# Stage 2 & beyond

Note: This section is for stages 2 and beyond.

1. Ensure you have `bun (1.3)` installed locally
1. Run `./your_program.sh` to run your program, which is implemented in
   `app/main.ts`.
1. Run `codecrafters submit` to submit your solution to CodeCrafters. Test
   output will be streamed to your terminal.

# Local setup

## Install bun

This project runs on [bun](https://bun.sh), a fast JavaScript/TypeScript runtime.
Install it with:

```sh
curl -fsSL https://bun.sh/install | bash
```

If you use the fish shell, reload your config to add bun to `$PATH`:

```sh
source ~/.config/fish/config.fish
```

Verify with `bun --version`.

## Run locally

```sh
./your_program.sh
```

Advanced stages accept extra arguments, e.g.:

```sh
./your_program.sh --directory /path/to/files
```

## Submit to CodeCrafters

1. Install the CodeCrafters CLI:

   ```sh
   curl https://codecrafters.io/install.sh | bash
   ```

2. If you cloned this repo from GitHub (not from CodeCrafters), add the
   CodeCrafters git remote. Find your git URL from the course dashboard at
   https://app.codecrafters.io/courses/http-server, then:

   ```sh
   git remote add codecrafters <your-codecrafters-git-url>
   ```

3. If `git` complains about "dubious ownership", fix it once:

   ```sh
   git config --global --add safe.directory /media/hdd/Build-an-HTTP-Server
   ```

4. Submit:

   ```sh
   codecrafters submit
   ```

   Test output streams to your terminal.
