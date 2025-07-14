npm install pm2 -g
npm i
npm run build
pm2 delete "Omega-next"
pm2 start npm --name "Omega-next" -- run start
pm2 save
