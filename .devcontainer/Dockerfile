FROM "mcr.microsoft.com/devcontainers/base:bullseye"

SHELL ["/bin/bash", "-c"]

RUN apt update
RUN apt install curl gnupg2 -y

# RUN apt update \
#   && apt install -y wget gnupg \
#   && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#   && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#   && apt update \
#   && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
#   --no-install-recommends \
#   && rm -rf /var/lib/apt/lists/*

# RUN apt update && apt install -y \
#     libnss3 \
#     libasound2 \
#     libatk1.0-0 \
#     libatk-bridge2.0-0 \
#     libcups2 \
#     libdbus-1-3 \
#     libgdk-pixbuf2.0-0 \
#     libnspr4 \
#     libxcomposite1 \
#     libxrandr2 \
#     libxdamage1 \
#     libxkbcommon0 \
#     libgbm1 \
#     libpango-1.0-0 \
#     libwayland-client0 \
#     libwayland-cursor0 \
#     libwayland-egl1 \
#     libcurl4 \
#     libexpat1 \
#     libfontconfig1 \
#     && apt-get clean && rm -rf /var/lib/apt/lists/*

# # Puppeteerが勝手にChromiumを入れるのを防ぐ
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true 

USER vscode
