#!/bin/sh
set -e

ENV_FILE="/app/.env"

if [ -z "$VAULT_URL" ]; then
  echo "[ERROR] VAULT_URL is not set."
  exit 1
fi

if [ -z "$VAULT_TOKEN" ]; then
  echo "[ERROR] VAULT_TOKEN is not set."
  exit 1
fi

echo "[ENTRYPOINT] Fetching config from Vault at: $VAULT_URL"

if ! curl -fsS -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_URL" \
  | jq -r '.data.metadata | to_entries | map("\(.key)=\(.value)") | .[]' > "$ENV_FILE"; then
  echo "[ERROR] Failed to fetch or parse Vault data."
  exit 1
fi

if [ ! -s "$ENV_FILE" ]; then
  echo "[ERROR] $ENV_FILE not found or empty!"
  exit 1
fi

echo "---- ENV DUMP ----"
cat "$ENV_FILE"
echo "------------------"

# Export to env
set -a
. "$ENV_FILE"
set +a

echo "[ENTRYPOINT] Starting App..."
exec "$@"