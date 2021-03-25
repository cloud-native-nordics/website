.PHONY: build
## build: build the site
build:
	hugo

.PHONY: run
## run: runs the website locally for development
run:
	hugo server

.PHONY: help
## help: prints this help message
help:
	@echo "Usage: \n"
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'