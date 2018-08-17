#!/bin/bash -ex

FILE_NAME=$(basename "$0")
STAGE="${FILE_NAME%.*}"
PROJECT_ID="017-009"
ANSIBLE_GROUP_PATTERN="${PROJECT_ID}:&${STAGE}"

ansible-playbook config/infrastructure/playbook.yml \
  -vv \
  -i config/infrastructure/inventory.yml \
  --limit ${ANSIBLE_GROUP_PATTERN} \
  --extra-vars "version=${GIT_COMMIT}
                stage=${STAGE}
                build_number=${BUILD_NUMBER}
                build_timestamp=${BUILD_ID}
                deploy_id='${DEPLOY_ID}'"
