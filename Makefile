app_dir = /data/apps/dev.dappado.com
temp_install_dir = /tmp/dev.dappado.com
deployment_hostname = int.app

install :
	sudo mkdir -p $(app_dir)
	sudo cp ./app.js $(app_dir)/app.js
	sudo cp ./dappado.conf /etc/init/dev.dappado


start_app :
	sudo stop dev.dappado
	sudo start  --no-wait -q dev.dappado