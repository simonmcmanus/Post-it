# node istall 

wget http://nodejs.org/dist/node-v0.4.9.tar.gz
gunzip node-v0.4.9.tar.gz
tar -xf node-v0.4.9.tar
cd node-v0.4.9
./configure
make
sudo make install

#npm install 
curl http://npmjs.org/install.sh | sh
sudo chown -R $USER /usr/local
