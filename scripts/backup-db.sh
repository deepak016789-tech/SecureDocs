#!/bin/bash

set -e
umask 077

PROJECT_DIR="$HOME/SecureDocs–Multi-Tenant"
BACKUP_DIR="$PROJECT_DIR/backups"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/securedocs_$TIMESTAMP.dump"

mkdir -p "$BACKUP_DIR"

if docker exec securedocs_db pg_dump \
    -U securedocs_admin \
    -d securedocs \
    -Fc > "$BACKUP_FILE"; then

    echo "Database backup successful: $BACKUP_FILE"

else
    rm -f "$BACKUP_FILE"
    echo "Database backup failed!"
    exit 1
fi
