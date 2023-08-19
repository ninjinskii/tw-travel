FROM denoland/deno:debian-1.35.2

EXPOSE 5000

WORKDIR /app

USER deno

ADD . .

RUN deno cache ./src/main.ts

CMD ["run", "--allow-net", "--allow-read", "--watch", "./src/main.ts", "./src/main.ts"]
