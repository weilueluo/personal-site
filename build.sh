# use by deploy script

set -xoe pipefail

nvm use
nvm ci
npm run build