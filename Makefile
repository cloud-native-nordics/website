export PROJECT=cloud-native-nordics-website

all: run

run:
	npm run dev

build-image:
	docker build -t cloud-native-nordics/${PROJECT} .

clean:
	sudo rm bin/${PROJECT}
	