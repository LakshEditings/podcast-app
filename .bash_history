sudo apt update && sudo apt upgrade -y
cd ~/Podcast && tar -czf podcast.tar.gz .
scp ~/Podcast/podcast.tar.gz user24@10.70.2.24:~/
scp -r ~/Podcast user24@10.70.2.24:~/
cd ~ && tar -xzf podcast.tar.gz && rm podcast.tar.gz
cd Podcast
ls
sudo apt install nodejs npm -y
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo npm install -g pm2
node --version
npm --version
sudo systemctl status mongod
mongod --version
sudo systemctl status nginx
curl localhost
pm2 --version
sudo apt update
sudo apt install curl -y
curl --version
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc |    sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" |    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl status mongod
mongod --version   # Should show db version v7.0.x
mongosh   # or mongo if old shell
ls
cd ~
tar -xzf podcast.tar.gz
rm podcast.tar.gz   # Optional: clean up
cd Podcast
ls
sudo systemctl start mongod
sudo systemctl status mongod
sudo mkdir -p /var/lib/mongodb
sudo mkdir -p /var/log/mongodb
sudo chown -R mongodb:mongodb /var/lib/mongodb /var/log/mongodb
sudo chmod 755 /var/lib/mongodb /var/log/mongodb
sudo systemctl enable mongod
sudo systemctl restart mongod
sudo systemctl status mongod
mongosh
sudo systemctl enable mongod
pwd
ls
cd backend
ls
cd ..
cd ~
grep -r -i "localhost:8000\|10.70.2.31\|127.0.0\|localhost" backend/ ADMIN/src/ CREATOR/src/ USER/src/ 2>/dev/null
cd ~/backend
nano server.js   # or vim if you prefer
cd ~/backend
npm install
npm install express mongoose cors morgan dotenv avrgirl-arduino buffer --save  
cd ~/ADMIN
npm install
npm install react-app-rewired avrgirl-arduino buffer --save   # if needed
npm run build
cd ~/CREATOR
npm install
npm install react-app-rewired avrgirl-arduino buffer --save
npm run build
cd ~/USER
npm install
npm install react-app-rewired avrgirl-arduino buffer --save
npm run build
cd ..
ls -la ~/ADMIN/build    # should show index.html + static/ folder
ls -la ~/CREATOR/build
ls -la ~/USER/build
du -sh ~/ADMIN/build    # rough size check
sudo apt remove --purge nodejs npm -y
sudo apt autoremove -y
sudo rm -rf /usr/local/bin/node /usr/local/bin/npm /usr/local/lib/node_modules   # clean remnants if any
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt update
sudo apt install -y nodejs
node --version
npm --version
which node
cd ~/ADMIN && rm -rf node_modules package-lock.json
cd ~/CREATOR && rm -rf node_modules package-lock.json
cd ~/USER && rm -rf node_modules package-lock.json
cd ~/ADMIN
npm install
npm run build
cd ~/CREATOR
npm install
npm run build
cd USER
cd ~/USER
npm install
npm run build
ls -la ~/ADMIN/build   # expect index.html, static/, assets/
ls -la ~/CREATOR/build
ls -la ~/USER/build
ls -la ~/dist
ls -la ~/dist/admin    # Should have index.html + assets/
ls -la ~/dist/creator
ls -la ~/dist/user
du -sh ~/dist          # Total size — expect ~1–2 MB or more with assets
cat ~/dist/index.html  # Quick peek at landing page (should have links or meta to the subpaths)
cd ~/backend
npm install   # Re-run to ensure all deps are there with new Node
pm2 start server.js --name "podcast-backend"
pm2 save
pm2 startup   # Follow any instructions it gives (usually a sudo command to enable on boot)
pm2 status
cd ..
# Re-install PM2 globally using the current Node/npm
sudo npm install -g pm2
# Verify it's installed and accessible
pm2 --version
which pm2 
cd ~/backend
# Optional: Re-audit and fix vulnerabilities if you want (not critical for now)
npm audit fix   # or npm audit fix --force if you accept breaking changes
# Start the backend
pm2 start server.js --name "podcast-backend"
# Save current process list (survives reboot)
pm2 save
# Set up auto-start on boot (this prints a command — copy and run it)
pm2 startup
# Check status
pm2 status
pm2 logs podcast-backend   # To see if server started and on which port
pm2 logs podcast-backend | grep "running on"   # or just read the first few lines
# 1. Force re-hash of commands (tells bash to find new binaries)
hash -r
# 2. Verify pm2 is now found in the correct path
which pm2          # Should still be /usr/bin/pm2
pm2 --version      # Should print a version number (e.g. 5.4.x or 6.x.x)
cd ~/backend
# Optional but recommended: Fix the high-severity vulnerability
# (multer/busboy/dicer chain – safe to force-upgrade here)
npm audit fix --force
# Start the server
pm2 start server.js --name "podcast-backend"   # or /usr/bin/pm2 start ... if needed
# Save the process list
pm2 save
# Setup auto-start on reboot (run the command it prints)
pm2 startup
# Check everything
pm2 status
pm2 logs podcast-backend   # Watch for startup messages
pm2 logs podcast-backend | grep -i "port\|listening\|running on\|http"
curl http://localhost:8000   # replace 8000 with actual port
# or
curl http://127.0.0.1:8000/health   # if your app has a /health endpoint
# Stop everything
pm2 kill   # even if it says not found, it's safe
# Remove PM2 home dir (logs, dumps, configs)
rm -rf ~/.pm2
# Uninstall global PM2
sudo npm uninstall -g pm2
sudo npm install -g pm2@latest
hash -r
pm2 --version   # must show a version, e.g. 5.4.x or 6.x.x
which pm2       # should be /usr/bin/pm2 or similar
cd ~/backend
pm2 start server.js --name "podcast-backend"
# Immediately check status
pm2 status
# Watch logs in real time
pm2 logs podcast-backend
pm2 save
pm2 startup  
pm2 logs podcast-backend | grep -i "port\|listening\|running on\|http\|localhost"
curl http://localhost:YOUR_PORT_HERE
node server.js   # run directly (without PM2) and see if it starts or errors
sudo nginx -t
sudo systemctl reload nginx
curl http://localhost:5000
# or if you have a specific route like health/root
curl http://localhost:5000/health   # if exists, otherwise just the root
curl http://localhost:5000/         # root route
pm2 status
pm2 logs podcast-backend --lines 20   # last 20 lines
sudo nano /etc/nginx/sites-available/podcast
sudo nginx -t
sudo systemctl reload nginx
sudo ufw allow 80
sudo ufw status   # should show 80 ALLOW
sudo nano /etc/nginx/sites-available/podcast
sudo nginx -t
sudo systemctl reload nginx
curl -I http://localhost/admin/
curl -I http://localhost/admin/some-random-route
ls -la /home/user24/dist/admin/index.html
ls -la /home/user24/dist/creator/index.html
ls -la /home/user24/dist/user/index.html
cd ..
cd ADMIN/frontend
npm run build
cd ..
cd ~
# Clean old merged dist if you want (optional)
rm -rf dist
# Run the top-level build (which calls all three + merge)
npm run build
ls -la ~/dist/admin/index.html
ls -la ~/dist/creator/index.html
ls -la ~/dist/user/index.html
sudo nano /etc/nginx/sites-available/podcast
sudo nginx -t
sudo systemctl reload nginx
curl -I http://localhost/
curl -I http://localhost/admin/
curl -I http://localhost/admin/login   # or any sub-route
curl -I http://localhost/creator/
curl -I http://localhost/user/
sudo tail -n 30 /var/log/nginx/error.log
tree -L 2 ~/dist   # if tree is installed, or just ls -laR ~/dist | head -n 30
sudo apt install tree -y
tree -L 3 ~/dist
sudo nano /etc/nginx/sites-available/podcast
sudo nginx -t
sudo systemctl reload nginx
curl -I http://localhost/
curl -I http://localhost/admin/
curl -I http://localhost/admin/login
curl -I http://localhost/creator/
curl -I http://localhost/user/
cd Podcast/ADMIN/frontend
cd Podcast
cd ADMIN/frontend
npm run build
cd ..
cd CREATOR
cd frontend
npm run build
cd ~/USER/frontend
npm run build
sudo nano /etc/nginx/sites-available/arduino-studio
sudo ln -s /etc/nginx/sites-available/arduino-studio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
pm2 status
cd ..
pm2 status
cd backend
pm2 status
pm2 start server.js --name "podcast-backend"
sudo ufw allow 'Nginx Full'
sudo ufw reload
cd ..
sudo ufw allow 'Nginx Full'
sudo ufw reload
sudo ufw status
sudo nano /etc/nginx/sites-available/arduino-studio
sudo ln -sf /etc/nginx/sites-available/arduino-studio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
chmod +x /home/user24
chmod -R 755 /home/user24/Podcast
ls -l /home/user24/Podcast/ADMIN/frontend/dist/index.html
sudo nano /etc/nginx/sites-available/podcast-app
sudo rm /etc/nginx/sites-enabled/arduino-studio
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/podcast-app /etc/nginx/sites-enabled/
sudo chmod +x /home/user24
sudo nginx -t
sudo systemctl restart nginx
sudo rm /etc/nginx/sites-available/arduino-studio
sudo nano /etc/nginx/sites-available/podcast-app
sudo chmod -R 755 /home/user24/Podcast
ls -F ~
sudo nano /etc/nginx/sites-available/podcast-app
ls -d Podcast
ls
sudo nano /etc/nginx/sites-available/podcast-app
# Allow Nginx to enter the home directory
sudo chmod +x /home/user24
# Allow Nginx to read the specific folders and the landing page
sudo chmod -R 755 /home/user24/ADMIN
sudo chmod -R 755 /home/user24/USER
sudo chmod -R 755 /home/user24/CREATOR
sudo chmod 644 /home/user24/index.html
sudo nginx -t
sudo systemctl reload nginx
Open your config file:sudo nano /etc/nginx/sites-available/podcast-app
sudo nano /etc/nginx/sites-available/podcast-app
sudo nginx -t
sudo systemctl reload nginx
sudo nginx -t
sudo systemctl reload nginx
sudo nano /etc/nginx/sites-available/podcast-app
sudo nginx -t && sudo systemctl reload nginx
mongodump --uri="mongodb+srv://lakshen6_db_user:z8qMPTT6A0uFdF5s@cluster.mongodb.net/DATABASE_NAME" --out=~/atlas_backup
mongorestore --db PodcastCluster ~/atlas_backup/PodcastCluster
ls /etc/mongod.conf
sudo nano /etc/mongod.conf
cat /etc/mongod.conf | grep -A 5 "net"
mongodump --uri="mongodb+srv://lakshen6_db_user:z8qMPTT6A0uFdF5s@cluster0.your-id.mongodb.net/PodcastCluster" --out=~/atlas_backup
mongodump
mongodump --uri="mongodb+srv://lakshen6_db_user:z8qMPTT6A0uFdF5s@cluster0.your-id.mongodb.net/PodcastCluster" --out=~/atlas_backup
mongorestore
mongorestore --db PodcastCluster ~/atlas_backup/PodcastCluster
sudo nano /etc/mongod.conf
sudo systemctl restart mongod
sudo ufw allow 27017
mongorestore --db PodcastCluster dump/PodcastCluster
mongodump --uri="mongodb+srv://lakshen6_db_user:z8qMPTT6A0uFdF5s@cluster0.abcde.mongodb.net/PodcastCluster" --out=~/atlas_backup
mongorestore --nsInclude="PodcastCluster.*" ~/atlas_backup/PodcastCluster/
mongodump
ls ~/atlas_backup
mongodump --uri="mongodb+srv://lakshen6_db_user:z8qMPTT6A0uFdF5s@podcastcluster.wnr3auy.mongodb.net/?appName=PodcastCluster" --db PodcastCluster --out=~/atlas_backup
sudo nano /etc/mongod.conf
sudo systemctl restart mongod
mongodump
mongodump --uri="mongodb+srv://lakshen6_db_user:z8qMPTT6A0uFdF5s@podcastcluster.wnr3auy.mongodb.net/PodcastCluster" --out=~/atlas_backup
mongorestore --db PodcastCluster ~/atlas_backup/PodcastCluster
ls -R ~/atlas_backup
mkdir -p ~/atlas_backup
mongodump --uri="mongodb+srv://lakshen6_db_user:z8qMPTT6A0uFdF5s@podcastcluster.wnr3auy.mongodb.net/PodcastCluster" --out=/home/user24/atlas_backup --verbose
sudo apt install mongodb-database-tools
ls -l ~/atlas_backup/PodcastCluster
mongorestore --dir=/home/user24/atlas_backup/PodcastCluster --db=PodcastCluster
mongodump --uri="mongodb+srv://lakshen6_db_user:z8qMPTT6A0uFdF5s@podcastcluster.wnr3auy.mongodb.net/" --out=~/atlas_backup --verbose
ls ~/atlas_backup
mongorestore --dir=~/atlas_backup/
sudo nano /etc/mongod.conf
sudo systemctl restart mongod
mongorestore --dir=~/atlas_backup/
sudo systemctl status mongod
sudo nano /etc/mongod.conf
sudo systemctl restart mongod
sudo systemctl status mongod
mongorestore --dir=~/atlas_backup/
cd ~/backend
nano .env
pm2 restart all
node server.js
cd ..
pm2 restart all
node server.js
pm2 stop 0
pm2 restart 0
pm2 logs 0
cd ~/backend
cd ..
pm2 restart 0 --update-env
pm2 logs 0
curl http://localhost:5000/api/podcasts
grep "mongodb" ~/backend/server.js
curl http://localhost:5000/podcasts
sudo nano /etc/nginx/sites-available/podcast-app
sudo nginx -t && sudo systemctl reload nginx
cd ~/backend
pm2 stop 0
pm2 delete 0
pm2 start server.js --name "podcast-backend"
curl http://localhost:5000/api/podcasts
cd ..
grep -r "router.get" ~/backend/routes/
curl http://localhost:5000/podcasts
pm2 logs 0 --lines 20
head -n 100 ~/backend/server.js
curl http://localhost:5000/api/user/podcasts
pm2 restart podcast-backend
pm2 logs 0
sudo nano /etc/nginx/sites-available/podcast-app
sudo nginx -t && sudo systemctl reload nginx
pm2 restart podcast-backend --update-env
pm2 logs 0
nano ~/backend/config/db.js
pm2 restart podcast-backend --update-env
pm2 logs 0 --lines 10
nano ~/backend/config/db.js
pm2 stop 0
pm2 delete 0
cd ~/backend
pm2 start server.js --name "podcast-backend"
pm2 logs 0 --lines 15
cd ..
pm2 restart podcast-backend
pm2 logs 0
cd ~/backend
pm2 stop podcast-backend
pm2 delete podcast-backend
pm2 start server.js --name "podcast-backend"
pm2 logs podcast-backend --lines 10
sudo nano /etc/nginx/sites-available/podcast-app
sudo nginx -t && sudo systemctl reload nginx
grep -r "ac-hitornt-shard" /home/user24/
sudo nano /home/user24/Podcast/backend/config/db.js
pm2 delete podcast-backend
cd /home/user24/Podcast/backend  # <--- Use your actual dev folder here
pm2 start server.js --name "podcast-backend"
pm2 logs podcast-backend
sudo nano /home/user24/backend/config/db.js
sudo nano /etc/nginx/sites-available/podcast-app
# Allow Nginx to enter the home directory
sudo chmod +x /home/user24
# Allow Nginx to read the specific folders and the landing page
sudo chmod -R 755 /home/user24/ADMIN
sudo chmod -R 755 /home/user24/USER
sudo chmod -R 755 /home/user24/CREATOR
sudo chmod 644 /home/user24/index.html
sudo nginx -t
sudo systemctl reload nginx
pm2 delete podcast-backend
cd /home/user24/backend
pm2 start server.js --name "podcast-backend"
pm2 logs podcast-backend
grep -r "ac-hitornt-shard" /home/user24/backend/
pm2 stop all
pm2 delete all
pm2 kill
cat /home/user24/backend/.env
nano /home/user24/backend/.env
cd /home/user24/backend
pm2 start server.js --name "podcast-backend"
pm2 logs 0
sudo nano /etc/nginx/sites-available/podcast-app
sudo nginx -t && sudo systemctl reload nginx
curl -I http://10.70.2.24/api/podcasts
mongosh podcastApp --eval 'db.admins.find({email: "admin@test.com"})'
mongosh podcastApp --eval 'db.creators.find({email: "creator@test.com"})'
mongosh podcastApp --eval 'db.users.find({email: "user@test.com"})'
cd ..
nano ~/backend/server.js
pm2 restart podcast-backend
sudo nano /etc/nginx/sites-available/podcast-app
sudo nginx -t && sudo systemctl reload nginx
grep -r "localhost:5000" /home/user24/USER/frontend/src/
grep -r "localhost:5000" /home/user24/CREATOR/frontend/src/
grep -r "localhost:5000" /home/user24/ADMIN/frontend/src/
# Fix USER Frontend
find /home/user24/USER/frontend/src/ -type f -name "*.jsx" -print0 | xargs -0 sed -i 's|http://localhost:5000|http://10.70.2.24|g'
# Fix CREATOR Frontend
find /home/user24/CREATOR/frontend/src/ -type f -name "*.jsx" -print0 | xargs -0 sed -i 's|http://localhost:5000|http://10.70.2.24|g'
# Fix ADMIN Frontend
find /home/user24/ADMIN/frontend/src/ -type f -name "*.jsx" -print0 | xargs -0 sed -i 's|http://localhost:5000|http://10.70.2.24|g'
# Build USER
cd /home/user24/USER/frontend && npm run build
# Build CREATOR
cd /home/user24/CREATOR/frontend && npm run build
# Build ADMIN
cd /home/user24/ADMIN/frontend && npm run build
sudo nano /etc/nginx/sites-available/podcast-app
sudo nginx -t && sudo systemctl reload nginx
cd ..
exit
