FROM denoland/deno:2.3.1

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app

RUN apt update && apt install bash less vim -y

# Prefer not to run as root.
# USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY deps.ts .
RUN deno install --entrypoint deps.ts

## These steps will be re-run upon each file change in your working directory:
#COPY . .
## Compile the main app so that it doesn't need to be compiled each startup/entry.
#RUN deno cache main.ts

CMD ["deno", "run", "--allow-net", "--watch", "main.ts"]
