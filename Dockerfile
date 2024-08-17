FROM node:16

# Install FFmpeg and dependencies for canvas
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Expose necessary ports (if required)
EXPOSE 3000

CMD [ "node", "index.js" ]
