
##############################################################################

from node as react-app

run npm install -g npm@9.3.0
workdir /opt/boardmaker/
add package.json package-lock.json ./
run npm install
add webpack.config.js ./
add src/ ./src/

##############################################################################

from react-app as react-app-dev
cmd [ "npm", "start" ]

##############################################################################
