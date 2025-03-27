#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until mongosh --host mongo --eval 'db.runCommand("ping").ok' --quiet; do
  echo "MongoDB is unavailable - sleeping"
  sleep 1
done

echo "MongoDB is up - executing command"
exec $cmd
