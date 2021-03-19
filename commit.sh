# /bin/bash
yarn all &&
git add . &&
git commit -m "$1" &&
git push
