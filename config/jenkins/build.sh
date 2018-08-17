#!/bin/bash -ex

REPORT_DIR="{{ playbook_dir }}/build/logs"

ansible localhost -m file -a "path=${REPORT_DIR} state=absent"
ansible localhost -m file -a "path=${REPORT_DIR} state=directory"

echo "Install dependencies"
ansible localhost -m shell -a "meteor add accounts-password session accounts-ui email ddp-rate-limiter ostrio:logger ostrio:loggerfile check fourseven:scss@3.13.0 chdir={{ playbook_dir }}"
ansible localhost -m shell -a "meteor npm install chdir={{ playbook_dir }}"

echo "Run ESlint code check style"

ansible localhost -m shell -a "meteor npm run eslint chdir={{ playbook_dir }}"

echo "Execute unit test"
ansible localhost -m shell -a "meteor npm test chdir={{ playbook_dir }}"
