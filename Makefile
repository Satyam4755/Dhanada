.PHONY: up down logs build shell shell-root clean

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

build:
	docker compose build

shell:
	docker compose exec backend bash

shell-root:
	docker compose exec -u root backend bash

clean:
	docker compose down -v
	rm -rf sites/ logs/ assets/ node_modules/
