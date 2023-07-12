FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN apk add --no-cache libc6-compat \
  && if [ -f package-lock.json ]; then npm install; else echo "package-lock.json not found." && exit 1; fi

# Copy all files from your host to your current location in the image
COPY . .

ENV WATCHPACK_POLLING=true

# Add metadata to the image to describe which port the container is listening on at runtime
EXPOSE 3000

# Run the specified command within the container
CMD [ "npm", "run", "dev" ]
