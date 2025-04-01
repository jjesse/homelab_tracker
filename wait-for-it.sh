#!/bin/sh

set -e

host="$1"
shift
cmd="$@"

max_attempts=30
attempt=0

until mongosh --host mongo --eval 'db.adminCommand("ping")' --quiet || [ $attempt -eq $max_attempts ]; do
  attempt=$((attempt+1))
  echo "MongoDB is unavailable - attempt $attempt of $max_attempts - sleeping"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "MongoDB did not become available in time - exiting"
  exit 1
fi

echo "MongoDB is up - executing command"
exec $cmd
