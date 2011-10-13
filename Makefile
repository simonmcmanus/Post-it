app_dir = /data/apps/dev.dappado.com
temp_install_dir = /tmp/dev.dappado.com
deployment_hostname = int.app

install :
	sudo mkdir -p $(app_dir)
	sudo cp ./app.js $(app_dir)/app.js
	sudo cp ./dappado.conf /etc/event.d/hello_world

deploy :
	# Get rid of old temp installs
	ssh $(deployment_hostname) sudo rm -rf $(temp_install_dir)
	# Copy files over to remote machine
	rsync -r . $(deployment_hostname):$(temp_install_dir)
	# Install our app to the right location
	ssh $(deployment_hostname) cd $(temp_install_dir)\; make install
	ssh $(deployment_hostname) cd $(temp_install_dir)\; make start_app

start_app :
	sudo start  --no-wait -q hello_world