prepare:
	ansible-playbook at-krl-editor.main.yml
start:
	docker compose up --detach
stop:
	docker compose stop
down:
	docker compose down
build:
	docker compose build
restart:
	docker compose stop
	docker compose up --detach
update:
	docker compose pull
recreate:
	docker compose up --detach --force-recreate
clean:
	docker compose down
	docker volume prune --force --filter label!=database
